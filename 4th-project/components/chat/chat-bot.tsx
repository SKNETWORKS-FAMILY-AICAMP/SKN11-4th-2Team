'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { websocketService } from '@/services/websocket-service';
import {
  WebSocketResponse,
  ChatSessionType,
  ChatCategory,
} from '@/types/websocket';

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
  sources?: any[];
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content:
        '안녕하세요! 육아 자료실 챗봇입니다. 어떤 자료를 찾아보시겠어요?',
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 웹소켓 세션 초기화
    const initializeWebSocket = async () => {
      try {
        setError(null);
        const session = await websocketService.createSession('doc', 'general');
        if (!session?.session_id) {
          throw new Error('세션 ID를 받지 못했습니다.');
        }
        await websocketService.connect(session.session_id);
        setIsConnected(true);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : '채팅 초기화 중 알 수 없는 오류가 발생했습니다.';

        console.error('채팅 초기화 중 오류 발생:', errorMessage);
        setError(errorMessage);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: '연결에 실패했습니다. 페이지를 새로고침해주세요.',
            isAI: true,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsConnecting(false);
      }
    };

    const cleanup = websocketService.addMessageHandler(
      (response: WebSocketResponse) => {
        if (response.type === 'error') {
          const errorMessage =
            response.error || '알 수 없는 오류가 발생했습니다.';
          console.error('채팅 에러:', errorMessage);
          setError(errorMessage);
          setIsLoading(false);
        } else if (response.type === 'ai_response') {
          const newMessage: Message = {
            id: Date.now().toString(),
            content: response.message,
            isAI: true,
            timestamp: new Date(response.timestamp),
            sources: response.sources || [],
          };
          setMessages((prev) => [...prev, newMessage]);
          setIsLoading(false);
          setError(null);
        } else if (response.type === 'typing') {
          setIsLoading(response.is_typing);
        }
      },
    );

    initializeWebSocket();

    return () => {
      cleanup();
      websocketService.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isConnected) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isAI: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      websocketService.sendMessage(userMessage.content);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content:
            '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          isAI: true,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }
  };

  if (isConnecting) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg"
          disabled
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-[350px] h-[500px] flex flex-col shadow-lg">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">육아 자료실 챗봇</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.isAI ? 'justify-start' : 'justify-end',
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[70%]',
                      message.isAI ? 'flex items-start space-x-3' : '',
                    )}
                  >
                    {message.isAI && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary">
                        <Brain className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2',
                        message.isAI
                          ? 'bg-muted'
                          : 'bg-primary text-primary-foreground',
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p
                        className={cn(
                          'text-xs mt-2',
                          message.isAI ? 'text-muted-foreground' : 'opacity-70',
                        )}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="질문을 입력하세요..."
                disabled={isLoading || !isConnected}
              />
              <Button type="submit" disabled={isLoading || !isConnected}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
