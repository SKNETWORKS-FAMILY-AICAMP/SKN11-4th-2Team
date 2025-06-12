#!/bin/bash

# Django 마이그레이션 스크립트
echo "발달 모니터링 API 마이그레이션을 시작합니다..."

# 가상환경 활성화 (필요시)
# source venv/bin/activate

# 마이그레이션 파일 생성
echo "1. 마이그레이션 파일 생성 중..."
python manage.py makemigrations api_service
python manage.py makemigrations token_blacklist  # JWT 블랙리스트 마이그레이션 추가

# 마이그레이션 실행
echo "2. 마이그레이션 실행 중..."
python manage.py migrate

# 슈퍼유저 생성 (이미 있는 경우 스킵)
echo "3. 슈퍼유저 확인 중..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    print('슈퍼유저가 없습니다. 생성해주세요.')
else:
    print('슈퍼유저가 이미 존재합니다.')
"

echo "마이그레이션이 완료되었습니다!"
