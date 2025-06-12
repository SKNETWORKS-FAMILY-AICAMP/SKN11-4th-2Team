import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { AuthService } from '@/lib/auth'; // JWT 토큰 관리

// API 기본 설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

console.log('🔍 환경 변수 확인:', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  사용될_API_BASE_URL: API_BASE_URL,
});

const API_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || '30000',
  10,
);

/**
 * 기본 API 클라이언트 클래스
 * 모든 API 요청에 공통적으로 필요한 설정을 관리
 */
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    console.log('🔧 API_BASE_URL:', API_BASE_URL);

    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터 설정
    this.client.interceptors.request.use(
      async (config) => {
        console.log('📤 API 요청:', {
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`,
          method: config.method?.toUpperCase(),
        });

        // CSRF 토큰을 가져옵니다 (브라우저 환경에서만)
        if (typeof document !== 'undefined') {
          let csrfToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('csrftoken='))
            ?.split('=')[1];

          // CSRF 토큰이 없으면 가져오기 시도
          if (
            !csrfToken &&
            (config.method?.toLowerCase() === 'post' ||
              config.method?.toLowerCase() === 'put' ||
              config.method?.toLowerCase() === 'patch' ||
              config.method?.toLowerCase() === 'delete')
          ) {
            try {
              console.log('🔍 CSRF 토큰이 없어서 가져오는 중...');
              await axios.get(`${API_BASE_URL}/api/auth/csrf/`, {
                withCredentials: true,
              });

              // 다시 한 번 쿠키에서 토큰 가져오기
              csrfToken = document.cookie
                .split('; ')
                .find((row) => row.startsWith('csrftoken='))
                ?.split('=')[1];

              console.log(
                '✅ CSRF 토큰 가져오기 성공:',
                csrfToken ? '토큰 있음' : '토큰 없음',
              );
            } catch (csrfError) {
              console.warn('⚠️ CSRF 토큰 가져오기 실패:', csrfError);
            }
          }

          if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
            console.log('🔐 CSRF 토큰 설정 완료');
          } else {
            console.warn('⚠️ CSRF 토큰을 찾을 수 없습니다');
          }
        }

        // 브라우저 환경에서만 JWT 토큰 처리
        if (typeof window !== 'undefined') {
          // 세션 스토리지에서 JWT 토큰 가져오기
          let accessToken = AuthService.getAccessToken();

          // 세션 스토리지에 토큰이 없으면 NextAuth 세션에서 가져오기
          if (!accessToken) {
            try {
              const session = await getSession();

              if (session?.access) {
                accessToken = session.access;

                // NextAuth에서 받은 토큰을 세션 스토리지에 저장
                const authTokens = {
                  access: session.access,
                  refresh: session.refresh || '',
                  user: session.user,
                };
                AuthService.setTokens(authTokens);
                console.log('💾 JWT 토큰을 세션 스토리지에 저장');
              }
            } catch (error) {
              console.error('❌ NextAuth 세션 가져오기 실패:', error);
            }
          }

          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          } else {
            console.warn(
              '⚠️ 인증 토큰이 없어서 API 요청에 실패할 수 있습니다:',
              config.url,
            );
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // 응답 인터셉터 설정
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // 토큰 만료로 인한 401 에러 처리
        if (error.response?.status === 401 && !originalRequest._retry) {
          // 토큰이 있는 경우에만 리프레시 시도
          const hasToken =
            AuthService.getAccessToken() || (await getSession())?.access;

          if (!hasToken) {
            // 토큰이 아예 없는 경우 - 로그인 필요
            console.info('토큰이 없어 로그인이 필요합니다.');
            return Promise.reject(error);
          }

          if (this.isRefreshing) {
            // 이미 토큰 갱신 중이면 대기
            return new Promise((resolve, reject) => {
              this.refreshSubscribers.push((token: string) => {
                if (token) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(this.client(originalRequest));
                } else {
                  reject(error);
                }
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // 세션 스토리지에서 리프레시 토큰 가져오기
            let refreshToken = AuthService.getRefreshToken();

            // 세션 스토리지에 리프레시 토큰이 없으면 NextAuth 세션에서 가져오기
            if (!refreshToken) {
              const session = await getSession();
              refreshToken = session?.refresh;
            }

            if (!refreshToken) {
              throw new Error('리프레시 토큰이 없습니다');
            }

            // 리프레시 토큰으로 새로운 액세스 토큰 발급
            const response = await axios.post(
              `${API_BASE_URL}/api/auth/token/refresh/`,
              {
                refresh: refreshToken,
              },
            );

            const { access } = response.data;

            // 세션 스토리지에 새로운 액세스 토큰 저장
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('access_token', access);
            }

            // 대기 중인 요청들 처리
            this.refreshSubscribers.forEach((callback) => callback(access));
            this.refreshSubscribers = [];

            // 새로운 액세스 토큰으로 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // 리프레시 토큰도 만료된 경우
            console.warn('토큰 갱신 실패:', refreshError);
            AuthService.clearTokens();

            // 대기 중인 요청들에게 실패 알림
            this.refreshSubscribers.forEach((callback) => callback(''));
            this.refreshSubscribers = [];

            // 특정 페이지에서만 자동 리다이렉트
            const currentPath =
              typeof window !== 'undefined' ? window.location.pathname : '';
            const shouldRedirect =
              currentPath.includes('/dashboard') ||
              currentPath.includes('/profile') ||
              currentPath.includes('/children');

            if (shouldRedirect && typeof window !== 'undefined') {
              console.info('인증 만료로 인해 로그인 페이지로 이동합니다.');
              setTimeout(() => {
                window.location.href = '/login';
              }, 1000); // 1초 후 리다이렉트 (에러 메시지 표시 시간 확보)
            }

            return Promise.reject(error); // 원본 에러 반환
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // 서버에서 응답이 왔지만 에러 상태 코드인 경우
      const message =
        error.response.data?.message ||
        error.response.data?.detail ||
        '서버 오류가 발생했습니다.';
      return new Error(message);
    }
    if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      return new Error('서버에 연결할 수 없습니다.');
    }
    // 요청 설정 중 오류가 발생한 경우
    return new Error(error.message || '요청 중 오류가 발생했습니다.');
  }
}

// API 클라이언트 인스턴스 생성 및 내보내기
const apiClient = new ApiClient();
export default apiClient;
