export type ChatSessionType = 'ai_expert' | 'community' | 'doc';

export type ChatCategory =
  | 'general'
  | 'specialized'
  | 'nutrition'
  | 'behavior'
  | 'psychology'
  | 'education';

export interface ChatSession {
  session_id: string;
  type: ChatSessionType;
  category: ChatCategory;
  message?: string;
}

export interface ChatMessage {
  type: 'ai_response';
  message: string;
  timestamp: string;
  sources: any[];
  session_type: string;
}

export interface ChatError {
  type: 'error';
  error: string;
}

export interface TypingStatus {
  type: 'typing';
  is_typing: boolean;
}

export interface WebSocketMessage {
  type: 'chat';
  message: string;
}

export interface SessionInitMessage {
  type: 'ai_expert';
  category: ChatCategory;
}

export type WebSocketResponse = ChatMessage | ChatError | TypingStatus;
