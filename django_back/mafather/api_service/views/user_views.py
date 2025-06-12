from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from api_service.models import User, UserChild
from api_service.serializers import (
    UserSerializer, 
    UserProfileUpdateSerializer,
    UserChildSerializer,
    UserChildCreateSerializer
)
from api_service.utils import StandardResponse, CustomPageNumberPagination
from api_service.exceptions import NotFoundError, ValidationError
import logging

logger = logging.getLogger(__name__)


class UserProfileView(APIView):
    """사용자 프로필 조회/업데이트"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """사용자 프로필 조회"""
        try:
            serializer = UserSerializer(request.user)
            return StandardResponse.success(
                data=serializer.data,
                message="프로필 조회 성공"
            )
        except Exception as e:
            logger.error(f"Profile get error for user {request.user.id}: {str(e)}")
            return StandardResponse.error(
                message="프로필 조회 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request):
        """사용자 프로필 업데이트"""
        try:
            serializer = UserProfileUpdateSerializer(
                request.user, 
                data=request.data, 
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                
                # 업데이트된 사용자 정보 반환
                updated_user = UserSerializer(request.user)
                return StandardResponse.success(
                    data=updated_user.data,
                    message="프로필이 업데이트되었습니다."
                )
            else:
                return StandardResponse.error(
                    message="입력 데이터가 올바르지 않습니다.",
                    errors=serializer.errors,
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Profile update error for user {request.user.id}: {str(e)}")
            return StandardResponse.error(
                message="프로필 업데이트 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserChildListCreateView(APIView):
    """자녀 목록 조회/생성"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """자녀 목록 조회"""
        try:
            children = UserChild.objects.filter(
                user=request.user,
                deleted_at__isnull=True
            ).order_by('-created_at')
            
            serializer = UserChildSerializer(children, many=True)
            
            return StandardResponse.success(
                data=serializer.data,
                message="자녀 목록 조회 성공"
            )
            
        except Exception as e:
            logger.error(f"Children list error for user {request.user.id}: {str(e)}")
            return StandardResponse.error(
                message="자녀 목록 조회 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        """자녀 생성"""
        try:
            serializer = UserChildCreateSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                child = serializer.save()
                
                return StandardResponse.success(
                    data=UserChildSerializer(child).data,
                    message="자녀 정보가 추가되었습니다.",
                    status_code=status.HTTP_201_CREATED
                )
            else:
                return StandardResponse.error(
                    message="입력 데이터가 올바르지 않습니다.",
                    errors=serializer.errors,
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.error(f"Child create error for user {request.user.id}: {str(e)}")
            return StandardResponse.error(
                message="자녀 정보 추가 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserChildDetailView(APIView):
    """자녀 상세 조회/수정/삭제"""
    permission_classes = [IsAuthenticated]
    
    def get_object(self, user, child_id):
        """자녀 객체 가져오기"""
        try:
            return UserChild.objects.get(
                id=child_id,
                user=user,
                deleted_at__isnull=True
            )
        except UserChild.DoesNotExist:
            raise NotFoundError("자녀 정보를 찾을 수 없습니다.")
    
    def get(self, request, child_id):
        """자녀 상세 조회"""
        try:
            child = self.get_object(request.user, child_id)
            serializer = UserChildSerializer(child)
            
            return StandardResponse.success(
                data=serializer.data,
                message="자녀 정보 조회 성공"
            )
            
        except NotFoundError as e:
            return StandardResponse.error(
                message=str(e),
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Child detail error for user {request.user.id}, child {child_id}: {str(e)}")
            return StandardResponse.error(
                message="자녀 정보 조회 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, child_id):
        """자녀 정보 수정"""
        try:
            child = self.get_object(request.user, child_id)
            serializer = UserChildSerializer(
                child,
                data=request.data,
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                
                return StandardResponse.success(
                    data=serializer.data,
                    message="자녀 정보가 수정되었습니다."
                )
            else:
                return StandardResponse.error(
                    message="입력 데이터가 올바르지 않습니다.",
                    errors=serializer.errors,
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        except NotFoundError as e:
            return StandardResponse.error(
                message=str(e),
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Child update error for user {request.user.id}, child {child_id}: {str(e)}")
            return StandardResponse.error(
                message="자녀 정보 수정 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, child_id):
        """자녀 정보 삭제 (소프트 삭제)"""
        try:
            child = self.get_object(request.user, child_id)
            child.soft_delete()
            
            return StandardResponse.success(
                data={'message': '자녀 정보가 삭제되었습니다.'},
                message="자녀 정보가 삭제되었습니다."
            )
            
        except NotFoundError as e:
            return StandardResponse.error(
                message=str(e),
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Child delete error for user {request.user.id}, child {child_id}: {str(e)}")
            return StandardResponse.error(
                message="자녀 정보 삭제 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
