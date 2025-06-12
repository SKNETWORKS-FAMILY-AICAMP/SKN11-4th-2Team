// lib/api.ts
import { AuthService, LoginCredentials, AuthTokens, User } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // HTTP 요청 헬퍼
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const accessToken = AuthService.getAccessToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // 인증이 필요한 요청에 토큰 추가
    if (accessToken && !config.headers?.Authorization) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    try {
      const response = await fetch(url, config);

      // 토큰 만료 시 리프레시 시도
      if (response.status === 401 && accessToken) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // 토큰 갱신 후 재시도
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${AuthService.getAccessToken()}`,
          };
          const retryResponse = await fetch(url, config);
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          return retryResponse.json();
        } else {
          // 리프레시 실패 시 로그아웃
          AuthService.clearTokens();
          window.location.href = '/login';
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API 요청 오류:', error);
      throw error;
    }
  }

  // 로그인
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await this.request<{data: AuthTokens}>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // 토큰과 사용자 정보를 세션 스토리지에 저장
    AuthService.setTokens(response.data);
    return response.data;
  }

  // 로그아웃
  async logout(): Promise<void> {
    const refreshToken = AuthService.getRefreshToken();
    
    try {
      await this.request('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (error) {
      console.error('로그아웃 API 오류:', error);
    } finally {
      // 로컬에서 토큰 제거
      AuthService.clearTokens();
    }
  }

  // 토큰 갱신
  async refreshToken(): Promise<boolean> {
    const refreshToken = AuthService.getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // 새로운 액세스 토큰 저장
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('access_token', data.access);
        }
        
        return true;
      }
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
    }

    return false;
  }

  // 사용자 프로필 조회
  async getProfile(): Promise<User> {
    const response = await this.request<{data: User}>('/auth/profile/');
    return response.data;
  }

  // 사용자 프로필 업데이트
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.request<{data: User}>('/auth/profile/update/', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  // 토큰 유효성 검증
  async verifyToken(): Promise<{ valid: boolean; user: User }> {
    const response = await this.request<{data: { valid: boolean; user: User }}>('/auth/token/verify/');
    return response.data;
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<T> {
    const response = await this.request<{data: T}>(endpoint, { method: 'GET' });
    return response.data;
  }

  // POST 요청
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.request<{data: T}>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // PUT 요청
  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.request<{data: T}>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.request<{data: T}>(endpoint, { method: 'DELETE' });
    return response.data;
  }
}

// API 클라이언트 인스턴스 생성
export const apiClient = new ApiClient(API_BASE_URL);

// 편의 함수들
export const authApi = {
  login: (credentials: LoginCredentials) => apiClient.login(credentials),
  logout: () => apiClient.logout(),
  getProfile: () => apiClient.getProfile(),
  updateProfile: (userData: Partial<User>) => apiClient.updateProfile(userData),
  verifyToken: () => apiClient.verifyToken(),
  refreshToken: () => apiClient.refreshToken(),
};
