import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

export interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  username?: string;
  like_count?: number;
  comments_count?: number;
  is_carousel?: boolean;
  child_count?: number;
  isTagged?: boolean;
  children?: {
    data: Array<{
      id?: string;
      media_type: string;
      media_url: string;
      thumbnail_url?: string;
      username?: string;
      like_count?: number;
      comments_count?: number;
    }>;
  };
}

export interface InstagramMediaResponse {
  data: InstagramMedia[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

interface ErrorResponse {
  message: string;
  type: string;
  code: number;
  error_subcode?: number;
}

interface InstagramErrorResponse {
  error: ErrorResponse;
}

export const getMediaList = async (accessToken: string): Promise<InstagramMediaResponse> => {
  try {
    console.log('📤 Fetching Instagram media list...');
    const response = await axios.get<InstagramMediaResponse>(`${API_URL}/instagram/media`, {
      params: { access_token: accessToken }
    });
    console.log('📥 Received media list:', {
      count: response.data.data.length,
      types: [...new Set(response.data.data.map(item => item.media_type))]
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<InstagramErrorResponse>;
      console.error('❌ Instagram API Error:', {
        status: axiosError.response?.status,
        message: axiosError.response?.data?.error?.message,
        type: axiosError.response?.data?.error?.type,
        code: axiosError.response?.data?.error?.code
      });
    } else {
      console.error('❌ Unexpected error:', error);
    }
    throw error;
  }
};

export const getTaggedMediaList = async (accessToken: string): Promise<InstagramMediaResponse> => {
  try {
    const response = await axios.get<InstagramMediaResponse>(`${API_URL}/instagram/media/tagged`, {
      params: {
        access_token: accessToken
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch Instagram tagged media:', error.response?.data);
      if (error.response?.status === 403) {
        console.log('Missing instagram_tagged permission. Please re-authenticate.');
      }
    }
    throw error;
  }
};