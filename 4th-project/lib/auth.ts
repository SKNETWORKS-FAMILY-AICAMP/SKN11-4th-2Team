// lib/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  profile_image?: string;
  is_staff: boolean;
  auth_provider?: string;
  last_login?: string;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export class AuthService {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_KEY = 'user_data';

  // 토큰 저장
  static setTokens(tokens: AuthTokens): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access);
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh);
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(tokens.user));
    }
  }

  // 액세스 토큰 가져오기
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  // 리프레시 토큰 가져오기
  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  // 사용자 정보 가져오기
  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // 로그인 상태 확인
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // 토큰 제거 (로그아웃)
  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
    }
  }

  // 토큰 만료 확인
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // 사용자 정보 업데이트
  static updateUser(user: User): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }
}

// JWT 토큰에서 페이로드 추출
export function decodeJWT(token: string): any {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error('JWT 디코딩 오류:', error);
    return null;
  }
}
