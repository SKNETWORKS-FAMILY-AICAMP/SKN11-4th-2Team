'use server';

import { revalidatePath } from 'next/cache';

// 상담 히스토리 타입 정의
export interface ChatHistory {
  id: string;
  title: string;
  category: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 함)
let chatHistories: ChatHistory[] = [
  {
    id: '1',
    title: '아이 수면 문제에 관한 상담',
    category: 'sleep',
    messages: [
      {
        role: 'user',
        content: '8개월 아기가 밤에 자주 깨요. 어떻게 해야 할까요?',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        role: 'assistant',
        content:
          '8개월 아기의 밤중 각성은 흔한 현상입니다. 이 시기에는 분리 불안이 시작되고, 발달 도약기를 겪으면서 수면 패턴이 방해받을 수 있습니다. 일관된 취침 루틴을 만들고, 아기가 스스로 다시 잠들 수 있는 능력을 기르도록 도와주세요. 밤중 수유가 습관이 되었다면 점진적으로 줄여나가는 것도 도움이 됩니다.',
        createdAt: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        role: 'user',
        content: '취침 루틴을 어떻게 만들어야 할까요?',
        createdAt: new Date(Date.now() - 3400000).toISOString(),
      },
      {
        role: 'assistant',
        content:
          '효과적인 취침 루틴은 매일 같은 시간에 비슷한 활동을 반복하는 것입니다. 예를 들어, 목욕 → 마사지 → 편안한 옷 입히기 → 조용한 방에서 책 읽기 → 자장가 → 잠자리에 눕히기 순서로 진행할 수 있습니다. 루틴은 20-30분 정도로 유지하고, 취침 시간 30분 전부터는 밝은 빛과 활발한 놀이를 피하세요. 일관성이 가장 중요합니다.',
        createdAt: new Date(Date.now() - 3300000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3300000).toISOString(),
  },
  {
    id: '2',
    title: '이유식 거부 문제 상담',
    category: 'nutrition',
    messages: [
      {
        role: 'user',
        content: '10개월 아기가 갑자기 이유식을 거부해요. 어떻게 해야 할까요?',
        createdAt: new Date(Date.now() - 2600000).toISOString(),
      },
      {
        role: 'assistant',
        content:
          '10개월 무렵 아기들이 이유식을 거부하는 것은 꽤 흔한 현상입니다. 이 시기에는 자기주장이 강해지고, 새로운 맛과 질감에 더 민감해질 수 있습니다. 또한 이가 나는 과정에서 잇몸 통증이 있거나, 감기 등 가벼운 질병으로 인해 식욕이 떨어질 수도 있습니다. 인내심을 가지고 다양한 음식을 계속 제공하되, 강요하지 마세요. 아기가 스스로 먹도록 격려하고, 식사 시간을 즐거운 경험으로 만들어주세요.',
        createdAt: new Date(Date.now() - 2500000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 2600000).toISOString(),
    updatedAt: new Date(Date.now() - 2500000).toISOString(),
  },
];

// 모든 상담 히스토리 가져오기
export async function getChatHistories() {
  // 실제로는 데이터베이스에서 가져오는 로직
  return chatHistories;
}

// 특정 상담 히스토리 가져오기
export async function getChatHistory(id: string) {
  // 실제로는 데이터베이스에서 가져오는 로직
  return chatHistories.find((history) => history.id === id) || null;
}

// 상담 히스토리 저장하기
export async function saveChatHistory(
  messages: { role: 'user' | 'assistant'; content: string; createdAt: Date }[],
  category: string,
) {
  if (messages.length < 2) return null; // 최소한 하나의 질문과 답변이 있어야 함

  // 첫 번째 사용자 메시지를 제목으로 사용 (20자 제한)
  const firstUserMessage = messages.find((msg) => msg.role === 'user');
  const title = firstUserMessage
    ? firstUserMessage.content.length > 20
      ? `${firstUserMessage.content.substring(0, 20)}...`
      : firstUserMessage.content
    : '새 상담';

  const newHistory: ChatHistory = {
    id: Date.now().toString(), // 실제로는 UUID 등 사용
    title,
    category,
    messages: messages.map((msg) => ({
      ...msg,
      createdAt: msg.createdAt.toISOString(),
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 실제로는 데이터베이스에 저장하는 로직
  chatHistories = [newHistory, ...chatHistories];

  revalidatePath('/expert/history');
  return newHistory.id;
}

// 상담 히스토리 삭제하기
export async function deleteChatHistory(id: string) {
  // 실제로는 데이터베이스에서 삭제하는 로직
  chatHistories = chatHistories.filter((history) => history.id !== id);
  revalidatePath('/expert/history');
  return true;
}
