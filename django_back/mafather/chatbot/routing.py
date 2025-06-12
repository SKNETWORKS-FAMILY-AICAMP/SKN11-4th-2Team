from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<session_id>[^/]+)/$', consumers.ChatbotConsumer.as_asgi()),
    re_path(r'ws/chat/$', consumers.ChatbotConsumer.as_asgi()),
    re_path(r'ws/chat/stream/(?P<session_id>[^/]+)/$', consumers.ChatbotStreamConsumer.as_asgi()),
    re_path(r'ws/chat/stream/$', consumers.ChatbotStreamConsumer.as_asgi())
]
