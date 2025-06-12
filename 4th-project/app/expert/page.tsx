'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RefreshCw,
  Brain,
  MessageCircle,
  Clock,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { websocketService } from '@/services/websocket-service';
import {
  WebSocketResponse,
  ChatSessionType,
  ChatCategory,
} from '@/types/websocket';

// 샘플 데이터
const expertFeatures = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: '검증된 정보',
    description: '최신 연구와 과학적 근거에 기반한 정보를 제공합니다.',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: '24시간 상담',
    description: '언제든지 즉시 답변을 받을 수 있습니다.',
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: '다양한 분야',
    description: '발달, 수유, 영양, 심리, 교육 등 다양한 정보를 제공합니다.',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: '상담 내용 저장',
    description: '상담 내용을 저장하고 나중에 다시 확인할 수 있습니다.',
  },
];

const frequentQuestions = [
  '12개월 아기 아직 걷지 못해요. 걱정해야 할까요?',
  '아이가 또래보다 말이 늦는 것 같아요. 어떻게 도와줄 수 있을까요?',
  '8개월 아기 밤중 자꾸 깨요. 개월에 따라 수면 패턴이 어떻게 다른지 궁금해요',
  '2살 아이의 작심 수 시간 징징거리고 떼를 써요. 어떻게 훈육할까요?',
];

const sampleQuestions = [
  '8개월 아기 밤중 자꾸 깨요. 개월에 따라 수면 패턴이 어떻게 다른지 궁금해요',
  '2살 이유식 적정 수신 시간은 얼마나 걸리고?',
  '이유식 기계어 아직 먹지 않나요?',
  '아이식 기계어 의식 수신 받은 것 같아요?',
];

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
  sources?: any[];
}

export default function ExpertPage() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 다크모드 상태 (next-themes 기반)
  const isDark = theme === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 웹소켓 연결 초기화
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setError(null);
        const session = await websocketService.createSession(
          'ai_expert',
          'general',
        );
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
          setIsTyping(false);
        } else if (response.type === 'ai_response') {
          const newMessage: Message = {
            id: Date.now().toString(),
            content: response.message,
            isAI: true,
            timestamp: new Date(response.timestamp),
            sources: response.sources || [],
          };
          setMessages((prev) => [...prev, newMessage]);
          setIsTyping(false);
          setError(null);
        } else if (response.type === 'typing') {
          setIsTyping(response.is_typing);
        }
      },
    );

    initializeChat();

    return () => {
      cleanup();
      websocketService.disconnect();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!isConnected) {
      setError(
        '채팅 서버에 연결되어 있지 않습니다. 잠시 후 다시 시도해주세요.',
      );
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 웹소켓으로 메시지 전송
    websocketService.sendMessage(inputMessage);
  };

  const handleQuestionClick = (question: string) => {
    setInputMessage(question);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // 연결 중일 때 로딩 화면
  if (isConnecting) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary/10">
            <Brain className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-lg font-medium">채팅을 초기화하는 중입니다...</p>
          <p className="text-sm text-muted-foreground mt-2">
            잠시만 기다려주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? 'fixed inset-0 z-50 lg:static lg:inset-auto' : 'hidden'} lg:block w-full lg:w-80 border-r`}
      >
        {/* 모바일에서 배경 클릭 시 사이드바 닫기 */}
        {isSidebarOpen && (
          <div
            className="lg:hidden absolute inset-0 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div className="relative z-50 w-80 h-full lg:w-full bg-background">
          <div className="p-6 h-full overflow-y-auto">
            {/* AI 상담 특징 */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">AI 상담 특징</h2>
              <div className="space-y-4">
                {expertFeatures.map((feature, index) => (
                  <div key={index} className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 p-2 rounded bg-primary/10 text-primary">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{feature.title}</h3>
                        <p className="text-xs mt-1 text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 자주 묻는 질문 */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                자주 묻는 질문 예시
              </h2>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  발달 문의
                </h3>
                {frequentQuestions.slice(0, 2).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="w-full text-left p-3 text-xs rounded-lg transition-colors bg-secondary/30 hover:bg-secondary/60"
                  >
                    "{question}"
                  </button>
                ))}

                <h3 className="text-sm font-medium mt-6 text-green-600 dark:text-green-400">
                  수면 문의
                </h3>
                {frequentQuestions.slice(2).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="w-full text-left p-3 text-xs rounded-lg transition-colors bg-secondary/30 hover:bg-secondary/60"
                  >
                    "{question}"
                  </button>
                ))}

                <h3 className="text-sm font-medium mt-6 text-purple-600 dark:text-purple-400">
                  영양 문의
                </h3>
                {sampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="w-full text-left p-3 text-xs rounded-lg transition-colors bg-secondary/30 hover:bg-secondary/60"
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-secondary"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <h1 className="text-lg font-semibold">AI 전문가 상담</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                ● {isConnected ? '온라인' : '연결 끊김'}
              </span>
              <button
                onClick={clearChat}
                className="p-2 rounded-md hover:bg-secondary"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-destructive">연결 오류</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 bg-primary/10">
                <Brain className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                안녕하세요! AI 육아 전문가입니다
              </h3>
              <p className="text-sm mb-6 text-muted-foreground">
                초보 부모님들의 육아 궁금증을 풀어드리고 조언해드립니다.
                <br />
                어떤 질문이든 편하게 물어보세요!
              </p>
              <div className="text-left max-w-md mx-auto">
                <p className="text-xs font-medium mb-2">
                  💡 이런 것들을 물어보실 수 있어요:
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• 발달, 수유, 영양, 심리, 교육</li>
                  <li>• 수면 패턴, 훈육 방법</li>
                  <li>• 응급 상황 대처법</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] ${message.isAI ? 'flex items-start space-x-3' : ''}`}
                  >
                    {message.isAI && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary">
                        <Brain className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg ${
                        message.isAI
                          ? 'bg-background border'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          message.isAI ? 'text-muted-foreground' : 'opacity-70'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[70%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary">
                      <Brain className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="p-3 rounded-lg bg-background border">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground"
                          style={{ animationDelay: '0ms' }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground"
                          style={{ animationDelay: '150ms' }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground"
                          style={{ animationDelay: '300ms' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-background">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  // 자동 크기 조절
                  e.target.style.height = 'auto';
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    // 한글 조합 중일 때는 전송하지 않음
                    if (e.nativeEvent.isComposing) {
                      return;
                    }
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                onCompositionStart={() => {
                  // 한글 조합 시작 시 플래그 설정 (필요시 사용)
                }}
                onCompositionEnd={() => {
                  // 한글 조합 완료 시 플래그 해제 (필요시 사용)
                }}
                placeholder={
                  isConnected
                    ? '질문을 기다리는 중...'
                    : '연결 중... 잠시만 기다려주세요.'
                }
                className="w-full p-3 rounded-lg resize-none border bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
                disabled={!isConnected}
              />
              <p className="text-xs mt-2 text-muted-foreground">
                Enter로 전송 | Shift + Enter로 줄바꿈
              </p>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping || !isConnected}
              className={`p-3 rounded-lg transition-colors ${
                inputMessage.trim() && !isTyping && isConnected
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
