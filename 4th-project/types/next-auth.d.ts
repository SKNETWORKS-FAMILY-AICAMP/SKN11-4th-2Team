import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Child } from './user';

declare module 'next-auth' {
  interface Session {
    djangoAccessToken?: string;
    djangoRefreshToken?: string;
    error?: string; // 에러 정보 추가
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      auth_provider?: string;
      is_new_user?: boolean;
      children?: Child[];
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    auth_provider?: string;
    is_new_user?: boolean;
    children?: Child[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    djangoAccessToken?: string;
    djangoRefreshToken?: string;
    error?: string; // 에러 정보 추가
    name?: string | null;
    email?: string | null;
    image?: string | null;
    auth_provider?: string;
    is_new_user?: boolean;
  }
}

declare module 'next-auth/providers' {
  interface Account {
    djangoAccessToken?: string;
    djangoRefreshToken?: string;
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      auth_provider?: string;
      is_new_user?: boolean;
    };
  }
}
