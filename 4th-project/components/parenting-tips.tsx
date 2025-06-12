import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ParentingTips() {
  const tips = [
    {
      id: 1,
      title: '아이와의 효과적인 대화법',
      category: '의사소통',
    },
    {
      id: 2,
      title: '영유아 수면 문제 해결하기',
      category: '수면',
    },
    {
      id: 3,
      title: '편식하는 아이 식습관 개선하기',
      category: '식이',
    },
    {
      id: 4,
      title: '형제간 다툼 중재하는 방법',
      category: '관계',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>오늘의 육아 팁</CardTitle>
        <CardDescription>일상 육아에 도움이 되는 유용한 정보</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tips.map((tip) => (
            <li key={tip.id}>
              <Link
                href={`/resources/tips/${tip.id}`}
                className="flex justify-between items-center hover:bg-accent p-2 rounded-md transition-colors"
              >
                <span className="font-medium">{tip.title}</span>
                <span className="text-xs text-muted-foreground">
                  {tip.category}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/resources/tips">더 많은 팁 보기</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
