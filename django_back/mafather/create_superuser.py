import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mafather.settings')
django.setup()

from api_service.models import User

def create_superuser():
    try:
        superuser = User.objects.create_superuser(
            email='admin@mafather.com',
            name='관리자',
            auth_provider='google',
            is_staff=True,
            is_superuser=True,
            is_active=True
        )
        superuser.set_password('Admin1234!@#$')
        superuser.save()
        print('슈퍼유저가 성공적으로 생성되었습니다!')
        print('이메일:', superuser.email)
        print('비밀번호: Admin1234!@#$')
    except Exception as e:
        print('슈퍼유저 생성 중 오류 발생:', str(e))

if __name__ == '__main__':
    create_superuser() 