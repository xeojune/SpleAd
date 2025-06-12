import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import * as crypto from 'crypto';
import { TokenResponse, PKCEPair, XUserResponse } from './x.types';
import { XAccessToken, XAccessTokenDocument } from './schema/x.schema';

@Injectable()
export class XService implements OnModuleInit {
  private readonly logger = new Logger(XService.name);
  private apiKey: string;
  private apiSecret: string;
  private redirectUri: string;
  private bearerToken: string;
  private pkceStore: Map<string, string> = new Map(); // Store PKCE verifiers by state

  constructor(
    private configService: ConfigService,
    @InjectModel('XAccessToken')
    private xAccessTokenModel: Model<XAccessTokenDocument>
  ) {
    const apiKey = this.configService.get<string>('X_CLIENT_ID');
    const apiSecret = this.configService.get<string>('X_APP_SECRET');
    const redirectUri = this.configService.get<string>('REDIRECT_URI');
    const bearerToken = this.configService.get<string>('X_BEARER_TOKEN');

    if (!apiKey || !apiSecret || !redirectUri || !bearerToken) {
      throw new Error('Missing required X API configuration');
    }

    this.logger.debug('Initializing X service with config:', {
      clientId: apiKey,
      redirectUri: redirectUri,
      hasBearerToken: !!bearerToken
    });

    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.redirectUri = redirectUri;
    this.bearerToken = bearerToken;
  }

  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json',
    };
  }

  async onModuleInit() {
    // No need to get app-only token, using bearer token instead
  }

  private async makeAuthenticatedRequest<T>(url: string, options: any = {}): Promise<T> {
    const response = await axios({
      ...options,
      url,
      headers: {
        ...options.headers,
        ...this.getAuthHeaders()
      }
    });

    return response.data;
  }

  private generatePKCE(): { codeVerifier: string; codeChallenge: string } {
    // Generate a random code verifier
    const codeVerifier = crypto.randomBytes(64).toString('base64url').substring(0, 128);

    // Generate code challenge using S256 method
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return {
      codeVerifier,
      codeChallenge
    };
  }

  async getOAuthUrl(state: string): Promise<string> {
    try {
      // Basic scopes required for X OAuth
      const scopes = [
        'tweet.read',
        'users.read',
        'follows.read',
        'follows.write',
        'offline.access'  // Add this for refresh tokens
      ];

      // Generate PKCE challenge
      const { codeVerifier, codeChallenge } = this.generatePKCE();
      this.pkceStore.set(state, codeVerifier);

      // Log the redirect URI for debugging
      this.logger.debug('Using redirect URI:', this.redirectUri);

      // Ensure redirect URI is properly registered
      if (!this.redirectUri) {
        throw new Error('X_REDIRECT_URI environment variable is not set');
      }

      // Build auth URL directly for better control over encoding
      const authUrl = `https://twitter.com/i/oauth2/authorize?` +
        `response_type=code` +
        `&client_id=${this.apiKey}` +
        `&redirect_uri=${encodeURIComponent(this.redirectUri)}` +
        `&scope=${encodeURIComponent(scopes.join(' '))}` +
        `&state=${state}` +
        `&code_challenge=${codeChallenge}` +
        `&code_challenge_method=S256` +
        `&force_login=true`;

      // Log the full auth URL for debugging
      this.logger.debug('Generated auth URL:', authUrl);
      
      return authUrl;
    } catch (error) {
      this.logger.error('Failed to generate OAuth URL:', error);
      throw error;
    }
  }

  async getAccessToken(code: string, state: string): Promise<TokenResponse> {
    try {
      const codeVerifier = this.pkceStore.get(state);
      if (!codeVerifier) {
        throw new Error('Invalid or expired state parameter');
      }

      const params = new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: this.apiKey,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier
      });

      const response = await axios.post<TokenResponse>(
        'https://api.twitter.com/2/oauth2/token',
        params,
        {
          auth: {
            username: this.apiKey,
            password: this.apiSecret
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Splead X App v1.0',
            'Accept-Encoding': 'gzip'
          }
        }
      );

      // Clean up used PKCE verifier
      this.pkceStore.delete(state);

      if (!response.data.access_token) {
        throw new Error('No access token received');
      }

      // Get user info to save with token
      const userInfo = await this.getUserInfo(response.data.access_token);

      // Save token and user info to database
      await this.xAccessTokenModel.findOneAndUpdate(
        { userId: userInfo.data.id },
        {
          userId: userInfo.data.id,
          username: userInfo.data.username,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          expiresIn: response.data.expires_in,
          profilePictureUrl: userInfo.data.profile_image_url,
          followersCount: userInfo.data.public_metrics?.followers_count,
          followsCount: userInfo.data.public_metrics?.following_count,
          tweetCount: userInfo.data.public_metrics?.tweet_count,
        },
        { upsert: true, new: true }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get access token:', error.response?.data || error.message);
      throw new Error('Failed to get access token');
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      });

      const response = await axios.post<TokenResponse>(
        'https://api.twitter.com/2/oauth2/token',
        params,
        {
          auth: {
            username: this.apiKey,
            password: this.apiSecret
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Splead X App v1.0',
            'Accept-Encoding': 'gzip'
          }
        }
      );

      if (!response.data.access_token) {
        throw new Error('No access token received from refresh');
      }

      // Add expires_at if we have expires_in
      if (response.data.expires_in) {
        response.data.expires_at = Date.now() + response.data.expires_in * 1000;
      }

      // Update token in database
      await this.xAccessTokenModel.findOneAndUpdate(
        { refreshToken: refreshToken },
        {
          accessToken: response.data.access_token,
          expiresIn: response.data.expires_in,
        },
        { new: true }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to refresh token:', error.response?.data || error.message);
      throw new Error('Failed to refresh token');
    }
  }

  async getUserInfo(accessToken?: string): Promise<XUserResponse> {
    try {
      // If access token is provided, use it, otherwise use bearer token
      const headers = accessToken ? {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      } : this.getAuthHeaders();

      const response = await axios.get('https://api.x.com/2/users/me', {
        headers: headers,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch user info:', error.response?.data || error.message);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<XUserResponse> {
    try {
      const response = await axios.get(`https://api.x.com/2/users/by/username/${username}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch user by username:', error.response?.data || error.message);
      throw error;
    }
  }
}