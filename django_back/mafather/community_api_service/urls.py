from django.urls import path
from community_api_service.views import (
    CategoryListView,
    PostListCreateView,
    PostDetailView,
    PostSolveView,
    CommentCreateView,
    CommentDetailView,
    LikeToggleView,
    CommunityStatsView,
)

urlpatterns = [
    # 카테고리
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('categories', CategoryListView.as_view(), name='categories'),
    
    # 게시물
    path('posts', PostListCreateView.as_view(), name='posts'),
    path('posts/<uuid:post_id>', PostDetailView.as_view(), name='post_detail'),
    path('posts/<uuid:post_id>/solve/', PostSolveView.as_view(), name='post_solve'),
    
    # 댓글
    path('comments/', CommentCreateView.as_view(), name='comments'),
    path('comments/<uuid:comment_id>/', CommentDetailView.as_view(), name='comment_detail'),
    
    # 좋아요
    path('likes/', LikeToggleView.as_view(), name='likes'),
    
    # 통계
    path('stats/', CommunityStatsView.as_view(), name='community_stats'),
]
