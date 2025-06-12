export interface User {
  id: string;
  email: string;
  name: string;
  profile_image?: string;
  auth_provider: 'google' | 'kakao' | 'naver';
  is_new_user?: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

export interface AuthError {
  error: string;
  message?: string;
}

export interface SocialConnectionsResponse {
  success: boolean;
  data: {
    google: boolean;
    kakao: boolean;
    naver: boolean;
  };
  message?: string;
}

export interface SocialDisconnectResponse {
  success: boolean;
  message?: string;
}

export interface UserChild {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
}

export type SocialProvider = 'google' | 'kakao' | 'naver';

export interface LogoutResponse {
  success: boolean;
  message?: string;
}
