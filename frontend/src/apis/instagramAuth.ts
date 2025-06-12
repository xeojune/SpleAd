import axios, { AxiosError } from 'axios';

const INSTAGRAM_AUTH_URL = 'https://www.instagram.com/oauth/authorize';
const CLIENT_ID = '1257114546025522';
const REDIRECT_URI = 'https://0005-220-76-70-1.ngrok-free.app/link';
const API_URL = 'http://localhost:3000';

interface InstagramTokenResponse {
  access_token: string;
  id: string;
  long_lived_token: string;
  expires_in: number;
  username: string;
  profile_picture_url: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
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

export const getInstagramAuthUrl = () => {
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
    force_authentication: '1'
  });

  const authUrl = `${INSTAGRAM_AUTH_URL}?${params.toString()}`;
  console.log('🚀 Redirecting to Instagram auth URL:', authUrl);
  return authUrl;
};

export const exchangeCodeForToken = async (code: string): Promise<InstagramTokenResponse> => {
  try {
    console.log('📤 Sending code to backend for token exchange:', code);
    const response = await axios.post<InstagramTokenResponse>(`${API_URL}/instagram/callback`, { code });
    
    console.log('📥 Raw token response data:', {
      ...response.data,
      access_token: response.data.access_token?.substring(0, 10) + '...',
      long_lived_token: response.data.long_lived_token?.substring(0, 10) + '...'
    });
    
    console.log('📥 Parsed token response:', {
      userId: response.data.id,
      username: response.data.username,
      shortLivedToken: response.data.access_token?.substring(0, 10) + '...',
      longLivedToken: response.data.long_lived_token?.substring(0, 10) + '...',
      expiresIn: response.data.expires_in,
      profilePictureUrl: response.data.profile_picture_url,
      followersCount: response.data.followers_count,
      followsCount: response.data.follows_count,
      mediaCount: response.data.media_count
    });
    
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