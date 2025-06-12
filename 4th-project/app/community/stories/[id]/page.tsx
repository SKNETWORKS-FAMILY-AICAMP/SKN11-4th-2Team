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

export default function StoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
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
  const story = {
    id: 1,
    title: '첫 걸음마의 감동, 그 순간을 기록합니다',
    content: `우리 아이가 드디어 첫 걸음마를 떼었어요. 그동안 기다림의 시간과 첫 걸음마의 감동적인 순간, 그리고 그 이후 아이의 변화에 대한 이야기를 나누고 싶어요.

아이가 태어나고 나서 매 순간이 새롭고 특별했지만, 첫 걸음마는 정말 잊을 수 없는 순간이었습니다. 11개월이 되던 날, 소파에 기대어 서 있던 아이가 갑자기 손을 놓고 세 걸음을 걸었어요. 그 순간 저와 남편은 너무 놀라고 기뻐서 환호성을 질렀고, 아이도 자신의 성취에 신이 났는지 웃음을 터뜨렸습니다.

첫 걸음마 이후 아이의 세계는 더욱 넓어졌어요. 이제는 걸어서 탐험할 수 있는 영역이 넓어졌고, 자신감도 부쩍 늘었습니다. 걷기 시작한 지 일주일 만에 집 안 곳곳을 누비고 다니며 새로운 것들을 발견하는 모습이 너무 사랑스럽습니다.

이 소중한 순간을 기록하기 위해 영상도 찍고, 일기도 썼어요. 나중에 아이가 크면 함께 보며 이야기하고 싶습니다. 모든 부모님들에게 이런 특별한 순간이 있으시겠지만, 우리 가족에게는 정말 잊지 못할 추억이 되었습니다.

여러분의 첫 걸음마 경험은 어땠나요? 그 순간을 어떻게 기념하셨는지 궁금합니다.`,
    author: {
      name: '행복한맘',
      image: '/abstract-profile.png',
      level: '열심 부모',
      posts: 24,
    },
    category: '성장일기',
    tags: ['첫걸음마', '성장기록', '감동순간'],
    comments: 12,
    views: 245,
    likes: 38,
    created: '2023년 5월 14일',
    isBookmarked: false,
    thumbnail: '/placeholder.svg?key=ed35d',
  };

  const comments = [
    {
      id: 1,
      content:
        "저희 아이도 11개월에 첫 걸음마를 뗐어요! 그 순간 너무 감동적이었죠. 저는 그날을 기념해서 작은 파티를 열어줬답니다. 케이크에 '첫 걸음마 축하해'라고 써서요. 소중한 추억 공유해주셔서 감사해요!",
      author: {
        name: '케이크맘',
        image: '/abstract-profile.png',
        level: '열심 부모',
      },
      created: '2023년 5월 14일',
      likes: 5,
    },
    {
      id: 2,
      content:
        '우리 아이는 13개월에 걷기 시작했는데, 처음에는 걱정했었어요. 하지만 아이마다 발달 속도가 다르다는 걸 깨달았죠. 첫 걸음마 영상은 정말 보물 같은 존재예요. 자주 꺼내보게 되더라고요. 행복한 육아 되세요!',
      author: {
        name: '느림보맘',
        image: '/abstract-profile.png',
        level: '슈퍼 부모',
      },
      created: '2023년 5월 15일',
      likes: 8,
    },
    {
      id: 3,
      content:
        '첫 걸음마의 감동은 정말 말로 표현할 수 없죠! 저는 아이의 첫 걸음마 발자국을 석고로 떠서 기념했어요. 지금도 거실에 전시해두고 있답니다. 소중한 순간을 기록하는 것은 정말 중요한 것 같아요.',
      author: {
        name: '기록맘',
        image: '/abstract-profile.png',
        level: '열심 부모',
      },
      created: '2023년 5월 16일',
      likes: 12,
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
          <Link href="/community/stories" className="hover:text-primary">
            육아 이야기
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
          <span>이야기 상세</span>
        </div>

        <div className="flex justify-between items-start gap-4 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold">{story.title}</h1>
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
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
              북마크
            </Button>
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
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={story.thumbnail || '/placeholder.svg'}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={story.author.image || '/placeholder.svg'}
                alt={story.author.name}
              />
              <AvatarFallback>{story.author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{story.author.name}</p>
                <Badge variant="outline" className="text-xs">
                  {story.author.level}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                작성일: {story.created}
              </p>
            </div>
          </div>
          <Badge>{story.category}</Badge>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {story.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {story.tags.map((tag, index) => (
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
              조회 {story.views}
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
              댓글 {story.comments}
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
              추천 {story.likes}
            </span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/community/stories/new">글쓰기</Link>
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
          <Link href="/community/stories">목록으로</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">수정</Button>
          <Button variant="destructive">삭제</Button>
        </div>
      </div>
    </div>
  );
}
