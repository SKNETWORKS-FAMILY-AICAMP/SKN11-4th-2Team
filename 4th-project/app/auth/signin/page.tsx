'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // NextAuth에서 오는 요청을 새로운 auth 페이지로 리다이렉트
    const callbackUrl = searchParams.get('callbackUrl');
    const error = searchParams.get('error');

    const params = new URLSearchParams();
    params.set('mode', 'signin');

    if (callbackUrl) {
      params.set('callbackUrl', callbackUrl);
    }

    if (error) {
      params.set('error', error);
    }

    router.replace(`/auth?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
