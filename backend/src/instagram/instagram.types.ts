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
  tagged_users?: {
    id: string;
    username: string;
  }[];
  collaborators?: {
    id: string;
    username: string;
  }[];
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

export interface InstagramUserResponse {
  id: string;
  username: string;
  profile_picture_url?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
}

export interface InstagramLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface InstagramErrorResponse {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}
