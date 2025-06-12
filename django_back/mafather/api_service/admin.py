from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import (
    User, UserChild, Session, SearchLog,
    DevelopmentRecord, DevelopmentRecordImage, 
    DevelopmentMilestone, ChildMilestone
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """사용자 관리자"""
    
    list_display = ['email', 'name', 'is_active', 'last_login', 'created_at']
    list_filter = ['is_active', 'is_staff', 'created_at']
    search_fields = ['email', 'name']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at', 'last_login']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('개인정보', {'fields': ('name', 'profile_image')}),
        ('권한', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('중요한 날짜', {'fields': ('last_login', 'created_at', 'updated_at', 'deleted_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2'),
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).filter(deleted_at__isnull=True)


@admin.register(UserChild)
class UserChildAdmin(admin.ModelAdmin):
    """자녀 정보 관리자"""
    
    list_display = ['name', 'user', 'birth_date', 'gender', 'age_months', 'created_at']
    list_filter = ['gender', 'created_at']
    search_fields = ['name', 'user__name', 'user__email']
    ordering = ['-created_at']
    readonly_fields = ['id', 'age_months', 'created_at', 'updated_at']
    
    fieldsets = (
        (None, {'fields': ('user', 'name', 'birth_date', 'gender')}),
        ('시스템정보', {'fields': ('id', 'age_months', 'created_at', 'updated_at', 'deleted_at')}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).filter(deleted_at__isnull=True)


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    """세션 관리자"""
    
    list_display = ['user', 'token_preview', 'ip_address', 'is_expired', 'created_at', 'expires_at']
    list_filter = ['created_at', 'expires_at']
    search_fields = ['user__email', 'user__name', 'ip_address']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at', 'is_expired']
    
    fieldsets = (
        (None, {'fields': ('user', 'token', 'expires_at')}),
        ('기기정보', {'fields': ('device_info', 'ip_address')}),
        ('시스템정보', {'fields': ('id', 'is_expired', 'created_at', 'updated_at')}),
    )

    def token_preview(self, obj):
        return f"{obj.token[:20]}..." if obj.token else "-"
    token_preview.short_description = '토큰 미리보기'

    def is_expired(self, obj):
        expired = obj.is_expired()
        color = 'red' if expired else 'green'
        text = '만료됨' if expired else '유효함'
        return format_html(f'<span style="color: {color};">{text}</span>')
    is_expired.short_description = '만료 여부'


@admin.register(SearchLog)
class SearchLogAdmin(admin.ModelAdmin):
    """검색 로그 관리자"""
    
    list_display = ['query', 'search_type', 'user', 'results_count', 'ip_address', 'created_at']
    list_filter = ['search_type', 'created_at']
    search_fields = ['query', 'user__email', 'user__name']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at']
    
    fieldsets = (
        (None, {'fields': ('user', 'query', 'search_type', 'results_count')}),
        ('기술정보', {'fields': ('ip_address', 'user_agent')}),
        ('시스템정보', {'fields': ('id', 'created_at')}),
    )


# ========== 발달 관련 Admin 모델들 ==========

class DevelopmentRecordImageInline(admin.TabularInline):
    """발달 기록 이미지 인라인"""
    model = DevelopmentRecordImage
    extra = 0
    readonly_fields = ['id', 'created_at']
    fields = ['image_url', 'order', 'created_at']


@admin.register(DevelopmentRecord)
class DevelopmentRecordAdmin(admin.ModelAdmin):
    """발달 기록 관리자"""
    
    list_display = [
        'title', 'child', 'user', 'date', 'age_group', 
        'development_area', 'record_type', 'image_count', 'created_at'
    ]
    list_filter = ['age_group', 'development_area', 'record_type', 'date', 'created_at']
    search_fields = ['title', 'description', 'child__name', 'user__name', 'user__email']
    ordering = ['-date', '-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at']
    date_hierarchy = 'date'
    inlines = [DevelopmentRecordImageInline]
    
    fieldsets = (
        ('기본정보', {
            'fields': ('user', 'child', 'title', 'description')
        }),
        ('발달정보', {
            'fields': ('date', 'age_group', 'development_area', 'record_type')
        }),
        ('시스템정보', {
            'fields': ('id', 'created_at', 'updated_at', 'deleted_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).filter(deleted_at__isnull=True)
    
    def image_count(self, obj):
        """이미지 개수 표시"""
        count = obj.images.count()
        if count > 0:
            return format_html(f'<span style="color: green;">{count}개</span>')
        return format_html('<span style="color: gray;">없음</span>')
    image_count.short_description = '이미지'
    
    def get_form(self, request, obj=None, **kwargs):
        """폼 커스터마이징"""
        form = super().get_form(request, obj, **kwargs)
        # 현재 사용자의 자녀만 선택 가능하도록 제한 (슈퍼유저가 아닌 경우)
        if not request.user.is_superuser and 'child' in form.base_fields:
            form.base_fields['child'].queryset = UserChild.objects.filter(
                user=request.user,
                deleted_at__isnull=True
            )
        return form


@admin.register(DevelopmentRecordImage)
class DevelopmentRecordImageAdmin(admin.ModelAdmin):
    """발달 기록 이미지 관리자"""
    
    list_display = ['record', 'image_preview', 'order', 'created_at']
    list_filter = ['created_at']
    search_fields = ['record__title', 'record__child__name']
    ordering = ['record', 'order']
    readonly_fields = ['id', 'created_at', 'image_preview']
    
    fieldsets = (
        (None, {'fields': ('record', 'image_url', 'order')}),
        ('미리보기', {'fields': ('image_preview',)}),
        ('시스템정보', {
            'fields': ('id', 'created_at', 'deleted_at'),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """이미지 미리보기"""
        if obj.image_url:
            return format_html(
                '<img src="{}" style="max-width: 200px; max-height: 200px;"/>',
                obj.image_url
            )
        return "이미지 없음"
    image_preview.short_description = '이미지 미리보기'


@admin.register(DevelopmentMilestone)
class DevelopmentMilestoneAdmin(admin.ModelAdmin):
    """발달 이정표 관리자"""
    
    list_display = [
        'title', 'age_group', 'development_area', 
        'order', 'is_active', 'achievement_count', 'created_at'
    ]
    list_filter = ['age_group', 'development_area', 'is_active', 'created_at']
    search_fields = ['title', 'description']
    ordering = ['age_group', 'development_area', 'order']
    readonly_fields = ['id', 'created_at', 'updated_at', 'achievement_count']
    
    fieldsets = (
        ('기본정보', {
            'fields': ('title', 'description', 'order', 'is_active')
        }),
        ('분류정보', {
            'fields': ('age_group', 'development_area')
        }),
        ('통계정보', {
            'fields': ('achievement_count',),
            'classes': ('collapse',)
        }),
        ('시스템정보', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def achievement_count(self, obj):
        """달성한 자녀 수"""
        count = obj.child_achievements.count()
        if count > 0:
            return format_html(f'<span style="color: green;">{count}명</span>')
        return format_html('<span style="color: gray;">0명</span>')
    achievement_count.short_description = '달성 자녀 수'


@admin.register(ChildMilestone)
class ChildMilestoneAdmin(admin.ModelAdmin):
    """자녀 이정표 달성 관리자"""
    
    list_display = [
        'child', 'milestone_title', 'milestone_age_group', 
        'milestone_development_area', 'achieved_date', 'created_at'
    ]
    list_filter = [
        'milestone__age_group', 'milestone__development_area', 
        'achieved_date', 'created_at'
    ]
    search_fields = [
        'child__name', 'child__user__name', 
        'milestone__title', 'milestone__description', 'notes'
    ]
    ordering = ['-achieved_date', '-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at']
    date_hierarchy = 'achieved_date'
    
    fieldsets = (
        ('기본정보', {
            'fields': ('child', 'milestone', 'achieved_date', 'notes')
        }),
        ('시스템정보', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def milestone_title(self, obj):
        """이정표 제목"""
        return obj.milestone.title
    milestone_title.short_description = '이정표'
    milestone_title.admin_order_field = 'milestone__title'
    
    def milestone_age_group(self, obj):
        """이정표 연령 그룹"""
        return obj.milestone.get_age_group_display()
    milestone_age_group.short_description = '연령 그룹'
    milestone_age_group.admin_order_field = 'milestone__age_group'
    
    def milestone_development_area(self, obj):
        """이정표 발달 영역"""
        return obj.milestone.get_development_area_display()
    milestone_development_area.short_description = '발달 영역'
    milestone_development_area.admin_order_field = 'milestone__development_area'
    
    def get_form(self, request, obj=None, **kwargs):
        """폼 커스터마이징"""
        form = super().get_form(request, obj, **kwargs)
        # 현재 사용자의 자녀만 선택 가능하도록 제한 (슈퍼유저가 아닌 경우)
        if not request.user.is_superuser and 'child' in form.base_fields:
            form.base_fields['child'].queryset = UserChild.objects.filter(
                user=request.user,
                deleted_at__isnull=True
            )
        return form
