import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import apiClient from '@/services/api-client';
import { AuthService } from '@/lib/auth'; // JWT 토큰 관리
import { SocialConnectionsResponse, SocialDisconnectResponse } from '@/types/auth';

/**
 * Django Allauth + NextAuth.js 통합 인증 훅
 */
export function useIntegratedAuth() {
  const { data: session, status } = useSession();
  const [djangoUser, setDjangoUser] = useState<any>(null);
  const [isLoadingDjango, setIsLoadingDjango] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading' || isLoadingDjango;
  const djangoAccessToken = session?.djangoAccessToken;

  // Django 사용자 프로필 조회
  useEffect(() => {
    if (isAuthenticated) {
      // NextAuth 세션에서 Django JWT 토큰을 세션 스토리지에 저장
      if (session?.access && session?.refresh && session?.user) {
        const authTokens = {
          access: session.access,
          refresh: session.refresh,
          user: session.user
        };
        AuthService.setTokens(authTokens);
        setDjangoUser(session.user);
      } else if (!djangoUser) {
        loadDjangoUserProfile();
      }
    }
  }, [isAuthenticated, session, djangoUser]);

  const loadDjangoUserProfile = async () => {
    // 세션 스토리지에서 JWT 토큰 가져오기
    const storedToken = AuthService.getAccessToken();
    const accessToken = djangoAccessToken || storedToken;
    
    if (!accessToken) return;
    
    try {
      setIsLoadingDjango(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        const userProfile = result.data || result; // API 응답 구조에 따라 조정
        setDjangoUser(userProfile);
        
        // 세션 스토리지의 사용자 정보도 업데이트
        AuthService.updateUser(userProfile);
      } else {
        throw new Error('Failed to fetch Django user profile');
      }
      
    } catch (error) {
      console.error('Failed to load Django user profile:', error);
      setError('사용자 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingDjango(false);
    }
  };

  const refreshDjangoData = async () => {
    const storedToken = AuthService.getAccessToken();
    const accessToken = djangoAccessToken || storedToken;
    
    if (accessToken) {
      await loadDjangoUserProfile();
    }
  };

  // 연결된 소셜 계정 목록
  const connectedProviders = session?.user?.auth_provider ? [session.user.auth_provider] : [];

  // 여러 소셜 계정 연결 여부
  const hasMultipleSocialAccounts = connectedProviders.length > 1;

  return {
    // NextAuth.js 상태
    session,
    nextAuthUser: session?.user,
    isAuthenticated,
    isLoading,
    
    // Django 상태
    djangoUser,
    djangoAccessToken,
    
    // 통합 사용자 정보
    user: {
      ...session?.user,
      ...djangoUser,
      // NextAuth 정보 우선, Django 정보로 보완
      name: session?.user?.name || djangoUser?.name,
      email: session?.user?.email || djangoUser?.email,
      image: session?.user?.image || djangoUser?.profile_image,
    },
    
    // 유틸리티
    error,
    refreshDjangoData,
    connectedProviders,
    hasMultipleSocialAccounts,
    authProvider: session?.authProvider,
    isNewUser: session?.isNewUser,
  };
}

/**
 * Django API 호출을 위한 인증 토큰 제공
 */
export function useDjangoAuth() {
  const { djangoAccessToken, isAuthenticated } = useIntegratedAuth();
  const storedToken = AuthService.getAccessToken();
  const accessToken = djangoAccessToken || storedToken;
  
  return {
    djangoAccessToken: accessToken,
    isAuthenticated: isAuthenticated && !!accessToken,
    getAuthHeaders: () => ({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }),
  };
}

/**
 * 간단한 인증 상태만 필요한 경우
 */
export function useAuthState() {
  const { user, isAuthenticated, isLoading } = useIntegratedAuth();

  return {
    user,
    isAuthenticated,
    isLoading,
    hasUser: !!user,
  };
}

export function useSocialConnections() {
  const { data: session } = useSession();
  const [connections, setConnections] = useState<{
    google: boolean;
    kakao: boolean;
    naver: boolean;
  }>({
    google: false,
    kakao: false,
    naver: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!session?.djangoAccessToken) return;

      try {
        setIsLoading(true);
        const response = await apiClient.get<SocialConnectionsResponse>('/auth/social/connections/');
        if (response.success) {
          setConnections(response.data);
        }
      } catch (err) {
        setError('소셜 계정 연결 정보를 불러오는데 실패했습니다.');
        console.error('소셜 계정 연결 정보 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, [session]);

  const disconnect = async (provider: 'google' | 'kakao' | 'naver') => {
    try {
      const response = await apiClient.post<SocialDisconnectResponse>(`/auth/social/disconnect/${provider}/`);
      if (response.success) {
        setConnections(prev => ({
          ...prev,
          [provider]: false
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error(`${provider} 계정 연결 해제 실패:`, err);
      return false;
    }
  };

  return {
    connections,
    isLoading,
    error,
    disconnect
  };
}
