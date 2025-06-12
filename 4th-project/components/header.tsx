'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useIntegratedAuth } from '@/hooks/use-integrated-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ModeToggle } from './mode-toggle';
import { Logo } from './logo';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Header() {
  const { data: session, status } = useSession();
  const {
    user,
    djangoAccessToken,
    isLoading: integratedLoading,
  } = useIntegratedAuth();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading' || integratedLoading;

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      toast.success('성공적으로 로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  // 사용자 이름의 첫 글자 추출 (아바타 대체 텍스트)
  const getUserInitial = (name: string): string => {
    return name?.charAt(0)?.toUpperCase() || 'U';
  };

  // 소셜 로그인 제공자 배지 색상 가져기기
  const getProviderBadgeColor = (provider: string): string => {
    const colors = {
      google: 'bg-blue-100 text-blue-800 border-blue-200',
      naver: 'bg-green-100 text-green-800 border-green-200',
      kakao: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      django: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return (
      (colors as any)[provider] || 'bg-gray-100 text-gray-800 border-gray-200'
    );
  };

  // 소셜 로그인 제공자 이름 가져오기
  const getProviderName = (provider: string): string => {
    const names = {
      google: 'Google',
      naver: 'Naver',
      kakao: 'Kakao',
      django: 'Django',
    };
    return (names as any)[provider] || provider;
  };

  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/community" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      커뮤니티
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/expert" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      AI전문가 상담
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {/* {isAuthenticated && (
                  <NavigationMenuItem>
                    <Link href="/development" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        발달 모니터링
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )} */}
                <NavigationMenuItem>
                  <Link href="/resources" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      육아 자료실
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* 로그인 상태에 따른 UI 분기 */}
          {isLoading ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          ) : isAuthenticated && user ? (
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image || ''}
                        alt={user.name || ''}
                      />
                      <AvatarFallback>
                        {getUserInitial(user.name || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {user?.auth_provider && (
                        <div className="flex items-center space-x-1 mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getProviderBadgeColor(user.auth_provider)}`}
                          >
                            {getProviderName(user.auth_provider)} 계정
                          </span>
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>프로필</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth?mode=signin">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/auth?mode=signup">회원가입</Link>
              </Button>
            </div>
          )}

          <ModeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                <Link href="/community">커뮤니티</Link>
                <Link href="/expert">AI전문가 상담</Link>
                {/* {isAuthenticated && (
                  <Link href="/development">발달 모니터링</Link>
                )} */}
                <Link href="/resources">육아 자료실</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
