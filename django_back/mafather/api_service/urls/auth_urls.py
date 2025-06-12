from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView as JWTTokenRefreshView
from api_service.views.auth_views import (
    CustomTokenObtainPairView,
    LoginView,
    LogoutView,
    VerifyTokenView,
    TokenRefreshView,
    UserStatusView,
    SocialTokenView,
    UserProfileView,
)

urlpatterns = [
    # JWT 로그인 (이메일/비밀번호)
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/email/', LoginView.as_view(), name='email_login'),
    
    # 로그아웃
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # 토큰 관리
    path('token/refresh/', JWTTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', VerifyTokenView.as_view(), name='token_verify'),
    
    # 사용자 정보
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('user/status/', UserStatusView.as_view(), name='user_status'),
    
    # 소셜 로그인
    path('social/token/', SocialTokenView.as_view(), name='social_token'),
    path('social/logout/', LogoutView.as_view(), name='social_logout'),
]
