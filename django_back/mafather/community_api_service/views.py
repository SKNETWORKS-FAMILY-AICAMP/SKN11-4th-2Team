from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from community_api_service.models import Category, Post, Comment, Like
from community_api_service.serializers import (
    CategorySerializer,
    PostSerializer,
    PostDetailSerializer,
    PostCreateSerializer,
    PostUpdateSerializer,
    PostSolveSerializer,
    CommentSerializer,
    CommentCreateSerializer,
    CommentUpdateSerializer,
    LikeToggleSerializer,
    CommunityStatsSerializer
)
from api_service.utils import StandardResponse, CustomPageNumberPagination
from api_service.exceptions import NotFoundError
import logging

logger = logging.getLogger(__name__)


class CategoryListView(APIView):
    """카테고리 목록 조회"""
    permission_classes = [AllowAny]  # 인증 없이 조회 가능
    
    def get(self, request):
        """카테고리 목록 조회"""
        try:
            post_type = request.GET.get('postType')
            
            queryset = Category.objects.filter(is_active=True)
            
            if post_type:
                queryset = queryset.filter(post_type=post_type)
            
            queryset = queryset.order_by('post_type', 'display_order')
            
            serializer = CategorySerializer(queryset, many=True)
            
            return StandardResponse.success(
                data=serializer.data,
                message="카테고리 목록 조회 성공"
            )
            
        except Exception as e:
            logger.error(f"Category list error: {str(e)}")
            return StandardResponse.error(
                message="카테고리 목록 조회 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PostListCreateView(APIView):
    """게시물 목록 조회/생성"""
    
    def get_permissions(self):
        """HTTP 메서드별 권한 설정"""
        if self.request.method == 'GET':
            return [AllowAny()]  # 조회는 인증 없이 가능
        return [IsAuthenticated()]  # 생성은 인증 필요
    
    def get(self, request):
        """게시물 목록 조회"""
        try:
            # 쿼리 파라미터
            page = request.GET.get('page', 1)
            limit = request.GET.get('limit', 20)
            post_type = request.GET.get('postType') or request.GET.get('post_type')
            category_id = request.GET.get('categoryId') or request.GET.get('category_id')
            status_filter = request.GET.get('status', 'published')
            search = request.GET.get('search')
            is_pinned = request.GET.get('isPinned')
            is_solved = request.GET.get('isSolved')
            
            # 기본 쿼리셋
            queryset = Post.objects.filter(
                deleted_at__isnull=True,
                status=status_filter
            ).select_related('user', 'category').prefetch_related('images', 'comments')
            
            # 필터링
            if post_type:
                queryset = queryset.filter(post_type=post_type)
            if category_id and category_id.lower() != 'all':
                try:
                    queryset = queryset.filter(category_id=category_id)
                except ValueError:
                    return StandardResponse.error(
                        message="잘못된 카테고리 ID 형식입니다.",
                        status_code=status.HTTP_400_BAD_REQUEST
                    )
            if search:
                queryset = queryset.filter(
                    Q(title__icontains=search) | Q(content__icontains=search)
                )
            if is_pinned is not None:
                queryset = queryset.filter(is_pinned=is_pinned.lower() == 'true')
            if is_solved is not None and post_type == 'question':
                queryset = queryset.filter(is_solved=is_solved.lower() == 'true')
            
            # 정렬 (핀된 게시물 우선, 최신순)
            queryset = queryset.order_by('-is_pinned', '-created_at')
            
            # 페이지네이션
            paginator = CustomPageNumberPagination()
            paginator.page_size = min(int(limit), 100)  # 최대 100개로 제한
            paginated_posts = paginator.paginate_queryset(queryset, request)
            
            serializer = PostSerializer(paginated_posts, many=True)
            return paginator.get_paginated_response(serializer.data)
            
        except Exception as e:
            logger.error(f"Post list error: {str(e)}")
            return StandardResponse.error(
                message="게시물 목록 조회 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        """게시물 생성"""
        try:
            serializer = PostCreateSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                post = serializer.save()
                
                return StandardResponse.success(
                    data=PostSerializer(post).data,
                    message="게시물이 생성되었습니다.",
                    status_code=status.HTTP_201_CREATED
                )
            else:
                return StandardResponse.error(
                    message="입력 데이터가 올바르지 않습니다.",
                    errors=serializer.errors,
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Post create error for user {request.user.id}: {str(e)}")
            return StandardResponse.error(
                message="게시물 생성 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PostDetailView(APIView):
    """게시물 상세 조회/수정/삭제"""
    
    def get_permissions(self):
        """HTTP 메서드별 권한 설정"""
        if self.request.method == 'GET':
            return [AllowAny()]  # 조회는 인증 없이 가능
        return [IsAuthenticated()]  # 수정/삭제는 인증 필요
    
    def get_object(self, post_id):
        """게시물 객체 가져오기"""
        try:
            return Post.objects.select_related('user', 'category').prefetch_related(
                'images', 'comments__user', 'comments__replies__user'
            ).get(
                id=post_id,
                deleted_at__isnull=True
            )
        except Post.DoesNotExist:
            raise NotFoundError("게시물을 찾을 수 없습니다.")
    
    def get(self, request, post_id):
        """게시물 상세 조회"""
        try:
            post = self.get_object(post_id)
            
            # 조회수 증가
            post.increment_view_count()
            
            serializer = PostDetailSerializer(post, context={'request': request})
            
            return StandardResponse.success(
                data=serializer.data,
                message="게시물 조회 성공"
            )
            
        except NotFoundError as e:
            return StandardResponse.error(
                message=str(e),
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Post detail error for post {post_id}: {str(e)}")
            return StandardResponse.error(
                message="게시물 조회 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, post_id):
        """게시물 수정"""
        try:
            post = self.get_object(post_id)
            
            # 작성자 권한 확인
            if post.user != request.user:
                return StandardResponse.error(
                    message="게시물을 수정할 권한이 없습니다.",
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            serializer = PostUpdateSerializer(
                post,
                data=request.data,
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                
                return StandardResponse.success(
                    data=PostSerializer(post).data,
                    message="게시물이 수정되었습니다."
                )
            else:
                return StandardResponse.error(
                    message="입력 데이터가 올바르지 않습니다.",
                    errors=serializer.errors,
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        except NotFoundError as e:
            return StandardResponse.error(
                message=str(e),
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Post update error for user {request.user.id}, post {post_id}: {str(e)}")
            return StandardResponse.error(
                message="게시물 수정 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, post_id):
        """게시물 삭제 (소프트 삭제)"""
        try:
            post = self.get_object(post_id)
            
            # 작성자 권한 확인
            if post.user != request.user:
                return StandardResponse.error(
                    message="게시물을 삭제할 권한이 없습니다.",
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            post.soft_delete()
            
            return StandardResponse.success(
                data={'message': '게시물이 삭제되었습니다.'},
                message="게시물이 삭제되었습니다."
            )
            
        except NotFoundError as e:
            return StandardResponse.error(
                message=str(e),
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Post delete error for user {request.user.id}, post {post_id}: {str(e)}")
            return StandardResponse.error(
                message="게시물 삭제 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PostSolveView(APIView):
    """게시물 해결 상태 변경 (질문 타입만)"""
    permission_classes = [IsAuthenticated]
    
    def put(self, request, post_id):
        """해결 상태 변경"""
        try:
            post = get_object_or_404(
                Post,
                id=post_id,
                user=request.user,
                post_type='question',
                deleted_at__isnull=True
            )
            
            serializer = PostSolveSerializer(data=request.data)
            
            if serializer.is_valid():
                post.is_solved = serializer.validated_data['is_solved']
                post.save(update_fields=['is_solved'])
                
                return StandardResponse.success(
                    data=PostSerializer(post).data,
                    message="해결 상태가 변경되었습니다."
                )
            else:
                return StandardResponse.error(
                    message="입력 데이터가 올바르지 않습니다.",
                    errors=serializer.errors,
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Post solve error for user {request.user.id}, post {post_id}: {str(e)}")
            return StandardResponse.error(
                message="해결 상태 변경 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CommentCreateView(APIView):
    """댓글 생성"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """댓글 생성"""
        try:
            serializer = CommentCreateSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                comment = serializer.save()
                
                return StandardResponse.success(
                    data=CommentSerializer(comment).data,
                    message="댓글이 작성되었습니다.",
                    status_code=status.HTTP_201_CREATED
                )
            else:
                return StandardResponse.error(
                    message="입력 데이터가 올바르지 않습니다.",
                    errors=serializer.errors,
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Comment create error for user {request.user.id}: {str(e)}")
            return StandardResponse.error(
                message="댓글 작성 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CommentDetailView(APIView):
    """댓글 상세 조회/수정/삭제"""
    permission_classes = [IsAuthenticated]
    
    def get_object(self, comment_id):
        """댓글 객체 가져오기"""
        try:
            return Comment.objects.select_related('user', 'post').get(
                id=comment_id,
                deleted_at__isnull=True
            )
        except Comment.DoesNotExist:
            raise NotFoundError("댓글을 찾을 수 없습니다.")
    
    def put(self, request, comment_id):
        """댓글 수정"""
        try:
            comment = self.get_object(comment_id)
            
            # 작성자 권한 확인
            if comment.user != request.user:
                return StandardResponse.error(
                    message="댓글을 수정할 권한이 없습니다.",
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            serializer = CommentUpdateSerializer(
                comment,
                data=request.data,
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                
                return StandardResponse.success(
                    data=CommentSerializer(comment).data,
                    message="댓글이 수정되었습니다."
                )
            else:
                return StandardResponse.error(
                    message="입력 데이터가 올바르지 않습니다.",
                    errors=serializer.errors,
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        except NotFoundError as e:
            return StandardResponse.error(
                message=str(e),
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Comment update error for user {request.user.id}, comment {comment_id}: {str(e)}")
            return StandardResponse.error(
                message="댓글 수정 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, comment_id):
        """댓글 삭제 (소프트 삭제)"""
        try:
            comment = self.get_object(comment_id)
            
            # 작성자 권한 확인
            if comment.user != request.user:
                return StandardResponse.error(
                    message="댓글을 삭제할 권한이 없습니다.",
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            comment.soft_delete()
            
            return StandardResponse.success(
                data={'message': '댓글이 삭제되었습니다.'},
                message="댓글이 삭제되었습니다."
            )
            
        except NotFoundError as e:
            return StandardResponse.error(
                message=str(e),
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Comment delete error for user {request.user.id}, comment {comment_id}: {str(e)}")
            return StandardResponse.error(
                message="댓글 삭제 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LikeToggleView(APIView):
    """좋아요 토글"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """좋아요 토글"""
        try:
            serializer = LikeToggleSerializer(data=request.data)
            
            if serializer.is_valid():
                target_id = serializer.validated_data['target_id']
                target_type = serializer.validated_data['target_type']
                
                # 기존 좋아요 확인
                existing_like = Like.objects.filter(
                    user=request.user,
                    target_id=target_id,
                    target_type=target_type
                ).first()
                
                if existing_like:
                    # 좋아요 취소
                    existing_like.delete()
                    is_liked = False
                    message = "좋아요가 취소되었습니다."
                else:
                    # 좋아요 추가
                    Like.objects.create(
                        user=request.user,
                        target_id=target_id,
                        target_type=target_type
                    )
                    is_liked = True
                    message = "좋아요가 추가되었습니다."
                
                # 좋아요 수 조회
                like_count = Like.objects.filter(
                    target_id=target_id,
                    target_type=target_type
                ).count()
                
                response_data = {
                    'is_liked': is_liked,
                    'like_count': like_count
                }
                
                return StandardResponse.success(
                    data=response_data,
                    message=message
                )
            else:
                return StandardResponse.error(
                    message="입력 데이터가 올바르지 않습니다.",
                    errors=serializer.errors,
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Like toggle error for user {request.user.id}: {str(e)}")
            return StandardResponse.error(
                message="좋아요 처리 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CommunityStatsView(APIView):
    """커뮤니티 통계"""
    permission_classes = [AllowAny]  # 인증 없이 조회 가능
    
    def get(self, request):
        """커뮤니티 통계 조회"""
        try:
            # 기본 통계
            total_posts = Post.objects.filter(deleted_at__isnull=True).count()
            total_comments = Comment.objects.filter(deleted_at__isnull=True).count()
            total_likes = Like.objects.count()
            
            # 게시물 타입별 통계
            posts_by_type = dict(
                Post.objects.filter(deleted_at__isnull=True).values('post_type').annotate(
                    count=Count('id')
                ).values_list('post_type', 'count')
            )
            
            # 카테고리별 통계
            posts_by_category = dict(
                Post.objects.filter(deleted_at__isnull=True).values('category__name').annotate(
                    count=Count('id')
                ).values_list('category__name', 'count')
            )
            
            # 최근 게시물
            recent_posts = Post.objects.filter(
                deleted_at__isnull=True,
                status='published'
            ).order_by('-created_at')[:10]
            
            # 인기 게시물 (좋아요 + 댓글 수 기준)
            popular_posts = Post.objects.filter(
                deleted_at__isnull=True,
                status='published'
            ).annotate(
                popularity_score=Count('like_count') + Count('comments')
            ).order_by('-popularity_score')[:10]
            
            stats_data = {
                'total_posts': total_posts,
                'total_comments': total_comments,
                'total_likes': total_likes,
                'posts_by_type': posts_by_type,
                'posts_by_category': posts_by_category,
                'recent_posts': PostSerializer(recent_posts, many=True).data,
                'popular_posts': PostSerializer(popular_posts, many=True).data
            }
            
            return StandardResponse.success(
                data=stats_data,
                message="커뮤니티 통계 조회 성공"
            )
            
        except Exception as e:
            logger.error(f"Community stats error: {str(e)}")
            return StandardResponse.error(
                message="커뮤니티 통계 조회 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
