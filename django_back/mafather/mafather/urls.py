from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('auth/', include('api_service.urls.auth_urls')),  # API 서비스 인증 URL
    path('users/', include('api_service.urls.user_urls')),
    path('vectordb/development/', include('api_service.urls.development_urls')),  # 발달 모니터링 API
    path('community/', include('community_api_service.urls')),
    path('chatbot/', include('chatbot.urls')),  # 챗봇 URL 추가
]

# 개발 환경에서 미디어 파일 서빙
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
