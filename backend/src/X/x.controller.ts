import { Controller, Get, Query, Logger, UnauthorizedException } from '@nestjs/common';
import { XService } from './x.service';
import { TokenResponse, XUserResponse } from './x.types';
import { randomBytes } from 'crypto';

interface XAuthSuccessResponse {
  success: true;
  tokenData: TokenResponse;
  userData: XUserResponse;
}

interface XAuthErrorResponse {
  success: false;
  error: string;
}

type XAuthResponse = XAuthSuccessResponse | XAuthErrorResponse;

@Controller('api/x')
export class XController {
  private readonly logger = new Logger(XController.name);

  constructor(private readonly xService: XService) {}

  @Get('auth')
  async initiateAuth(@Query('state') state: string): Promise<{ authUrl: string; state: string }> {
    try {
      this.logger.debug('Received auth request with state:', state);
      
      if (!state) {
        state = randomBytes(32).toString('hex');
        this.logger.debug('Generated new state:', state);
      }
      
      this.logger.debug('Initiating X auth with state:', state);
      const authUrl = await this.xService.getOAuthUrl(state);
      this.logger.debug('Generated X auth URL:', authUrl);
      
      return { authUrl, state };
    } catch (error) {
      this.logger.error('Failed to generate auth URL:', error);
      throw error;
    }
  }

  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
  ): Promise<XAuthResponse> {
    try {
      if (!code || !state) {
        return {
          success: false,
          error: 'Missing code or state parameter'
        };
      }

      this.logger.debug('Handling callback with code and state:', { code, state });
      
      // Exchange the code for an access token
      const tokenData = await this.xService.getAccessToken(code, state);
      
      // Get user info using the access token
      const userData = await this.xService.getUserInfo(tokenData.access_token);
      
      this.logger.debug('Successfully processed callback');
      return {
        success: true,
        tokenData,
        userData
      };
    } catch (error) {
      this.logger.error('Callback handling failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('refresh')
  async refreshToken(@Query('refresh_token') refreshToken: string): Promise<{ success: boolean; tokenData: TokenResponse; error?: string }> {
    try {
      if (!refreshToken) {
        throw new Error('Missing refresh token');
      }

      const tokenData = await this.xService.refreshToken(refreshToken);
      return {
        success: true,
        tokenData,
      };
    } catch (error) {
      this.logger.error('Token refresh failed:', error);
      throw error;
    }
  }

  @Get('user/me')
  async getCurrentUser(@Query('access_token') accessToken: string): Promise<XUserResponse> {
    try {
      if (!accessToken) {
        throw new UnauthorizedException('Access token is required');
      }
      return await this.xService.getUserInfo(accessToken);
    } catch (error) {
      this.logger.error('Failed to get current user:', error);
      throw error;
    }
  }

  @Get('user/by-username')
  async getUserByUsername(@Query('username') username: string): Promise<XUserResponse> {
    try {
      if (!username) {
        throw new Error('Username is required');
      }
      return await this.xService.getUserByUsername(username);
    } catch (error) {
      this.logger.error('Failed to get user by username:', error);
      throw error;
    }
  }
}