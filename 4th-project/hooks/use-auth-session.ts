'use client';

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef } from 'react';

export function useAuthSession() {
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: false,
    refetchInterval: false, // 자동 갱신 비활성화
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 갱신 비활성화
  });

  const lastUpdateTime = useRef<number>(Date.now());
  const updateSession = useCallback(async () => {
    const now = Date.now();
    // 마지막 업데이트로부터 1분이 지났을 때만 세션 갱신
    if (now - lastUpdateTime.current > 60 * 1000) {
      await update();
      lastUpdateTime.current = now;
    }
  }, [update]);

  // 컴포넌트 마운트 시 한 번만 세션 확인
  useEffect(() => {
    if (status === 'unauthenticated') {
      updateSession();
    }
  }, [status, updateSession]);

  return {
    session,
    status,
    update: updateSession,
  };
}
