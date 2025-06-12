import {
  ChatSession,
  ChatMessage,
  ChatError,
  WebSocketMessage,
  ChatSessionType,
  ChatCategory,
  WebSocketResponse,
  SessionInitMessage,
  TypingStatus,
} from '@/types/websocket';
import { getSession } from 'next-auth/react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000';

class WebSocketService {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private messageHandlers: ((message: WebSocketResponse) => void)[] = [];
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastHeartbeat: number = Date.now();
  private isIntentionalClose = false;

  private async getAuthHeaders() {
    const session = await getSession();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.djangoAccessToken}`,
    };
  }

  async createSession(
    type: ChatSessionType,
    category: ChatCategory = 'general',
  ): Promise<ChatSession> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}/chatbot/api/websocket/session/`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ type, category }),
        },
      );

      if (!response.ok) {
        throw new Error('세션 생성에 실패했습니다.');
      }

      const session = await response.json();
      this.sessionId = session.session_id;
      return session;
    } catch (error) {
      console.error('세션 생성 중 오류 발생:', error);
      throw error;
    }
  }

  connect(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws) {
        this.isIntentionalClose = true;
        this.ws.close();
      }

      this.isIntentionalClose = false;
      this.ws = new WebSocket(`${WS_BASE_URL}/ws/chat/${sessionId}/`);

      this.ws.onopen = () => {
        console.log('WebSocket 연결됨');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        resolve();
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket 연결 끊김:', event.code, event.reason);
        this.stopHeartbeat();

        if (!this.isIntentionalClose) {
          this.handleReconnect();
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'heartbeat') {
            this.lastHeartbeat = Date.now();
            return;
          }
          this.messageHandlers.forEach((handler) => handler(message));
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket 에러:', error);
        if (!this.isIntentionalClose) {
          reject(error);
        }
      };
    });
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.lastHeartbeat = Date.now();

    // 30초마다 하트비트 전송
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'heartbeat' }));

        // 마지막 하트비트로부터 1분 이상 지났으면 재연결
        if (Date.now() - this.lastHeartbeat > 60000) {
          console.log('하트비트 타임아웃, 재연결 시도');
          this.handleReconnect();
        }
      }
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const wsMessage: WebSocketMessage = {
        type: 'chat',
        message: message,
      };
      this.ws.send(JSON.stringify(wsMessage));
    } else {
      console.error('WebSocket이 연결되어 있지 않습니다.');
      this.handleReconnect();
    }
  }

  addMessageHandler(handler: (message: WebSocketResponse) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(
        1000 * Math.pow(2, this.reconnectAttempts - 1),
        30000,
      );
      console.log(
        `${delay}ms 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );

      setTimeout(() => {
        if (this.sessionId && !this.isIntentionalClose) {
          this.connect(this.sessionId).catch((error) => {
            console.error('재연결 실패:', error);
          });
        }
      }, delay);
    } else {
      console.error('최대 재연결 시도 횟수 초과');
      this.messageHandlers.forEach((handler) =>
        handler({
          type: 'error',
          error: '연결이 불안정합니다. 페이지를 새로고침해주세요.',
        }),
      );
    }
  }

  disconnect() {
    this.isIntentionalClose = true;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const websocketService = new WebSocketService();
