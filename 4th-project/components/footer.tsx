import Link from 'next/link';
import { Logo } from './logo';
export default function Footer() {
  return (
    <footer className="py-16 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4">
        {/* 상단 섹션 - Flexbox 사용 */}
        <div className="flex flex-wrap justify-around mb-12">
          {/* 첫 번째 열 - 서비스 */}
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-6">
              서비스
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/community"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link
                  href="/expert"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  전문가 조언
                </Link>
              </li>
              <li>
                <Link
                  href="/development"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  발달 모니터링
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  육아 자료실
                </Link>
              </li>
            </ul>
          </div>

          {/* 두 번째 열 - 지원 */}
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-6">
              지원
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  마파덜 소개
                </Link>
              </li>
            </ul>
          </div>

          {/* 세 번째 열 - 설명 */}
          <div className="w-full md:w-1/3 lg:w-1/3">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Logo />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                '초보 엄마 아빠의 부담을 덜어준다'는 의미의 마파덜은
                부모님들에게 신뢰할 수 있는 육아 정보와 상호 지원 환경을
                제공하는 플랫폼입니다.
              </p>
            </div>
          </div>
        </div>

        {/* 하단 섹션 - Flexbox 사용 */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* 법적 정보 링크 */}
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Link
                href="/privacy"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm"
              >
                개인정보처리방침
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link
                href="/terms"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm"
              >
                이용약관
              </Link>
            </div>

            {/* 저작권 */}
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} 마파덜. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
