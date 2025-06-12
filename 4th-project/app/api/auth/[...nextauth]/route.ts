import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import NaverProvider from 'next-auth/providers/naver';
import { JWT } from 'next-auth/jwt';
import axios from 'axios';
import { NextRequest } from 'next/server';
import { Session } from 'next-auth';

// 클라이언트 사이드에서만 실행되도록 설정
export const dynamic = 'force-dynamic';

interface ExtendedToken extends JWT {
  djangoAccessToken?: string;
  djangoRefreshToken?: string;
  user?: any;
  exp?: number;
}

interface ExtendedSession extends Session {
  djangoAccessToken?: string;
  djangoRefreshToken?: string;
  access?: string; // API 클라이언트에서 사용
  refresh?: string; // API 클라이언트에서 사용
  error?: string;
}

const NextAuthProvider: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),

    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: { token: ExtendedToken; account: any; user: any }) {
      if (account && user) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/social/token/`,
            {
              provider: account.provider,
              access_token: account.access_token,
              id_token: account.id_token,
              code: account.code,
              user: {
                email: user.email,
                name: user.name,
                image: user.image,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 10000,
            },
          );

          if (response.data.success) {
            return {
              djangoAccessToken: response.data.data.access,
              djangoRefreshToken: response.data.data.refresh,
              user: response.data.data.user,
              exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
            };
          }
        } catch (error: any) {
          console.error(
            '소셜 로그인 토큰 처리 실패:',
            error.response?.data || error.message,
          );
          return { error: 'OAuthCallback' };
        }
      }

      if (
        token.djangoRefreshToken &&
        token.exp &&
        token.exp < Math.floor(Date.now() / 1000) + 300
      ) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/refresh/`,
            {
              refresh_token: token.djangoRefreshToken,
            },
            { timeout: 5000 },
          );

          if (response.data.success) {
            return {
              ...token,
              djangoAccessToken: response.data.data.access,
              exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
            };
          }
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
          return { error: 'RefreshAccessTokenError' };
        }
      }

      return token;
    },
    async session({ session, token }: { session: ExtendedSession; token: ExtendedToken }) {
      if (token.error) {
        session.error = token.error;
      }

      const updatedSession = {
        ...session,
        djangoAccessToken: token.djangoAccessToken,
        djangoRefreshToken: token.djangoRefreshToken,
        // API 클라이언트에서 사용하는 키 이름으로 추가
        access: token.djangoAccessToken,
        refresh: token.djangoRefreshToken,
        user: {
          ...session.user,
          ...token.user,
        },
        expires: token.exp
          ? new Date(token.exp * 1000).toISOString()
          : session.expires,
      };
      
      console.log('📝 NextAuth 세션 콜백:', {
        hasAccess: !!updatedSession.access,
        hasDjangoAccess: !!updatedSession.djangoAccessToken,
        userEmail: updatedSession.user?.email
      });
      
      return updatedSession;
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NEXT_PUBLIC_DOMAIN || undefined,
        maxAge: 30 * 24 * 60 * 60,
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NEXT_PUBLIC_DOMAIN || undefined,
        maxAge: 60 * 60,
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NEXT_PUBLIC_DOMAIN || undefined,
        maxAge: 60 * 60,
      },
    },
    state: {
      name: 'next-auth.state',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NEXT_PUBLIC_DOMAIN || undefined,
        maxAge: 60 * 60,
      },
    },
  },
};

export const authOptions = NextAuthProvider;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };