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
import { Progress } from '@/components/ui/progress';

export function DevelopmentTracker() {
  const milestones = [
    { name: '신체 발달', progress: 75 },
    { name: '인지 발달', progress: 80 },
    { name: '언어 발달', progress: 65 },
    { name: '사회성 발달', progress: 70 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>발달 모니터링</CardTitle>
        <CardDescription>
          아이의 발달 상황을 기록하고 추적하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{milestone.name}</span>
              <span className="text-muted-foreground">
                {milestone.progress}%
              </span>
            </div>
            <Progress value={milestone.progress} />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full" asChild>
          <Link href="/development/record">발달 기록하기</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/development/tracker">발달 추적 보기</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
