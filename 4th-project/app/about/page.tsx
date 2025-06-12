import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-bold mb-4">마파덜 소개</h1>
          <p className="text-xl text-muted-foreground">
            초보 엄마 아빠의 육아 부담을 덜어주는 종합 육아 지원 플랫폼
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">마파덜의 의미</h2>
            <p className="text-lg mb-4">
              <span className="font-bold text-primary">마파덜</span>은{' '}
              <span className="font-bold">마</span>마와{' '}
              <span className="font-bold">파</span>파의 육아{' '}
              <span className="font-bold">부담을 덜</span>어준다는 의미를 담고
              있습니다.
            </p>
            <p className="mb-4">
              육아는 기쁨과 보람도 크지만, 특히 처음 부모가 된 분들에게는 많은
              불안과 고민, 그리고 부담이 따릅니다. 마파덜은 이러한 초보
              부모님들의 부담을 함께 나누고 덜어드리기 위해 탄생했습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">로고에 담긴 의미</h2>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 flex-shrink-0">
                <Logo showText={false} size="lg" />
              </div>
              <div>
                <p className="mb-2">
                  마파덜의 로고는 부모와 아이의 연결, 그리고 부담을 덜어주는
                  의미를 담고 있습니다.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <span className="font-medium">원형 심볼</span>: 부모와
                    아이를 상징하는 원은 가족의 따뜻한 연결을 의미합니다.
                  </li>
                  <li>
                    <span className="font-medium">날개 형태</span>: 아래의 곡선
                    형태는 부모의 부담을 덜어주는 날개를 상징합니다.
                  </li>
                  <li>
                    <span className="font-medium">파란색 계열</span>: 신뢰와
                    안정감을 주는 색상으로, 부모님들에게 든든한 지원군이
                    되겠다는 의지를 담았습니다.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">마파덜의 비전</h2>
            <p className="mb-4">
              마파덜은 모든 부모가 육아의 부담보다는 기쁨과 보람을 더 크게
              느끼며, 아이와 함께 건강하게 성장할 수 있는 환경을 만들고자
              합니다.
            </p>
            <p className="mb-4">
              검증된 정보와 경험 공유, 전문가의 조언, 그리고 따뜻한 커뮤니티를
              통해 부모님들이 서로 의지하고 함께 성장하는 플랫폼이 되겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">마파덜의 핵심 가치</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">신뢰성</h3>
                <p>
                  검증된 정보와 전문가의 조언으로 부모님들에게 신뢰할 수 있는
                  정보를 제공합니다.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">공동체</h3>
                <p>
                  부모님들이 서로의 경험을 나누고 지지하는 따뜻한 커뮤니티를
                  만들어갑니다.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">접근성</h3>
                <p>
                  누구나 쉽게 접근하고 이용할 수 있는 직관적이고 친근한 서비스를
                  제공합니다.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center mt-12">
            <p className="text-lg mb-6">
              마파덜과 함께 더 가벼운 육아를 경험해보세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
