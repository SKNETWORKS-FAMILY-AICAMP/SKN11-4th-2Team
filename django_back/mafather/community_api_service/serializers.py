from rest_framework import serializers
from community_api_service.models import Category, Post, Comment, PostImage, Like
from api_service.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    """카테고리 시리얼라이저"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'post_type', 'color', 'icon', 'display_order']


class PostImageSerializer(serializers.ModelSerializer):
    """게시물 이미지 시리얼라이저"""
    
    class Meta:
        model = PostImage
        fields = ['id', 'image_url', 'alt_text', 'order']


class CommentSerializer(serializers.ModelSerializer):
    """댓글 시리얼라이저"""
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = [
            'id', 'user', 'content', 'like_count', 'is_anonymous', 
            'parent', 'depth', 'replies', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'like_count', 'depth', 'created_at', 'updated_at']
    
    def get_replies(self, obj):
        """대댓글 조회"""
        if obj.depth == 0:  # 최상위 댓글만 대댓글 포함
            replies = obj.replies.filter(deleted_at__isnull=True).order_by('created_at')
            return CommentSerializer(replies, many=True, context=self.context).data
        return []


class PostSerializer(serializers.ModelSerializer):
    """게시물 시리얼라이저"""
    user = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = PostImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'user', 'category', 'post_type', 'title', 'content', 
            'status', 'view_count', 'like_count', 'comment_count', 
            'is_anonymous', 'is_solved', 'is_pinned', 'images',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'view_count', 'like_count', 'comment_count', 
            'created_at', 'updated_at'
        ]


class PostDetailSerializer(PostSerializer):
    """게시물 상세 시리얼라이저"""
    comments = serializers.SerializerMethodField()
    
    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + ['comments']
    
    def get_comments(self, obj):
        """댓글 목록 조회 (트리 구조)"""
        # 최상위 댓글만 가져오기 (대댓글은 replies에서 처리)
        top_level_comments = obj.comments.filter(
            parent__isnull=True,
            deleted_at__isnull=True
        ).order_by('created_at')
        
        return CommentSerializer(top_level_comments, many=True, context=self.context).data


class PostCreateSerializer(serializers.ModelSerializer):
    """게시물 생성 시리얼라이저"""
    category_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = Post
        fields = ['title', 'content', 'post_type', 'category_id', 'is_anonymous']
    
    def validate_title(self, value):
        """제목 유효성 검사"""
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError("제목은 필수입니다.")
        if len(value.strip()) > 200:
            raise serializers.ValidationError("제목은 200자 이하여야 합니다.")
        return value.strip()
    
    def validate_content(self, value):
        """내용 유효성 검사"""
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError("내용은 필수입니다.")
        if len(value.strip()) > 10000:
            raise serializers.ValidationError("내용은 10000자 이하여야 합니다.")
        return value.strip()
    
    def create(self, validated_data):
        """게시물 생성"""
        category_id = validated_data.pop('category_id')
        category = Category.objects.get(id=category_id)
        
        user = self.context['request'].user
        validated_data['user'] = user
        validated_data['category'] = category
        
        return super().create(validated_data)


class PostUpdateSerializer(serializers.ModelSerializer):
    """게시물 수정 시리얼라이저"""
    
    class Meta:
        model = Post
        fields = ['title', 'content', 'is_anonymous']
    
    def validate_title(self, value):
        """제목 유효성 검사"""
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError("제목은 필수입니다.")
        if len(value.strip()) > 200:
            raise serializers.ValidationError("제목은 200자 이하여야 합니다.")
        return value.strip()
    
    def validate_content(self, value):
        """내용 유효성 검사"""
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError("내용은 필수입니다.")
        if len(value.strip()) > 10000:
            raise serializers.ValidationError("내용은 10000자 이하여야 합니다.")
        return value.strip()


class CommentCreateSerializer(serializers.ModelSerializer):
    """댓글 생성 시리얼라이저"""
    post_id = serializers.UUIDField(write_only=True)
    parent_id = serializers.UUIDField(write_only=True, required=False)
    
    class Meta:
        model = Comment
        fields = ['content', 'post_id', 'parent_id', 'is_anonymous']
    
    def validate_content(self, value):
        """내용 유효성 검사"""
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError("댓글 내용은 필수입니다.")
        if len(value.strip()) > 1000:
            raise serializers.ValidationError("댓글은 1000자 이하여야 합니다.")
        return value.strip()
    
    def create(self, validated_data):
        """댓글 생성"""
        post_id = validated_data.pop('post_id')
        parent_id = validated_data.pop('parent_id', None)
        
        post = Post.objects.get(id=post_id)
        user = self.context['request'].user
        
        validated_data['post'] = post
        validated_data['user'] = user
        
        if parent_id:
            parent = Comment.objects.get(id=parent_id)
            validated_data['parent'] = parent
        
        return super().create(validated_data)


class CommentUpdateSerializer(serializers.ModelSerializer):
    """댓글 수정 시리얼라이저"""
    
    class Meta:
        model = Comment
        fields = ['content', 'is_anonymous']
    
    def validate_content(self, value):
        """내용 유효성 검사"""
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError("댓글 내용은 필수입니다.")
        if len(value.strip()) > 1000:
            raise serializers.ValidationError("댓글은 1000자 이하여야 합니다.")
        return value.strip()


class LikeToggleSerializer(serializers.Serializer):
    """좋아요 토글 시리얼라이저"""
    target_id = serializers.UUIDField()
    target_type = serializers.ChoiceField(choices=['post', 'comment'])


class PostSolveSerializer(serializers.Serializer):
    """게시물 해결 시리얼라이저"""
    is_solved = serializers.BooleanField()
    solved_comment_id = serializers.UUIDField(required=False, allow_null=True)


class CommunityStatsSerializer(serializers.Serializer):
    """커뮤니티 통계 시리얼라이저"""
    total_posts = serializers.IntegerField()
    total_comments = serializers.IntegerField()
    total_likes = serializers.IntegerField()
    posts_by_type = serializers.DictField()
    posts_by_category = serializers.DictField()
    recent_posts = PostSerializer(many=True)
    popular_posts = PostSerializer(many=True)
