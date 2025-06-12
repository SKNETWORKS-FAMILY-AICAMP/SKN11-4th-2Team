import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

/**
 * 인증 상태를 관리하는 훅
 */
export function useAuth() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // 로그인 상태 확인
  const isAuthenticated = status === 'authenticated';

  // 로그인 필요 페이지에서 사용
  const requireAuth = () => {
    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push('/login');
      }
    }, [status]);
  };

  // 로그인 상태에서 접근 불가 페이지에서 사용 (로그인, 회원가입 등)
  const redirectIfAuthenticated = (redirectTo: string = '/') => {
    useEffect(() => {
      if (status === 'authenticated') {
        router.push(redirectTo);
      }
    }, [status, redirectTo]);
  };

  // 로그아웃
  const logout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
    } finally {
      router.push('/login');
    }
  };

  // 현재 소셜 로그인 제공자 확인
  const getCurrentProvider = () => {
    return session?.user?.auth_provider || null;
  };

  // 토큰 유효성 검사
  const checkTokenValidity = async () => {
    return status === 'authenticated';
  };

  return {
    isAuthenticated,
    requireAuth,
    redirectIfAuthenticated,
    logout,
    getCurrentProvider,
    checkTokenValidity,
    session
  };
}

/**
 * 사용자 정보를 관리하는 훅
 */
export function useUser() {
  const { data: session } = useSession();
  
  return {
    user: session?.user || null,
    isLoading: !session,
    error: null,
    refetch: () => {},
  };
}
