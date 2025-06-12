import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 인증이 필요하지 않은 경로 목록
const publicPaths = [
  '/',
  '/auth',
  '/auth/signin',
  '/auth/signup', 
  '/auth/error',
  '/auth/callback',
  '/login',
  '/signup',
  '/api/auth',
  '/about',
  '/privacy',
  '/terms',
  '/resources',
  '/brand',
  '/community',
  '/expert',
  '/_next',
  '/favicon.ico',
];

// 인증이 필요한 경로 목록 (더 구체적으로 관리)
const protectedPaths = [
  '/development',
  '/profile',
  '/settings',
  '/community/questions/new',
  '/community/stories/new',
  '/community/tips/new',
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // 정적 파일이나 API 라우트는 건너뛰기
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 공개 경로는 접근 허용
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 보호된 경로에 대해서만 인증 확인
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // 보호된 경로이고 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (isProtectedPath && !token) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('mode', 'signin');
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
