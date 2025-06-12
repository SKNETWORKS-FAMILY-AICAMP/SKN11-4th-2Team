'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(true);
  const [callbackStatus, setCallbackStatus] = useState<
    'processing' | 'success' | 'error'
  >('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // NextAuth의 세션 상태 확인
        if (status === 'loading') {
          return; // 아직 로딩 중
        }

        if (status === 'authenticated' && session?.djangoAccessToken) {
          // 성공적으로 로그인됨
          setCallbackStatus('success');
          toast.success(`${session.user?.name || '사용자'}님, 환영합니다!`);

          // 2초 후 메인 페이지로 이동
          setTimeout(() => {
            const callbackUrl = searchParams.get('callbackUrl') || '/';
            router.push(callbackUrl);
          }, 2000);
          return;
        }

        // NextAuth 에러 처리
        const error = searchParams.get('error');
        if (error) {
          console.error('NextAuth 에러:', error);
          setCallbackStatus('error');
          setErrorMessage(getErrorMessage(error));
          toast.error('로그인 처리 중 오류가 발생했습니다.');
          return;
        }

        // 세션이 없는 경우 로그인 페이지로 이동
        if (status === 'unauthenticated') {
          setCallbackStatus('error');
          setErrorMessage('인증에 실패했습니다.');
          setTimeout(() => {
            router.push('/auth?mode=signin');
          }, 3000);
          return;
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setCallbackStatus('error');
        setErrorMessage('로그인 처리 중 예상치 못한 오류가 발생했습니다.');
        toast.error('로그인 처리 중 오류가 발생했습니다.');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [status, session, searchParams, router]);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthCallback':
        return 'OAuth 콜백 처리 중 오류가 발생했습니다.';
      case 'OAuthSignin':
        return '소셜 로그인 중 오류가 발생했습니다.';
      case 'AccessDenied':
        return '접근이 거부되었습니다.';
      case 'RefreshAccessTokenError':
        return '토큰 갱신 중 오류가 발생했습니다.';
      default:
        return '알 수 없는 오류가 발생했습니다.';
    }
  };

  const renderContent = () => {
    switch (callbackStatus) {
      case 'processing':
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-xl font-bold">
                로그인 처리 중
              </CardTitle>
              <CardDescription>
                계정 정보를 확인하고 있습니다.
                <br />
                잠시만 기다려주세요.
              </CardDescription>
            </CardHeader>
          </Card>
        );

      case 'success':
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-green-600">
                로그인 성공!
              </CardTitle>
              <CardDescription>
                {session?.user?.name}님, 환영합니다!
                <br />
                메인 페이지로 이동 중입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-green-600 h-2 rounded-full animate-pulse"
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  자동으로 이동되지 않으면{' '}
                  <Link href="/" className="text-primary underline">
                    여기를 클릭
                  </Link>
                  하세요.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 'error':
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-red-600">
                로그인 실패
              </CardTitle>
              <CardDescription>{errorMessage}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth?mode=signin">다시 로그인</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">홈으로 가기</Link>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  문제가 지속되면{' '}
                  <Link
                    href="/contact"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    고객센터
                  </Link>
                  로 문의해주세요.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container flex h-screen items-center justify-center">
      {renderContent()}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex h-screen items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-xl font-bold">로딩 중...</CardTitle>
              <CardDescription>
                페이지를 불러오는 중입니다.
                <br />
                잠시만 기다려주세요.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
