import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
});

// No need for token interceptor since we're using cookies

export interface LoginResponse {
  user: {
    id?: string;
    _id: string;
    email: string;
    name: string;
    firstNameKana: string;
    lastNameKana: string;
    phoneNumber?: string;
    lineId?: string; // Matches backend schema
    accountHolderLastKana?: string;
    accountHolderFirstKana?: string;
    postCode?: string;
    address?: string;
    bankName?: string;
    branchCode?: string;
    accountType?: string;
    accountNumber?: string;
    accountPostalCode?: string;
    accountAddress?: string;
    accountPhone?: string;
    paypalEmail?: string;
    hasCompletedSnsSetup: boolean;
    linkedAccounts: Array<{
      type: string;
      email?: string;
      username?: string;
    }>;
  }
  token: string;
}

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  firstNameKana: string;
  lastNameKana: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthApi {
  login(data: LoginData): Promise<LoginResponse>;
  signup(data: SignupData): Promise<Omit<LoginResponse['user'], 'id'>>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<{ authenticated: boolean; user: LoginResponse['user'] | null }>;
  getCurrentUser(): Promise<LoginResponse['user']>;
  completeSnsSetup(): Promise<{ success: boolean; hasCompletedSnsSetup: boolean }>;
  deleteAccount(): Promise<void>;
  checkEmailAvailability(email: string): Promise<{ available: boolean }>;
  updateUser(data: Partial<LoginResponse['user']>): Promise<LoginResponse['user']>;
  updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }>;
}

export const authApi: AuthApi = {
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      if (response.data?.user) {
        // Don't store token in localStorage since we're using HTTP-only cookies
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      console.log('login response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('login failed:', error); // Debug log
      throw error;
    }
  },

  async signup(data: SignupData): Promise<Omit<LoginResponse['user'], 'id'>> {
    try {
      const response = await api.post('/auth/signup', data);
      console.log('signup response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('signup failed:', error); // Debug log
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      // First clear all client-side data
      localStorage.removeItem('user');
      localStorage.removeItem('user_id');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('x_auth_state');
      localStorage.removeItem('tiktok_auth_state');
      localStorage.removeItem('instagram_user_id');
      
      // Reset axios instance
      delete api.defaults.headers.common['Authorization'];
      
      // Then send logout request to server
      await api.post('/auth/logout', {}, {
        withCredentials: true
      });
      
      // No need for alert here since navigation will happen immediately
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local data even if server request fails
      localStorage.clear();
      delete api.defaults.headers.common['Authorization'];
      throw error;
    }
  },

  async isAuthenticated(): Promise<{ authenticated: boolean; user: LoginResponse['user'] | null }> {
    try {
      const response = await api.get<LoginResponse['user']>('/auth/me', {
        withCredentials: true
      });
      
      if (!response.data || !response.data._id) {
        throw new Error('Invalid user data');
      }

      return {
        authenticated: true,
        user: {
          ...response.data,
          id: response.data._id,
        },
      };
    } catch (error) {
      // Clear all auth data if authentication fails
      localStorage.removeItem('user');
      localStorage.removeItem('user_id');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('x_auth_state');
      localStorage.removeItem('tiktok_auth_state');
      localStorage.removeItem('instagram_user_id');
      
      // Reset axios instance
      delete api.defaults.headers.common['Authorization'];
      
      return {
        authenticated: false,
        user: null,
      };
    }
  },

  async getCurrentUser(): Promise<LoginResponse['user']> {
    try {
      // Make sure to include credentials to send cookies
      const response = await api.get<LoginResponse['user']>('/auth/me', {
        withCredentials: true
      });
      
      if (!response.data || !response.data._id) {
        throw new Error('Invalid user data received');
      }

      return {
        ...response.data,
        id: response.data._id,
      };
    } catch (error) {
      console.error('getCurrentUser failed:', error);
      // Clear any stale data
      localStorage.removeItem('user');
      localStorage.removeItem('user_id');
      throw error;
    }
  },

  async completeSnsSetup(): Promise<{ success: boolean; hasCompletedSnsSetup: boolean }> {
    try {
      const response = await api.post<{ success: boolean; hasCompletedSnsSetup: boolean }>('/auth/complete-sns-setup');
      return response.data;
    } catch (error) {
      console.error('completeSnsSetup failed:', error);
      throw error;
    }
  },

  async deleteAccount(): Promise<void> {
    try {
      await api.delete('/auth/user');
      localStorage.clear();
      console.log('Account deletion successful');
    } catch (error) {
      console.error('Account deletion failed:', error);
      throw error;
    }
  },

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    try {
      const response = await api.get<{ available: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error('Email check failed:', error);
      throw error;
    }
  },

  async updateUser(data: Partial<LoginResponse['user']>): Promise<LoginResponse['user']> {
    try {
      const response = await api.patch<LoginResponse['user']>('/auth/user', data);
      return response.data;
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    }
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.patch<{ success: boolean; message: string }>(
        '/auth/password',
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('現在のパスワードが正しくありません。');
      }
      throw error;
    }
  }
};

export interface SocialAccount {
  platform: string;
  username: string;
  profilePictureUrl: string;
  isConnected: boolean;
  followersCount: number;
  followsCount: number;
  mediaCount?: number;
  tweetCount?: number;
  videoCount?: number;
  lastUpdated: Date;
}

export interface UpdateUserLinkedAccountsRequest {
  userId: string;
  linkedAccounts: SocialAccount[];
}

export const updateUserLinkedAccounts = async (data: UpdateUserLinkedAccountsRequest): Promise<void> => {
  try {
    await api.patch('/auth/user/linked-accounts', data);
    // Refresh user data after updating linked accounts
    await authApi.getCurrentUser();
    console.log('updateUserLinkedAccounts successful'); // Debug log
  } catch (error) {
    console.error('Failed to update user linked accounts:', error); // Debug log
    throw error;
  }
};