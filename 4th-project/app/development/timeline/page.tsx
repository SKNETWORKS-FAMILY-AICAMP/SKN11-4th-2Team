import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DevelopmentTimelinePage() {
  const timelineEvents = [
    {
      date: '2023년 12월 15일',
      title: '첫 걸음마',
      description:
        '오늘 아이가 처음으로 혼자서 3걸음을 걸었어요! 소파에서 일어나 테이블까지 걸어갔습니다.',
      area: 'physical',
      ageGroup: '12-18개월',
    },
    {
      date: '2023년 12월 5일',
      title: "첫 단어 '엄마'",
      description:
        "오늘 아이가 처음으로 '엄마'라고 명확하게 말했어요. 의미를 알고 부르는 것 같았습니다.",
      area: 'language',
      ageGroup: '10-14개월',
    },
    {
      date: '2023년 11월 20일',
      title: '물건 숨기기 놀이',
      description:
        '장난감을 천 아래 숨겼을 때 찾아내기 시작했어요. 사물의 영속성 개념이 발달하고 있는 것 같습니다.',
      area: 'cognitive',
      ageGroup: '8-12개월',
    },
    {
      date: '2023년 11월 10일',
      title: '낯가림 시작',
      description:
        '낯선 사람에게 불안감을 보이기 시작했어요. 엄마나 아빠가 안아줄 때만 안정감을 느끼는 것 같습니다.',
      area: 'social',
      ageGroup: '6-8개월',
    },
    {
      date: '2023년 10월 25일',
      title: '혼자 앉기 시작',
      description:
        '오늘부터 아이가 지지 없이 혼자 앉을 수 있게 되었어요. 약 30초 정도 균형을 유지할 수 있습니다.',
      area: 'physical',
      ageGroup: '6-8개월',
    },
    {
      date: '2023년 10월 5일',
      title: '다양한 옹알이',
      description:
        "다양한 소리를 내며 옹알이를 하기 시작했어요. '바바', '마마' 같은 소리를 반복합니다.",
      area: 'language',
      ageGroup: '4-6개월',
    },
  ];

  const getAreaName = (area: string) => {
    switch (area) {
      case 'physical':
        return '신체 발달';
      case 'cognitive':
        return '인지 발달';
      case 'language':
        return '언어 발달';
      case 'social':
        return '사회성 발달';
      default:
        return area;
    }
  };

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'physical':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'cognitive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'language':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'social':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/development" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>발달 모니터링</span>
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">발달 타임라인</h1>
        <p className="text-muted-foreground">
          아이의 발달 과정을 시간 순서대로 확인할 수 있습니다.
        </p>
      </div>

      <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 pl-8 space-y-10 py-4">
        {timelineEvents.map((event, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-11 mt-1.5 h-6 w-6 rounded-full border-4 border-white dark:border-gray-900 bg-primary"></div>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      {event.date} · {event.ageGroup}
                    </CardDescription>
                  </div>
                  <Badge className={cn('ml-2', getAreaColor(event.area))}>
                    {getAreaName(event.area)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>{event.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">
          새로운 발달 사항을 기록하고 타임라인에 추가하세요.
        </p>
        <Button asChild>
          <Link href="/development/record">발달 기록하기</Link>
        </Button>
      </div>
    </div>
  );
}
