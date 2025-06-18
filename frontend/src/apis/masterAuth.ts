import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
});

// No need for token interceptor since we're using cookies

interface LoginResponse {
  user: {
    id?: string;  // For backward compatibility
    _id: string;  // From MongoDB
    email: string;
    name: string | null;
    linkedAccounts: Array<{
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
    }>;
  };
  token: string;
}

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
  postCode: string;
  address: string;
  detailAddress?: string;
  accountNumber: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthApi {
  login(data: LoginData): Promise<LoginResponse>;
  signup(data: SignupData): Promise<Omit<LoginResponse['user'], 'id'>>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<{ authenticated: boolean; user?: LoginResponse['user'] }>;
  getCurrentUser(): Promise<LoginResponse['user']>;
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
      await api.post('/auth/logout');
      // Don't need to remove token from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('user_id');
      console.log('logout successful'); // Debug log
    } catch (error) {
      console.error('logout failed:', error); // Debug log
      throw error;
    }
  },

  async isAuthenticated(): Promise<{ authenticated: boolean; user?: LoginResponse['user'] }> {
    try {
      const user = await this.getCurrentUser();
      console.log('isAuthenticated check - user:', user);
      return {
        authenticated: !!(user?._id || user?.id), // Check both _id and id
        user
      };
    } catch (error) {
      console.error('isAuthenticated check failed:', error);
      return { authenticated: false };
    }
  },

  async getCurrentUser(): Promise<LoginResponse['user']> {
    try {
      const response = await api.get<LoginResponse['user']>('/auth/me');
      console.log('getCurrentUser response:', response.data);
      
      // Transform the response to ensure id is present
      const userData = {
        ...response.data,
        id: response.data._id, // Add id field based on _id
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('getCurrentUser failed:', error);
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