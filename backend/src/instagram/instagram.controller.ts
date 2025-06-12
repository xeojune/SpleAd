import { Controller, Get, Query, HttpException, HttpStatus, Body, Headers, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InstagramService } from './instagram.service';
import axios, { AxiosError } from 'axios';
import * as FormData from 'form-data';
import {
  InstagramMediaResponse,
  InstagramUserResponse,
  InstagramLongLivedTokenResponse,
  InstagramErrorResponse,
} from './instagram.types';

interface InstagramTokenResponse {
  access_token: string;
  user_id: string;
}

@Controller('instagram')
export class InstagramController {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(
    private configService: ConfigService,
    private instagramService: InstagramService,
  ) {
    this.clientId = this.configService.get<string>('CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('CLIENT_SECRET') || '';
    this.redirectUri = this.configService.get<string>('REDIRECT_URI') || '';

    console.log('📱 Instagram OAuth Configuration:');
    console.log('- Client ID:', this.clientId);
    console.log('- Redirect URI:', this.redirectUri);
  }

  private async getUserInfo(accessToken: string): Promise<InstagramUserResponse> {
    try {
      console.log('🔄 Fetching user information...');
      const response = await axios.get<InstagramUserResponse>(
        'https://graph.instagram.com/v12.0/me',
        {
          params: {
            fields: 'id,username,profile_picture_url,followers_count,follows_count,media_count',
            access_token: accessToken,
          },
        }
      );
      console.log('📥 Received user info:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user info:', error.response?.data || error);
      throw error;
    }
  }

  private async exchangeForLongLivedToken(shortLivedToken: string): Promise<InstagramLongLivedTokenResponse> {
    try {
      console.log('🔄 Exchanging for long-lived token...');
      const response = await axios.get<InstagramLongLivedTokenResponse>(
        'https://graph.instagram.com/access_token',
        {
          params: {
            grant_type: 'ig_exchange_token',
            client_secret: this.clientSecret,
            access_token: shortLivedToken,
          },
        }
      );
      console.log('📥 Received long-lived token response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error exchanging for long-lived token:', error.response?.data || error);
      throw error;
    }
  }

  @Get('user')
  async getUserProfile(@Query('access_token') accessToken: string) {
    if (!accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }
    return this.getUserInfo(accessToken);
  }

  @Get('token/:userId')
  async getStoredAccessToken(@Param('userId') userId: string) {
    try {
      console.log('🔍 Backend Controller - Fetching token for userId:', userId);
      const token = await this.instagramService.getAccessToken(userId);
      console.log('🔑 Backend Controller - Token found:', {
        userId,
        hasToken: !!token,
        tokenPreview: token?.accessToken ? `${token.accessToken.substring(0, 10)}...` : 'none'
      });

      if (!token) {
        throw new HttpException('No access token found for this user', HttpStatus.NOT_FOUND);
      }
      return { access_token: token.accessToken };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve access token',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('media')
  async getMediaList(@Query('access_token') accessToken: string) {
    if (!accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      console.log('📤 Fetching Instagram media list...');
      const response = await axios.get<InstagramMediaResponse>(
        'https://graph.instagram.com/me/media',
        {
          params: {
            fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,like_count,comments_count,children{id,media_type,media_url,thumbnail_url,username,like_count,comments_count}',
            access_token: accessToken,
          },
        }
      );

      // Process the response to handle carousel albums
      const processedData = {
        ...response.data,
        data: response.data.data.map(item => {
          console.log('📸 Processing media item:', {
            id: item.id,
            type: item.media_type,
            hasChildren: !!item.children?.data,
            username: item.username,
            likes: item.like_count,
            comments: item.comments_count
          });

          if (item.media_type === 'CAROUSEL_ALBUM' && item.children?.data) {
            const firstChild = item.children.data[0];
            return {
              ...item,
              media_url: firstChild.media_url || item.media_url,
              thumbnail_url: firstChild.thumbnail_url || item.thumbnail_url,
              is_carousel: true,
              child_count: item.children.data.length,
              like_count: firstChild.like_count || item.like_count,
              comments_count: firstChild.comments_count || item.comments_count
            };
          }
          return item;
        })
      };
      
      console.log('📥 Processed media list:', {
        totalItems: processedData.data.length,
        carouselCount: processedData.data.filter(item => item.is_carousel).length,
        totalLikes: processedData.data.reduce((sum, item) => sum + (item.like_count || 0), 0),
        totalComments: processedData.data.reduce((sum, item) => sum + (item.comments_count || 0), 0)
      });
      
      return processedData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<InstagramErrorResponse>;
        console.error('❌ Instagram API Error:', {
          status: axiosError.response?.status,
          message: axiosError.response?.data?.error?.message,
          url: axiosError.config?.url,
          params: axiosError.config?.params
        });
        throw new HttpException(
          axiosError.response?.data?.error?.message || 'Failed to fetch media',
          axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('media/tagged')
  async getTaggedMediaList(
    @Query('access_token') accessToken: string,
    @Query('user_id') userId: string
  ) {
    if (!accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      console.log('📤 Fetching Instagram tagged media list...');
      
      // First, verify the access token and permissions
      try {
        const debugResponse = await axios.get(
          'https://graph.instagram.com/me/permissions',
          {
            params: { access_token: accessToken }
          }
        );
        console.log('🔑 Instagram permissions:', debugResponse.data);
      } catch (error) {
        console.error('❌ Failed to fetch permissions:', error);
      }

      // Now try to fetch tagged media using /me/tags endpoint
      const response = await axios.get<InstagramMediaResponse>(
        'https://graph.instagram.com/me/tags',
        {
          params: {
            fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,like_count,comments_count,children{id,media_type,media_url,thumbnail_url,username,like_count,comments_count}',
            access_token: accessToken,
          },
        }
      );

      console.log('📥 Raw tagged media response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      if (!response.data.data || response.data.data.length === 0) {
        console.log('⚠️ No tagged media found. This could mean:');
        console.log('1. The user has no tagged media');
        console.log('2. The app lacks necessary permissions');
        console.log('Current permissions requested:', 'user_profile,user_media,instagram_graph_user_profile,instagram_graph_user_media,instagram_tagged');
      }

      // Process the response to handle carousel albums
      const processedData = {
        ...response.data,
        data: response.data.data.map(item => {
          console.log('📸 Processing tagged media item:', {
            id: item.id,
            type: item.media_type,
            hasChildren: !!item.children?.data,
            username: item.username,
            likes: item.like_count,
            comments: item.comments_count
          });

          if (item.media_type === 'CAROUSEL_ALBUM' && item.children?.data) {
            const firstChild = item.children.data[0];
            return {
              ...item,
              media_url: firstChild.media_url || item.media_url,
              thumbnail_url: firstChild.thumbnail_url || item.thumbnail_url,
              is_carousel: true,
              child_count: item.children.data.length,
              like_count: firstChild.like_count || item.like_count,
              comments_count: firstChild.comments_count || item.comments_count,
              isTagged: true
            };
          }
          return {
            ...item,
            isTagged: true
          };
        })
      };
      
      return processedData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<InstagramErrorResponse>;
        console.error('❌ Instagram API Error:', {
          status: axiosError.response?.status,
          message: axiosError.response?.data?.error?.message,
          url: axiosError.config?.url,
          params: axiosError.config?.params,
          data: axiosError.response?.data
        });

        // Special handling for common errors
        if (axiosError.response?.status === 403) {
          console.log('🔒 Permission error. Make sure the app has the instagram_tagged permission');
        }

        throw new HttpException(
          axiosError.response?.data?.error?.message || 'Failed to fetch tagged media',
          axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('auth')
  async getAuthUrl(@Query('redirect_uri') redirectUri: string) {
    const appId = process.env.INSTAGRAM_APP_ID;
    if (!appId) {
      throw new Error('Instagram App ID not configured');
    }

    const scope = 'user_profile,user_media,instagram_graph_user_profile,instagram_graph_user_media,instagram_tagged';
    
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    
    return { url: authUrl };
  }

  @Post('callback')
  async handleCallback(@Body('code') code: string, @Headers('origin') origin: string) {
    console.log('📥 Received authorization code:', code);
    console.log('🌐 Request origin:', origin);

    if (!code) {
      console.error('❌ No authorization code provided');
      throw new HttpException('Authorization code is required', HttpStatus.BAD_REQUEST);
    }

    try {
      console.log('🔄 Preparing token exchange request...');
      const formData = new FormData();
      formData.append('client_id', this.clientId);
      formData.append('client_secret', this.clientSecret);
      formData.append('grant_type', 'authorization_code');
      formData.append('redirect_uri', this.redirectUri);
      formData.append('code', code);

      console.log('📤 Sending token exchange request to Instagram...');
      const response = await axios.post(
        'https://api.instagram.com/oauth/access_token',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Accept': 'application/json',
          },
        }
      );

      console.log('📥 Received short-lived token response:', response.data);
      
      // Exchange for long-lived token
      const longLivedTokenResponse = await this.exchangeForLongLivedToken(response.data.access_token);
      
      // Get user information using the long-lived token
      const userInfo = await this.getUserInfo(longLivedTokenResponse.access_token);
      
      // Save token to database
      await this.instagramService.saveAccessToken({
        userId: userInfo.id,
        username: userInfo.username,
        accessToken: longLivedTokenResponse.access_token,
        expiresIn: longLivedTokenResponse.expires_in,
        profilePictureUrl: userInfo.profile_picture_url,
        followersCount: userInfo.followers_count,
        followsCount: userInfo.follows_count,
        mediaCount: userInfo.media_count,
      });

      console.log('💾 Saved access token to database');
      
      console.log('📤 Sending response to frontend:', {
        userId: userInfo.id,
        username: userInfo.username,
        tokenPreview: longLivedTokenResponse.access_token.substring(0, 10) + '...'
      });
      
      return {
        ...response.data,
        id: userInfo.id,
        long_lived_token: longLivedTokenResponse.access_token,
        expires_in: longLivedTokenResponse.expires_in,
        username: userInfo.username,
        profile_picture_url: userInfo.profile_picture_url,
        followers_count: userInfo.followers_count,
        follows_count: userInfo.follows_count,
        media_count: userInfo.media_count
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<InstagramErrorResponse>;
        console.error('❌ Instagram API Error:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message,
          config: {
            url: axiosError.config?.url,
            method: axiosError.config?.method,
            headers: axiosError.config?.headers,
          }
        });
        throw new HttpException(
          axiosError.response?.data?.error?.message || 'Failed to exchange authorization code for token',
          axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      console.error('❌ Unexpected error:', error);
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}