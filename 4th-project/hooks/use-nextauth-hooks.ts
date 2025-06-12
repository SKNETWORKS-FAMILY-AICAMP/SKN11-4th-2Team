import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 인증이 필요한 페이지에서 사용하는 커스텀 훅
 */
export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  return { 
    isAuthenticated, 
    isLoading, 
    session,
    user: session?.user 
  };
}

/**
 * 이미 로그인된 사용자를 메인 페이지로 리다이렉트하는 훅 (로그인/회원가입 페이지용)
 */
export function useRedirectIfAuthenticated() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  return { 
    isAuthenticated, 
    isLoading, 
    session 
  };
}

/**
 * 로그인 상태 변화를 감지하는 훅
 */
export function useAuthState() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    hasUser: !!session?.user,
  };
}

/**
 * 현재 사용자 정보를 가져오는 훅
 */
export function useUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}
