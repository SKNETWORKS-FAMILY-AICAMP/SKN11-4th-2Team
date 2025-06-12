from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count, Prefetch
from django.utils import timezone
from datetime import datetime, timedelta
from collections import defaultdict
from itertools import chain

from api_service.models import (
    DevelopmentRecord, DevelopmentRecordImage, 
    DevelopmentMilestone, ChildMilestone, UserChild
)
from api_service.serializers import (
    DevelopmentRecordSerializer, DevelopmentRecordCreateSerializer,
    DevelopmentMilestoneSerializer, ChildMilestoneSerializer, 
    ChildMilestoneCreateSerializer, DevelopmentStatsSerializer,
    MilestoneProgressSerializer, DevelopmentTimelineItemSerializer,
    DevelopmentRecordListRequestSerializer, MilestoneListRequestSerializer,
    ChildMilestoneListRequestSerializer, DevelopmentTimelineRequestSerializer
)
from api_service.utils import create_response


class DevelopmentPagination(PageNumberPagination):
    """발달 관련 페이지네이션"""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class DevelopmentRecordViewSet(viewsets.ModelViewSet):
    """발달 기록 ViewSet"""
    
    serializer_class = DevelopmentRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = DevelopmentPagination
    
    def get_serializer_class(self):
        """액션에 따른 시리얼라이저 선택"""
        if self.action == 'create':
            return DevelopmentRecordCreateSerializer
        return DevelopmentRecordSerializer
    
    def get_queryset(self):
        """사용자의 발달 기록만 조회"""
        user = self.request.user
        queryset = DevelopmentRecord.objects.filter(
            user=user,
            deleted_at__isnull=True
        ).select_related('child', 'user').prefetch_related('images')
        
        # 필터링
        child_id = self.request.query_params.get('child')
        if child_id:
            queryset = queryset.filter(child_id=child_id)
        
        development_area = self.request.query_params.get('development_area')
        if development_area:
            queryset = queryset.filter(development_area=development_area)
        
        age_group = self.request.query_params.get('age_group')
        if age_group:
            queryset = queryset.filter(age_group=age_group)
        
        record_type = self.request.query_params.get('record_type')
        if record_type:
            queryset = queryset.filter(record_type=record_type)
        
        start_date = self.request.query_params.get('start_date')
        if start_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__gte=start_date)
            except ValueError:
                pass
        
        end_date = self.request.query_params.get('end_date')
        if end_date:
            try:
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__lte=end_date)
            except ValueError:
                pass
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset.order_by('-date', '-created_at')
    
    def list(self, request, *args, **kwargs):
        """발달 기록 목록 조회"""
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return create_response(
            success=True,
            message="발달 기록 목록을 성공적으로 조회했습니다.",
            data={"results": serializer.data}
        )
    
    def create(self, request, *args, **kwargs):
        """발달 기록 생성"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            record = serializer.save()
            response_serializer = DevelopmentRecordSerializer(record)
            return create_response(
                success=True,
                message="발달 기록이 성공적으로 생성되었습니다.",
                data=response_serializer.data,
                status_code=status.HTTP_201_CREATED
            )
        
        return create_response(
            success=False,
            message="발달 기록 생성에 실패했습니다.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    def retrieve(self, request, *args, **kwargs):
        """발달 기록 상세 조회"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return create_response(
            success=True,
            message="발달 기록을 성공적으로 조회했습니다.",
            data=serializer.data
        )
    
    def update(self, request, *args, **kwargs):
        """발달 기록 수정"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            record = serializer.save()
            return create_response(
                success=True,
                message="발달 기록이 성공적으로 수정되었습니다.",
                data=serializer.data
            )
        
        return create_response(
            success=False,
            message="발달 기록 수정에 실패했습니다.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    def destroy(self, request, *args, **kwargs):
        """발달 기록 소프트 삭제"""
        instance = self.get_object()
        instance.soft_delete()
        
        return create_response(
            success=True,
            message="발달 기록이 성공적으로 삭제되었습니다.",
            status_code=status.HTTP_204_NO_CONTENT
        )
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """발달 기록 통계"""
        user = request.user
        child_id = request.query_params.get('child_id')
        
        # 기본 쿼리셋
        queryset = DevelopmentRecord.objects.filter(
            user=user,
            deleted_at__isnull=True
        )
        
        if child_id:
            queryset = queryset.filter(child_id=child_id)
        
        # 전체 기록 수
        total_records = queryset.count()
        
        # 발달 영역별 기록 수
        records_by_area = dict(
            queryset.values('development_area')
            .annotate(count=Count('id'))
            .values_list('development_area', 'count')
        )
        
        # 기록 유형별 기록 수
        records_by_type = dict(
            queryset.values('record_type')
            .annotate(count=Count('id'))
            .values_list('record_type', 'count')
        )
        
        # 연령 그룹별 기록 수
        records_by_age_group = dict(
            queryset.values('age_group')
            .annotate(count=Count('id'))
            .values_list('age_group', 'count')
        )
        
        # 최근 활동
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        records_this_week = queryset.filter(date__gte=week_ago).count()
        records_this_month = queryset.filter(date__gte=month_ago).count()
        
        # 이정표 진행률
        milestone_progress = self._get_milestone_progress(user, child_id)
        
        stats_data = {
            'total_records': total_records,
            'records_by_area': records_by_area,
            'records_by_type': records_by_type,
            'records_by_age_group': records_by_age_group,
            'recent_activity': {
                'records_this_week': records_this_week,
                'records_this_month': records_this_month,
            },
            'milestone_progress': milestone_progress
        }
        
        return create_response(
            success=True,
            message="발달 기록 통계를 성공적으로 조회했습니다.",
            data=stats_data
        )
    
    def _get_milestone_progress(self, user, child_id=None):
        """이정표 진행률 계산"""
        if child_id:
            # 특정 자녀의 이정표 진행률
            child_milestones = ChildMilestone.objects.filter(
                child_id=child_id,
                child__user=user
            )
            total_milestones = DevelopmentMilestone.objects.filter(is_active=True)
            
            achieved_count = child_milestones.count()
            total_count = total_milestones.count()
        else:
            # 전체 자녀들의 평균 이정표 진행률
            user_children = UserChild.objects.filter(user=user, deleted_at__isnull=True)
            total_achievements = ChildMilestone.objects.filter(
                child__in=user_children
            ).count()
            
            total_possible = DevelopmentMilestone.objects.filter(is_active=True).count() * user_children.count()
            
            achieved_count = total_achievements
            total_count = total_possible if total_possible > 0 else 1
        
        percentage = (achieved_count / total_count * 100) if total_count > 0 else 0
        
        return {
            'achieved': achieved_count,
            'total': total_count,
            'percentage': round(percentage, 1)
        }


class DevelopmentMilestoneViewSet(viewsets.ReadOnlyModelViewSet):
    """발달 이정표 ViewSet (읽기 전용)"""
    
    serializer_class = DevelopmentMilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """활성화된 이정표만 조회"""
        return DevelopmentMilestone.objects.filter(is_active=True)
    
    def get_serializer_context(self):
        """시리얼라이저 컨텍스트에 child_id 추가"""
        context = super().get_serializer_context()
        context['child_id'] = self.request.query_params.get('child_id')
        return context
    
    def list(self, request, *args, **kwargs):
        """이정표 목록 조회"""
        queryset = self.get_queryset()
        
        # 필터링
        age_group = request.query_params.get('age_group')
        if age_group:
            queryset = queryset.filter(age_group=age_group)
        
        development_area = request.query_params.get('development_area')
        if development_area:
            queryset = queryset.filter(development_area=development_area)
        
        queryset = queryset.order_by('age_group', 'development_area', 'order')
        serializer = self.get_serializer(queryset, many=True)
        
        return create_response(
            success=True,
            message="발달 이정표 목록을 성공적으로 조회했습니다.",
            data={"results": serializer.data}
        )


class ChildMilestoneViewSet(viewsets.ModelViewSet):
    """자녀 이정표 달성 ViewSet"""
    
    serializer_class = ChildMilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = DevelopmentPagination
    
    def get_serializer_class(self):
        """액션에 따른 시리얼라이저 선택"""
        if self.action == 'create':
            return ChildMilestoneCreateSerializer
        return ChildMilestoneSerializer
    
    def get_queryset(self):
        """사용자의 자녀 이정표만 조회"""
        user = self.request.user
        queryset = ChildMilestone.objects.filter(
            child__user=user,
            child__deleted_at__isnull=True
        ).select_related('child', 'milestone')
        
        # 필터링
        child_id = self.request.query_params.get('child')
        if child_id:
            queryset = queryset.filter(child_id=child_id)
        
        age_group = self.request.query_params.get('age_group')
        if age_group:
            queryset = queryset.filter(milestone__age_group=age_group)
        
        development_area = self.request.query_params.get('development_area')
        if development_area:
            queryset = queryset.filter(milestone__development_area=development_area)
        
        return queryset.order_by('-achieved_date')
    
    def list(self, request, *args, **kwargs):
        """자녀 이정표 달성 목록 조회"""
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return create_response(
            success=True,
            message="자녀 이정표 달성 목록을 성공적으로 조회했습니다.",
            data={"results": serializer.data}
        )
    
    def create(self, request, *args, **kwargs):
        """자녀 이정표 달성 기록"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            milestone = serializer.save()
            response_serializer = ChildMilestoneSerializer(milestone)
            return create_response(
                success=True,
                message="이정표 달성이 성공적으로 기록되었습니다.",
                data=response_serializer.data,
                status_code=status.HTTP_201_CREATED
            )
        
        return create_response(
            success=False,
            message="이정표 달성 기록에 실패했습니다.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=False, methods=['get'])
    def progress(self, request):
        """이정표 달성 진도"""
        user = request.user
        child_id = request.query_params.get('child_id')
        
        # 전체 진도
        overall_progress = self._calculate_overall_progress(user, child_id)
        
        # 영역별 진도
        by_area_progress = self._calculate_by_area_progress(user, child_id)
        
        # 연령별 진도
        by_age_group_progress = self._calculate_by_age_group_progress(user, child_id)
        
        progress_data = {
            'overall': overall_progress,
            'by_area': by_area_progress,
            'by_age_group': by_age_group_progress
        }
        
        return create_response(
            success=True,
            message="이정표 달성 진도를 성공적으로 조회했습니다.",
            data=progress_data
        )
    
    def _calculate_overall_progress(self, user, child_id=None):
        """전체 진도 계산"""
        if child_id:
            achieved = ChildMilestone.objects.filter(
                child_id=child_id,
                child__user=user
            ).count()
            total = DevelopmentMilestone.objects.filter(is_active=True).count()
        else:
            user_children = UserChild.objects.filter(user=user, deleted_at__isnull=True)
            achieved = ChildMilestone.objects.filter(child__in=user_children).count()
            total = DevelopmentMilestone.objects.filter(is_active=True).count() * user_children.count()
        
        percentage = (achieved / total * 100) if total > 0 else 0
        
        return {
            'achieved': achieved,
            'total': total,
            'percentage': round(percentage, 1)
        }
    
    def _calculate_by_area_progress(self, user, child_id=None):
        """영역별 진도 계산"""
        areas = dict(DevelopmentMilestone.DEVELOPMENT_AREA_CHOICES)
        progress_by_area = {}
        
        for area_code, area_name in areas.items():
            if child_id:
                achieved = ChildMilestone.objects.filter(
                    child_id=child_id,
                    child__user=user,
                    milestone__development_area=area_code
                ).count()
                total = DevelopmentMilestone.objects.filter(
                    development_area=area_code,
                    is_active=True
                ).count()
            else:
                user_children = UserChild.objects.filter(user=user, deleted_at__isnull=True)
                achieved = ChildMilestone.objects.filter(
                    child__in=user_children,
                    milestone__development_area=area_code
                ).count()
                total = DevelopmentMilestone.objects.filter(
                    development_area=area_code,
                    is_active=True
                ).count() * user_children.count()
            
            percentage = (achieved / total * 100) if total > 0 else 0
            
            progress_by_area[area_code] = {
                'achieved': achieved,
                'total': total,
                'percentage': round(percentage, 1),
                'area_name': area_name
            }
        
        return progress_by_area
    
    def _calculate_by_age_group_progress(self, user, child_id=None):
        """연령별 진도 계산"""
        age_groups = dict(DevelopmentMilestone.AGE_GROUP_CHOICES)
        progress_by_age_group = {}
        
        for age_group_code, age_group_name in age_groups.items():
            if child_id:
                achieved = ChildMilestone.objects.filter(
                    child_id=child_id,
                    child__user=user,
                    milestone__age_group=age_group_code
                ).count()
                total = DevelopmentMilestone.objects.filter(
                    age_group=age_group_code,
                    is_active=True
                ).count()
            else:
                user_children = UserChild.objects.filter(user=user, deleted_at__isnull=True)
                achieved = ChildMilestone.objects.filter(
                    child__in=user_children,
                    milestone__age_group=age_group_code
                ).count()
                total = DevelopmentMilestone.objects.filter(
                    age_group=age_group_code,
                    is_active=True
                ).count() * user_children.count()
            
            percentage = (achieved / total * 100) if total > 0 else 0
            
            progress_by_age_group[age_group_code] = {
                'achieved': achieved,
                'total': total,
                'percentage': round(percentage, 1),
                'age_group_name': age_group_name
            }
        
        return progress_by_age_group


class DevelopmentTimelineView(viewsets.GenericViewSet):
    """발달 타임라인 ViewSet"""
    
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = DevelopmentPagination
    
    @action(detail=False, methods=['get'])
    def timeline(self, request):
        """발달 타임라인 조회 (발달 기록 + 이정표 달성)"""
        user = request.user
        child_id = request.query_params.get('child')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        timeline_items = []
        
        # 발달 기록 조회
        records_queryset = DevelopmentRecord.objects.filter(
            user=user,
            deleted_at__isnull=True
        ).select_related('child').prefetch_related('images')
        
        if child_id:
            records_queryset = records_queryset.filter(child_id=child_id)
        
        if start_date:
            try:
                start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
                records_queryset = records_queryset.filter(date__gte=start_date_obj)
            except ValueError:
                pass
        
        if end_date:
            try:
                end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
                records_queryset = records_queryset.filter(date__lte=end_date_obj)
            except ValueError:
                pass
        
        # 발달 기록을 타임라인 아이템으로 변환
        for record in records_queryset:
            timeline_items.append({
                'id': record.id,
                'type': 'record',
                'date': record.date,
                'title': record.title,
                'description': record.description,
                'child_name': record.child.name,
                'development_area': record.development_area,
                'development_area_display': record.get_development_area_display(),
                'age_group': record.age_group,
                'age_group_display': record.get_age_group_display(),
                'record_type': record.record_type,
                'record_type_display': record.get_record_type_display(),
                'images': [
                    {
                        'id': img.id,
                        'image_url': img.image_url,
                        'order': img.order
                    } for img in record.images.all()
                ],
                'sort_datetime': datetime.combine(record.date, datetime.min.time())
            })
        
        # 이정표 달성 기록 조회
        milestones_queryset = ChildMilestone.objects.filter(
            child__user=user,
            child__deleted_at__isnull=True
        ).select_related('child', 'milestone')
        
        if child_id:
            milestones_queryset = milestones_queryset.filter(child_id=child_id)
        
        if start_date:
            try:
                start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
                milestones_queryset = milestones_queryset.filter(achieved_date__gte=start_date_obj)
            except ValueError:
                pass
        
        if end_date:
            try:
                end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
                milestones_queryset = milestones_queryset.filter(achieved_date__lte=end_date_obj)
            except ValueError:
                pass
        
        # 이정표 달성을 타임라인 아이템으로 변환
        for milestone in milestones_queryset:
            timeline_items.append({
                'id': milestone.id,
                'type': 'milestone',
                'date': milestone.achieved_date,
                'title': milestone.milestone.title,
                'description': milestone.milestone.description,
                'child_name': milestone.child.name,
                'development_area': milestone.milestone.development_area,
                'development_area_display': milestone.milestone.get_development_area_display(),
                'age_group': milestone.milestone.age_group,
                'age_group_display': milestone.milestone.get_age_group_display(),
                'notes': milestone.notes,
                'sort_datetime': datetime.combine(milestone.achieved_date, datetime.min.time())
            })
        
        # 날짜순으로 정렬 (최신순)
        timeline_items.sort(key=lambda x: x['sort_datetime'], reverse=True)
        
        # sort_datetime 필드 제거 (응답에는 불필요)
        for item in timeline_items:
            del item['sort_datetime']
        
        # 페이지네이션 적용
        page = self.paginate_queryset(timeline_items)
        if page is not None:
            return self.get_paginated_response(page)
        
        return create_response(
            success=True,
            message="발달 타임라인을 성공적으로 조회했습니다.",
            data={"results": timeline_items}
        )
