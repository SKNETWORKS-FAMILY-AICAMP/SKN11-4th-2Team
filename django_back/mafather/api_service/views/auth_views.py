from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.urls import reverse
from django.conf import settings
from django.views import View
from django.http import HttpResponseRedirect
from urllib.parse import urlencode
import secrets
import logging
from datetime import datetime, timezone, timedelta
from api_service.utils import create_response, get_client_ip, get_user_agent
from api_service.serializers import (
    AuthResponseSerializer, LogoutResponseSerializer, UserChildSerializer,
    CustomTokenObtainPairSerializer, UserSerializer
)
from api_service.models import User, Session, UserChild
from api_service.exceptions import AuthenticationError, ValidationError
import uuid
import requests
import json

logger = logging.getLogger(__name__)

def generate_state_token():
    """CSRF 방지를 위한 state 토큰 생성"""
    return secrets.token_urlsafe(32)


class CustomTokenObtainPairView(TokenObtainPairView):
    """커스텀 JWT 토큰 발급 뷰"""
    serializer_class = CustomTokenObtainPairSerializer


class LoginView(APIView):
    """이메일/비밀번호 로그인"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """로그인 처리"""
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            
            if not email or not password:
                return create_response(
                    success=False,
                    message="이메일과 비밀번호를 입력해주세요.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # 사용자 인증
            user = authenticate(email=email, password=password)
            if not user:
                return create_response(
                    success=False,
                    message="이메일 또는 비밀번호가 잘못되었습니다.",
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
            
            if not user.is_active:
                return create_response(
                    success=False,
                    message="비활성화된 계정입니다.",
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
            
            # JWT 토큰 생성
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            # 세션 생성
            Session.objects.filter(user=user).delete()  # 기존 세션 삭제
            Session.objects.create(
                user=user,
                token=access_token,
                device_info={'user_agent': get_user_agent(request)},
                ip_address=get_client_ip(request),
                expires_at=datetime.fromtimestamp(refresh.access_token.payload['exp'], tz=timezone.utc)
            )
            
            # 사용자 정보와 함께 응답
            response_data = {
                'access': access_token,
                'refresh': str(refresh),
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'name': user.name,
                    'profile_image': user.profile_image,
                    'is_staff': user.is_staff,
                    'auth_provider': user.auth_provider,
                    'last_login': user.last_login.isoformat() if user.last_login else None,
                    'date_joined': user.date_joined.isoformat(),
                }
            }
            
            # 로그인 시간 업데이트
            user.last_login = datetime.now(timezone.utc)
            user.save(update_fields=['last_login'])
            
            return create_response(
                success=True,
                data=response_data,
                message="로그인 성공"
            )
            
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return create_response(
                success=False,
                message="로그인 처리 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LogoutView(APIView):
    """로그아웃"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """로그아웃 처리"""
        try:
            # 리프레시 토큰 블랙리스트 추가
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except Exception as e:
                    logger.warning(f"Failed to blacklist token: {str(e)}")
            
            # 현재 사용자의 모든 세션 삭제
            Session.objects.filter(user=request.user).delete()
            
            response_data = {
                'message': '로그아웃되었습니다.'
            }
            
            return create_response(
                success=True,
                data=response_data,
                message="로그아웃되었습니다."
            )
            
        except Exception as e:
            logger.error(f"Logout error for user {request.user.id}: {str(e)}")
            return create_response(
                success=False,
                message="로그아웃 처리 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyTokenView(APIView):
    """토큰 유효성 검증"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """토큰 유효성 검증 및 사용자 정보 반환"""
        try:
            response_data = {
                'valid': True,
                'user': {
                    'id': str(request.user.id),
                    'email': request.user.email,
                    'name': request.user.name,
                    'profile_image': request.user.profile_image,
                    'is_staff': request.user.is_staff,
                    'auth_provider': request.user.auth_provider,
                    'last_login': request.user.last_login.isoformat() if request.user.last_login else None,
                    'date_joined': request.user.date_joined.isoformat(),
                }
            }
            
            return create_response(
                success=True,
                data=response_data,
                message="토큰 검증 성공"
            )
            
        except Exception as e:
            logger.error(f"Token verification error for user {request.user.id}: {str(e)}")
            return create_response(
                success=False,
                message="토큰 검증 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TokenRefreshView(APIView):
    """토큰 갱신"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """토큰 갱신 처리"""
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return create_response(
                    success=False,
                    message="리프레시 토큰이 필요합니다.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                refresh = RefreshToken(refresh_token)
                access_token = str(refresh.access_token)
                
                # 기존 세션 업데이트 또는 새 세션 생성
                user_id = refresh.payload.get('user_id')
                if user_id:
                    user_obj = User.objects.get(id=user_id)
                    Session.objects.filter(user=user_obj).delete()
                    
                    Session.objects.create(
                        user=user_obj,
                        token=access_token,
                        device_info={'user_agent': get_user_agent(request)},
                        ip_address=get_client_ip(request),
                        expires_at=datetime.fromtimestamp(refresh.access_token.payload['exp'], tz=timezone.utc)
                    )
                
                response_data = {
                    'access_token': access_token,
                    'refresh_token': str(refresh)
                }
                
                return create_response(
                    success=True,
                    data=response_data,
                    message="토큰이 갱신되었습니다."
                )
                
            except Exception as e:
                logger.error(f"Token refresh error: {str(e)}")
                return create_response(
                    success=False,
                    message="유효하지 않은 리프레시 토큰입니다.",
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            logger.error(f"Token refresh processing error: {str(e)}")
            return create_response(
                success=False,
                message="토큰 갱신 처리 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserStatusView(APIView):
    """사용자 상태 확인"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """현재 사용자 상태 확인"""
        try:
            from api_service.serializers import UserSerializer
            
            response_data = {
                'user': UserSerializer(request.user).data,
                'is_authenticated': True
            }
            
            return create_response(
                success=True,
                data=response_data,
                message="사용자 상태 조회 성공"
            )
            
        except Exception as e:
            logger.error(f"User status check error for user {request.user.id}: {str(e)}")
            return create_response(
                success=False,
                message="사용자 상태 확인 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SocialLoginRedirectView(View):
    """소셜 로그인 리다이렉트"""
    def get(self, request, provider):
        """소셜 로그인 리다이렉트 URL 생성"""
        try:
            # 소셜 로그인 제공자별 설정
            provider_config = {
                'google': {
                    'auth_url': 'https://accounts.google.com/o/oauth2/v2/auth',
                    'client_id': settings.GOOGLE_CLIENT_ID,
                    'redirect_uri': f"{settings.BASE_URL}/auth/callback",
                    'scope': 'email profile'
                },
                'kakao': {
                    'auth_url': 'https://kauth.kakao.com/oauth/authorize',
                    'client_id': settings.KAKAO_CLIENT_ID,
                    'redirect_uri': f"{settings.BASE_URL}/auth/callback",
                    'scope': 'profile_nickname profile_image account_email'
                },
                'naver': {
                    'auth_url': 'https://nid.naver.com/oauth2.0/authorize',
                    'client_id': settings.NAVER_CLIENT_ID,
                    'redirect_uri': f"{settings.BASE_URL}/auth/callback",
                    'scope': 'profile'
                }
            }

            if provider not in provider_config:
                return create_response(
                    success=False,
                    message="지원하지 않는 소셜 로그인 제공자입니다.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )

            # CSRF 방지를 위한 state 생성
            state = generate_state_token()
            request.session['oauth_state'] = state

            # 소셜 로그인 URL 생성
            config = provider_config[provider]
            auth_url = f"{config['auth_url']}?" + urlencode({
                'client_id': config['client_id'],
                'redirect_uri': config['redirect_uri'],
                'response_type': 'code',
                'scope': config['scope'],
                'state': state,
            })
            
            return HttpResponseRedirect(auth_url)

        except Exception as e:
            logger.error(f"Social login redirect error for provider {provider}: {str(e)}")
            return create_response(
                success=False,
                message="소셜 로그인 리다이렉트 URL 생성 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SocialTokenView(APIView):
    """소셜 로그인 토큰 처리"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        print(f"SocialTokenView request: {request.data}")
        try:
            provider = request.data.get('provider')
            access_token = request.data.get('access_token')
            id_token = request.data.get('id_token')
            
            logger.info(f"Social login request received:")
            logger.info(f"- Provider: {provider} (type: {type(provider)})")
            logger.info(f"- Access Token: {access_token[:20] if access_token else 'None'}...")
            logger.info(f"- Request data keys: {list(request.data.keys())}")
            
            # 필수 파라미터 검증
            if not provider:
                logger.error("Provider가 없습니다.")
                return create_response(
                    success=False,
                    message="provider가 필요합니다.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            if not isinstance(provider, str):
                logger.error(f"Provider가 문자열이 아닙니다. 타입: {type(provider)}, 값: {provider}")
                return create_response(
                    success=False,
                    message="provider는 문자열이어야 합니다.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            if not access_token:
                logger.error("Access token이 없습니다.")
                return create_response(
                    success=False,
                    message="access_token이 필요합니다.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            if not isinstance(access_token, str):
                logger.error(f"Access token이 문자열이 아닙니다. 타입: {type(access_token)}, 값: {access_token}")
                return create_response(
                    success=False,
                    message="access_token은 문자열이어야 합니다.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # provider 값 검증
            if provider not in ['google', 'kakao', 'naver']:
                logger.error(f"지원하지 않는 provider: {provider}")
                return create_response(
                    success=False,
                    message=f"지원하지 않는 소셜 로그인 제공자입니다: {provider}",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            logger.info(f"Provider 검증 완료: {provider}")
            
            # 소셜 로그인 제공자별 사용자 정보 조회
            logger.info(f"사용자 정보 조회 시작...")
            user_info = self._get_user_info(provider, access_token)
            if not user_info:
                logger.error("사용자 정보 조회 실패")
                return create_response(
                    success=False,
                    message="사용자 정보를 가져오는데 실패했습니다.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            logger.info(f"사용자 정보 조회 성공: {user_info.get('email')}")
            
            # 사용자 생성 또는 조회
            logger.info(f"사용자 생성/조회 시작...")
            user = self._get_or_create_user(provider, user_info)
            logger.info(f"사용자 생성/조회 완료: {user.id}")
            
            # JWT 토큰 생성
            logger.info(f"JWT 토큰 생성 시작...")
            refresh = RefreshToken.for_user(user)
            access_token_jwt = str(refresh.access_token)
            logger.info(f"JWT 토큰 생성 완료")
            
            # 세션 생성
            logger.info(f"세션 생성 시작...")
            Session.objects.filter(user=user).delete()  # 기존 세션 삭제
            Session.objects.create(
                user=user,
                token=access_token_jwt,
                device_info={'user_agent': get_user_agent(request)},
                ip_address=get_client_ip(request),
                expires_at=datetime.fromtimestamp(refresh.access_token.payload['exp'], tz=timezone.utc)
            )
            logger.info(f"세션 생성 완료")
            
            # 자녀 정보 조회
            children = UserChild.objects.filter(user=user)
            children_data = UserChildSerializer(children, many=True).data if children.exists() else []
            
            response_data = {
                'access': access_token_jwt,
                'refresh': str(refresh),
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'name': user.name or '',
                    'image': user.profile_image or '',
                    'auth_provider': provider,
                    'is_new_user': user.date_joined > datetime.now(timezone.utc) - timedelta(minutes=5),
                    'children': children_data
                }
            }
            
            logger.info(f"소셜 로그인 성공: {user.email}")
            return create_response(
                success=True,
                data=response_data,
                message="소셜 로그인 성공"
            )
            
        except Exception as e:
            logger.error(f"Social token processing error: {str(e)}")
            logger.error(f"Error type: {type(e)}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return create_response(
                success=False,
                message="소셜 로그인 처리 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _get_user_info(self, provider, access_token):
        """소셜 로그인 제공자별 사용자 정보 조회"""
        try:
            if provider == 'google':
                response = requests.get(
                    'https://www.googleapis.com/oauth2/v2/userinfo',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                logger.info(f"Google OAuth response status: {response.status_code}")
                logger.info(f"Google OAuth response content: {response.text}")
                
                if response.status_code == 200:
                    data = response.json()
                    if not data.get('email'):
                        logger.error("Google OAuth: 이메일 정보가 없습니다.")
                        return None
                    return {
                        'email': data['email'],
                        'name': data.get('name', ''),
                        'profile_image': data.get('picture', ''),
                    }
                else:
                    logger.error(f"Google OAuth error: {response.status_code} - {response.text}")
                    return None
            
            elif provider == 'kakao':
                response = requests.get(
                    'https://kapi.kakao.com/v2/user/me',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                logger.info(f"Kakao OAuth response status: {response.status_code}")
                logger.info(f"Kakao OAuth response content: {response.text}")
                
                if response.status_code == 200:
                    data = response.json()
                    kakao_account = data.get('kakao_account', {})
                    if not kakao_account.get('email'):
                        logger.error("Kakao OAuth: 이메일 정보가 없습니다.")
                        return None
                    return {
                        'email': kakao_account['email'],
                        'name': data.get('properties', {}).get('nickname', ''),
                        'profile_image': data.get('properties', {}).get('profile_image', ''),
                    }
                else:
                    logger.error(f"Kakao OAuth error: {response.status_code} - {response.text}")
                    return None
            
            elif provider == 'naver':
                response = requests.get(
                    'https://openapi.naver.com/v1/nid/me',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                logger.info(f"Naver OAuth response status: {response.status_code}")
                logger.info(f"Naver OAuth response content: {response.text}")
                
                if response.status_code == 200:
                    data = response.json()
                    response_data = data.get('response', {})
                    if not response_data.get('email'):
                        logger.error("Naver OAuth: 이메일 정보가 없습니다.")
                        return None
                    return {
                        'email': response_data['email'],
                        'name': response_data.get('name', ''),
                        'profile_image': response_data.get('profile_image', ''),
                    }
                else:
                    logger.error(f"Naver OAuth error: {response.status_code} - {response.text}")
                    return None
            
            logger.error(f"지원하지 않는 소셜 로그인 제공자: {provider}")
            return None
            
        except requests.RequestException as e:
            logger.error(f"Network error while fetching user info from {provider}: {str(e)}")
            return None
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error while parsing response from {provider}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error while fetching user info from {provider}: {str(e)}")
            return None
    
    def _get_or_create_user(self, provider, user_info):
        """사용자 생성 또는 조회"""
        try:
            logger.info(f"Attempting to get/create user for provider {provider} with email {user_info.get('email')}")
            
            if not user_info.get('email'):
                logger.error("이메일 정보가 없습니다.")
                raise ValidationError("이메일 정보가 필요합니다.")
            
            user = User.objects.filter(email=user_info['email']).first()
            
            if not user:
                logger.info(f"Creating new user for email {user_info['email']}")
                # 새 사용자 생성
                user = User.objects.create(
                    email=user_info['email'],
                    name=user_info.get('name', ''),
                    profile_image=user_info.get('profile_image', ''),
                    auth_provider=provider
                )
                logger.info(f"Successfully created new user with ID {user.id}")
            else:
                logger.info(f"Found existing user with ID {user.id}")
                # 기존 사용자의 경우 아무것도 업데이트하지 않고 그대로 반환
            
            return user
            
        except ValidationError as e:
            logger.error(f"Validation error while creating/fetching user: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error while creating/fetching user: {str(e)}")
            raise

class UserProfileView(APIView):
    """사용자 프로필 조회 및 수정"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """프로필 조회"""
        try:
            user = request.user
            logger.info(f"Profile request for user {user.id} ({user.email})")
            
            # 자녀 정보 조회
            children = UserChild.objects.filter(user=user)
            children_data = UserChildSerializer(children, many=True).data if children.exists() else []
            
            logger.info(f"Found {len(children_data)} children for user {user.id}")
            
            response_data = {
                'id': str(user.id),
                'email': user.email,
                'name': user.name or '',
                'profile_image': user.profile_image or '',
                'auth_provider': user.auth_provider or '',
                'is_new_user': False,  # 이미 가입된 계정이므로 항상 False
                'children': children_data
            }
            
            logger.info(f"Returning profile data for user {user.id}: {response_data['name']}")
            
            return create_response(
                success=True,
                data=response_data,
                message="사용자 프로필 조회 성공"
            )
            
        except Exception as e:
            logger.error(f"User profile fetch error for user {request.user.id}: {str(e)}")
            return create_response(
                success=False,
                message="사용자 프로필 조회 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request):
        """프로필 수정"""
        try:
            user = request.user
            name = request.data.get('name')
            
            # 이름 유효성 검사
            if not name or not name.strip():
                return create_response(
                    success=False,
                    message="이름은 필수입니다.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            if len(name.strip()) > 100:
                return create_response(
                    success=False,
                    message="이름은 100자를 초과할 수 없습니다.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # 사용자 정보 업데이트
            user.name = name.strip()
            user.save(update_fields=['name', 'updated_at'])
            
            # 업데이트된 사용자 정보 반환
            response_data = {
                'id': str(user.id),
                'email': user.email,
                'name': user.name,
                'profile_image': user.profile_image or '',
                'auth_provider': user.auth_provider or '',
                'created_at': user.created_at.isoformat(),
                'updated_at': user.updated_at.isoformat(),
            }
            
            logger.info(f"Profile updated for user {user.id}: name changed to '{user.name}'")
            
            return create_response(
                success=True,
                data=response_data,
                message="프로필이 성공적으로 업데이트되었습니다."
            )
            
        except Exception as e:
            logger.error(f"Profile update error for user {request.user.id}: {str(e)}")
            return create_response(
                success=False,
                message="프로필 업데이트 중 오류가 발생했습니다.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
