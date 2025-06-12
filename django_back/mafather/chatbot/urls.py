from django.urls import path
from . import views

app_name = 'chatbot'

urlpatterns = [
    # 메인 챗봇 페이지 (DB 필요)
    path('', views.ChatbotView.as_view(), name='chat'),
    
    # 메모리 기반 챗봇 (DB 불필요)
    path('memory/', views.MemoryChatView.as_view(), name='memory_chat'),
    
    # API 엔드포인트
    path('api/session/create/', views.create_session, name='create_session'),
    path('api/message/send/', views.send_message, name='send_message'),
    path('api/session/<uuid:session_id>/history/', views.get_session_history, name='session_history'),
    path('api/session/<uuid:session_id>/end/', views.end_session, name='end_session'),
    
    # 메모리 기반 채팅 API (DB 불필요)
    path('api/memory-chat/', views.memory_chat_api, name='memory_chat_api'),
    path('api/memory/clear/', views.clear_memory, name='clear_memory'),
    path('api/memory/history/', views.get_chat_history, name='get_chat_history'),
    
    # 웹소켓 챗봇 API 엔드포인트 (세션 관리용)
    path('api/websocket/session/', views.create_websocket_session, name='create_websocket_session'),
    path('api/websocket/session/<str:session_id>/info/', views.get_websocket_session_info, name='get_websocket_session_info'),
    
    # 테스트 페이지 (DB 불필요)
    path('test/', views.test_rag, name='test_rag'),
]
