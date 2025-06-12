// hooks/use-jwt-auth.ts
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AuthService, User, LoginCredentials } from '../lib/auth';
import { authApi } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useJWTAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useJWTAuth는 JWTAuthProvider 내에서 사용되어야 합니다.');
  }
  return context;
};

interface JWTAuthProviderProps {
  children: ReactNode;
}

export const JWTAuthProvider: React.FC<JWTAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && AuthService.isAuthenticated();

  // 인증 상태 확인
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const storedUser = AuthService.getUser();
      const accessToken = AuthService.getAccessToken();

      if (storedUser && accessToken) {
        // 토큰 만료 확인
        if (AuthService.isTokenExpired(accessToken)) {
          // 리프레시 토큰으로 갱신 시도
          const refreshed = await authApi.refreshToken();
          if (!refreshed) {
            throw new Error('토큰 갱신 실패');
          }
        }

        // 서버에서 사용자 정보 재검증
        try {
          const verifyResult = await authApi.verifyToken();
          if (verifyResult.valid) {
            setUser(verifyResult.user);
            AuthService.updateUser(verifyResult.user);
          } else {
            throw new Error('토큰 검증 실패');
          }
        } catch (error) {
          console.error('토큰 검증 실패:', error);
          AuthService.clearTokens();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('인증 확인 오류:', error);
      AuthService.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const authData = await authApi.login(credentials);
      setUser(authData.user);
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      AuthService.clearTokens();
      setUser(null);
    }
  };

  // 사용자 정보 업데이트
  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await authApi.updateProfile(userData);
      setUser(updatedUser);
      AuthService.updateUser(updatedUser);
    } catch (error) {
      console.error('사용자 정보 업데이트 오류:', error);
      throw error;
    }
  };

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, []);

  // 토큰 만료 체크 (5분마다)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const accessToken = AuthService.getAccessToken();
      if (accessToken && AuthService.isTokenExpired(accessToken)) {
        const refreshed = await authApi.refreshToken();
        if (!refreshed) {
          logout();
        }
      }
    }, 5 * 60 * 1000); // 5분

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 페이지 가드 훅
export const useAuthGuard = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useJWTAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};

// 인증된 사용자만 접근 가능한 컴포넌트 래퍼
interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = <div>로딩 중...</div>,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isLoading } = useAuthGuard(redirectTo);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

// 로그인된 사용자는 접근할 수 없는 페이지 가드
export const useGuestGuard = (redirectTo: string = '/') => {
  const { isAuthenticated, isLoading } = useJWTAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};
