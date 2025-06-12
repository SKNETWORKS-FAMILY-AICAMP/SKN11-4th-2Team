import type React from 'react';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';
import Header from '@/components/header';
import ConditionalFooter from '@/components/conditional-footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
});

export const metadata: Metadata = {
  title: '마파덜 - 초보 엄마 아빠의 육아 부담을 덜어주는 플랫폼',
  description:
    '초보 부모님들의 육아 부담을 덜어주고 함께 성장하는 신뢰할 수 있는 육아 정보 공유 플랫폼',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansKr.variable} font-sans`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <ConditionalFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
