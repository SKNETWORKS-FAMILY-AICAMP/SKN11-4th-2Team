'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return '서버 설정에 문제가 있습니다. 관리자에게 문의하세요.';
      case 'AccessDenied':
        return '접근이 거부되었습니다. 권한을 확인해주세요.';
      case 'Verification':
        return '이메일 인증에 실패했습니다.';
      case 'OAuthCallback':
        return 'OAuth 콜백 처리 중 오류가 발생했습니다. 다시 시도해주세요.';
      case 'OAuthSignin':
        return 'OAuth 로그인 중 오류가 발생했습니다.';
      case 'EmailSignin':
        return '이메일 로그인 중 오류가 발생했습니다.';
      case 'CredentialsSignin':
        return '로그인 정보가 올바르지 않습니다.';
      case 'SessionRequired':
        return '로그인이 필요한 페이지입니다.';
      case 'RefreshAccessTokenError':
        return '토큰 갱신 중 오류가 발생했습니다. 다시 로그인해주세요.';
      default:
        return '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.';
    }
  };

  const getErrorTitle = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return '서버 오류';
      case 'AccessDenied':
        return '접근 거부됨';
      case 'Verification':
        return '인증 실패';
      case 'OAuthCallback':
      case 'OAuthSignin':
        return '소셜 로그인 오류';
      case 'EmailSignin':
        return '이메일 로그인 오류';
      case 'CredentialsSignin':
        return '로그인 정보 오류';
      case 'SessionRequired':
        return '로그인 필요';
      case 'RefreshAccessTokenError':
        return '토큰 갱신 오류';
      default:
        return '로그인 오류';
    }
  };

  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-red-600">
              {getErrorTitle(error)}
            </CardTitle>
            <CardDescription>
              로그인 처리 중 문제가 발생했습니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>

            {error && (
              <div className="text-center">
                <span className="text-xs text-muted-foreground">
                  오류 코드: {error}
                </span>
              </div>
            )}

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth?mode=signin">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  다시 로그인
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  홈으로 가기
                </Link>
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
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense
      fallback={
        <div className="container flex h-screen items-center justify-center">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full animate-pulse">
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
