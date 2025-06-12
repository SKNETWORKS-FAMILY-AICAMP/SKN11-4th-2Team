from asyncio.log import logger
import json
import uuid
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from django.core.cache import cache
from django.utils import timezone
from .services import RAGChatbotService

# DB 사용하는 경우만 임포트 (오류 방지)
try:
    from .models import ChatSession, ChatMessage
    DB_AVAILABLE = True
except Exception as e:
    print(f"DB 모델 로드 실패: {e}")
    DB_AVAILABLE = False


def get_chat_history_from_cache(session_id: str) -> list:
    """캐시에서 채팅 히스토리 가져오기"""
    cache_key = f"chat_history_{session_id}"
    history = cache.get(cache_key, [])
    return history


def save_chat_history_to_cache(session_id: str, history: list):
    """캐시에 채팅 히스토리 저장"""
    cache_key = f"chat_history_{session_id}"
    # 1시간 동안 유지
    cache.set(cache_key, history, timeout=3600)


def create_chatbot_with_history(session_id: str) -> RAGChatbotService:
    """히스토리가 복원된 챗봇 서비스 생성"""
    chatbot_service = RAGChatbotService()
    
    # 캐시에서 히스토리 가져와서 메모리에 설정
    history = get_chat_history_from_cache(session_id)
    if history:
        chatbot_service.set_memory_from_history(history)
    
    return chatbot_service


class ChatbotView(View):
    """챗봇 메인 페이지"""
    
    def get(self, request):
        # DB가 없어도 동작하도록 수정
        recent_sessions = []
        if DB_AVAILABLE:
            try:
                recent_sessions = ChatSession.objects.filter(
                    status='active'
                ).order_by('-last_message_at')[:5]
            except:
                recent_sessions = []
        
        return render(request, 'chatbot/chat.html', {
            'recent_sessions': recent_sessions
        })


class MemoryChatView(View):
    """메모리 기반 챗봇 (DB 없음)"""
    
    def get(self, request):
        # 새로운 세션 ID 생성
        session_id = str(uuid.uuid4())
        return render(request, 'chatbot/memory_chat.html', {
            'session_id': session_id
        })


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def create_websocket_session(request):
    """웹소켓 챗봇 세션 생성 (타입별 처리)"""
    if request.method == "OPTIONS":
        return JsonResponse({}, status=200)
        
    try:
        data = json.loads(request.body) if request.body else {}
        logger.info(f"Creating websocket session with data: {data}")
        
        session_type = data.get('type', 'ai_expert')  # 'ai_expert', 'community', 'doc'
        category = data.get('category', 'general')  # 카테고리 정보 (기본값 'general')
        user_id = request.user.id if request.user.is_authenticated else None
        logger.info(f"Session type: {session_type}, Category: {category}, User ID: {user_id}")
        
        # 타입 검증
        type_configs = {
            'ai_expert': {
                'default_category': 'general',
            },
            'community': {
                'default_category': 'general',
            },
            'doc': {
                'default_category': 'document',
            }
        }
        
        # 타입 검증
        if session_type not in type_configs:
            logger.error(f"Invalid session type: {session_type}")
            return JsonResponse({
                'success': False,
                'error': '지원하지 않는 채팅 타입입니다.',
                'allowed_types': list(type_configs.keys())
            }, status=400)
        
        # 카테고리가 없으면 타입별 기본 카테고리 사용
        config = type_configs[session_type]
        if not category:
            category = config['default_category']
            logger.info(f"Using default category: {category}")
        
        # 새 세션 ID 생성
        session_id = str(uuid.uuid4())
        logger.info(f"Generated new session ID: {session_id}")
        
        # 이전 세션 정리 (같은 사용자의 활성 세션)
        if user_id:
            all_sessions = cache.keys('websocket_session_*')
            logger.info(f"Found {len(all_sessions)} existing sessions for user {user_id}")
            for session_key in all_sessions:
                session_data = cache.get(session_key)
                if session_data and session_data.get('user_id') == user_id:
                    session_data['status'] = 'disconnected'
                    session_data['disconnected_at'] = timezone.now().isoformat()
                    cache.set(session_key, session_data, timeout=3600)
                    logger.info(f"Marked session {session_key} as disconnected")
        
        # 새 세션 메타데이터 생성
        session_metadata = {
            'session_id': session_id,
            'type': session_type,
            'category': category,
            'user_id': user_id,
            'created_at': timezone.now().isoformat(),
            'status': 'pending',  # 초기 상태를 'pending'으로 설정
            'last_activity': timezone.now().isoformat(),
            'connection_attempts': 0  # 연결 시도 횟수 추가
        }
        logger.info(f"Created session metadata: {session_metadata}")
        
        # 세션 메타데이터 저장 (캐시 저장 방식 수정)
        cache_key = f"websocket_session_{session_id}"
        try:
            # 캐시 저장 시도
            cache.set(cache_key, session_metadata, timeout=3600)  # 1시간 유효
            
            # 저장 확인
            saved_data = cache.get(cache_key)
            if not saved_data:
                raise Exception("Failed to save session data to cache")
                
            logger.info(f"Successfully saved session metadata to cache with key: {cache_key}")
            
            # 응답 전송 전에 잠시 대기 (캐시 동기화 시간 확보)
            import time
            time.sleep(0.1)
            
            return JsonResponse({
                'success': True,
                'session_id': session_id,
                'type': session_type,
                'category': category,
                'message': '웹소켓 세션이 생성되었습니다.'
            })
            
        except Exception as cache_error:
            logger.error(f"Cache operation failed: {str(cache_error)}", exc_info=True)
            return JsonResponse({
                'success': False,
                'error': '세션 데이터 저장 중 오류가 발생했습니다.'
            }, status=500)
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON in request body")
        return JsonResponse({
            'success': False,
            'error': '잘못된 JSON 형식입니다.'
        }, status=400)
    except Exception as e:
        logger.error(f"WebSocket session creation error: {str(e)}", exc_info=True)
        return JsonResponse({
            'success': False,
            'error': '세션 생성 중 오류가 발생했습니다.'
        }, status=500)


@require_http_methods(["GET"])
def get_websocket_session_info(request, session_id):
    """웹소켓 세션 정보 조회"""
    try:
        # 세션 메타데이터 가져오기
        cache_key = f"websocket_session_{session_id}"
        session_metadata = cache.get(cache_key)
        
        if not session_metadata:
            return JsonResponse({
                'success': False,
                'error': '세션을 찾을 수 없습니다.'
            }, status=404)
        
        # 세션 히스토리 가져오기
        history_key = f"chat_history_{session_id}"
        chat_history = cache.get(history_key, [])
        
        return JsonResponse({
            'success': True,
            'session_info': session_metadata,
            'message_count': len(chat_history),
            'last_activity': session_metadata.get('created_at')
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def memory_chat_api(request):
    """메모리 기반 채팅 API (히스토리 캐시 방식)"""
    try:
        data = json.loads(request.body)
        message_content = data.get('message', '').strip()
        session_id = data.get('session_id')
        
        if not message_content:
            return JsonResponse({
                'success': False,
                'error': '메시지 내용이 없습니다.'
            }, status=400)
        
        # 세션 ID가 없으면 새로 생성
        if not session_id:
            session_id = str(uuid.uuid4())
        
        # 히스토리가 복원된 챗봇 서비스 생성
        chatbot_service = create_chatbot_with_history(session_id)
        
        # AI 응답 생성
        response = chatbot_service.chat(message_content, session_id)
        ai_response = response['answer']
        source_docs = response.get('source_documents', [])
        
        # 현재 대화 히스토리 가져와서 새 메시지 추가
        current_history = get_chat_history_from_cache(session_id)
        current_history.append({"role": "user", "content": message_content})
        current_history.append({"role": "assistant", "content": ai_response})
        
        # 캐시에 업데이트된 히스토리 저장
        save_chat_history_to_cache(session_id, current_history)
        
        # 참고 문서 정보 생성
        sources = []
        for doc in source_docs[:3]:  # 상위 3개만
            if hasattr(doc, 'metadata'):
                sources.append({
                    'category': doc.metadata.get('category_name', ''),
                    'section': doc.metadata.get('section_title', ''),
                    'content_preview': doc.page_content[:100] + '...'
                })
        
        return JsonResponse({
            'success': True,
            'session_id': session_id,  # 클라이언트에 세션 ID 반환
            'ai_response': ai_response,
            'sources': sources,
            'is_parenting_related': response.get('is_parenting_related', True)
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'오류가 발생했습니다: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def clear_memory(request):
    """세션 메모리 초기화"""
    try:
        data = json.loads(request.body)
        session_id = data.get('session_id')
        
        if not session_id:
            return JsonResponse({
                'success': False,
                'error': '세션 ID가 필요합니다.'
            }, status=400)
        
        # 캐시에서 해당 세션의 히스토리 삭제
        cache_key = f"chat_history_{session_id}"
        cache.delete(cache_key)
        
        return JsonResponse({
            'success': True,
            'message': '대화 기록이 초기화되었습니다.'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def get_chat_history(request):
    """세션 대화 히스토리 조회"""
    try:
        session_id = request.GET.get('session_id')
        
        if not session_id:
            return JsonResponse({
                'success': False,
                'error': '세션 ID가 필요합니다.'
            }, status=400)
        
        # 캐시에서 대화 히스토리 가져오기
        history = get_chat_history_from_cache(session_id)
        
        return JsonResponse({
            'success': True,
            'session_id': session_id,
            'chat_history': history
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def create_session(request):
    """새 채팅 세션 생성"""
    if not DB_AVAILABLE:
        return JsonResponse({
            'success': False,
            'error': 'DB가 사용 불가능합니다. /chatbot/memory/ 를 사용하세요.'
        }, status=503)
    
    try:
        data = json.loads(request.body)
        title = data.get('title', '새로운 상담')
        category = data.get('category', 'general')
        
        session = ChatSession.objects.create(
            title=title,
            category=category,
            status='active'
        )
        
        return JsonResponse({
            'success': True,
            'session_id': str(session.id),
            'message': '새 세션이 생성되었습니다.'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def send_message(request):
    """메시지 전송 및 AI 응답"""
    if not DB_AVAILABLE:
        return JsonResponse({
            'success': False,
            'error': 'DB가 사용 불가능합니다. /chatbot/memory/ 를 사용하세요.'
        }, status=503)
    
    try:
        data = json.loads(request.body)
        session_id = data.get('session_id')
        message_content = data.get('message', '').strip()
        
        if not message_content:
            return JsonResponse({
                'success': False,
                'error': '메시지 내용이 없습니다.'
            }, status=400)
        
        # 세션 조회 또는 생성
        if session_id:
            try:
                session = ChatSession.objects.get(id=session_id, status='active')
            except ChatSession.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': '유효하지 않은 세션입니다.'
                }, status=404)
        else:
            # 새 세션 생성
            session = ChatSession.objects.create(
                title=message_content[:50] + ('...' if len(message_content) > 50 else ''),
                category='general',
                status='active'
            )
        
        # 사용자 메시지 저장
        user_message = ChatMessage.objects.create(
            session=session,
            role='user',
            content=message_content
        )
        
        # 히스토리가 복원된 챗봇 서비스 생성
        chatbot_service = create_chatbot_with_history(str(session.id))
        
        # 기존 대화 히스토리 로드 (DB에서)
        existing_messages = ChatMessage.objects.filter(
            session=session
        ).exclude(id=user_message.id).order_by('created_at')
        
        chat_history = []
        for msg in existing_messages:
            chat_history.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # 메모리에 히스토리 설정
        if chat_history:
            chatbot_service.set_memory_from_history(chat_history)
        
        # AI 응답 생성
        response = chatbot_service.chat(message_content, str(session.id))
        ai_response = response['answer']
        source_docs = response.get('source_documents', [])
        
        # AI 응답 저장
        ai_message = ChatMessage.objects.create(
            session=session,
            role='assistant',
            content=ai_response,
            metadata={
                'source_count': len(source_docs),
                'is_parenting_related': response.get('is_parenting_related', True)
            }
        )
        
        # 세션 업데이트
        session.update_last_message_time()
        
        # 캐시에도 히스토리 저장 (DB와 동기화)
        chat_history.append({"role": "user", "content": message_content})
        chat_history.append({"role": "assistant", "content": ai_response})
        save_chat_history_to_cache(str(session.id), chat_history)
        
        # 참고 문서 정보 생성
        sources = []
        for doc in source_docs[:3]:  # 상위 3개만
            if hasattr(doc, 'metadata'):
                sources.append({
                    'category': doc.metadata.get('category_name', ''),
                    'section': doc.metadata.get('section_title', ''),
                    'content_preview': doc.page_content[:100] + '...'
                })
        
        return JsonResponse({
            'success': True,
            'session_id': str(session.id),
            'ai_response': ai_response,
            'sources': sources,
            'message_id': str(ai_message.id)
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'오류가 발생했습니다: {str(e)}'
        }, status=500)


@require_http_methods(["GET"])
def get_session_history(request, session_id):
    """세션 대화 히스토리 조회"""
    if not DB_AVAILABLE:
        return JsonResponse({
            'success': False,
            'error': 'DB가 사용 불가능합니다.'
        }, status=503)
    
    try:
        session = get_object_or_404(ChatSession, id=session_id)
        messages = ChatMessage.objects.filter(session=session).order_by('created_at')
        
        history = []
        for message in messages:
            history.append({
                'id': str(message.id),
                'role': message.role,
                'content': message.content,
                'created_at': message.created_at.isoformat(),
                'metadata': message.metadata
            })
        
        return JsonResponse({
            'success': True,
            'session': {
                'id': str(session.id),
                'title': session.title,
                'category': session.category,
                'created_at': session.created_at.isoformat()
            },
            'messages': history
        }, render(request))
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def end_session(request, session_id):
    """세션 종료"""
    if not DB_AVAILABLE:
        return JsonResponse({
            'success': False,
            'error': 'DB가 사용 불가능합니다.'
        }, status=503)
    
    try:
        session = get_object_or_404(ChatSession, id=session_id)
        session.complete_session()
        
        # 캐시에서도 삭제
        cache_key = f"chat_history_{session_id}"
        cache.delete(cache_key)
        return JsonResponse({
            'success': True,
            'message': '세션이 종료되었습니다.',
        }, render(request))
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)


def test_rag(request):
    """RAG 시스템 테스트 페이지 (DB 없음)"""
    if request.method == 'POST':
        try:
            question = request.POST.get('question', '').strip()
            if not question:
                return render(request, 'chatbot/test.html', {
                    'error': '질문을 입력해주세요.'
                })
            
            # 테스트용 세션 ID
            test_session_id = "test_session"
            
            # RAG 테스트
            chatbot_service = create_chatbot_with_history(test_session_id)
            response = chatbot_service.chat(question)
            
            return render(request, 'chatbot/test.html', {
                'question': question,
                'answer': response['answer'],
                'sources': response.get('source_documents', [])[:3],
                'is_parenting': response.get('is_parenting_related', True)
            })
            
        except Exception as e:
            return render(request, 'chatbot/test.html', {
                'error': f'오류: {str(e)}'
            })
    
    return render(request, 'chatbot/test.html')