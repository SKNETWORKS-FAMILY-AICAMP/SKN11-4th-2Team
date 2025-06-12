# chatbot/chains.py (목적에 맞게 재구성)
from typing import Dict, Any, List
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from .models import ChatSession, ChatMessage
from django.utils import timezone
import os
import httpx
import json
import logging
import uuid

logger = logging.getLogger(__name__)

# 환경 변수에서 API 키 가져오기
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EXTERNAL_SERVER_URL = os.getenv("EXTERNAL_SERVER_URL", "http://127.0.0.1:8080")

# 기본 LLM 설정
llm = ChatOpenAI(
    model="gpt-4.1",
    temperature=0.7,
    api_key=OPENAI_API_KEY,
    max_tokens=800,
    request_timeout=20
)

# 1단계: 육아 관련성 판단 프롬프트
parenting_classifier_prompt = ChatPromptTemplate.from_messages([
    ("system", """당신은 질문의 주제를 분류하는 전문가입니다.
    주어진 질문이 육아와 관련된 것인지 판단해주세요.
    
    육아 관련 주제: 아기, 신생아, 유아, 수유, 이유식, 기저귀, 수면, 발달, 성장, 놀이, 교육, 건강, 안전, 예방접종 등
    
    응답은 반드시 다음 JSON 형식으로 해주세요:
    {{"is_parenting": true}} 또는 {{"is_parenting": false}}"""),
    ("human", "{question}")
])

parenting_classifier_chain = (
    parenting_classifier_prompt 
    | llm 
    | StrOutputParser()
)

# 2단계: 육아 질문의 세부 카테고리 판단 프롬프트
category_classifier_prompt = ChatPromptTemplate.from_messages([
    ("system", """당신은 육아 관련 질문을 세부 카테고리로 분류하는 전문가입니다.
    주어진 질문이 다음 중 어떤 카테고리에 속하는지 판단해주세요:
    
    - sleep: 수면, 잠, 밤잠, 낮잠, 수면패턴, 잠투정 관련
    - development: 발달, 성장, 월령, 언어발달, 운동발달, 인지발달 관련
    - other: 그 외 육아 관련 (수유, 이유식, 건강, 놀이, 교육 등)
    
    응답은 반드시 다음 JSON 형식으로 해주세요:
    {{"category": "sleep"}} 또는 {{"category": "development"}} 또는 {{"category": "other"}}"""),
    ("human", "{question}")
])

category_classifier_chain = (
    category_classifier_prompt 
    | llm 
    | StrOutputParser()
)

# 3단계: 일반 육아 상담 프롬프트
parenting_expert_prompt = ChatPromptTemplate.from_messages([
    ("system", """당신은 전문적인 육아 상담 AI 어시스턴트입니다.

    전문 분야:
    - 0~24개월 영유아 육아 전반
    - 수유, 이유식, 영양 관리
    - 건강 관리 및 안전
    - 놀이, 교육, 정서 발달
    
    답변 가이드라인:
    1. 따뜻하고 공감적인 톤으로 답변
    2. 과학적이고 신뢰할 수 있는 정보 제공
    3. 실용적이고 구체적인 조언 제공
    4. 의료적 응급상황 시 병원 방문 권유
    5. 개별 아기의 차이를 인정
    
    응답 형식:
    - 반드시 마크다운 형식으로 답변해주세요
    - 제목은 ## (h2) 태그를 사용
    - 중요 내용은 **굵게** 표시
    - 목록은 - 또는 1. 2. 3. 형식 사용
    - 참고사항은 > 인용구 형식 사용
    
    이전 대화:
    {chat_history}
    
    한국어로 간결하고 도움이 되는 답변을 마크다운 형식으로 제공해주세요."""),
    ("human", "{input}")
])

# 메모리 관리를 위한 클래스 추가
class ChatSession:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        self.chain = ConversationChain(
            llm=llm,
            memory=self.memory,
            prompt=parenting_expert_prompt,
            verbose=True
        )
        self.messages = []  # 대화 내역 저장용 리스트

    def add_message(self, role: str, content: str, category: str = None, is_parenting_related: bool = True):
        self.messages.append({
            'role': role,
            'content': content,
            'category': category,
            'is_parenting_related': is_parenting_related,
            'created_at': timezone.now()
        })

# 세션 관리를 위한 클래스
class SessionManager:
    def __init__(self):
        self.sessions = {}
    
    def get_session(self, session_id: str) -> ChatSession:
        if session_id not in self.sessions:
            self.sessions[session_id] = ChatSession(session_id)
        return self.sessions[session_id]
    
    async def save_session(self, session_id: str):
        """세션의 대화 내역을 데이터베이스에 저장"""
        if session_id not in self.sessions:
            return

        chat_session = self.sessions[session_id]
        
        try:
            # ChatSession 모델 저장
            db_session, created = ChatSession.objects.get_or_create(
                session_id=session_id,
                defaults={'is_active': True}
            )
            
            # ChatMessage 모델에 메시지 저장
            for msg in chat_session.messages:
                ChatMessage.objects.create(
                    session=db_session,
                    role=msg['role'],
                    content=msg['content'],
                    category=msg.get('category'),
                    is_parenting_related=msg.get('is_parenting_related', True)
                )
            
            # 세션 비활성화
            db_session.is_active = False
            db_session.save()
            
            # 메모리에서 세션 제거
            del self.sessions[session_id]
            
            logger.info(f"세션 {session_id}의 대화 내역이 저장되었습니다.")
            
        except Exception as e:
            logger.error(f"세션 저장 중 오류 발생: {str(e)}")
            raise

# 세션 매니저 인스턴스 생성
session_manager = SessionManager()

# 4단계: 비육아 질문 안내 프롬프트
non_parenting_prompt = ChatPromptTemplate.from_messages([
    ("system", """당신은 육아 전문 상담 AI입니다.
    육아와 관련되지 않은 질문을 받았을 때, 정중하게 육아 관련 질문을 요청하는 메시지를 제공하세요.
    
    따뜻하고 친근한 톤으로 육아 상담 서비스임을 안내하고, 어떤 육아 고민이 있는지 물어보세요."""),
    ("human", "사용자가 다음과 같은 비육아 질문을 했습니다: {question}")
])

non_parenting_chain = (
    non_parenting_prompt 
    | llm 
    | StrOutputParser()
)

# 외부 API 호출 함수들
async def call_sleep_development_server(question: str, chat_history: List[Dict[str, str]], category: str) -> str:
    """수면/발달 전문 서버에 요청"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{EXTERNAL_SERVER_URL}/tuning",
                json={
                    "message": question
                }
            )
            response.raise_for_status()
            result = response.json()
            return result.get("response", "외부 서버에서 응답을 받지 못했습니다.")
    except Exception as e:
        logger.error(f"수면/발달 서버 통신 오류: {str(e)}")
        return "죄송합니다. 수면/발달 전문 상담 서비스가 일시적으로 이용 불가합니다."

async def call_doc_server(question: str, chat_history: List[Dict[str, str]]) -> Dict[str, Any]:
    """문서 기반 벡터 DB 서버에 요청"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{EXTERNAL_SERVER_URL}/vector",
                json={
                    "message": question
                }
            )
            response.raise_for_status()
            result = response.json()
            return {
                "answer": result.get("response", "문서 검색 결과를 찾을 수 없습니다."),
                "sources": []
            }
    except Exception as e:
        logger.error(f"문서 서버 통신 오류: {str(e)}")
        return {
            "answer": "죄송합니다. 문서 검색 서비스가 일시적으로 이용 불가합니다.",
            "sources": []
        }

async def call_openai_server(question: str, chat_history: List[Dict[str, str]]) -> str:
    """일반 육아 상담 서버에 요청"""
    try:
        # LangChain 프롬프트로 질문 가공
        formatted_history = format_chat_history(chat_history)
        formatted_question = session_manager.get_session(session_id).chain.invoke({
            "question": question,
            "chat_history": formatted_history
        })

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{EXTERNAL_SERVER_URL}/openai",
                json={
                    "message": formatted_question
                }
            )
            response.raise_for_status()
            result = response.json()
            return result.get("response", "외부 서버에서 응답을 받지 못했습니다.")
    except Exception as e:
        logger.error(f"일반 육아 상담 서버 통신 오류: {str(e)}")
        return "죄송합니다. 일반 육아 상담 서비스가 일시적으로 이용 불가합니다."

def format_chat_history(chat_history: List[Dict[str, str]]) -> str:
    """채팅 히스토리를 더 자연스럽게 포맷팅"""
    if not chat_history:
        return "첫 상담입니다."
    
    formatted_history = []
    # 최근 4개 대화만 사용 (너무 길면 응답 품질 저하)
    recent_history = chat_history[-8:] if len(chat_history) > 8 else chat_history
    
    for i, msg in enumerate(recent_history):
        if msg.get("type") == "user":
            # 사용자 메시지를 더 자연스럽게 표현
            formatted_history.append(f"부모님 질문: {msg.get('message', '')[:200]}")
        elif msg.get("type") == "ai":
            # AI 응답도 간략하게 요약
            formatted_history.append(f"상담사 답변: {msg.get('message', '')[:150]}...")
    
    if len(formatted_history) > 6:  # 최대 3번의 대화만 유지
        formatted_history = formatted_history[-6:]
    
    return "\n".join(formatted_history)

def parse_llm_json_response(response_text: str) -> Dict[str, Any]:
    """LLM의 JSON 응답을 안전하게 파싱"""
    try:
        # JSON 블록 추출 시도
        import re
        json_match = re.search(r'\{[^}]*\}', response_text)
        if json_match:
            return json.loads(json_match.group())
        else:
            # JSON이 없으면 기본값 반환
            return {}
    except:
        return {}

# 메인 처리 함수
async def process_question(
    question: str, 
    chat_history: List[Dict[str, str]] = None, 
    websocket_type: str = "ai_expert",
    session_id: str = None,
) -> Dict[str, Any]:
    """질문 처리 메인 함수"""
    
    if not session_id:
        raise ValueError("session_id는 필수값입니다.")
    
    # doc 타입인 경우 세션 관리 없이 직접 처리
    if websocket_type == "doc":
        try:
            result = await call_doc_server(question, [])  # 빈 chat_history 전달
            return {
                "answer": result.get("answer", "문서 검색 결과를 찾을 수 없습니다."),
                "sources": result.get("sources", []),
                "is_parenting_related": True,
                "category": "doc",
                "session_id": session_id
            }
        except Exception as e:
            logger.error(f"문서 서버 통신 오류: {str(e)}")
            return {
                "answer": "죄송합니다. 문서 검색 서비스가 일시적으로 이용 불가합니다.",
                "sources": [],
                "is_parenting_related": True,
                "session_id": session_id
            }
    
    # doc 타입이 아닌 경우에만 세션 관리 및 대화 기록
    chat_session = session_manager.get_session(session_id)
    chat_session.add_message('user', question)
    
    try:
        # 1단계: 육아 관련성 판단
        logger.info("1단계: 육아 관련성 판단 중...")
        parenting_result = parenting_classifier_chain.invoke({"question": question})
        parenting_data = parse_llm_json_response(parenting_result)
        is_parenting = parenting_data.get("is_parenting", False)
        logger.info(f"육아 관련성 판단 결과: {is_parenting}")
        
        if not is_parenting:
            # 비육아 질문 - 안내 메시지
            logger.info("비육아 질문으로 판단 - 안내 메시지 생성")
            answer = non_parenting_chain.invoke({"question": question})
            chat_session.add_message('ai', answer, is_parenting_related=False)
            return {
                "answer": answer,
                "sources": [],
                "is_parenting_related": False,
                "session_id": session_id
            }
        
        # 2단계: 육아 질문의 세부 카테고리 판단
        logger.info("2단계: 세부 카테고리 판단 중...")
        category_result = category_classifier_chain.invoke({"question": question})
        category_data = parse_llm_json_response(category_result)
        category = category_data.get("category", "other")
        logger.info(f"카테고리 판단 결과: {category}")
        
        if category in ["sleep", "development"]:
            # 3-1단계: 수면/발달 전문 서버로 요청
            logger.info(f"{category} 전문 서버로 요청 중...")
            answer = await call_sleep_development_server(question, chat_history, category)
        else:
            # 3-2단계: 일반 육아 상담 (메모리를 사용한 체인)
            logger.info("일반 육아 상담으로 처리 중...")
            response = chat_session.chain.predict(input=question)
            answer = response
        
        # AI 응답 저장
        chat_session.add_message('ai', answer, category, is_parenting_related=True)
        
        return {
            "answer": answer,
            "sources": [],
            "is_parenting_related": True,
            "category": category,
            "session_id": session_id
        }
    
    except Exception as e:
        error_message = "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해 주세요."
        chat_session.add_message('ai', error_message, is_parenting_related=True)
        logger.error(f"질문 처리 중 오류 발생: {str(e)}")
        return {
            "answer": error_message,
            "sources": [],
            "is_parenting_related": True,
            "session_id": session_id
        }
