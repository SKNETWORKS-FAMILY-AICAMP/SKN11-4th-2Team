'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // 메인 페이지('/')에서만 Footer를 표시
  if (pathname === '/') {
    return <Footer />;
  }
  
  return null;
}
