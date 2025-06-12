from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from typing import Any, Dict, Optional


class StandardResponse:
    """표준 API 응답 형식"""
    
    @staticmethod
    def success(data: Any = None, message: str = "성공", status_code: int = status.HTTP_200_OK) -> Response:
        """성공 응답"""
        response_data = {
            "success": True,
            "message": message,
            "data": data
        }
        return Response(response_data, status=status_code)
    
    @staticmethod
    def error(message: str = "오류가 발생했습니다", 
              errors: Optional[Dict] = None, 
              status_code: int = status.HTTP_400_BAD_REQUEST) -> Response:
        """에러 응답"""
        response_data = {
            "success": False,
            "message": message,
            "errors": errors
        }
        return Response(response_data, status=status_code)
    
    @staticmethod
    def paginated_success(data: Any, 
                         pagination_info: Dict, 
                         message: str = "성공") -> Response:
        """페이지네이션 포함 성공 응답"""
        response_data = {
            "success": True,
            "message": message,
            "data": data,
            "pagination": pagination_info
        }
        return Response(response_data, status=status.HTTP_200_OK)


class CustomPageNumberPagination(PageNumberPagination):
    """커스텀 페이지네이션"""
    page_size = 20
    page_size_query_param = 'limit'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return StandardResponse.paginated_success(
            data=data,
            pagination_info={
                'count': self.page.paginator.count,
                'page': self.page.number,
                'total_pages': self.page.paginator.num_pages,
                'page_size': self.page_size,
                'has_next': self.page.has_next(),
                'has_previous': self.page.has_previous(),
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            }
        )


def get_client_ip(request):
    """클라이언트 IP 주소 가져오기"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_user_agent(request):
    """User Agent 가져오기"""
    return request.META.get('HTTP_USER_AGENT', '')


def validate_uuid(uuid_string):
    """UUID 형식 검증"""
    import uuid
    try:
        uuid.UUID(uuid_string)
        return True
    except ValueError:
        return False


def create_response(success: bool = True, 
                   message: str = "성공", 
                   data: Any = None, 
                   errors: Optional[Dict] = None, 
                   status_code: int = status.HTTP_200_OK) -> Response:
    """표준 API 응답 생성"""
    response_data = {
        "success": success,
        "message": message
    }
    
    if data is not None:
        response_data["data"] = data
    
    if errors is not None:
        response_data["errors"] = errors
    
    return Response(response_data, status=status_code)
