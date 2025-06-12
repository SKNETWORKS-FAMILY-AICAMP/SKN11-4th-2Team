import json
import uuid
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.cache import cache
from django.utils import timezone
import logging
from .chains import EXTERNAL_SERVER_URL, process_question
import httpx

logger = logging.getLogger(__name__)


class ChatbotConsumer(AsyncWebsocketConsumer):
    """웹소켓 기반 챗봇 컨슈머"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_name = None
        self.room_group_name = None
        self.session_id = None
        self.session_type = None
        self.category = None

    async def connect(self):
        """웹소켓 연결 처리"""
        try:
            # URL에서 세션 ID 가져오기
            self.session_id = self.scope['url_route']['kwargs'].get('session_id')
            logger.info(f"[WebSocket] Connection attempt for session_id: {self.session_id}")
            logger.info(f"[WebSocket] Scope: {self.scope}")
            
            if not self.session_id:
                logger.error("[WebSocket] No session_id provided")
                await self.close(code=4000)
                return
            
            # 세션 메타데이터 가져오기 (최대 3번 시도)
            cache_key = f"websocket_session_{self.session_id}"
            session_data = None
            max_retries = 3
            retry_delay = 0.1  # 100ms
            
            for attempt in range(max_retries):
                session_data = cache.get(cache_key)
                logger.info(f"[WebSocket] Cache lookup attempt {attempt + 1}: {session_data}")
                if session_data:
                    break
                logger.warning(f"[WebSocket] Session data not found, attempt {attempt + 1}/{max_retries}")
                await asyncio.sleep(retry_delay)
            
            if not session_data:
                logger.error(f"[WebSocket] No session data found for session_id: {self.session_id} after {max_retries} attempts")
                await self.close(code=4001)
                return
            
            # 연결 시도 횟수 증가
            connection_attempts = session_data.get('connection_attempts', 0) + 1
            session_data['connection_attempts'] = connection_attempts
            logger.info(f"[WebSocket] Connection attempt count: {connection_attempts}")
            
            # 세션 타입과 카테고리 설정
            self.session_type = session_data.get('type', 'ai_expert')
            self.category = session_data.get('category', 'general')
            logger.info(f"[WebSocket] Session type: {self.session_type}, Category: {self.category}")
            
            # 타입별 설정
            type_configs = {
                'ai_expert': {
                    'default_category': 'general',
                    'category_names': {
                        'general': '일반 AI 상담',
                        'specialized': '전문 AI 상담',
                        'nutrition': '영양',
                        'behavior': '행동',
                        'psychology': '심리',
                        'education': '교육'
                    }
                },
                'community': {
                    'default_category': 'general',
                    'category_names': {
                        'general': '일반',
                        'question': '질문',
                        'discussion': '토론'
                    }
                },
                'doc': {
                    'default_category': 'document',
                    'category_names': {
                        'document': '문서',
                        'reference': '참고자료',
                        'guide': '가이드'
                    }
                }
            }
            
            # 타입 검증
            if self.session_type not in type_configs:
                logger.error(f"[WebSocket] Invalid session type: {self.session_type}")
                await self.close(code=4002)
                return
            
            # 카테고리가 없으면 타입별 기본 카테고리 사용
            config = type_configs[self.session_type]
            if not self.category:
                self.category = config['default_category']
                logger.info(f"[WebSocket] Using default category: {self.category}")
            
            # 그룹에 추가
            try:
                await self.channel_layer.group_add(
                    self.session_id,
                    self.channel_name
                )
                logger.info(f"[WebSocket] Added to group: {self.session_id}")
            except Exception as group_error:
                logger.error(f"[WebSocket] Failed to add to group: {str(group_error)}")
                await self.close(code=4004)
                return
            
            # 세션 상태 업데이트
            try:
                session_data['status'] = 'connected'
                session_data['last_activity'] = timezone.now().isoformat()
                cache.set(cache_key, session_data, timeout=3600)
                logger.info("[WebSocket] Session status updated to connected")
            except Exception as cache_error:
                logger.error(f"[WebSocket] Failed to update session status: {str(cache_error)}")
                await self.close(code=4005)
                return
            
            # 연결 수락
            await self.accept()
            logger.info("[WebSocket] Connection accepted")
            
            # 환영 메시지 전송
            try:
                category_name = config['category_names'].get(self.category, self.category)
                welcome_message = {
                    'type': 'chat_message',
                    'message': {
                        'role': 'assistant',
                        'content': f'안녕하세요! {category_name} 전문가입니다. 어떤 도움이 필요하신가요?'
                    }
                }
                await self.send(text_data=json.dumps(welcome_message))
                logger.info("[WebSocket] Welcome message sent")
            except Exception as message_error:
                logger.error(f"[WebSocket] Failed to send welcome message: {str(message_error)}")
            
        except Exception as e:
            logger.error(f"[WebSocket] Connection error: {str(e)}", exc_info=True)
            await self.close(code=4000)

    async def disconnect(self, close_code):
        """웹소켓 연결 해제"""
        try:
            # 그룹에서 채널 제거
            if self.room_group_name:
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
            
            # 세션 메타데이터 업데이트
            if self.session_id:
                cache_key = f"websocket_session_{self.session_id}"
                session_metadata = await database_sync_to_async(cache.get)(cache_key)
                if session_metadata:
                    session_metadata['status'] = 'disconnected'
                    session_metadata['disconnected_at'] = timezone.now().isoformat()
                    await database_sync_to_async(cache.set)(cache_key, session_metadata, timeout=3600)
            
        except Exception as e:
            logger.error(f"WebSocket disconnect error: {str(e)}")
            # 에러가 발생해도 연결은 정리
            if self.room_group_name:
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )

    async def receive(self, text_data):
        """클라이언트로부터 메시지 수신"""
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type', 'chat')
            
            if message_type == 'chat':
                await self.handle_chat_message(text_data_json)
            elif message_type == 'clear_history':
                await self.handle_clear_history(text_data_json)
            elif message_type == 'get_history':
                await self.handle_get_history(text_data_json)
            else:
                await self.send_error('알 수 없는 메시지 타입입니다.')
                
        except json.JSONDecodeError:
            await self.send_error('잘못된 JSON 형식입니다.')
        except Exception as e:
            await self.send_error(f'오류가 발생했습니다: {str(e)}')

    async def handle_chat_message(self, data):
        """채팅 메시지 처리"""
        try:
            message = data.get('message', '')
            if not message:
                await self.send_error('메시지가 비어있습니다.')
                return

            logger.info(f"[WebSocket] Processing message with session_id: {self.session_id}")  # 디버깅용 로그 추가

            # 입력 중 상태 전송
            await self.send(text_data=json.dumps({
                'type': 'typing',
                'is_typing': True
            }))

            # 채팅 히스토리 가져오기
            history_key = f"chat_history_{self.session_id}"
            chat_history = await database_sync_to_async(cache.get)(history_key, [])

            # 타입별 메시지 처리
            if self.session_type == 'ai_expert':
                # AI 전문가 상담 처리 - session_id 추가
                result = await process_question(
                    question=message,
                    chat_history=chat_history,
                    session_id=self.session_id,  # 여기에 session_id 추가
                    websocket_type=self.session_type
                )
            elif self.session_type == 'community':
                # 커뮤니티 채팅 처리
                result = await self.process_community_message(message, chat_history)
            else:  # doc
                # 자료실 검색 처리
                result = await self.process_doc_search(message, chat_history)

            # 채팅 히스토리 업데이트
            chat_history.append({
                'type': 'user',
                'message': message,
                'timestamp': timezone.now().isoformat()
            })
            
            chat_history.append({
                'type': 'ai',
                'message': result['answer'],
                'timestamp': timezone.now().isoformat()
            })
            
            # 히스토리 저장 (최대 50개 메시지 유지)
            if len(chat_history) > 50:
                chat_history = chat_history[-50:]
            
            await database_sync_to_async(cache.set)(history_key, chat_history, timeout=3600)

            # 응답 전송
            await self.send(text_data=json.dumps({
                'type': 'ai_response',
                'message': result['answer'],
                'timestamp': timezone.now().isoformat(),
                'sources': result.get('sources', []),
                'session_type': self.session_type
            }))

        except Exception as e:
            logger.error(f"Chat message handling error: {str(e)}")
            await self.send_error('메시지 처리 중 오류가 발생했습니다.')

    async def process_community_message(self, message, history):
        """커뮤니티 채팅 메시지 처리"""
        # TODO: 커뮤니티 채팅 로직 구현
        return {
            'answer': '커뮤니티 채팅 기능은 준비 중입니다.',
            'sources': []
        }

    async def process_doc_search(self, message, history):
        """자료실 검색 처리"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{EXTERNAL_SERVER_URL}/vector",
                    json={
                        "message": message
                    }
                )
                response.raise_for_status()
                result = response.json()
                
                return {
                    'answer': result.get('response', '문서 검색 결과를 찾을 수 없습니다.'),
                    'sources': result.get('sources', [])
                }
        except Exception as e:
            logger.error(f"문서 서버 통신 오류: {str(e)}")
            return {
                'answer': '죄송합니다. 문서 검색 서비스가 일시적으로 이용 불가합니다.',
                'sources': []
            }

    async def handle_clear_history(self, data):
        """채팅 히스토리 초기화"""
        try:
            history_key = f"chat_history_{self.session_id}"
            await database_sync_to_async(cache.delete)(history_key)
            await self.send(text_data=json.dumps({
                'type': 'history_cleared',
                'message': '채팅 히스토리가 초기화되었습니다.'
            }))
        except Exception as e:
            logger.error(f"Clear history error: {str(e)}")
            await self.send_error('히스토리 초기화 중 오류가 발생했습니다.')

    async def handle_get_history(self, data):
        """채팅 히스토리 조회"""
        try:
            history_key = f"chat_history_{self.session_id}"
            chat_history = await database_sync_to_async(cache.get)(history_key, [])
            await self.send(text_data=json.dumps({
                'type': 'chat_history',
                'history': chat_history
            }))
        except Exception as e:
            logger.error(f"Get history error: {str(e)}")
            await self.send_error('히스토리 조회 중 오류가 발생했습니다.')

    async def send_error(self, error_message):
        """에러 메시지 전송"""
        await self.send(text_data=json.dumps({
            'type': 'error',
            'error': error_message
        }))


class ChatbotStreamConsumer(AsyncWebsocketConsumer):
    """스트리밍 응답을 위한 챗봇 컨슈머"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.session_id = None
        self.chatbot_service = None

    async def connect(self):
        """웹소켓 연결"""
        self.session_id = self.scope['url_route']['kwargs'].get('session_id')
        if not self.session_id:
            self.session_id = str(uuid.uuid4())
        
        # 세션 메타데이터 확인
        session_metadata = await database_sync_to_async(cache.get)(f"websocket_session_{self.session_id}")
        
        await self.accept()
        
        # 카테고리 메시지 생성
        category_message = ""
        if session_metadata:
            category = session_metadata.get('category', 'all')
            category_names = {
                'nutrition': '영양',
                'behavior': '행동',
                'psychology': '심리',
                'education': '교육',
                'general': '일반',
                'specialized': '전문',
                'document': '문서',
                'reference': '참고자료',
                'guide': '가이드'
            }
            category_kr = category_names.get(category, '전체')
            category_message = f" [{category_kr} 전문 상담]"
        
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'session_id': self.session_id,
            'message': f'스트리밍 챗봇과 연결되었습니다.{category_message}'
        }))

    async def disconnect(self, close_code):
        """웹소켓 연결 해제"""
        pass

    async def receive(self, text_data):
        """클라이언트로부터 메시지 수신"""
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json.get('message', '').strip()
            
            if not message:
                await self.send_error('메시지 내용이 없습니다.')
                return
            
            # 스트리밍 응답 시작
            await self.send(text_data=json.dumps({
                'type': 'stream_start',
                'message': message
            }))
            
            # 챗봇 서비스 초기화
            if not self.chatbot_service:
                self.chatbot_service = await self.create_chatbot_service()
            
            # 스트리밍 방식으로 AI 응답 생성
            await self.generate_streaming_response(message)
            
        except Exception as e:
            await self.send_error(f'오류가 발생했습니다: {str(e)}')

    async def generate_streaming_response(self, message):
        """스트리밍 방식으로 AI 응답 생성"""
        try:
            # 여기서는 실제 스트리밍 대신 청크로 나누어 전송하는 시뮬레이션
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                self.chatbot_service.chat,
                message,
                self.session_id
            )
            
            answer = response['answer']
            
            # 응답을 청크로 나누어 전송
            chunk_size = 50  # 50자씩 전송
            for i in range(0, len(answer), chunk_size):
                chunk = answer[i:i + chunk_size]
                
                await self.send(text_data=json.dumps({
                    'type': 'stream_chunk',
                    'chunk': chunk,
                    'is_complete': i + chunk_size >= len(answer)
                }))
                
                # 스트리밍 효과를 위한 약간의 지연
                await asyncio.sleep(0.1)
            
            # 스트리밍 완료
            await self.send(text_data=json.dumps({
                'type': 'stream_complete',
                'sources': await self.format_sources(response.get('source_documents', [])),
                'is_parenting_related': response.get('is_parenting_related', True)
            }))
            
            # 히스토리 저장
            await self.save_chat_history(message, answer)
            
        except Exception as e:
            await self.send_error(f'스트리밍 응답 생성 중 오류: {str(e)}')

    async def send_error(self, error_message):
        """에러 메시지 전송"""
        await self.send(text_data=json.dumps({
            'type': 'error',
            'error': error_message
        }))

    @database_sync_to_async
    def create_chatbot_service(self):
        """챗봇 서비스 생성"""
        chatbot_service = RAGChatbotService()
        cache_key = f"chat_history_{self.session_id}"
        history = cache.get(cache_key, [])
        if history:
            chatbot_service.set_memory_from_history(history)
        return chatbot_service

    @database_sync_to_async
    def save_chat_history(self, user_message, ai_response):
        """채팅 히스토리 저장"""
        cache_key = f"chat_history_{self.session_id}"
        current_history = cache.get(cache_key, [])
        
        current_history.append({"role": "user", "content": user_message})
        current_history.append({"role": "assistant", "content": ai_response})
        
        if len(current_history) > 50:
            current_history = current_history[-50:]
        
        cache.set(cache_key, current_history, timeout=3600)

    async def format_sources(self, source_docs):
        """소스 문서 포맷팅"""
        sources = []
        for doc in source_docs[:3]:
            if hasattr(doc, 'metadata'):
                sources.append({
                    'category': doc.metadata.get('category_name', ''),
                    'section': doc.metadata.get('section_title', ''),
                    'content_preview': doc.page_content[:100] + '...'
                })
        return sources