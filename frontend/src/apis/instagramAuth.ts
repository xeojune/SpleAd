import axios, { AxiosError } from 'axios';

const INSTAGRAM_AUTH_URL = 'https://www.instagram.com/oauth/authorize';
const CLIENT_ID = '1257114546025522';
const REDIRECT_URI = 'https://0005-220-76-70-1.ngrok-free.app/profile/sns';
const API_URL = 'http://localhost:3000';

export interface InstagramTokenResponse {
  id: string;
  username: string;
  profile_picture_url: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  access_token: string;
  long_lived_token: string;
  expires_in: number;
}

interface InstagramUserResponse {
  id: string;
  username: string;
  profile_picture_url: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
}

interface InstagramErrorResponse {
  error_type: string;
  code: number;
  error_message: string;
}

interface InstagramMediaResponse {
  data: Array<{
    id: string;
    caption?: string;
    media_type: string;
    media_url: string;
    permalink: string;
    thumbnail_url?: string;
    timestamp: string;
  }>;
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export const getInstagramAuthUrl = (userId: string): string => {
  const state = Math.random().toString(36).substring(2);
  localStorage.setItem('instagram_auth_state', state);
  const scopes = [
    'instagram_business_basic',
    'instagram_business_manage_messages',
    'instagram_business_manage_comments',
    'instagram_business_content_publish',
    'instagram_business_manage_insights'
  ].join(',');

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: scopes,
    enable_fb_login: '0',
    force_authentication: '1',
    state,
    userId
  });

  const authUrl = `${INSTAGRAM_AUTH_URL}?${params.toString()}`;
  console.log('🚀 Redirecting to Instagram auth URL:', authUrl);
  return authUrl;
};

export const exchangeCodeForToken = async (code: string, userId: string): Promise<InstagramTokenResponse> => {
  try {
    const redirect_uri = `${window.location.origin}/profile/sns`;
    console.log('📤 Sending code to backend for token exchange:', { code, redirect_uri });
    
    const response = await axios.post<InstagramTokenResponse>(
      `${API_URL}/instagram/callback`, 
      { code, userId, redirect_uri }
    );
    
    console.log('📥 Raw token response data:', {
      ...response.data,
      access_token: response.data.access_token?.substring(0, 10) + '...',
      long_lived_token: response.data.long_lived_token?.substring(0, 10) + '...'
    });

    if (!response.data.access_token) {
      console.error('❌ No access token in response data');
      throw new Error('No access token received');
    }

    if (!response.data.id) {
      console.error('❌ No user ID in response data');
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<InstagramErrorResponse>;
      console.error('❌ Instagram API Error:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message
      });
    } else {
      console.error('❌ Unexpected error:', error);
    }
    throw error;
  }
};

export const getUserProfile = async (accessToken: string): Promise<InstagramUserResponse> => {
  try {
    console.log('📤 Fetching user profile...');
    const response = await axios.get<InstagramUserResponse>(`${API_URL}/instagram/user`, {
      params: { access_token: accessToken }
    });
    console.log('📥 Received user profile:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<InstagramErrorResponse>;
      console.error('❌ Instagram API Error:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message
      });
    } else {
      console.error('❌ Unexpected error:', error);
    }
    throw error;
  }
};

export const getMediaList = async (accessToken: string): Promise<InstagramMediaResponse> => {
  try {
    console.log('📤 Fetching media list...');
    const response = await axios.get<InstagramMediaResponse>(`${API_URL}/instagram/media`, {
      params: { access_token: accessToken }
    });
    console.log('📥 Received media list:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<InstagramErrorResponse>;
      console.error('❌ Instagram API Error:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message
      });
    } else {
      console.error('❌ Unexpected error:', error);
    }
    throw error;
  }
};