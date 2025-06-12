'use client';

import { useState, useEffect, use } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import CommunityService from '@/services/community-service';
import type {
  PostDetail,
  CreateCommentRequest,
  CommunityComment,
} from '@/types/community';
import {
  Eye,
  MessageCircle,
  ThumbsUp,
  Bookmark,
  Share2,
  Flag,
  Reply,
  Crown,
  CheckCircle,
  ChevronRight,
  Edit,
  Trash2,
} from 'lucide-react';

export default function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  // 게시물 로드
  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      try {
        const response = await CommunityService.getPost(unwrappedParams.id);
        if (response.success) {
          setPost(response.data);
          setIsLiked(response.data.is_liked);
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
  }, [unwrappedParams.id, router]);

  // 좋아요 토글
  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: '로그인이 필요합니다',
        description: '좋아요 기능을 사용하려면 로그인이 필요합니다.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await CommunityService.toggleLike({
        targetId: post.id,
        targetType: 'post',
      });

      if (response.success) {
        setIsLiked(!isLiked);
        setPost((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            like_count: isLiked ? prev.like_count - 1 : prev.like_count + 1,
          };
        });
      } else {
        toast({
          title: '좋아요 처리 실패',
          description: '잠시 후 다시 시도해주세요.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      toast({
        title: '좋아요 처리 실패',
        description: '잠시 후 다시 시도해주세요.',
        variant: 'destructive',
      });
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: '로그인이 필요합니다',
        description: '댓글을 작성하려면 로그인해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (!commentContent.trim()) {
      toast({
        title: '댓글 내용을 입력해주세요',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const commentData: CreateCommentRequest = {
        post_id: unwrappedParams.id,
        content: commentContent.trim(),
        is_anonymous: false,
      };

      const response = await CommunityService.createComment(commentData);
      if (response.success) {
        // 댓글 추가 후 게시물 다시 로드
        const updatedPost = await CommunityService.getPost(unwrappedParams.id);
        if (updatedPost.success) {
          setPost(updatedPost.data);
        }

        setCommentContent('');
        toast({
          title: '댓글이 등록되었습니다',
        });
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      toast({
        title: '댓글 작성 실패',
        description: '댓글 작성 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 해결 상태 변경 (질문 작성자만)
  const handleSolveToggle = async () => {
    if (!post || !isAuthenticated) return;

    try {
      const response = await CommunityService.solvePost(unwrappedParams.id, {
        isSolved: !post.is_solved,
      });

      if (response.success) {
        setPost((prev) =>
          prev
            ? {
                ...prev,
                is_solved: !prev.is_solved,
              }
            : null,
        );

        toast({
          title: post.is_solved
            ? '질문이 미해결로 변경되었습니다'
            : '질문이 해결되었습니다',
        });
      }
    } catch (error) {
      console.error('해결 상태 변경 실패:', error);
      toast({
        title: '상태 변경 실패',
        description: '잠시 후 다시 시도해주세요.',
        variant: 'destructive',
      });
    }
  };

  // 댓글 좋아요 토글
  const handleCommentLike = async (commentId: string) => {
    if (!isAuthenticated) {
      toast({
        title: '로그인이 필요합니다',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await CommunityService.toggleLike({
        targetId: commentId,
        targetType: 'comment',
      });

      if (response.success) {
        // 댓글 좋아요 상태 업데이트
        setPost((prev) => {
          if (!prev) return null;

          const updatedComments = prev.comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                like_count: response.data.like_count,
              };
            }
            return comment;
          });

          return {
            ...prev,
            comments: updatedComments,
          };
        });
      }
    } catch (error) {
      console.error('댓글 좋아요 실패:', error);
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

    return date.toLocaleDateString();
  };

  // 사용자 이름 첫 글자
  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-32" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">게시물을 찾을 수 없습니다</h1>
          <Button asChild>
            <Link href="/community/questions">목록으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 브레드크럼 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/community" className="hover:text-primary">
            커뮤니티
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/community/questions" className="hover:text-primary">
            질문 게시판
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span>질문 상세</span>
        </div>

        <div className="flex justify-between items-start gap-4 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLikeToggle}
              className={isLiked ? 'text-red-600 border-red-200 bg-red-50' : ''}
            >
              <ThumbsUp
                className={`mr-1 h-4 w-4 ${isLiked ? 'fill-current' : ''}`}
              />
              추천 {post.like_count}
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="mr-1 h-4 w-4" />
              북마크
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-1 h-4 w-4" />
              공유
            </Button>
          </div>
        </div>
      </div>

      {/* 게시물 내용 */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.user.profile_image} alt={post.user.name} />
              <AvatarFallback>{getUserInitial(post.user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">
                  {post.is_anonymous ? '익명' : post.user.name}
                </p>
                <Badge variant="outline" className="text-xs">
                  작성자
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {getRelativeTime(post.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{post.category.name}</Badge>
            {post.is_solved && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                해결됨
              </Badge>
            )}
            {post.is_pinned && <Badge variant="secondary">📌 고정</Badge>}
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* 이미지가 있는 경우 */}
          {Array.isArray(post.images) && post.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={typeof image === 'string' ? image : image.imageUrl}
                  alt={
                    typeof image === 'string'
                      ? `이미지 ${index + 1}`
                      : image.altText || `이미지 ${index + 1}`
                  }
                  className="rounded-lg max-w-full h-auto"
                />
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
          <div className="flex space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              조회 {post.view_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              댓글 {post.comment_count}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              추천 {post.like_count}
            </span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Flag className="mr-1 h-4 w-4" />
              신고
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* 댓글 섹션 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">댓글 {post.comment_count}개</h2>

        {post.comments.length > 0 ? (
          <div className="space-y-4">
            {CommunityService.sortCommentsByDate(post.comments).map(
              (comment) => (
                <Card key={comment.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={comment.user.profile_image}
                          alt={comment.user.name}
                        />
                        <AvatarFallback>
                          {getUserInitial(comment.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {comment.is_anonymous ? '익명' : comment.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getRelativeTime(comment.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCommentLike(comment.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {comment.like_count}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">아직 댓글이 없습니다</h3>
            <p className="text-muted-foreground">
              첫 번째 댓글을 작성해보세요!
            </p>
          </div>
        )}
      </div>

      {/* 댓글 작성 */}
      {isAuthenticated ? (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">댓글 작성하기</h2>
          <Card>
            <CardContent className="pt-6">
              <Textarea
                placeholder="댓글을 작성해주세요..."
                rows={4}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                disabled={isSubmitting}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-3">
              <p className="text-xs text-muted-foreground">
                댓글 작성 시{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  커뮤니티 이용규칙
                </Link>
                을 지켜주세요.
              </p>
              <Button
                onClick={handleCommentSubmit}
                disabled={isSubmitting || !commentContent.trim()}
              >
                {isSubmitting ? '등록 중...' : '댓글 등록'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                댓글을 작성하려면 로그인이 필요합니다.
              </p>
              <Button asChild>
                <Link href="/login">로그인하기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/community/questions">목록으로</Link>
        </Button>
        {isAuthenticated && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/community/questions/${post.id}/edit`}>
                <Edit className="mr-1 h-4 w-4" />
                수정
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-1 h-4 w-4" />
              삭제
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
