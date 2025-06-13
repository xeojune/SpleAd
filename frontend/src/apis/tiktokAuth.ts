import axios from 'axios';

export interface TikTokAuthResponse {
  success: boolean;
  tokenData: {
    access_token: string;
    refresh_token: string;
    userData: {
      id: string;
      display_name: string;
      avatar_url: string;
      stats: {
        follower_count: number;
        following_count: number;
        video_count: number;
      };
    };
  };
}

export class TikTokAuth {
  private static state: string;

  static async initiateLogin(userId: string): Promise<void> {
    console.log('🎯 TikTokAuth.initiateLogin called');
    // Generate random state
    this.state = Math.random().toString(36).substring(2);
    localStorage.setItem('tiktok_auth_state', this.state);

    try {
      console.log('📡 Making request to backend...');
      const authUrl = `http://localhost:3000/tiktok/auth?state=${this.state}&userId=${userId}`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('❌ Error in TikTokAuth.initiateLogin:', error);
      throw error;
    }
  }

  static async handleCallback(code: string, state: string, userId: string): Promise<TikTokAuthResponse> {
    // Verify state matches
    const savedState = localStorage.getItem('tiktok_auth_state');
    if (!savedState || state !== savedState) {
      throw new Error('Invalid state parameter');
    }

    try {
      console.log('📡 Making callback request to backend...');
      const response = await axios.get<TikTokAuthResponse>('http://localhost:3000/tiktok/callback', {
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
      localStorage.removeItem('tiktok_auth_state');

      return response.data;
    } catch (error) {
      console.error('Failed to complete TikTok authentication:', error);
      throw error;
    }
  }
}
