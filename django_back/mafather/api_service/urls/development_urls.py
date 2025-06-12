from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api_service.development_views import (
    DevelopmentRecordViewSet,
    DevelopmentMilestoneViewSet,
    ChildMilestoneViewSet,
    DevelopmentTimelineView
)

# 라우터 설정
router = DefaultRouter()
router.register(r'records', DevelopmentRecordViewSet, basename='development-records')
router.register(r'milestones', DevelopmentMilestoneViewSet, basename='development-milestones')
router.register(r'child-milestones', ChildMilestoneViewSet, basename='child-milestones')
router.register(r'timeline', DevelopmentTimelineView, basename='development-timeline')

app_name = 'development'

urlpatterns = [
    path('', include(router.urls)),
]
