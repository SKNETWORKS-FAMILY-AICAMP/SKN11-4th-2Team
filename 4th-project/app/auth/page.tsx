'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Zap, Lock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Suspense } from 'react';

function AuthPageContent() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  const mode = searchParams.get('mode') as 'signin' | 'signup' | null;

  useEffect(() => {
    // URL 파라미터에 따라 탭 설정
    if (mode === 'signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('signin');
    }
  }, [mode]);

  useEffect(() => {
    // 이미 로그인된 사용자는 메인 페이지로 리다이렉트
    if (status === 'authenticated' && session?.djangoAccessToken) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  useEffect(() => {
    // 에러 처리
    if (error) {
      let errorMessage = '인증 중 오류가 발생했습니다.';

      switch (error) {
        case 'OAuthCallback':
          errorMessage =
            '소셜 로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.';
          break;
        case 'OAuthSignin':
          errorMessage = '소셜 로그인 중 오류가 발생했습니다.';
          break;
        case 'AccessDenied':
          errorMessage = '접근이 거부되었습니다.';
          break;
        case 'RefreshAccessTokenError':
          errorMessage =
            '토큰 갱신 중 오류가 발생했습니다. 다시 로그인해주세요.';
          break;
      }

      toast.error(errorMessage);
    }
  }, [error]);

  const handleSocialAuth = async (provider: 'google' | 'naver') => {
    try {
      setIsLoading(provider);
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        const action = activeTab === 'signin' ? '로그인' : '회원가입';
        toast.error(`${action}에 실패했습니다. 다시 시도해주세요.`);
        console.error(`${action} 실패:`, result.error);
        return;
      }

      if (result?.ok) {
        const action = activeTab === 'signin' ? '로그인' : '회원가입';
        toast.success(`${action}이 완료되었습니다.`);
        router.push(callbackUrl);
      }
    } catch (error) {
      const action = activeTab === 'signin' ? '로그인' : '회원가입';
      toast.error(`${action} 중 오류가 발생했습니다.`);
      console.error(`${action} 중 오류 발생:`, error);
    } finally {
      setIsLoading(null);
    }
  };

  // 로딩 중이거나 이미 인증된 경우
  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const SocialButtons = () => (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full h-12"
        onClick={() => handleSocialAuth('google')}
        disabled={!!isLoading}
      >
        {isLoading === 'google' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className="mr-2"
          >
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Google로 {activeTab === 'signin' ? '로그인' : '회원가입'}
      </Button>

      <Button
        variant="outline"
        className="w-full h-12"
        onClick={() => handleSocialAuth('naver')}
        disabled={!!isLoading}
      >
        {isLoading === 'naver' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <div className="mr-2 h-5 w-5 bg-green-500 rounded-sm flex items-center justify-center">
            <span className="text-sm font-bold text-white">N</span>
          </div>
        )}
        네이버로 {activeTab === 'signin' ? '로그인' : '회원가입'}
      </Button>
    </div>
  );

  const FeaturesList = () => (
    <div className="grid gap-3">
      <div className="flex items-center space-x-2 text-sm">
        <Shield className="h-4 w-4 text-green-600" />
        <span className="text-muted-foreground">
          NextAuth.js로 안전한 OAuth
        </span>
      </div>
      <div className="flex items-center space-x-2 text-sm">
        <Zap className="h-4 w-4 text-blue-600" />
        <span className="text-muted-foreground">
          {activeTab === 'signin' ? '편리한 세션 관리' : '간편한 회원가입'}
        </span>
      </div>
      <div className="flex items-center space-x-2 text-sm">
        <Lock className="h-4 w-4 text-purple-600" />
        <span className="text-muted-foreground">JWT 토큰 기반 API 인증</span>
      </div>
    </div>
  );

  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="w-full max-w-md">
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              인증 중 오류가 발생했습니다. 다시 시도해주세요.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {activeTab === 'signin' ? '로그인' : '회원가입'}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'signin'
                ? '계정에 로그인하세요'
                : '새로운 계정을 만드세요'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'signin' | 'signup')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">로그인</TabsTrigger>
                <TabsTrigger value="signup">회원가입</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="space-y-4">
                <SocialButtons />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      또는
                    </span>
                  </div>
                </div>
                <FeaturesList />
              </TabsContent>
              <TabsContent value="signup" className="space-y-4">
                <SocialButtons />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      또는
                    </span>
                  </div>
                </div>
                <FeaturesList />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              {activeTab === 'signin' ? (
                <>
                  계정이 없으신가요?{' '}
                  <Link
                    href="/auth?mode=signup"
                    className="text-primary hover:underline"
                  >
                    회원가입
                  </Link>
                </>
              ) : (
                <>
                  이미 계정이 있으신가요?{' '}
                  <Link
                    href="/auth?mode=signin"
                    className="text-primary hover:underline"
                  >
                    로그인
                  </Link>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex h-screen items-center justify-center">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader>
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
              </CardFooter>
            </Card>
          </div>
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
