import { Controller, Get, Query, Logger, UnauthorizedException, Res } from '@nestjs/common';
import { Response } from 'express';
import { TikTokService } from './tiktok.service';
import * as crypto from 'crypto';

interface TikTokAuthResponse {
  success: boolean;
  error?: string;
  tokenData?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
    openId: string;
    scopes: string;
    tokenType: string;
    userData: {
      displayName: string;
      avatarUrl: string;
      stats: {
        followerCount: number;
        followingCount: number;
        likesCount: number;
        videoCount: number;
      };
      isVerified: boolean;
      bioDescription: string;
      profileUrl: string;
    };
  };
}

@Controller('tiktok')
export class TiktokController {
  private readonly logger = new Logger(TiktokController.name);

  constructor(private readonly tiktokService: TikTokService) {}

  @Get('auth')
  async initiateAuth(@Query('state') state: string, @Res() res: Response): Promise<void> {
    try {
      
      // Generate state if not provided
      if (!state) {
        state = crypto.randomBytes(32).toString('hex');
      }
    
      
      // Get the auth URL
      const authUrl = await this.tiktokService.getOAuthUrl(state);
      
      // Set state in cookie for validation
      res.cookie('tiktokState', state, { 
        maxAge: 600000, // 10 minutes
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      });

      // Redirect to TikTok
      res.redirect(authUrl);
    } catch (error) {
      this.logger.error('Failed to generate auth URL:', error);
      res.redirect('/error?message=Failed to start TikTok authentication');
    }
  }

  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Query('error_description') errorDescription: string,
    @Query('userId') userId: string = 'default' // Temporary default user ID
  ): Promise<any> {
    try {
      if (error) {
        this.logger.error('TikTok OAuth error:', { error, errorDescription });
        return { success: false, error };
      }

      if (!code || !state) {
        throw new UnauthorizedException('Missing required parameters');
      }

      this.logger.debug('Processing TikTok callback:', { code, state });

      const tokenData = await this.tiktokService.exchangeCodeForToken(code);
      const userData = await this.tiktokService.getUserInfo(tokenData.access_token, tokenData.token_type);

      // Save token and user info to database
      await this.tiktokService.saveTokenInfo(userId, tokenData, userData);

      this.logger.debug('TikTok auth successful and data saved');

      return {
        success: true,
        tokenData: {
          access_token: tokenData.access_token,
          expires_in: tokenData.expires_in,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
          userData: {
            display_name: userData.display_name,
            avatar_url: userData.avatar_url,
            stats: {
              follower_count: userData.follower_count,
              following_count: userData.following_count,
              video_count: userData.video_count
            }
          }
        }
      };
    } catch (error) {
      this.logger.error('Callback handling error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  }

  @Get('refresh')
  async refreshToken(@Query('refresh_token') refreshToken: string): Promise<TikTokAuthResponse> {
    try {
      this.logger.debug('Handling token refresh request');

      if (!refreshToken) {
        return {
          success: false,
          error: 'Refresh token is required'
        };
      }

      try {
        const tokenData = await this.tiktokService.refreshToken(refreshToken);
        
        // Get updated user info with new access token
        const userData = await this.tiktokService.getUserInfo(
          tokenData.access_token,
          tokenData.token_type
        );

        return {
          success: true,
          tokenData: {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresIn: tokenData.expires_in,
            refreshExpiresIn: tokenData.refresh_expires_in,
            openId: tokenData.open_id,
            scopes: tokenData.scope,
            tokenType: tokenData.token_type,
            userData: {
              displayName: userData.display_name,
              avatarUrl: userData.avatar_url,
              stats: {
                followerCount: userData.stats.follower_count,
                followingCount: userData.stats.following_count,
                likesCount: userData.stats.likes_count,
                videoCount: userData.stats.video_count
              },
              isVerified: userData.is_verified,
              bioDescription: userData.bio_description,
              profileUrl: userData.profile_deep_link
            }
          }
        };
      } catch (error) {
        this.logger.error('Token refresh error:', error);
        return {
          success: false,
          error: 'Failed to refresh token'
        };
      }
    } catch (error) {
      this.logger.error('Refresh handling error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  }

  @Get('user-info')
  async getUserInfo(@Query('userId') userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new UnauthorizedException('Missing user ID');
      }

      const tokenInfo = await this.tiktokService.getTokenInfo(userId);
      if (!tokenInfo) {
        throw new UnauthorizedException('No TikTok connection found for this user');
      }

      return {
        success: true,
        data: tokenInfo.userInfo
      };
    } catch (error) {
      this.logger.error('Failed to get user info:', error);
      return {
        success: false,
        error: error.message || 'Failed to get user info'
      };
    }
  }
}