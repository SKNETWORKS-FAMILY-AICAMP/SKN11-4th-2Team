'use client';

// 상담 히스토리 타입 정의
export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  sources?: Array<{
    category: string;
    section: string;
    content_preview: string;
  }>;
}

export interface ChatHistory {
  id: string;
  sessionId: string;
  title: string;
  category: 'general' | 'specialized';
  categoryDetail?: string; // nutrition, sleep, development 등 세부 카테고리
  messages: ChatHistoryMessage[];
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  isActive: boolean; // 세션이 아직 활성화되어 있는지
}

export interface ChatHistoryListResponse {
  histories: ChatHistory[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ChatHistoryApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  }

  // 헤더 생성
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
  }

  // API 응답 처리
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }

  // 상담 히스토리 목록 조회
  async getChatHistories(
    page: number = 1,
    limit: number = 20,
    category?: 'general' | 'specialized'
  ): Promise<ApiResponse<ChatHistoryListResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (category) {
        params.append('category', category);
      }

      const response = await fetch(
        `${this.baseUrl}/chatbot/api/history/?${params.toString()}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
          credentials: 'include',
        }
      );

      return this.handleResponse<ChatHistoryListResponse>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.',
      };
    }
  }

  // 특정 상담 히스토리 상세 조회
  async getChatHistory(id: string): Promise<ApiResponse<ChatHistory>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/chatbot/api/history/${id}/`,
        {
          method: 'GET',
          headers: this.getHeaders(),
          credentials: 'include',
        }
      );

      return this.handleResponse<ChatHistory>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.',
      };
    }
  }

  // 상담 히스토리 삭제
  async deleteChatHistory(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/chatbot/api/history/${id}/`,
        {
          method: 'DELETE',
          headers: this.getHeaders(),
          credentials: 'include',
        }
      );

      if (response.ok) {
        return { success: true, data: true };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || '삭제 중 오류가 발생했습니다.',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.',
      };
    }
  }

  // 상담 히스토리 제목 수정
  async updateChatHistoryTitle(id: string, title: string): Promise<ApiResponse<ChatHistory>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/chatbot/api/history/${id}/`,
        {
          method: 'PATCH',
          headers: this.getHeaders(),
          credentials: 'include',
          body: JSON.stringify({ title }),
        }
      );

      return this.handleResponse<ChatHistory>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.',
      };
    }
  }

  // 현재 세션 저장 (세션 종료 시)
  async saveCurrentSession(
    sessionId: string,
    messages: ChatHistoryMessage[],
    category: 'general' | 'specialized',
    title?: string
  ): Promise<ApiResponse<ChatHistory>> {
    try {
      if (messages.length === 0) {
        return {
          success: false,
          error: '저장할 메시지가 없습니다.',
        };
      }

      // 첫 번째 사용자 메시지를 제목으로 사용
      const defaultTitle = messages.find(msg => msg.role === 'user')?.content.slice(0, 50) || '새 상담';

      const response = await fetch(
        `${this.baseUrl}/chatbot/api/history/save/`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          credentials: 'include',
          body: JSON.stringify({
            sessionId,
            title: title || defaultTitle,
            category,
            messages,
          }),
        }
      );

      return this.handleResponse<ChatHistory>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.',
      };
    }
  }

  // 세션 복원 (이어서 상담하기)
  async restoreSession(historyId: string): Promise<ApiResponse<{
    sessionId: string;
    messages: ChatHistoryMessage[];
    category: 'general' | 'specialized';
  }>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/chatbot/api/history/${historyId}/restore/`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          credentials: 'include',
        }
      );

      return this.handleResponse<{
        sessionId: string;
        messages: ChatHistoryMessage[];
        category: 'general' | 'specialized';
      }>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.',
      };
    }
  }
}

// 싱글톤 인스턴스 생성
export const chatHistoryApi = new ChatHistoryApiService();

// React Query 또는 SWR을 위한 키 생성기
export const chatHistoryKeys = {
  all: ['chatHistory'] as const,
  lists: () => [...chatHistoryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...chatHistoryKeys.lists(), filters] as const,
  details: () => [...chatHistoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...chatHistoryKeys.details(), id] as const,
};
