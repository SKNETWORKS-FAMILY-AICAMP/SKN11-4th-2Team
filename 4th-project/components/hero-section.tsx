import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative py-12 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20" />
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="block text-primary">초보 엄마 아빠의</span>
          <span className="block">육아 부담을 덜어드려요</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          마파덜은 '초보 엄마 아빠의 부담을 덜어준다'는 의미로, 부모님들이
          서로의 경험을 나누고 전문가의 조언을 받으며 함께 성장하는 든든한 육아
          동반자입니다.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/auth?mode=signin">시작하기</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/about">더 알아보기</Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
