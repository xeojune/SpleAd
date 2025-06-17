import axios, { AxiosError } from 'axios';

export interface XUserResponse {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

export interface XUserData {
  data: {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
    public_metrics?: {
      followers_count: number;
      following_count: number;
      tweet_count: number;
    };
  }
}

export interface XAuthSuccessResponse {
  success: true;
  tokenData: {
    access_token: string;
    token_type: string;
  };
  userData: XUserData;
}

export interface XAuthErrorResponse {
  success: false;
  error: string;
}

export interface XAuthResponse {
  success: boolean;
  tokenData: {
    token_type: string;
    expires_in: number;
    access_token: string;
    scope: string;
    refresh_token: string;
  };
  userData: {
    data: {
      id: string;
      name: string;
      username: string;
      profile_image_url: string;
      public_metrics: {
        followers_count: number;
        following_count: number;
        tweet_count: number;
      };
    };
  };
}

export class XAuth {
  private static state: string;

  static async initiateLogin(userId: string): Promise<void> {
    console.log('🎯 XAuth.initiateLogin called');
    // Generate random state
    this.state = Math.random().toString(36).substring(2);
    localStorage.setItem('x_auth_state', this.state);

    try {
      console.log('📡 Making request to backend...');
      const response = await axios.get<{ authUrl: string; state: string }>('http://localhost:3000/api/x/auth', {
        params: {
          state: this.state,
          userId: userId,
        },
        withCredentials: true
      });

      console.log('📥 Response received:', response);

      if (!response.data?.authUrl) {
        console.error('❌ Invalid response:', response.data);
        throw new Error('Invalid auth URL received from server');
      }

      // Redirect to Twitter's authorization page
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('❌ Error in XAuth.initiateLogin:', {
        message: (error as AxiosError).message,
        response: (error as AxiosError).response?.data,
        status: (error as AxiosError).response?.status,
      });
      throw error;
    }
  }

  static async handleCallback(code: string, state: string, userId: string): Promise<XAuthResponse> {
    // Verify state matches
    const savedState = localStorage.getItem('x_auth_state');
    if (!savedState || state !== savedState) {
      throw new Error('Invalid state parameter');
    }

    try {
      console.log('📡 Making callback request to backend...');
      const response = await axios.get<XAuthResponse>('http://localhost:3000/api/x/callback', {
        params: {
          code,
          state,
          userId,
        },
        withCredentials: true
      });

      console.log('📥 Callback response:', response.data);

      if (!response.data?.success) {
        throw new Error('Failed to complete authentication');
      }

      // Clear the state after successful authentication
      localStorage.removeItem('x_auth_state');

      return response.data;
    } catch (error) {
      console.error('Failed to complete X authentication:', error);
      throw error;
    }
  }
}