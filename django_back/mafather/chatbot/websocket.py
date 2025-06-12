from channels.generic.websocket import AsyncWebsocketConsumer
from .chains import process_question, session_manager
import json
import uuid

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = str(uuid.uuid4())
        await self.accept()

    async def disconnect(self, close_code):
        # 연결이 끊어질 때 세션 저장
        await session_manager.save_session(self.session_id)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            question = data.get('message')
            
            response = await process_question(
                question=question,
                session_id=self.session_id,
                websocket_type="ai_expert"
            )
            
            await self.send(text_data=json.dumps(response))
            
        except Exception as e:
            await self.send(text_data=json.dumps({
                "error": str(e)
            })) 