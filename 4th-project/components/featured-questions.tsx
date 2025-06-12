import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export function FeaturedQuestions() {
  const questions = [
    {
      id: 1,
      title: '12개월 아기가 아직 걷지 못해요. 걱정해야 할까요?',
      content:
        '우리 아기가 12개월인데 아직 걷지 못하고 있어요. 기어다니는 것은 잘하는데 일어서려고 하지 않아요. 또래 아이들은 대부분 걷기 시작했다고 하는데 걱정해야 할까요?',
      author: {
        name: '걱정많은엄마',
        image: '/abstract-profile.png',
      },
      category: '발달',
      replies: 8,
      views: 124,
      created: '2일 전',
    },
    {
      id: 2,
      title: '이유식 거부하는 10개월 아기, 어떻게 해야 할까요?',
      content:
        '10개월 된 아기가 갑자기 이유식을 거부하기 시작했어요. 전에는 잘 먹었는데 이제는 입을 꼭 다물고 고개를 돌려버려요. 어떻게 하면 다시 이유식을 먹게 할 수 있을까요?',
      author: {
        name: '초보맘',
        image: '/abstract-profile.png',
      },
      category: '식이',
      replies: 12,
      views: 187,
      created: '1일 전',
    },
    {
      id: 3,
      title: '아이가 유치원에서 친구를 때려요. 어떻게 대화해야 할까요?',
      content:
        '4살 아이가 유치원에서 친구를 자주 때린다는 선생님의 연락을 받았어요. 집에서는 그런 모습을 보이지 않아서 당황스럽네요. 아이와 어떻게 대화해야 할까요?',
      author: {
        name: '고민하는아빠',
        image: '/abstract-profile.png',
      },
      category: '행동',
      replies: 15,
      views: 203,
      created: '3일 전',
    },
  ];

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={question.author.image || '/placeholder.svg'}
                  alt={question.author.name}
                />
                <AvatarFallback>
                  {question.author.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{question.author.name}</p>
                <p className="text-xs text-muted-foreground">
                  {question.created}
                </p>
              </div>
            </div>
            <Badge variant="outline">{question.category}</Badge>
          </CardHeader>
          <CardContent>
            <Link
              href={`/community/questions/${question.id}`}
              className="hover:underline"
            >
              <h3 className="font-bold text-lg mb-2">{question.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {question.content}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-4 text-xs text-muted-foreground">
              <span>조회 {question.views}</span>
              <span>답변 {question.replies}</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/community/questions/${question.id}`}>
                자세히 보기
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/community/questions">더 많은 질문 보기</Link>
        </Button>
      </div>
    </div>
  );
}
