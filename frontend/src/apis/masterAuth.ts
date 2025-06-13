import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface LoginResponse {
  user: {
    id: string;
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
  isAuthenticated(): Promise<boolean>;
}

export const authApi: AuthApi = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    if (response.data?.user) {
      // Store the token
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async signup(data: SignupData): Promise<Omit<LoginResponse['user'], 'id'>> {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }
      const response = await api.get('/auth/me');
      return !!response.data;
    } catch (error) {
      localStorage.removeItem('token'); // Clear invalid token
      return false;
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
    await axios.patch(`${API_URL}/auth/user/linked-accounts`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  } catch (error) {
    console.error('Failed to update user linked accounts:', error);
    throw error;
  }
};