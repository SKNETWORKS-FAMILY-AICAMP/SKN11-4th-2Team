import logging
import sys
import traceback
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from service.chatbot import LGExaoneAdvancedChatbot
from service.vectordb import FaissCommand
from service.faiss_chatbot import async_faiss_chat, FAISSChatbotService
from service.openai_chatbot import async_memory_chat, MemoryChatbotService

# 로깅 설정
log_dir = "log"
log_file = "fastapi.log"
log_path = os.path.join(log_dir, log_file)

if not os.path.exists(log_dir):
    os.makedirs(log_dir)  # log 디렉토리 생성

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(log_path, encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

chatbot = LGExaoneAdvancedChatbot()
faiss_db = FaissCommand()

# 이모지 대체 함수
def replace_emoji(text: str) -> str:
    emoji_map = {
        "🔗": "[CONNECT]",
        "✅": "[SUCCESS]",
        "📡": "[HTTP]",
        "❌": "[ERROR]",
        "🤖": "[AI]",
        "📨": "[MESSAGE]",
        "🧹": "[CLEANUP]"
    }
    for emoji, replacement in emoji_map.items():
        text = text.replace(emoji, replacement)
    return text

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ⏳ 서버 시작 시 실행
    print('서버 실행')
    chatbot.load_model()
    print('모델 로드')
    faiss_db.handle()
    print('파이어스')

    yield

faiss_chatbot_service = FAISSChatbotService()
memory_chatbot_service = MemoryChatbotService()

# FastAPI 앱 생성
app = FastAPI(
    title="Enhanced Special Chat API",
    description="LG Exaone AI 기반 소아과 전문 채팅봇",
    version="2.0.0",
    lifespan=lifespan
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 요청 스키마 정의
class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {
        "message": "Enhanced Special Chat API with LG Exaone AI",
        "version": "2.0.0",
        "status": "running",
        "features": [
            "POST 방식 챗봇 API",
            "세션별 대화 기록 관리",
            "LG Exaone AI 응답 생성"
        ]
    }

@app.post("/tuning")
async def chatbot_response(payload: ChatRequest):
    user_input = payload.message.strip()

    if not user_input:
        raise HTTPException(status_code=400, detail="메시지가 비어 있습니다.")

    try:
        # 모델을 통해 응답 생성
        bot_response = chatbot.generate_response(user_input)

        return {
            "response": bot_response
        }

    except Exception as e:
        logger.error(f"응답 생성 실패: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="AI 응답 생성 중 오류가 발생했습니다.")
    
@app.post("/vector")
async def faiss_chat_endpoint(payload: ChatRequest):
    """
    POST 방식으로 FAISS 기반 GPT-4o 챗봇 응답 반환
    요청 예시: { "message": "3개월 아기 수유 간격 알려줘요" }
    """
    user_input = payload.message.strip()

    if not user_input:
        return {
            "error": "질문이 비어 있습니다.",
            "status": "fail"
        }

    result = faiss_chatbot_service.chat(user_input)

    return {
        "response": result.get("answer")
    }

@app.post("/openai")
async def memory_chat_endpoint(payload: ChatRequest):
    """
    POST 방식으로 GPT-4o Memory 챗봇 응답 반환
    요청 예시: { "message": "3개월 아기 수면시간이 궁금해요" }
    """
    user_input = payload.message.strip()

    if not user_input:
        return {
            "error": "질문이 비어 있습니다.",
            "status": "fail"
        }

    result = memory_chatbot_service.chat(user_input)

    return {
        "response": result.get("answer")
    }