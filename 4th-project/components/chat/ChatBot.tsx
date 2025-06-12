import { useState, useEffect } from 'react';
import { websocketService } from '@/services/websocket-service';
import { WebSocketResponse, ChatSessionType, ChatCategory } from '@/types/websocket';

interface ChatBotProps {
  sessionType: ChatSessionType;
  category?: ChatCategory;
  onError?: (error: string) => void;
  className?: string;
}

export function ChatBot({ 
  sessionType, 
  category = 'general',
  onError,
  className = ''
}: ChatBotProps) {
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketResponse[]>([]);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setError(null);
        const session = await websocketService.createSession(sessionType, category);
        if (!session?.session_id) {
          throw new Error('세션 ID를 받지 못했습니다.');
        }
        await websocketService.connect(session.session_id);
        setIsConnected(true);
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : typeof error === 'string'
            ? error
            : '채팅 초기화 중 알 수 없는 오류가 발생했습니다.';
        
        console.error('채팅 초기화 중 오류 발생:', errorMessage);
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsConnecting(false);
      }
    };

    const cleanup = websocketService.addMessageHandler((response: WebSocketResponse) => {
      if (response.type === 'error') {
        const errorMessage = response.error || '알 수 없는 오류가 발생했습니다.';
        console.error('채팅 에러:', errorMessage);
        setError(errorMessage);
        onError?.(errorMessage);
      } else {
        setError(null);
        setMessages(prev => [...prev, response]);
      }
    });

    initializeChat();

    return () => {
      cleanup();
      websocketService.disconnect();
    };
  }, [sessionType, category, onError]);

  const handleSendMessage = () => {
    if (message.trim()) {
      if (!isConnected) {
        setError('채팅 서버에 연결되어 있지 않습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      websocketService.sendMessage(message);
      setMessage('');
    }
  };

  if (isConnecting) {
    return (
      <div className={`p-4 ${className}`}>
        <p>채팅을 초기화하는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">알림</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            다시 시도
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, index) => {
          if (msg.type === 'ai_response') {
            return (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <p>{msg.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
            );
          } else if (msg.type === 'typing') {
            return msg.is_typing ? (
              <div key={index} className="text-gray-500 italic">
                AI가 입력 중...
              </div>
            ) : null;
          }
          return null;
        })}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 p-2 border rounded"
          placeholder={isConnected ? "메시지를 입력하세요..." : "연결 중... 잠시만 기다려주세요."}
          disabled={!isConnected}
        />
        <button
          onClick={handleSendMessage}
          className={`px-4 py-2 rounded ${
            isConnected 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isConnected}
        >
          전송
        </button>
      </div>
    </div>
  );
} 