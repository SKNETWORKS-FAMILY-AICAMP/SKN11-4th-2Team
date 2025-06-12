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

export function ExpertAdvice() {
  const articles = [
    {
      id: 1,
      title: '영유아기 수면 습관 형성의 중요성',
      excerpt:
        '생후 6개월부터 3세까지는 수면 습관이 형성되는 중요한 시기입니다. 이 시기에 올바른 수면 습관을 길러주는 방법과 수면 환경 조성에 대해 알아봅니다.',
      expert: {
        name: '김수면 박사',
        title: '소아과 전문의',
        image: '/caring-doctor.png',
      },
      category: '수면',
      readTime: '5분',
      published: '2025.05.10',
    },
    {
      id: 2,
      title: '아이의 감정 조절 능력을 키우는 대화법',
      excerpt:
        '유아기 감정 조절 능력은 평생 동안 영향을 미치는 중요한 능력입니다. 부모가 일상에서 실천할 수 있는 감정 코칭 대화법을 소개합니다.',
      expert: {
        name: '이감정 교수',
        title: '아동심리학자',
        image: '/psychologist.png',
      },
      category: '심리',
      readTime: '7분',
      published: '2025.05.12',
    },
    {
      id: 3,
      title: '영유아 발달 단계별 적합한 놀이 활동',
      excerpt:
        '아이의 발달 단계에 맞는 놀이는 인지, 정서, 사회성 발달에 큰 영향을 미칩니다. 연령별로 적합한 놀이 활동과 그 효과에 대해 알아봅니다.',
      expert: {
        name: '박놀이 선생님',
        title: '아동발달 전문가',
        image: '/diverse-classroom-teacher.png',
      },
      category: '놀이',
      readTime: '6분',
      published: '2025.05.14',
    },
  ];

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={article.expert.image || '/placeholder.svg'}
                  alt={article.expert.name}
                />
                <AvatarFallback>
                  {article.expert.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{article.expert.name}</p>
                <p className="text-xs text-muted-foreground">
                  {article.expert.title}
                </p>
              </div>
            </div>
            <Badge variant="secondary">{article.category}</Badge>
          </CardHeader>
          <CardContent>
            <Link
              href={`/expert/advice/${article.id}`}
              className="hover:underline"
            >
              <h3 className="font-bold text-lg mb-2">{article.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {article.excerpt}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-4 text-xs text-muted-foreground">
              <span>읽는 시간 {article.readTime}</span>
              <span>발행일 {article.published}</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/expert/advice/${article.id}`}>자세히 보기</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/expert/advice">더 많은 전문가 조언 보기</Link>
        </Button>
      </div>
    </div>
  );
}
