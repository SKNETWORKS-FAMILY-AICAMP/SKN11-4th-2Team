'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { toast } from 'sonner';
import CommunityService from '@/services/community-service';
import type {
  Post,
  Category,
  CommunityStats,
  PostType,
} from '@/types/community';
import {
  MessageCircle,
  Eye,
  ThumbsUp,
  Users,
  PenTool,
  HelpCircle,
  BookOpen,
  Lightbulb,
} from 'lucide-react';

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Record<PostType, Post[]>>({
    question: [],
    story: [],
    tip: [],
  });
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PostType>('question');

  // 데이터 로드
  useEffect(() => {
    const loadCommunityData = async () => {
      setIsLoading(true);

      try {
        // 병렬로 데이터 로드
        const [categoriesRes, questionPostsRes, storyPostsRes, tipPostsRes] =
          await Promise.all([
            CommunityService.getCategories(),
            CommunityService.getPosts({ postType: 'question', limit: 5 }),
            CommunityService.getPosts({ postType: 'story', limit: 5 }),
            CommunityService.getPosts({ postType: 'tip', limit: 5 }),
          ]);

        if (categoriesRes.success) {
          setCategories(categoriesRes.data);
        }

        // 게시물 데이터 설정
        if (questionPostsRes.success) {
          setPosts((prev) => ({
            ...prev,
            question: questionPostsRes.data || [],
          }));
        }
        if (storyPostsRes.success) {
          setPosts((prev) => ({
            ...prev,
            story: storyPostsRes.data || [],
          }));
        }
        if (tipPostsRes.success) {
          setPosts((prev) => ({
            ...prev,
            tip: tipPostsRes.data || [],
          }));
        }

        console.log('게시글 데이터 로드 상태:', {
          question: questionPostsRes.success
            ? questionPostsRes.data?.length || 0
            : 0,
          story: storyPostsRes.success ? storyPostsRes.data?.length || 0 : 0,
          tip: tipPostsRes.success ? tipPostsRes.data?.length || 0 : 0,
        });
      } catch (error) {
        console.error('커뮤니티 데이터 로드 실패:', error);
        toast.error('커뮤니티 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCommunityData();
  }, []);

  // 게시물 타입별 아이콘
  const getPostTypeIcon = (type: PostType) => {
    switch (type) {
      case 'question':
        return <HelpCircle className="h-5 w-5" />;
      case 'story':
        return <BookOpen className="h-5 w-5" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <MessageCircle className="h-5 w-5" />;
    }
  };

  // 게시물 타입별 색상
  const getPostTypeColor = (type: PostType) => {
    switch (type) {
      case 'question':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'story':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'tip':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // 상대 시간 계산
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}주 전`;

    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 섹션 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">부모 커뮤니티</h1>
          <p className="text-muted-foreground">
            초보 엄마 아빠들이 서로의 경험과 지식을 나누며 함께 성장하는
            공간입니다.
          </p>
        </div>
      </div>

      {/* 통계 카드 섹션 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 질문</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalPosts?.questions || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">육아 이야기</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalPosts?.stories || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">육아 팁</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalPosts?.tips || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 댓글</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalComments || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 게시물 탭 섹션 */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as PostType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="question" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            질문 게시판
          </TabsTrigger>
          <TabsTrigger value="story" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            육아 이야기
          </TabsTrigger>
          <TabsTrigger value="tip" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            육아 팁
          </TabsTrigger>
        </TabsList>

        <TabsContent value="question" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">최근 질문</h2>
              {isAuthenticated && (
                <Button asChild>
                  <Link href="/community/questions/new">
                    <PenTool className="mr-2 h-4 w-4" />
                    질문하기
                  </Link>
                </Button>
              )}
            </div>
            {posts.question.length > 0 ? (
              <div className="space-y-4">
                {posts.question.map((post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getPostTypeColor('question')}>
                              {CommunityService.getPostTypeLabel('question')}
                            </Badge>
                            <Badge variant="outline">
                              {post.category.name}
                            </Badge>
                            {post.is_solved && (
                              <Badge variant="default">해결됨</Badge>
                            )}
                          </div>
                          <Link
                            href={`/community/questions/${post.id}`}
                            className="block hover:underline"
                          >
                            <h3 className="font-semibold mb-1 line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {post.user.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.view_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {post.comment_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {post.like_count}
                            </span>
                            <span>{getRelativeTime(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  아직 질문이 없습니다
                </h3>
                <p className="text-muted-foreground mb-4">
                  첫 번째 질문을 올려보세요!
                </p>
                {isAuthenticated ? (
                  <Button asChild>
                    <Link href="/community/questions/new">질문하기</Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/auth?mode=signin">로그인 후 질문하기</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="story" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">최근 이야기</h2>
              {isAuthenticated && (
                <Button asChild>
                  <Link href="/community/stories/new">
                    <PenTool className="mr-2 h-4 w-4" />
                    이야기 작성하기
                  </Link>
                </Button>
              )}
            </div>
            {posts.story.length > 0 ? (
              <div className="space-y-4">
                {posts.story.map((post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getPostTypeColor('story')}>
                              {CommunityService.getPostTypeLabel('story')}
                            </Badge>
                            <Badge variant="outline">
                              {post.category.name}
                            </Badge>
                          </div>
                          <Link
                            href={`/community/stories/${post.id}`}
                            className="block hover:underline"
                          >
                            <h3 className="font-semibold mb-1 line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {post.user.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.view_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {post.comment_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {post.like_count}
                            </span>
                            <span>{getRelativeTime(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  아직 이야기가 없습니다
                </h3>
                <p className="text-muted-foreground mb-4">
                  첫 번째 육아 이야기를 공유해보세요!
                </p>
                {isAuthenticated ? (
                  <Button asChild>
                    <Link href="/community/stories/new">이야기 작성하기</Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/auth?mode=signin">
                      로그인 후 이야기 작성하기
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tip" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">최근 팁</h2>
              {isAuthenticated && (
                <Button asChild>
                  <Link href="/community/tips/new">
                    <PenTool className="mr-2 h-4 w-4" />팁 작성하기
                  </Link>
                </Button>
              )}
            </div>
            {posts.tip.length > 0 ? (
              <div className="space-y-4">
                {posts.tip.map((post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getPostTypeColor('tip')}>
                              {CommunityService.getPostTypeLabel('tip')}
                            </Badge>
                            <Badge variant="outline">
                              {post.category.name}
                            </Badge>
                          </div>
                          <Link
                            href={`/community/tips/${post.id}`}
                            className="block hover:underline"
                          >
                            <h3 className="font-semibold mb-1 line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {post.user.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.view_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {post.comment_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {post.like_count}
                            </span>
                            <span>{getRelativeTime(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">아직 팁이 없습니다</h3>
                <p className="text-muted-foreground mb-4">
                  첫 번째 육아 팁을 공유해보세요!
                </p>
                {isAuthenticated ? (
                  <Button asChild>
                    <Link href="/community/tips/new">팁 작성하기</Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/auth?mode=signin">로그인 후 팁 작성하기</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
