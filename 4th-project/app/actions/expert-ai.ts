'use server';

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import type { CategoryType } from '@/components/expert-chat/expert-chat-with-categories';

// 전문가 AI 응답 생성 함수
export async function generateExpertResponse(
  question: string,
  category: CategoryType = 'all',
) {
  try {
    // 카테고리별 전문가 페르소나 설정
    let expertPersona = '육아 전문가';
    let additionalContext = '';

    switch (category) {
      case 'development':
        expertPersona = '아동발달 전문가';
        additionalContext =
          '아이의 신체, 인지, 언어, 사회성 발달에 관한 전문 지식을 바탕으로 답변해주세요.';
        break;
      case 'sleep':
        expertPersona = '소아 수면 전문가';
        additionalContext =
          '아이의 수면 패턴, 수면 습관 형성, 수면 문제 해결에 관한 전문 지식을 바탕으로 답변해주세요.';
        break;
      case 'nutrition':
        expertPersona = '아동 영양 전문가';
        additionalContext =
          '아이의 영양 섭취, 식습관 형성, 이유식, 편식 문제에 관한 전문 지식을 바탕으로 답변해주세요.';
        break;
      case 'behavior':
        expertPersona = '아동 행동 전문가';
        additionalContext =
          '아이의 행동 발달, 훈육 방법, 문제 행동 대처에 관한 전문 지식을 바탕으로 답변해주세요.';
        break;
      case 'psychology':
        expertPersona = '아동 심리학자';
        additionalContext =
          '아이의 정서 발달, 심리적 안정, 애착 형성에 관한 전문 지식을 바탕으로 답변해주세요.';
        break;
      case 'education':
        expertPersona = '유아 교육 전문가';
        additionalContext =
          '아이의 학습 발달, 교육 방법, 학습 환경 조성에 관한 전문 지식을 바탕으로 답변해주세요.';
        break;
    }

    // 시스템 프롬프트 설정 - 전문가 페르소나 정의
    const systemPrompt = `당신은 '마파덜'의 ${expertPersona} AI입니다. 
    소아과 의사, 아동심리학자, 발달 전문가, 영양사 등 다양한 전문가의 지식을 바탕으로 
    초보 부모님들에게 신뢰할 수 있는 육아 정보와 조언을 제공합니다.
    
    ${additionalContext}
    
    답변 시 다음 원칙을 따르세요:
    1. 과학적 근거와 최신 연구에 기반한 정보를 제공합니다.
    2. 부모의 불안과 부담을 덜어주는 공감적인 어조를 유지합니다.
    3. 한국어로 친절하고 이해하기 쉽게 설명합니다.
    4. 의학적 진단이나 처방은 하지 않으며, 필요시 전문가 상담을 권장합니다.
    5. 아이의 개인차를 존중하고, 다양한 관점을 제시합니다.
    
    답변은 항상 정중하고 전문적이되, 부모가 이해하기 쉬운 용어를 사용하세요.`;

    // AI 응답 생성
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      prompt: question,
      temperature: 0.7,
      maxTokens: 1000,
    });

    return {
      content: text,
      role: 'assistant',
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('AI 응답 생성 오류:', error);
    return {
      content:
        '죄송합니다. 현재 전문가 AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      role: 'assistant',
      createdAt: new Date(),
    };
  }
}
