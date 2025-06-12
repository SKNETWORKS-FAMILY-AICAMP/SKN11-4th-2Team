'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';
import CommunityService from '@/services/community-service';
import { PostDetail } from '@/types/community';

export default function TipDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      try {
        const response = await CommunityService.getPost(params.id);
        if (response.success) {
          setPost(response.data);
          setIsLiked(response.data.is_liked ?? false);
        } else {
          toast({
            title: '게시물을 찾을 수 없습니다',
            description: '존재하지 않거나 삭제된 게시물입니다.',
            variant: 'destructive',
          });
          router.push('/community');
        }
      } catch (error) {
        console.error('게시물 로드 실패:', error);
        toast({
          title: '게시물 로드 실패',
          description: '게시물을 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
        router.push('/community');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [params.id, router]);

  // 실제로는 params.id를 사용하여 API에서 데이터를 가져올 것
  const tip = {
    id: 1,
    title: '아이와의 효과적인 대화법 5가지',
    content: `아이와 효과적으로 대화하는 방법을 알려드립니다. 부모와 아이 사이의 소통은 신뢰 관계 형성과 아이의 정서 발달에 매우 중요합니다. 다음 5가지 방법을 실천해보세요.

## 1. 아이의 눈높이에 맞추기

아이와 대화할 때는 물리적으로 아이의 눈높이에 맞춰주세요. 무릎을 꿇거나 앉아서 아이와 같은 높이에서 대화하면 아이는 자신이 존중받고 있다고 느낍니다. 이는 대화의 시작부터 아이의 마음을 열게 하는 중요한 요소입니다.

## 2. 적극적으로 경청하기

아이가 말할 때 스마트폰을 보거나 다른 일을 하지 말고, 아이의 이야기에 온전히 집중해주세요. 눈을 마주치고, 고개를 끄덕이며, "그랬구나", "그래서 어떻게 됐어?" 등의 반응을 보여주면 아이는 자신의 이야기가 중요하게 받아들여진다고 느낍니다.

## 3. 아이의 감정 인정하기

아이가 화가 났거나 슬플 때 "괜찮아, 별거 아니야"라고 말하기보다는 "그런 일이 있어서 화가 났구나", "그래서 슬펐겠다"라고 아이의 감정을 인정해주세요. 감정을 부정하지 않고 인정받을 때 아이는 자신의 감정을 건강하게 표현하는 법을 배웁니다.

## 4. 열린 질문하기

"학교 어땠어?"라고 물으면 대부분 "좋았어"라는 짧은 대답을 듣게 됩니다. 대신 "오늘 점심시간에 누구랑 놀았어?", "가장 재미있었던 수업은 뭐였어?"와 같이 구체적이고 열린 질문을 하면 아이가 더 많은 이야기를 할 수 있습니다.

## 5. 긍정적인 언어 사용하기

"뛰지 마"보다는 "걸어다니자", "소리 지르지 마"보다는 "조용히 말해줄래?"와 같이 긍정적인 언어로 표현하세요. 부정적인 명령보다 긍정적인 지시가 아이의 협조를 이끌어내는 데 더 효과적입니다.

이 다섯 가지 방법을 일상에서 꾸준히 실천하면, 아이와의 대화가 더 풍부해지고 관계도 더욱 깊어질 것입니다. 완벽할 필요는 없습니다. 때로는 실수할 수도 있지만, 중요한 것은 아이와 진정성 있게 소통하려는 노력입니다.`,
    author: {
      name: '소통맘',
      image: '/abstract-profile.png',
      level: '열심 부모',
      posts: 24,
    },
    category: '의사소통',
    tags: ['대화법', '감정코칭', '경청'],
    comments: 15,
    views: 320,
    likes: 42,
    created: '2023년 5월 14일',
    isBookmarked: false,
  };

  const comments = [
    {
      id: 1,
      content:
        '정말 유용한 팁 감사합니다! 특히 아이의 눈높이에 맞추는 것이 생각보다 효과가 좋더라고요. 저도 실천하고 있는데, 아이가 더 편안하게 대화하는 것 같아요.',
      author: {
        name: '배움맘',
        image: '/abstract-profile.png',
        level: '열심 부모',
      },
      created: '2023년 5월 14일',
      likes: 8,
    },
    {
      id: 2,
      content:
        "열린 질문하기가 정말 중요한 것 같아요. '학교 어땠어?'라고 물으면 항상 '그냥'이라는 대답만 듣다가, 구체적인 질문으로 바꾸니 아이가 학교에서 있었던 일을 더 많이 이야기해주네요!",
      author: {
        name: '소통중인맘',
        image: '/abstract-profile.png',
        level: '슈퍼 부모',
      },
      created: '2023년 5월 15일',
      likes: 12,
    },
    {
      id: 3,
      content:
        "아이의 감정을 인정해주는 부분이 가장 어려운 것 같아요. 습관적으로 '괜찮아'라고 말하게 되는데, 이제는 아이의 감정을 먼저 인정해주려고 노력하고 있습니다. 좋은 글 감사합니다!",
      author: {
        name: '노력하는아빠',
        image: '/abstract-profile.png',
        level: '열심 부모',
      },
      created: '2023년 5월 16일',
      likes: 10,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/community" className="hover:text-primary">
            커뮤니티
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span>팁 상세</span>
        </div>

        <div className="flex justify-between items-start gap-4 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold">{tip.title}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M7 10v12" />
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
              </svg>
              추천
            </Button>
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={tip.author.image || '/placeholder.svg'}
                alt={tip.author.name}
              />
              <AvatarFallback>{tip.author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{tip.author.name}</p>
                <Badge variant="outline" className="text-xs">
                  {tip.author.level}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                작성일: {tip.created}
              </p>
            </div>
          </div>
          <Badge>{tip.category}</Badge>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {tip.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-xl font-bold mt-6 mb-3">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              return <p key={index}>{paragraph}</p>;
            })}
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {tip.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
          <div className="flex space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              조회 {tip.views}
            </span>
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              댓글 {tip.comments}
            </span>
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 10v12" />
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
              </svg>
              추천 {tip.likes}
            </span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/community/tips/new">팁 작성하기</Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">댓글 {comments.length}개</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={comment.author.image || '/placeholder.svg'}
                      alt={comment.author.name}
                    />
                    <AvatarFallback>
                      {comment.author.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {comment.author.name}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {comment.author.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      작성일: {comment.created}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{comment.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                  추천 {comment.likes}
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    신고
                  </Button>
                  <Button variant="ghost" size="sm">
                    답글
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">댓글 작성하기</h2>
        <Card>
          <CardContent className="pt-6">
            <Textarea placeholder="댓글을 작성해주세요." rows={3} />
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-3">
            <p className="text-xs text-muted-foreground">
              댓글 작성 시{' '}
              <Link href="/terms" className="text-primary hover:underline">
                커뮤니티 이용규칙
              </Link>
              을 지켜주세요.
            </p>
            <Button>댓글 등록</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/community/tips">목록으로</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">수정</Button>
          <Button variant="destructive">삭제</Button>
        </div>
      </div>
    </div>
  );
}
