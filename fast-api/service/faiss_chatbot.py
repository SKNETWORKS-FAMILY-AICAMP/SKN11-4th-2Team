"""
FAISS 전용 RAG 챗봇 서비스

FAISS만을 사용하는 독립적인 챗봇 서비스
"""

import os
import asyncio
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain_community.vectorstores import FAISS
from langchain.schema import Document

load_dotenv()

class FAISSChatbotService:
    """FAISS 전용 RAG 챗봇 서비스"""
    
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.embedding_model = None
        self.faiss_vectorstore = None
        self.llm = None
        self.chain = None
        self.chat_history = []
        self._initialize()

    def _initialize(self):
        """FAISS 전용 RAG 시스템 초기화"""
        try:
            # OpenAI 임베딩 모델 초기화
            self.embedding_model = OpenAIEmbeddings(
                model="text-embedding-3-small",
                openai_api_key=self.openai_api_key
            )
            
            # FAISS 로드
            self._load_faiss()
            
            # GPT-4o 모델 초기화
            self.llm = ChatOpenAI(
                model="gpt-4o",
                temperature=0.7,
                openai_api_key=self.openai_api_key,
                max_tokens=1500
            )
            
            # FAISS 전용 프롬프트 템플릿
            prompt_template = ChatPromptTemplate.from_messages([
                ("system", """당신은 **FAISS 기반** 육아 전문 상담 AI 어시스턴트입니다.

⚡ **시스템 특징:**
• FAISS (Facebook AI Similarity Search) 벡터 데이터베이스 전용
• 고속 근사 최근접 이웃 검색 (Approximate Nearest Neighbor)
• 대규모 벡터 데이터에 최적화된 빠른 검색
• 0~36개월 영유아 육아 전문

👥 **상담 스타일:**
• 따뜻하고 공감적인 대화
• 과학적 근거에 기반한 신뢰할 수 있는 정보
• 개별 아기의 차이와 다양성 인정

⚠️ **안전 우선:**
• 의료적 응급상황 시 즉시 병원 방문 권고
• 일반적인 가이드라인임을 명시
• 전문의 상담 필요시 안내

📚 **FAISS 참고자료:**
{context}

💬 **이전 대화:**
{chat_history}

🎯 **응답 가이드:**
1. FAISS에서 검색된 참고자료를 바탕으로 답변
2. 부모의 감정에 공감하며 실용적 조언 제공
3. 단계별 설명이나 체크리스트 제공
4. 전문적이지만 이해하기 쉬운 언어 사용
5. 육아 외 질문은 정중히 거절하고 육아 상담으로 유도"""),
                ("user", "{question}")
            ])
            
            # 출력 파서 및 체인 구성
            output_parser = StrOutputParser()
            self.chain = prompt_template | self.llm | output_parser
            
            print("✅ FAISS 챗봇 서비스 초기화 완료")
            
        except Exception as e:
            print(f"❌ FAISS 챗봇 서비스 초기화 오류: {str(e)}")
            raise

    def _load_faiss(self):
        """FAISS 벡터스토어 로드"""
        try:
            # vectordb 앱의 faiss_db 경로
            app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            faiss_dir = os.path.join(app_dir, "vector_store","faiss_db")
            print(os.path.exists(faiss_dir))
            if os.path.exists(faiss_dir):
                self.faiss_vectorstore = FAISS.load_local(
                    faiss_dir, 
                    self.embedding_model
                )
                doc_count = self._get_faiss_doc_count()
                print(f"✅ FAISS 로드 성공: {faiss_dir} (문서 수: {doc_count})")
            else:
                print(f"⚠️ FAISS를 찾을 수 없습니다: {faiss_dir}")
                raise FileNotFoundError(f"FAISS 경로가 존재하지 않습니다: {faiss_dir}")
                
        except Exception as e:
            print(f"❌ FAISS 로드 오류: {str(e)}")
            raise

    def _get_faiss_doc_count(self) -> int:
        """FAISS 문서 수 조회"""
        try:
            if self.faiss_vectorstore:
                return self.faiss_vectorstore.index.ntotal
        except:
            pass
        return 0

    def search_faiss(self, query: str, k: int = 8) -> List[Document]:
        """FAISS에서 문서 검색"""
        if not self.faiss_vectorstore:
            print("⚠️ FAISS가 로드되지 않았습니다.")
            return []
        
        try:
            results = self.faiss_vectorstore.similarity_search(query, k=k)
            print(f"🔍 FAISS 검색 결과: {len(results)}개 문서")
            return results
        except Exception as e:
            print(f"❌ FAISS 검색 오류: {e}")
            return []

    def search_faiss_with_scores(self, query: str, k: int = 8) -> List[tuple]:
        """FAISS에서 점수와 함께 문서 검색"""
        if not self.faiss_vectorstore:
            print("⚠️ FAISS가 로드되지 않았습니다.")
            return []
        
        try:
            results = self.faiss_vectorstore.similarity_search_with_score(query, k=k)
            print(f"🔍 FAISS 점수 검색 결과: {len(results)}개 문서")
            return results
        except Exception as e:
            print(f"❌ FAISS 점수 검색 오류: {e}")
            return []

    def chat(self, question: str) -> Dict[str, Any]:
        """FAISS 기반 채팅"""
        try:
            # FAISS 검색 (점수와 함께)
            search_results = self.search_faiss_with_scores(question, k=8)
            
            if not search_results:
                return {
                    "answer": "죄송합니다. FAISS에서 관련 자료를 찾을 수 없습니다. 다른 키워드로 다시 질문해 주세요.",
                    "source_documents": [],
                    "is_parenting_related": True,
                    "search_method": "faiss_empty"
                }
            
            # Document와 점수 분리
            relevant_docs = [doc for doc, score in search_results]
            scores = [score for doc, score in search_results]
            
            # 컨텍스트 구성 (점수 정보 포함)
            context = self._build_context_with_scores(search_results)
            
            # 대화 기록 포맷팅
            history_text = self._format_chat_history()
            
            # LLM 호출
            response = self.chain.invoke({
                "context": context,
                "chat_history": history_text,
                "question": question
            })
            
            # 대화 기록에 추가
            self._add_to_history(question, response)
            
            return {
                "answer": response,
                "source_documents": relevant_docs,
                "similarity_scores": scores,
                "is_parenting_related": True,
                "search_method": "faiss",
                "context_length": len(context),
                "vectordb_type": "FAISS"
            }
            
        except Exception as e:
            error_msg = f"FAISS 챗봇 오류가 발생했습니다: {str(e)}"
            return {
                "answer": error_msg,
                "source_documents": [],
                "is_parenting_related": True,
                "error": str(e),
                "search_method": "faiss_error",
                "vectordb_type": "FAISS"
            }

    async def async_chat(self, question: str) -> Dict[str, Any]:
        """비동기 FAISS 기반 채팅"""
        try:
            # 비동기 FAISS 검색
            loop = asyncio.get_event_loop()
            search_results = await loop.run_in_executor(
                None, self.search_faiss_with_scores, question, 8
            )
            
            if not search_results:
                return {
                    "answer": "죄송합니다. FAISS에서 관련 자료를 찾을 수 없습니다. 다른 키워드로 다시 질문해 주세요.",
                    "source_documents": [],
                    "is_parenting_related": True,
                    "search_method": "faiss_empty_async",
                    "vectordb_type": "FAISS"
                }
            
            # Document와 점수 분리
            relevant_docs = [doc for doc, score in search_results]
            scores = [score for doc, score in search_results]
            
            # 컨텍스트 구성
            context = self._build_context_with_scores(search_results)
            history_text = self._format_chat_history()
            
            # 비동기 LLM 호출
            response = await loop.run_in_executor(
                None,
                lambda: self.chain.invoke({
                    "context": context,
                    "chat_history": history_text,
                    "question": question
                })
            )
            
            # 대화 기록에 추가
            self._add_to_history(question, response)
            
            return {
                "answer": response,
                "source_documents": relevant_docs,
                "similarity_scores": scores,
                "is_parenting_related": True,
                "search_method": "faiss_async",
                "context_length": len(context),
                "vectordb_type": "FAISS"
            }
            
        except Exception as e:
            error_msg = f"FAISS 비동기 챗봇 오류가 발생했습니다: {str(e)}"
            return {
                "answer": error_msg,
                "source_documents": [],
                "is_parenting_related": True,
                "error": str(e),
                "search_method": "faiss_error_async",
                "vectordb_type": "FAISS"
            }

    def _build_context_with_scores(self, search_results: List[tuple]) -> str:
        """FAISS 검색 결과(점수 포함)로부터 컨텍스트 구성"""
        if not search_results:
            return "FAISS에서 관련 참고 자료가 없습니다."
        
        context_parts = []
        for i, (doc, score) in enumerate(search_results, 1):
            metadata = getattr(doc, 'metadata', {})
            category = metadata.get('category_name', '')
            section = metadata.get('section_title', '')
            
            # 유사도 점수를 백분율로 변환 (낮을수록 유사함)
            similarity_percentage = max(0, (1 - score) * 100)
            
            header = f"[FAISS 자료 {i} (유사도: {similarity_percentage:.1f}%)"
            if category:
                header += f" - {category}"
            if section:
                header += f" > {section}"
            header += "]"
            
            context_parts.append(f"{header}\n{doc.page_content}")
        
        return "\n\n".join(context_parts)

    def _build_context(self, documents: List) -> str:
        """FAISS 문서 목록으로부터 컨텍스트 구성 (점수 없는 버전)"""
        if not documents:
            return "FAISS에서 관련 참고 자료가 없습니다."
        
        context_parts = []
        for i, doc in enumerate(documents, 1):
            metadata = getattr(doc, 'metadata', {})
            category = metadata.get('category_name', '')
            section = metadata.get('section_title', '')
            
            header = f"[FAISS 자료 {i}"
            if category:
                header += f" - {category}"
            if section:
                header += f" > {section}"
            header += "]"
            
            context_parts.append(f"{header}\n{doc.page_content}")
        
        return "\n\n".join(context_parts)

    def _add_to_history(self, question: str, response: str):
        """대화 기록에 추가"""
        self.chat_history.append({"role": "user", "content": question})
        self.chat_history.append({"role": "assistant", "content": response})
        
        # 최근 20개 메시지만 유지
        if len(self.chat_history) > 20:
            self.chat_history = self.chat_history[-20:]

    def _format_chat_history(self) -> str:
        """채팅 히스토리를 문자열로 포맷팅"""
        if not self.chat_history:
            return "이전 대화가 없습니다."
        
        formatted_history = []
        for message in self.chat_history[-10:]:
            if message["role"] == "user":
                formatted_history.append(f"사용자: {message['content']}")
            elif message["role"] == "assistant":
                formatted_history.append(f"AI: {message['content']}")
        
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
        
        if len(self.chat_history) > 20:
            self.chat_history = self.chat_history[-20:]

    def get_service_status(self) -> Dict[str, Any]:
        """FAISS 챗봇 서비스 상태 정보"""
        try:
            doc_count = self._get_faiss_doc_count()
            return {
                "status": "healthy",
                "vectordb_type": "FAISS",
                "llm_model": "gpt-4o",
                "embedding_model": "text-embedding-3-small",
                "faiss_available": self.faiss_vectorstore is not None,
                "faiss_document_count": doc_count,
                "chat_history_length": len(self.chat_history)
            }
        except Exception as e:
            return {
                "status": "error",
                "vectordb_type": "FAISS",
                "error": str(e),
                "chat_history_length": len(self.chat_history)
            }


# 편의 함수들

def create_faiss_chatbot() -> FAISSChatbotService:
    """FAISS 챗봇 서비스 생성"""
    return FAISSChatbotService()


async def async_faiss_chat(question: str) -> Dict[str, Any]:
    """비동기 FAISS RAG 채팅 편의 함수"""
    service = create_faiss_chatbot()
    return await service.async_chat(question)


def sync_faiss_chat(question: str) -> Dict[str, Any]:
    """동기 FAISS RAG 채팅 편의 함수"""
    service = create_faiss_chatbot()
    return service.chat(question)


if __name__ == "__main__":
    # FAISS 챗봇 테스트
    print("=== FAISS 전용 챗봇 서비스 테스트 ===")
    
    try:
        service = create_faiss_chatbot()
        print("✅ FAISS 챗봇 서비스 초기화 성공")
        
        # 상태 정보
        status = service.get_service_status()
        print(f"📊 상태: {status}")
        
        # 채팅 테스트
        test_questions = [
            "3개월 아기 수유 간격은?",
            "신생아 목욕은 어떻게 해야 하나요?",
            "이유식 시작 시기는 언제인가요?"
        ]
        
        for question in test_questions:
            print(f"\n🤔 질문: {question}")
            result = service.chat(question)
            print(f"🤖 답변: {result['answer'][:100]}...")
            print(f"📚 FAISS 소스 수: {len(result['source_documents'])}")
            if 'similarity_scores' in result:
                avg_score = sum(result['similarity_scores']) / len(result['similarity_scores'])
                print(f"📈 평균 유사도: {(1-avg_score)*100:.1f}%")
            
    except Exception as e:
        print(f"❌ FAISS 챗봇 테스트 실패: {e}")
