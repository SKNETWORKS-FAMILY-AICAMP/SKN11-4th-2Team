// 성장 차트 관련 데이터

export interface GrowthData {
  month: string;
  maleWeight: number;
  maleHeight: number;
  femaleWeight: number;
  femaleHeight: number;
}

export interface GrowthCategory {
  category: string;
  ageRange: string;
  description: string;
  characteristics: string;
  data: GrowthData[];
}

// 월령별 성장 데이터 (프로젝트 knowledge 기반)
export const growthCategories: GrowthCategory[] = [
  {
    category: "영아기 초기",
    ageRange: "4-6개월",
    description: "급속한 성장기",
    characteristics: "생후 4-6개월은 급속한 성장기입니다. 체중은 출생 시 대비 약 2배 정도 증가하며, 목가누기, 뒤집기 등의 운동 발달이 활발해집니다.",
    data: [
      { month: "4개월", maleWeight: 7.0, maleHeight: 63.9, femaleWeight: 6.4, femaleHeight: 62.1 },
      { month: "5개월", maleWeight: 7.5, maleHeight: 65.9, femaleWeight: 6.9, femaleHeight: 64.0 },
      { month: "6개월", maleWeight: 7.9, maleHeight: 67.6, femaleWeight: 7.3, femaleHeight: 65.7 }
    ]
  },
  {
    category: "영아기 후기",
    ageRange: "10-12개월", 
    description: "운동 발달기",
    characteristics: "생후 10-12개월은 앉기, 기어다니기, 첫 걸음마 등 중요한 운동 발달이 이루어지는 시기입니다. 체중 증가 속도는 이전보다 완만해집니다.",
    data: [
      { month: "10개월", maleWeight: 9.2, maleHeight: 73.3, femaleWeight: 8.5, femaleHeight: 71.5 },
      { month: "11개월", maleWeight: 9.4, maleHeight: 74.5, femaleWeight: 8.7, femaleHeight: 72.8 },
      { month: "12개월", maleWeight: 9.6, maleHeight: 75.7, femaleWeight: 8.9, femaleHeight: 74.0 }
    ]
  },
  {
    category: "유아기",
    ageRange: "25-36개월",
    description: "언어 및 사회성 발달기", 
    characteristics: "25개월 이후는 활발한 신체 활동과 함께 언어 발달이 급속히 이루어지는 시기입니다. 균형 잡힌 영양 섭취가 중요합니다.",
    data: [
      { month: "25개월", maleWeight: 12.4, maleHeight: 88.0, femaleWeight: 11.7, femaleHeight: 86.6 },
      { month: "30개월", maleWeight: 13.5, maleHeight: 92.3, femaleWeight: 12.9, femaleHeight: 91.1 },
      { month: "36개월", maleWeight: 14.7, maleHeight: 96.5, femaleWeight: 14.2, femaleHeight: 95.4 }
    ]
  }
];

// 성장 관련 주의사항
export const growthConcerns = [
  "성장 곡선에서 급격한 변화가 있을 때",
  "지속적으로 평균 범위를 벗어날 때", 
  "식욕 부진이 지속될 때",
  "발달 지연이 의심될 때"
];

// 건강한 성장을 위한 팁
export const healthyGrowthTips = [
  "규칙적인 수유/식사 시간 유지",
  "충분한 수면과 휴식",
  "연령에 맞는 신체 활동", 
  "정기적인 건강검진 받기"
];

// 성장 차트 사용 안내
export const growthChartGuidance = {
  title: "성장 차트 이용 안내",
  guidelines: [
    "이 데이터는 평균값으로, 아이마다 성장 속도가 다를 수 있습니다",
    "지속적인 성장 추이가 중요하며, 급격한 변화가 있을 때 전문의 상담을 받으세요",
    "정기적인 건강검진을 통해 아이의 전반적인 발달을 확인하세요"
  ]
};
