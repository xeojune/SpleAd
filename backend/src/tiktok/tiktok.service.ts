import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import * as querystring from 'querystring';
import { TikTok, TikTokDocument } from './schemas/tiktok.schema';

interface TikTokTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  open_id: string;
  scope: string;
  token_type: string;
}

interface TikTokUserStats {
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

interface TikTokUserProfile {
  open_id: string;
  union_id: string;
  avatar_url: string;
  avatar_url_100: string;
  avatar_large_url: string;
  display_name: string;
  bio_description: string;
  profile_deep_link: string;
  is_verified: boolean;
  stats: TikTokUserStats;
}

interface TikTokUserResponse {
  data: {
    user: TikTokUserProfile;
  };
  error?: {
    code: string;
    message: string;
  };
}

@Injectable()
export class TikTokService {
  private readonly logger = new Logger(TikTokService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(
    private configService: ConfigService,
    @InjectModel(TikTok.name) private tikTokModel: Model<TikTokDocument>
  ) {
    // Get config values
    const clientId = this.configService.get<string>('TIKTOK_CLIENT_ID');
    const clientSecret = this.configService.get<string>('TIKTOK_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('REDIRECT_URI');

    // Debug log the values (but mask sensitive data)
    this.logger.debug('TikTok config:', {
      clientId: clientId ? `${clientId.substring(0, 4)}...` : 'missing',
      redirectUri,
      hasSecret: !!clientSecret
    });

    if (!clientId || !clientSecret || !redirectUri) {
      this.logger.error('Missing TikTok configuration:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        hasRedirectUri: !!redirectUri
      });
      throw new Error('Missing required TikTok API configuration');
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  async getOAuthUrl(state: string): Promise<string> {
    try {
      const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
      
      // Log the exact values being used (except secret)
      this.logger.debug('Using OAuth parameters:', {
        client_key: this.clientId,
        redirect_uri: this.redirectUri,
        state
      });

      authUrl.searchParams.append('client_key', this.clientId);
      authUrl.searchParams.append('scope', 'user.info.basic,video.list,user.info.open_id,user.info.profile,user.info.stats');
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', this.redirectUri);
      authUrl.searchParams.append('state', state);

      const finalUrl = authUrl.toString();
      this.logger.debug('Final TikTok auth URL:', finalUrl);
      return finalUrl;
    } catch (error) {
      this.logger.error('Failed to generate OAuth URL:', error);
      throw error;
    }
  }

  async exchangeCodeForToken(code: string): Promise<TikTokTokenResponse> {
    try {
      this.logger.debug('Exchanging code for token...', { code });

      const params = new URLSearchParams();
      params.append('client_key', this.clientId);
      params.append('client_secret', this.clientSecret);
      params.append('code', code);
      params.append('grant_type', 'authorization_code');
      params.append('redirect_uri', this.redirectUri);

      // Log full request details (except secret)
      this.logger.debug('Token exchange request:', {
        url: 'https://open.tiktokapis.com/v2/oauth/token/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache'
        },
        params: {
          client_key: this.clientId,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri
        }
      });

      const response = await axios.post<TikTokTokenResponse>(
        'https://open.tiktokapis.com/v2/oauth/token/',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
          }
        }
      );

      // Log full response (excluding sensitive data)
      this.logger.debug('Token exchange response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: {
          ...response.data,
          access_token: response.data.access_token ? '[REDACTED]' : undefined,
          refresh_token: response.data.refresh_token ? '[REDACTED]' : undefined,
          open_id: response.data.open_id,
          scope: response.data.scope,
          expires_in: response.data.expires_in,
          refresh_expires_in: response.data.refresh_expires_in,
        }
      });

      return response.data;
    } catch (error) {
      // Log detailed error information
      this.logger.error('Token exchange failed:', {
        error: error?.response?.data || error,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        headers: error?.response?.headers,
        request: {
          url: error?.config?.url,
          method: error?.config?.method,
          headers: error?.config?.headers,
          data: error?.config?.data?.toString() // URLSearchParams toString()
        }
      });
      
      throw new InternalServerErrorException(
        `Failed to exchange code for token: ${error?.response?.data?.message || error.message}`
      );
    }
  }

  async refreshToken(refreshToken: string): Promise<TikTokTokenResponse> {
    try {
      this.logger.debug('Refreshing access token...');

      const response = await axios.post<TikTokTokenResponse>(
        'https://sandbox-open.tiktokapis.com/v2/oauth/token/',
        querystring.stringify({
          client_key: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
          }
        }
      );

      this.logger.debug('Token refresh successful');
      return response.data;
    } catch (error) {
      this.logger.error('Token refresh failed:', error?.response?.data || error);
      throw new InternalServerErrorException('Failed to refresh token');
    }
  }

  async getUserInfo(accessToken: string, tokenType: string): Promise<any> {
    try {
      this.logger.debug('Fetching user info...');

      const response = await axios.get(
        'https://open.tiktokapis.com/v2/user/info/',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          params: {
            fields: [
              'open_id',
              'union_id',
              'avatar_url',
              'avatar_url_100',
              'avatar_large_url',
              'display_name',
              'bio_description',
              'profile_deep_link',
              'is_verified',
              'follower_count',
              'following_count',
              'likes_count',
              'video_count'
            ].join(',')
          }
        }
      );

      this.logger.debug('User info response:', response.data);

      if (response.data.error?.code !== 'ok') {
        throw new Error(response.data.error?.message || 'Failed to fetch user info');
      }

      const user = response.data.data.user;
      return {
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        follower_count: user.follower_count,
        following_count: user.following_count,
        likes_count: user.likes_count,
        video_count: user.video_count,
        is_verified: user.is_verified,
        bio_description: user.bio_description,
        profile_deep_link: user.profile_deep_link
      };
    } catch (error) {
      this.logger.error('Failed to fetch user info:', error?.response?.data || error);
      throw error;
    }
  }

  async saveTokenInfo(userId: string, tokenData: any, userData: any): Promise<TikTokDocument> {
    try {
      const tikTokInfo = {
        userId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenType: tokenData.token_type,
        expiresIn: tokenData.expires_in,
        refreshExpiresIn: tokenData.refresh_expires_in,
        scope: tokenData.scope,
        userInfo: {
          displayName: userData.display_name,
          avatarUrl: userData.avatar_url,
          followerCount: userData.follower_count,
          followingCount: userData.following_count,
          videoCount: userData.video_count
        }
      };

      const existingRecord = await this.tikTokModel.findOne({ userId });
      
      if (existingRecord) {
        const updated = await this.tikTokModel.findOneAndUpdate(
          { userId },
          tikTokInfo,
          { new: true }
        );
        
        if (!updated) {
          throw new InternalServerErrorException('Failed to update TikTok record');
        }
        
        return updated;
      } else {
        const newTikTok = new this.tikTokModel(tikTokInfo);
        return await newTikTok.save();
      }
    } catch (error) {
      this.logger.error('Failed to save TikTok token info:', error);
      throw new InternalServerErrorException('Failed to save TikTok token information');
    }
  }

  async getTokenInfo(userId: string): Promise<TikTokDocument> {
    try {
      const tokenInfo = await this.tikTokModel.findOne({ userId });
      if (!tokenInfo) {
        throw new InternalServerErrorException('No TikTok token found for this user');
      }
      return tokenInfo;
    } catch (error) {
      this.logger.error('Failed to get TikTok token info:', error);
      throw new InternalServerErrorException('Failed to get TikTok token information');
    }
  }
}