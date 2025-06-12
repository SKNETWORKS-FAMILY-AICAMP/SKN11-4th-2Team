import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { FeaturedQuestions } from '@/components/featured-questions';
import { ExpertAdvice } from '@/components/expert-advice';
import { DevelopmentTracker } from '@/components/development-tracker';
import { ParentingTips } from '@/components/parenting-tips';
import { HeroSection } from '@/components/hero-section';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />

      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6 text-center">
          마파덜과 함께 가벼워지는 육아
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
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
                  className="text-blue-600"
                >
                  <path d="M17 18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7h10v11Z" />
                  <path d="M11 13v6" />
                  <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">커뮤니티 답변</h3>
              <p className="text-muted-foreground">
                다른 부모님들과 경험과 지식을 나누세요
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
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
                  className="text-green-600"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">전문가 조언</h3>
              <p className="text-muted-foreground">
                검증된 전문가의 육아 정보와 조언을 받으세요
              </p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
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
                  className="text-purple-600"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">발달 모니터링</h3>
              <p className="text-muted-foreground">
                아이의 발달 이정표를 추적하고 관리하세요
              </p>
            </CardContent>
          </Card> */}

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
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
                  className="text-yellow-600"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">일상 육아 지원</h3>
              <p className="text-muted-foreground">
                수면, 식단, 일상 루틴 관리를 도와드립니다
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="my-12 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          마파덜과 함께 육아의 부담을 덜어보세요
        </h2>
        <p className="mb-6 max-w-2xl mx-auto">
          초보 엄마 아빠들의 경험과 전문가의 조언이 모인 마파덜에서 더 쉽고
          즐거운 육아를 경험하세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/signup">회원가입하기</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/community">커뮤니티 둘러보기</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
