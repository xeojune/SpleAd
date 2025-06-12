export interface TokenResponse {
  token_type: string;
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
}

export interface PKCEPair {
  codeVerifier: string;
  codeChallenge: string;
}

export interface XUserResponse {
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
  };
}
