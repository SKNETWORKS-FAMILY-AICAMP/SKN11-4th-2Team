"""
Memory 기반 GPT-4o 챗봇 서비스

벡터DB 없이 GPT-4o 내장 지식만 사용하는 순수 대화형 챗봇
"""

import os
import asyncio
from typing import List, Dict, Any
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

load_dotenv()


class MemoryChatbotService:
    """Memory 기반 GPT-4o 챗봇 서비스 (DB 미사용, API 전용)"""
    
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.llm = None
        self.chain = None
        self.chat_history = []  # 메모리 기반 히스토리 관리
        self._initialize()

    def _initialize(self):
        """Memory 챗봇 시스템 초기화"""
        try:
            # GPT-4o 모델 초기화
            self.llm = ChatOpenAI(
                model="gpt-4o",
                temperature=0.7,
                openai_api_key=self.openai_api_key,
                max_tokens=1500
            )
            
            # Memory 기반 프롬프트 템플릿 (벡터DB 없이)
            prompt_template = ChatPromptTemplate.from_messages([
                ("system", """당신은 **Memory 기반** 육아 전문 AI 어시스턴트입니다. 💾

🧠 **시스템 특징:**
• GPT-4o의 강력한 내장 지식 활용
• 벡터 데이터베이스 없는 순수 대화형
• 실시간 대화 기록 기반 개인화된 상담
• 0~36개월 영유아 육아 전문

👥 **상담 스타일:**
• 따뜻하고 공감적인 대화
• 과학적 근거에 기반한 신뢰할 수 있는 정보
• 개별 아기의 차이와 다양성 인정
• 이전 대화 맥락을 활용한 연속적 상담

⚠️ **안전 우선:**
• 의료적 응급상황 시 즉시 병원 방문 권고
• 일반적인 가이드라인임을 명시
• 전문의 상담 필요시 안내

💬 **이전 대화 기록:**
{chat_history}

🎯 **응답 가이드:**
1. 내장된 육아 지식과 경험을 바탕으로 답변
2. 이전 대화 내용을 참고하여 일관성 있는 상담 제공
3. 부모의 감정에 공감하며 실용적 조언 제공
4. 단계별 설명이나 체크리스트 제공
5. 전문적이지만 이해하기 쉬운 언어 사용
6. 육아 외 질문은 정중히 거절하고 육아 상담으로 유도
7. 사용자의 이전 질문과 상황을 기억하여 개인화된 답변 제공"""),
                ("user", "{question}")
            ])
            
            # 출력 파서 및 체인 구성
            output_parser = StrOutputParser()
            self.chain = prompt_template | self.llm | output_parser
            
            print("✅ Memory 기반 챗봇 서비스 초기화 완료")
            
        except Exception as e:
            print(f"❌ Memory 챗봇 서비스 초기화 오류: {str(e)}")
            raise

    def chat(self, question: str):
        """Memory 기반 채팅 메시지 처리"""
        try:
            # 이전 대화 기록을 문자열로 변환
            history_text = self._format_chat_history()
            
            # 체인 실행
            response = self.chain.invoke({
                "chat_history": history_text,
                "question": question
            })
            
            # 대화 기록에 추가
            self._add_to_history(question, response)
            
            return {
                "answer": response,
                "source_documents": [],  # 메모리 기반이므로 소스 문서 없음
                "is_parenting_related": True,
                "search_method": "memory_only",
                "context_length": len(history_text),
                "vectordb_type": "Memory",
                "chat_mode": "api_only"
            }
            
        except Exception as e:
            error_msg = f"죄송합니다. Memory 기반 처리 중 오류가 발생했습니다: {str(e)}"
            return {
                "answer": error_msg,
                "source_documents": [],
                "is_parenting_related": True,
                "error": str(e),
                "search_method": "memory_error",
                "vectordb_type": "Memory"
            }

    async def async_chat(self, question: str):
        """비동기 Memory 기반 채팅 처리 (웹소켓용)"""
        try:
            # 이전 대화 기록을 문자열로 변환
            history_text = self._format_chat_history()
            
            # 비동기 LLM 호출
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.chain.invoke({
                    "chat_history": history_text,
                    "question": question
                })
            )
            
            # 대화 기록에 추가
            self._add_to_history(question, response)
            
            return {
                "answer": response,
                "source_documents": [],  # 메모리 기반이므로 소스 문서 없음
                "is_parenting_related": True,
                "search_method": "memory_async",
                "context_length": len(history_text),
                "vectordb_type": "Memory",
                "chat_mode": "websocket"
            }
            
        except Exception as e:
            error_msg = f"죄송합니다. 비동기 Memory 처리 중 오류가 발생했습니다: {str(e)}"
            return {
                "answer": error_msg,
                "source_documents": [],
                "is_parenting_related": True,
                "error": str(e),
                "search_method": "memory_async_error",
                "vectordb_type": "Memory"
            }

    def _add_to_history(self, question: str, response: str):
        """대화 기록에 추가"""
        self.chat_history.append({"role": "user", "content": question})
        self.chat_history.append({"role": "assistant", "content": response})
        
        # 최근 20개 메시지만 유지 (10개 대화)
        if len(self.chat_history) > 20:
            self.chat_history = self.chat_history[-20:]

    def _format_chat_history(self) -> str:
        """채팅 히스토리를 문자열로 포맷팅"""
        if not self.chat_history:
            return "이전 대화가 없습니다."
        
        formatted_history = []
        for message in self.chat_history[-10:]:  # 최근 10개 메시지만
            if message["role"] == "user":
                formatted_history.append(f"사용자: {message['content']}")
            elif message["role"] == "assistant":
                formatted_history.append(f"Memory AI: {message['content']}")
        
        return "\n".join(formatted_history)

    def clear_memory(self):
        """대화 메모리 초기화"""
        self.chat_history = []

    def get_chat_history(self) -> List[Dict[str, str]]:
        """현재 세션의 채팅 히스토리 반환"""
        return self.chat_history.copy()

    def set_memory_from_history(self, chat_history: List[Dict[str, str]]):
        """기존 채팅 히스토리로 메모리 설정"""
        self.chat_history = chat_history.copy()
        
        # 최근 20개 메시지만 유지
        if len(self.chat_history) > 20:
            self.chat_history = self.chat_history[-20:]

    def get_service_status(self):
        """Memory 기반 서비스 상태 정보 반환"""
        try:
            return {
                "status": "healthy",
                "vectordb_type": "Memory",
                "llm_model": "gpt-4o",
                "embedding_model": "none",
                "memory_only": True,
                "api_only": True,
                "chat_history_length": len(self.chat_history),
                "max_history_length": 20,
                "chat_mode": "memory_based"
            }
        except Exception as e:
            return {
                "status": "error",
                "vectordb_type": "Memory",
                "error": str(e),
                "chat_history_length": len(self.chat_history)
            }

    # 추가 Memory 기반 기능들

    def get_conversation_summary(self) -> str:
        """현재 세션의 대화 요약 생성"""
        if not self.chat_history:
            return "대화 기록이 없습니다."
        
        # 간단한 대화 요약
        user_messages = [msg for msg in self.chat_history if msg['role'] == 'user']
        if user_messages:
            topics = []
            for msg in user_messages[-5:]:  # 최근 5개 사용자 메시지
                content = msg['content'][:50]
                topics.append(content)
            
            return f"최근 대화 주제: {', '.join(topics)}"
        
        return "사용자 메시지가 없습니다."

    def get_memory_stats(self):
        """Memory 통계 정보"""
        user_messages = [msg for msg in self.chat_history if msg['role'] == 'user']
        assistant_messages = [msg for msg in self.chat_history if msg['role'] == 'assistant']
        
        return {
            "total_messages": len(self.chat_history),
            "user_messages": len(user_messages),
            "assistant_messages": len(assistant_messages),
            "memory_usage": "in_memory_only",
            "persistence": False,
            "max_capacity": 20
        }


# 편의 함수들

def create_memory_chatbot() -> MemoryChatbotService:
    """Memory 기반 챗봇 서비스 생성"""
    return MemoryChatbotService()


async def async_memory_chat(question: str):
    """비동기 Memory 기반 채팅 편의 함수"""
    service = create_memory_chatbot()
    return await service.async_chat(question)


def sync_memory_chat(question: str):
    """동기 Memory 기반 채팅 편의 함수"""
    service = create_memory_chatbot()
    return service.chat(question)


if __name__ == "__main__":
    # Memory 챗봇 테스트
    print("=== Memory 기반 챗봇 서비스 테스트 ===")
    
    try:
        service = create_memory_chatbot()
        print("✅ Memory 챗봇 서비스 초기화 성공")
        
        # 상태 정보
        status = service.get_service_status()
        print(f"📊 상태: {status}")
        
        # 연속 대화 테스트
        test_questions = [
            "안녕하세요! 3개월 아기 엄마인데 수유 간격이 궁금해요",
            "방금 전에 물어본 아기가 밤에 자주 깨서 힘들어요",
            "감사합니다. 앞서 말씀해주신 수유 간격을 지키려면 어떻게 해야 할까요?"
        ]
        
        for i, question in enumerate(test_questions, 1):
            print(f"\n🤔 질문 {i}: {question}")
            result = service.chat(question)
            print(f"🤖 답변: {result['answer'][:100]}...")
            print(f"💾 히스토리 길이: {len(service.chat_history)}")
            
        # 대화 요약
        summary = service.get_conversation_summary()
        print(f"\n📋 대화 요약: {summary}")
        
        # Memory 통계
        stats = service.get_memory_stats()
        print(f"📈 Memory 통계: {stats}")
            
    except Exception as e:
        print(f"❌ Memory 챗봇 테스트 실패: {e}")
