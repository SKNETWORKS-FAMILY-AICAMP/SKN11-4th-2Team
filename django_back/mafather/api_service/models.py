import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, email, **extra_fields):
        if not email:
            raise ValueError('이메일은 필수입니다.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """사용자 모델"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, verbose_name='이메일')
    name = models.CharField(max_length=100, verbose_name='사용자 이름')
    profile_image = models.URLField(blank=True, null=True, verbose_name='프로필 이미지 URL')
    auth_provider = models.CharField(
        max_length=20,
        choices=[
            ('google', 'Google'),
            ('kakao', 'Kakao'),
            ('naver', 'Naver')
        ],
        null=True,
        blank=True,
        verbose_name='인증 제공자'
    )
    auth_provider_id = models.CharField(max_length=255, blank=True, null=True, verbose_name='인증 제공자 ID')
    last_login = models.DateTimeField(blank=True, null=True, verbose_name='마지막 로그인')
    date_joined = models.DateTimeField(default=timezone.now, verbose_name='가입일')
    is_active = models.BooleanField(default=True, verbose_name='활성 상태')
    is_staff = models.BooleanField(default=False, verbose_name='스태프 여부')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성 시간')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정 시간')
    deleted_at = models.DateTimeField(blank=True, null=True, verbose_name='삭제 시간')

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
        verbose_name = '사용자'
        verbose_name_plural = '사용자들'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.email

    def soft_delete(self):
        """소프트 삭제"""
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save()


class UserChild(models.Model):
    """사용자 자녀 정보"""
    
    GENDER_CHOICES = [
        ('male', '남성'),
        ('female', '여성'),
        ('other', '기타'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='children', verbose_name='사용자')
    name = models.CharField(max_length=100, verbose_name='자녀 별명')
    birth_date = models.DateField(verbose_name='생년월일')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True, verbose_name='성별')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성 시간')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정 시간')
    deleted_at = models.DateTimeField(blank=True, null=True, verbose_name='삭제 시간')

    class Meta:
        db_table = 'user_children'
        verbose_name = '자녀 정보'
        verbose_name_plural = '자녀 정보들'
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"{self.user.name}의 자녀 - {self.name}"

    def soft_delete(self):
        """소프트 삭제"""
        self.deleted_at = timezone.now()
        self.save()

    @property
    def age_months(self):
        """개월 수 계산"""
        today = timezone.now().date()
        age_days = (today - self.birth_date).days
        return age_days // 30  # 대략적인 개월 수


class Session(models.Model):
    """세션 관리"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions', verbose_name='사용자')
    token = models.CharField(verbose_name='세션 토큰',max_length=500)
    device_info = models.JSONField(blank=True, null=True, verbose_name='기기 정보')
    ip_address = models.GenericIPAddressField(blank=True, null=True, verbose_name='IP 주소')
    expires_at = models.DateTimeField(verbose_name='만료 시간')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성 시간')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정 시간')

    class Meta:
        db_table = 'sessions'
        verbose_name = '세션'
        verbose_name_plural = '세션들'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['expires_at']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.token[:10]}..."

    def is_expired(self):
        """세션 만료 여부 확인"""
        return timezone.now() > self.expires_at


class SearchLog(models.Model):
    """검색 로그"""
    
    SEARCH_TYPE_CHOICES = [
        ('all', '전체'),
        ('posts', '게시물'),
        ('milestones', '발달 이정표'),
        ('records', '발달 기록'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, verbose_name='사용자')
    query = models.CharField(max_length=255, verbose_name='검색어')
    search_type = models.CharField(max_length=50, choices=SEARCH_TYPE_CHOICES, default='all', verbose_name='검색 유형')
    results_count = models.IntegerField(default=0, verbose_name='결과 수')
    ip_address = models.GenericIPAddressField(blank=True, null=True, verbose_name='IP 주소')
    user_agent = models.TextField(blank=True, null=True, verbose_name='User Agent')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성 시간')

    class Meta:
        db_table = 'search_logs'
        verbose_name = '검색 로그'
        verbose_name_plural = '검색 로그들'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.query} ({self.search_type})"


class DevelopmentRecord(models.Model):
    """발달 기록 모델"""
    
    AGE_GROUP_CHOICES = [
        ('0-3months', '0-3개월'),
        ('3-6months', '3-6개월'),
        ('6-9months', '6-9개월'),
        ('9-12months', '9-12개월'),
        ('12-18months', '12-18개월'),
        ('18-24months', '18-24개월'),
        ('24-36months', '24-36개월'),
        ('36-48months', '36-48개월'),
        ('48-60months', '48-60개월'),
        ('60months+', '60개월 이상'),
    ]
    
    DEVELOPMENT_AREA_CHOICES = [
        ('physical', '신체 발달'),
        ('cognitive', '인지 발달'),
        ('language', '언어 발달'),
        ('social', '사회성 발달'),
        ('emotional', '정서 발달'),
        ('self_care', '자조 능력'),
    ]
    
    RECORD_TYPE_CHOICES = [
        ('development_record', '발달 기록'),
        ('milestone_achievement', '이정표 달성'),
        ('observation', '관찰 기록'),
        ('concern', '우려사항'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='development_records', verbose_name='사용자')
    child = models.ForeignKey(UserChild, on_delete=models.CASCADE, related_name='development_records', verbose_name='자녀')
    date = models.DateField(verbose_name='기록 날짜')
    age_group = models.CharField(max_length=20, choices=AGE_GROUP_CHOICES, verbose_name='연령 그룹')
    development_area = models.CharField(max_length=20, choices=DEVELOPMENT_AREA_CHOICES, blank=True, null=True, verbose_name='발달 영역')
    title = models.CharField(max_length=200, verbose_name='제목')
    description = models.TextField(verbose_name='설명')
    record_type = models.CharField(max_length=30, choices=RECORD_TYPE_CHOICES, default='development_record', verbose_name='기록 유형')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성 시간')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정 시간')
    deleted_at = models.DateTimeField(blank=True, null=True, verbose_name='삭제 시간')

    class Meta:
        db_table = 'development_records'
        verbose_name = '발달 기록'
        verbose_name_plural = '발달 기록들'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['child']),
            models.Index(fields=['date']),
            models.Index(fields=['development_area']),
            models.Index(fields=['record_type']),
        ]
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.child.name} - {self.title} ({self.date})"

    def soft_delete(self):
        """소프트 삭제"""
        self.deleted_at = timezone.now()
        self.save()


class DevelopmentRecordImage(models.Model):
    """발달 기록 이미지 모델"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    record = models.ForeignKey(DevelopmentRecord, on_delete=models.CASCADE, related_name='images', verbose_name='발달 기록')
    image_url = models.URLField(verbose_name='이미지 URL')
    order = models.PositiveIntegerField(default=0, verbose_name='순서')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성 시간')
    deleted_at = models.DateTimeField(blank=True, null=True, verbose_name='삭제 시간')

    class Meta:
        db_table = 'development_record_images'
        verbose_name = '발달 기록 이미지'
        verbose_name_plural = '발달 기록 이미지들'
        ordering = ['order']

    def __str__(self):
        return f"{self.record.title} - 이미지 {self.order}"


class DevelopmentMilestone(models.Model):
    """발달 이정표 모델"""
    
    AGE_GROUP_CHOICES = DevelopmentRecord.AGE_GROUP_CHOICES
    DEVELOPMENT_AREA_CHOICES = DevelopmentRecord.DEVELOPMENT_AREA_CHOICES
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    age_group = models.CharField(max_length=20, choices=AGE_GROUP_CHOICES, verbose_name='연령 그룹')
    development_area = models.CharField(max_length=20, choices=DEVELOPMENT_AREA_CHOICES, verbose_name='발달 영역')
    title = models.CharField(max_length=200, verbose_name='제목')
    description = models.TextField(verbose_name='설명')
    order = models.PositiveIntegerField(default=0, verbose_name='순서')
    is_active = models.BooleanField(default=True, verbose_name='활성 상태')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성 시간')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정 시간')

    class Meta:
        db_table = 'development_milestones'
        verbose_name = '발달 이정표'
        verbose_name_plural = '발달 이정표들'
        indexes = [
            models.Index(fields=['age_group']),
            models.Index(fields=['development_area']),
            models.Index(fields=['is_active']),
        ]
        ordering = ['age_group', 'development_area', 'order']

    def __str__(self):
        return f"{self.get_age_group_display()} - {self.get_development_area_display()} - {self.title}"


class ChildMilestone(models.Model):
    """자녀별 달성 이정표 모델"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    child = models.ForeignKey(UserChild, on_delete=models.CASCADE, related_name='achieved_milestones', verbose_name='자녀')
    milestone = models.ForeignKey(DevelopmentMilestone, on_delete=models.CASCADE, related_name='child_achievements', verbose_name='이정표')
    achieved_date = models.DateField(verbose_name='달성 날짜')
    notes = models.TextField(blank=True, null=True, verbose_name='메모')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성 시간')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정 시간')

    class Meta:
        db_table = 'child_milestones'
        verbose_name = '자녀 이정표 달성'
        verbose_name_plural = '자녀 이정표 달성들'
        unique_together = [('child', 'milestone')]
        indexes = [
            models.Index(fields=['child']),
            models.Index(fields=['milestone']),
            models.Index(fields=['achieved_date']),
        ]
        ordering = ['-achieved_date']

    def __str__(self):
        return f"{self.child.name} - {self.milestone.title} ({self.achieved_date})"
