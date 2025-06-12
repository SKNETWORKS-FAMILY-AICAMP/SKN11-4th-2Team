import os
import pickle
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

load_dotenv()


class RAGChatbotService:
    """FAISS + GPT-4o 기반 RAG 챗봇 서비스 (간단한 체인 구성)"""
    
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.embedding_model = None
        self.vectorstore = None
        self.llm = None
        self.chain = None
        self.chat_history = []  # 간단한 메모리 관리
        self._initialize()

    def _initialize(self):
        """RAG 시스템 초기화"""
        try:
            # OpenAI 임베딩 모델 초기화
            self.embedding_model = OpenAIEmbeddings(
                model="text-embedding-3-small",
                openai_api_key=self.openai_api_key
            )
            
            # FAISS 벡터스토어 로드
            app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            faiss_dir = os.path.join(app_dir, "vectordb", "vector_store", "faiss_db")
            print(app_dir)
            print(faiss_dir)
            if os.path.exists(faiss_dir):
                self.vectorstore = FAISS.load_local(
                    faiss_dir, 
                    self.embedding_model,
                )
            else:
                raise FileNotFoundError("FAISS DB가 존재하지 않습니다.")
            print(1)
            # GPT-4o 모델 초기화
            self.llm = ChatOpenAI(
                model="gpt-4o",
                temperature=0.8,
                openai_api_key=self.openai_api_key,
                max_tokens=1000
            )
            
            # 육아 전문 프롬프트 템플릿
            prompt_template = ChatPromptTemplate.from_messages([
                ("system", """당신은 전문적인 육아 상담 AI 어시스턴트입니다.

                역할과 특성:
                - 0~24개월 영유아 육아 전문가
                - 따뜻하고 공감적인 톤으로 상담
                - 과학적이고 신뢰할 수 있는 정보 제공
                - 안전을 최우선으로 고려
                
                응답 가이드라인:
                1. 육아 관련 질문에는 제공된 참고 자료를 바탕으로 정확하고 도움이 되는 답변을 제공하세요.
                2. 의료적 응급상황이나 심각한 증상의 경우 즉시 병원 방문을 권하세요.
                3. 부모의 감정과 어려움에 공감하며 실용적인 조언을 제공하세요.
                4. 개별 아기의 차이를 인정하고 일반적인 가이드라인임을 명시하세요.
                
                참고자료:
                {context}
                
                이전 대화:
                {chat_history}"""),
                ("user", "{question}")
            ])
            
            # 출력 파서
            output_parser = StrOutputParser()
            
            # 간단한 체인 구성
            self.chain = prompt_template | self.llm | output_parser
            
        except Exception as e:
            print(f"RAG 시스템 초기화 오류: {str(e)}")
            raise

    def chat(self, question: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        """채팅 메시지 처리"""
        try:
            # 육아 관련성 체크
            if not self._is_parenting_related(question):
                return {
                    "answer": self._get_redirect_message(),
                    "source_documents": [],
                    "is_parenting_related": False
                }
            
            # 벡터스토어에서 관련 문서 검색
            retriever = self.vectorstore.as_retriever(search_kwargs={"k": 5})
            relevant_docs = retriever.get_relevant_documents(question)
            
            # 검색된 문서를 컨텍스트로 변환
            context = "\n\n".join([doc.page_content for doc in relevant_docs])
            
            # 이전 대화 기록을 문자열로 변환
            history_text = self._format_chat_history()
            
            # 체인 실행
            response = self.chain.invoke({
                "context": context,
                "chat_history": history_text,
                "question": question
            })
            
            # 대화 기록에 추가 (최근 10개만 유지)
            self.chat_history.append({"role": "user", "content": question})
            self.chat_history.append({"role": "assistant", "content": response})
            
            # 최근 20개 메시지만 유지 (user + assistant 쌍으로 10개 대화)
            if len(self.chat_history) > 20:
                self.chat_history = self.chat_history[-20:]
            
            return {
                "answer": response,
                "source_documents": relevant_docs,
                "is_parenting_related": True
            }
            
        except Exception as e:
            return {
                "answer": f"죄송합니다. 오류가 발생했습니다: {str(e)}",
                "source_documents": [],
                "is_parenting_related": True
            }

    def _format_chat_history(self) -> str:
        """채팅 히스토리를 문자열로 포맷팅"""
        if not self.chat_history:
            return "이전 대화가 없습니다."
        
        formatted_history = []
        for message in self.chat_history[-10:]:  # 최근 10개 메시지만
            if message["role"] == "user":
                formatted_history.append(f"사용자: {message['content']}")
            elif message["role"] == "assistant":
                formatted_history.append(f"AI: {message['content']}")
        
        return "\n".join(formatted_history)

    def _is_parenting_related(self, question: str) -> bool:
        """육아 관련 질문인지 확인"""
        parenting_keywords = [
            "아기", "아이", "신생아", "영아", "유아", "육아", "양육",
            "수유", "모유", "분유", "이유식", "기저귀", "잠", "수면",
            "발달", "성장", "걷기", "기어가기", "울음", "우유", 
            "예방접종", "백신", "열", "기침", "감기", "변비", "설사",
            "목욕", "안전", "놀이", "장난감", "책", "노래",
            "개월", "돌", "출산", "임신", "산후", "젖니", "이가",
            "엄마", "아빠", "부모", "가족", "형제", "자매"
        ]
        
        question_lower = question.lower()
        
        # 한국어 키워드 체크
        for keyword in parenting_keywords:
            if keyword in question_lower:
                return True
        
        # 숫자 + 개월 패턴 체크 (1개월, 3개월 등)
        import re
        month_pattern = r'\d+개월'
        if re.search(month_pattern, question):
            return True
        
        return False

    def _get_redirect_message(self) -> str:
        """육아 외 질문에 대한 안내 메시지"""
        return """안녕하세요! 저는 육아 전문 상담 AI입니다. 😊

            육아와 관련된 질문이 있으시면 언제든 물어보세요!

            **이런 것들을 도와드릴 수 있어요:**
            🍼 **수유 & 영양**: 모유수유, 분유, 이유식 고민
            👶 **아기 발달**: 성장 단계, 언어발달, 운동발달
            😴 **수면**: 수면 패턴, 밤잠, 잠투정
            🎮 **놀이 & 학습**: 월령별 놀이, 교육, 책 읽기
            🏥 **건강 & 안전**: 예방접종, 질병, 안전사고 예방
            💝 **정서 & 행동**: 애착 형성, 훈육, 분리불안

            어떤 육아 고민이 있으신가요?"""

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