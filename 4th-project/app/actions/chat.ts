'use server';

import { revalidatePath } from 'next/cache';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(message: string): Promise<ChatMessage> {
  try {
    // TODO: 실제 AI 모델과 연동
    // 현재는 임시 응답
    return {
      role: 'assistant',
      content: '죄송합니다. 아직 개발 중인 기능입니다. 곧 서비스될 예정입니다.',
    };
  } catch (error) {
    console.error('Chat API error:', error);
    throw new Error('채팅 메시지 전송 중 오류가 발생했습니다.');
  }
}
