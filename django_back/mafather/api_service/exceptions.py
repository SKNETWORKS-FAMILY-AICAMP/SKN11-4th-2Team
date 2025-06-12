from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.http import Http404
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """커스텀 예외 처리기"""
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response_data = {
            'success': False,
            'message': '오류가 발생했습니다.',
            'errors': None
        }
        
        if isinstance(exc, ValidationError):
            custom_response_data['message'] = '입력 데이터가 올바르지 않습니다.'
            custom_response_data['errors'] = exc.message_dict if hasattr(exc, 'message_dict') else str(exc)
        elif isinstance(exc, Http404):
            custom_response_data['message'] = '요청하신 리소스를 찾을 수 없습니다.'
        elif hasattr(exc, 'detail'):
            if isinstance(exc.detail, dict):
                custom_response_data['errors'] = exc.detail
                # 첫 번째 에러 메시지를 메인 메시지로 사용
                for field, messages in exc.detail.items():
                    if isinstance(messages, list) and messages:
                        custom_response_data['message'] = f'{field}: {messages[0]}'
                        break
                    elif isinstance(messages, str):
                        custom_response_data['message'] = f'{field}: {messages}'
                        break
            elif isinstance(exc.detail, list):
                custom_response_data['message'] = exc.detail[0] if exc.detail else '오류가 발생했습니다.'
            else:
                custom_response_data['message'] = str(exc.detail)
        
        # 로깅
        logger.error(f"API Exception: {exc}", exc_info=True)
        
        response.data = custom_response_data
    
    return response


class CustomAPIException(Exception):
    """커스텀 API 예외"""
    def __init__(self, message, status_code=status.HTTP_400_BAD_REQUEST, errors=None):
        self.message = message
        self.status_code = status_code
        self.errors = errors
        super().__init__(message)


class AuthenticationError(CustomAPIException):
    """인증 오류"""
    def __init__(self, message="인증이 필요합니다."):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)


class PermissionError(CustomAPIException):
    """권한 오류"""
    def __init__(self, message="권한이 없습니다."):
        super().__init__(message, status.HTTP_403_FORBIDDEN)


class NotFoundError(CustomAPIException):
    """리소스 없음 오류"""
    def __init__(self, message="요청하신 리소스를 찾을 수 없습니다."):
        super().__init__(message, status.HTTP_404_NOT_FOUND)


class ValidationError(CustomAPIException):
    """유효성 검사 오류"""
    def __init__(self, message="입력 데이터가 올바르지 않습니다.", errors=None):
        super().__init__(message, status.HTTP_400_BAD_REQUEST, errors)
