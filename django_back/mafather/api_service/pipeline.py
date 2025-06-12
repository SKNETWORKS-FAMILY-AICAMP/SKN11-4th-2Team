from api_service.models import User
from social_core.exceptions import AuthAlreadyAssociated
import logging

logger = logging.getLogger(__name__)


def create_user_profile(strategy, details, backend, user=None, *args, **kwargs):
    """
    소셜 로그인 사용자 프로필 생성 파이프라인
    """
    if user:
        return {'is_new': False}
    
    email = details.get('email')
    if not email:
        return None
    
    try:
        # 기존 사용자 확인
        existing_user = User.objects.get(email=email)
        
        # 소셜 제공자 정보 업데이트
        provider = backend.name
        if existing_user.auth_provider == 'local':
            existing_user.auth_provider = provider
            existing_user.auth_provider_id = kwargs.get('uid')
            existing_user.save()
        
        return {
            'is_new': False,
            'user': existing_user
        }
        
    except User.DoesNotExist:
        # 새 사용자 생성
        provider = backend.name
        provider_id = kwargs.get('uid')
        
        # 이름 처리
        name = details.get('fullname') or details.get('first_name', '')
        if not name and details.get('username'):
            name = details.get('username')
        
        # 프로필 이미지 처리
        profile_image = None
        if hasattr(kwargs.get('response', {}), 'get'):
            response = kwargs.get('response', {})
            if provider == 'google':
                profile_image = response.get('picture')
            elif provider == 'kakao':
                kakao_account = response.get('kakao_account', {})
                profile = kakao_account.get('profile', {})
                profile_image = profile.get('profile_image_url')
            elif provider == 'naver':
                naver_response = response.get('response', {})
                profile_image = naver_response.get('profile_image')
        
        new_user = User.objects.create_user(
            email=email,
            name=name or email.split('@')[0],
            auth_provider=provider,
            auth_provider_id=provider_id,
            profile_image=profile_image,
            is_active=True
        )
        
        logger.info(f"새 소셜 사용자 생성: {email} ({provider})")
        
        return {
            'is_new': True,
            'user': new_user
        }
        
    except Exception as e:
        logger.error(f"소셜 로그인 파이프라인 오류: {str(e)}")
        return None
