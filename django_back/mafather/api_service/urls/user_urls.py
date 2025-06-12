from django.urls import path
from api_service.views.user_views import (
    UserProfileView,
    UserChildListCreateView,
    UserChildDetailView,
)

urlpatterns = [
    # 사용자 프로필 관련
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    
    # 자녀 정보 관련
    path('children/', UserChildListCreateView.as_view(), name='user_children'),
    path('children/<uuid:child_id>/', UserChildDetailView.as_view(), name='user_child_detail'),
]
