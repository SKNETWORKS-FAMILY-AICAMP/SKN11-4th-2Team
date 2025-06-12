from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from api_service.models import (
    UserChild, DevelopmentRecord, DevelopmentRecordImage, 
    DevelopmentMilestone, ChildMilestone
)
from datetime import date, timedelta
from collections import defaultdict

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """커스텀 JWT 토큰 시리얼라이저 - 사용자 정보를 토큰에 포함"""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # 토큰에 사용자 정보 추가
        token['user_id'] = str(user.id)
        token['email'] = user.email
        token['name'] = user.name or ''
        token['profile_image'] = user.profile_image or ''
        token['is_staff'] = user.is_staff
        token['auth_provider'] = user.auth_provider or ''
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # 응답에 사용자 정보 추가
        data['user'] = {
            'id': str(self.user.id),
            'email': self.user.email,
            'name': self.user.name or '',
            'profile_image': self.user.profile_image or '',
            'is_staff': self.user.is_staff,
            'auth_provider': self.user.auth_provider or '',
            'last_login': self.user.last_login.isoformat() if self.user.last_login else None,
            'date_joined': self.user.date_joined.isoformat(),
        }
        
        return data


class UserSerializer(serializers.ModelSerializer):
    """사용자 시리얼라이저"""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'profile_image', 'auth_provider', 'created_at', 'updated_at']
        read_only_fields = ['id', 'email', 'auth_provider', 'created_at', 'updated_at']


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """사용자 프로필 업데이트 시리얼라이저"""
    
    class Meta:
        model = User
        fields = ['name', 'profile_image']
    
    def validate_name(self, value):
        """이름 유효성 검사"""
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError("이름은 필수입니다.")
        if len(value.strip()) > 50:
            raise serializers.ValidationError("이름은 50자 이하여야 합니다.")
        return value.strip()


class UserChildSerializer(serializers.ModelSerializer):
    """자녀 정보 시리얼라이저"""
    age_months = serializers.ReadOnlyField()
    
    class Meta:
        model = UserChild
        fields = ['id', 'name', 'birth_date', 'gender', 'age_months', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_name(self, value):
        """자녀 이름 유효성 검사"""
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError("자녀 이름은 필수입니다.")
        if len(value.strip()) > 20:
            raise serializers.ValidationError("자녀 이름은 20자 이하여야 합니다.")
        return value.strip()
    
    def validate_birth_date(self, value):
        """생년월일 유효성 검사"""
        if not value:
            raise serializers.ValidationError("생년월일은 필수입니다.")
        
        today = date.today()
        if value > today:
            raise serializers.ValidationError("생년월일은 미래 날짜가 될 수 없습니다.")
        
        # 10년 전까지만 허용
        ten_years_ago = today - timedelta(days=365 * 10)
        if value < ten_years_ago:
            raise serializers.ValidationError("생년월일은 10년 이전이 될 수 없습니다.")
        
        return value


class UserChildCreateSerializer(UserChildSerializer):
    """자녀 생성 시리얼라이저"""
    
    def create(self, validated_data):
        """자녀 생성"""
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)


class AuthResponseSerializer(serializers.Serializer):
    """인증 응답 시리얼라이저"""
    access_token = serializers.CharField()
    refresh_token = serializers.CharField()
    user = UserSerializer()


class LogoutResponseSerializer(serializers.Serializer):
    """로그아웃 응답 시리얼라이저"""
    message = serializers.CharField(default="로그아웃되었습니다.")


class FileUploadSerializer(serializers.Serializer):
    """파일 업로드 시리얼라이저"""
    file_url = serializers.URLField()
    file_key = serializers.CharField()
    file_size = serializers.IntegerField()
    content_type = serializers.CharField()


class ImageUploadSerializer(FileUploadSerializer):
    """이미지 업로드 시리얼라이저"""
    width = serializers.IntegerField(required=False)
    height = serializers.IntegerField(required=False)


class ProfileImageUploadSerializer(serializers.Serializer):
    """프로필 이미지 업로드 시리얼라이저"""
    original = ImageUploadSerializer()
    thumbnail = ImageUploadSerializer()


class MultipleUploadResultSerializer(serializers.Serializer):
    """다중 파일 업로드 결과 시리얼라이저"""
    successful_uploads = FileUploadSerializer(many=True)
    failed_uploads = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )
    total_count = serializers.IntegerField()
    success_count = serializers.IntegerField()
    failure_count = serializers.IntegerField()


class PaginationSerializer(serializers.Serializer):
    """페이지네이션 시리얼라이저"""
    count = serializers.IntegerField()
    page = serializers.IntegerField()
    total_pages = serializers.IntegerField()
    page_size = serializers.IntegerField()
    has_next = serializers.BooleanField()
    has_previous = serializers.BooleanField()
    next = serializers.URLField(allow_null=True)
    previous = serializers.URLField(allow_null=True)


class StandardResponseSerializer(serializers.Serializer):
    """표준 API 응답 시리얼라이저"""
    success = serializers.BooleanField()
    message = serializers.CharField()
    data = serializers.JSONField(required=False)
    errors = serializers.JSONField(required=False)
    pagination = PaginationSerializer(required=False)


class DevelopmentRecordSerializer(serializers.ModelSerializer):
    """발달 기록 시리얼라이저"""
    images = ImageUploadSerializer(many=True, read_only=True)
    child_name = serializers.CharField(source='child.name', read_only=True)
    
    class Meta:
        model = DevelopmentRecord
        fields = ['id', 'child', 'child_name', 'development_area', 'record_type', 
                 'title', 'description', 'date', 'age_group', 'images', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class DevelopmentRecordCreateSerializer(DevelopmentRecordSerializer):
    """발달 기록 생성 시리얼라이저"""
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)


class DevelopmentMilestoneSerializer(serializers.ModelSerializer):
    """발달 이정표 시리얼라이저"""
    
    class Meta:
        model = DevelopmentMilestone
        fields = ['id', 'development_area', 'age_group', 'title', 
                 'description', 'is_achieved', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ChildMilestoneSerializer(serializers.ModelSerializer):
    """자녀 이정표 달성 시리얼라이저"""
    milestone_title = serializers.CharField(source='milestone.title', read_only=True)
    milestone_description = serializers.CharField(source='milestone.description', read_only=True)
    
    class Meta:
        model = ChildMilestone
        fields = ['id', 'child', 'milestone', 'milestone_title', 
                 'milestone_description', 'achieved_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ChildMilestoneCreateSerializer(ChildMilestoneSerializer):
    """자녀 이정표 달성 생성 시리얼라이저"""
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)


class DevelopmentStatsSerializer(serializers.Serializer):
    """발달 기록 통계 시리얼라이저"""
    total_records = serializers.IntegerField()
    records_by_area = serializers.DictField(child=serializers.IntegerField())
    records_by_type = serializers.DictField(child=serializers.IntegerField())
    records_by_age_group = serializers.DictField(child=serializers.IntegerField())


class MilestoneProgressSerializer(serializers.Serializer):
    """이정표 달성 진행률 시리얼라이저"""
    overall_progress = serializers.FloatField()
    progress_by_area = serializers.DictField(child=serializers.FloatField())
    progress_by_age_group = serializers.DictField(child=serializers.FloatField())


class DevelopmentTimelineItemSerializer(serializers.Serializer):
    """발달 타임라인 아이템 시리얼라이저"""
    date = serializers.DateField()
    records = DevelopmentRecordSerializer(many=True)
    milestones = ChildMilestoneSerializer(many=True)


class DevelopmentRecordListRequestSerializer(serializers.Serializer):
    """발달 기록 목록 요청 시리얼라이저"""
    child = serializers.IntegerField(required=False)
    development_area = serializers.CharField(required=False)
    age_group = serializers.CharField(required=False)
    record_type = serializers.CharField(required=False)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
    search = serializers.CharField(required=False)


class MilestoneListRequestSerializer(serializers.Serializer):
    """이정표 목록 요청 시리얼라이저"""
    development_area = serializers.CharField(required=False)
    age_group = serializers.CharField(required=False)


class ChildMilestoneListRequestSerializer(serializers.Serializer):
    """자녀 이정표 목록 요청 시리얼라이저"""
    child = serializers.IntegerField(required=False)
    development_area = serializers.CharField(required=False)
    age_group = serializers.CharField(required=False)


class DevelopmentTimelineRequestSerializer(serializers.Serializer):
    """발달 타임라인 요청 시리얼라이저"""
    child = serializers.IntegerField(required=False)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
