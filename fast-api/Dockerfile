# 1. PyTorch + Transformers 호환 가능한 공식 이미지 기반
FROM python:3.10-slim

# 2. 작업 디렉토리 설정
WORKDIR /fast-api

# 3. 의존성 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. 코드 복사
COPY . .

# 5. 포트 열기
EXPOSE 8080

# 6. 실행 명령 (uvicorn)
CMD ["uvicorn", "fast-api.main:app", "--host", "0.0.0.0", "--port", "8080"]
