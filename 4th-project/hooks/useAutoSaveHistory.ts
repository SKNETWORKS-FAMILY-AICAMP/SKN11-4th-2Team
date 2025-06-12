import { chatHistoryApi } from '@/services/chat-history-api';

// 자동 히스토리 저장 훅
export function useAutoSaveHistory() {
  const saveHistory = async (
    sessionId: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string; createdAt: Date }>,
    category: 'general' | 'specialized'
  ) => {
    try {
      // 최소 2개 이상의 메시지가 있고, 사용자와 AI 모두 메시지가 있는 경우에만 저장
      if (messages.length < 2) return null;
      
      const hasUserMessage = messages.some(msg => msg.role === 'user');
      const hasAssistantMessage = messages.some(msg => msg.role === 'assistant');
      
      if (!hasUserMessage || !hasAssistantMessage) return null;
      
      // API 형식에 맞게 메시지 변환
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
      }));

      const response = await chatHistoryApi.saveCurrentSession(
        sessionId,
        apiMessages,
        category
      );

      if (response.success) {
        console.log('히스토리 자동 저장 완료:', response.data?.id);
        return response.data?.id;
      } else {
        console.error('히스토리 저장 실패:', response.error);
        return null;
      }
    } catch (error) {
      console.error('히스토리 저장 중 오류:', error);
      return null;
    }
  };

  return { saveHistory };
}
