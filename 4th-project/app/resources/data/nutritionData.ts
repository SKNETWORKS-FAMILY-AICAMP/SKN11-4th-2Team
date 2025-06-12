// 수유 관련 데이터

export interface BreastfeedingTip {
  category: string;
  title: string;
  content: string[];
}

export interface BurpingMethod {
  method: string;
  description: string;
}

export interface FeedingScheduleItem {
  time: string;
  activity: string;
  notes?: string;
}

export interface FeedingLogEntry {
  date: string;
  time: string;
  feedingTime: string; // 좌/우 젖 수유 시간
  formulaAmount?: string;
  stool?: string;
  urine?: string;
  notes?: string;
}

export interface FormulaGuide {
  ageGroup: string;
  dailyFeedings: number;
  amountPerKg: number;
  maxDailyAmount: number;
  guidelines: string[];
}

// 모유수유 관련 팁
export const breastfeedingTips: BreastfeedingTip[] = [
  {
    category: "모유수유 자세",
    title: "올바른 수유 자세",
    content: [
      "엄마가 편안한 자세를 취하고 아기를 가슴 가까이 당깁니다.",
      "아기의 코가 젖꼭지 높이에 오도록 합니다.",
      "아기가 입을 크게 벌리면 빠르게 가슴쪽으로 당깁니다.",
      "아기의 입술이 젖꼭지뿐만 아니라 유륜까지 깊숙이 물도록 합니다."
    ]
  },
  {
    category: "수유 빈도",
    title: "수유 주기와 빈도",
    content: [
      "신생아는 하루 8-12회 정도 수유합니다.",
      "아기가 배고픈 신호를 보일 때마다 수유하세요.",
      "한쪽 젖을 충분히 먹인 후 다른 쪽을 제공합니다.",
      "수유 시간은 보통 15-45분 정도 소요됩니다."
    ]
  }
];

// 트림 시키는 방법
export const burpingMethods: BurpingMethod[] = [
  {
    method: "어깨에 올려서",
    description: "아기를 엄마의 어깨 위까지 올려서 아기의 상체가 엄마의 어깨에 걸치게 합니다. 그리고 한 손은 아기의 엉덩이를 받치고, 다른 손은 아가의 등을 쓰다듬거나 토닥거려 줍니다."
  },
  {
    method: "무릎에 앉혀서",
    description: "아기를 엄마 무릎위에 눕혀서 손바닥으로 쓸어주거나 가볍게 토닥거려 줍니다."
  }
];

// 트림 관련 주의사항
export const burpingNotes = [
  "아기의 위는 미성숙해서 어른들과 달리 트림을 할 때 소량의 젖을 토할 수 있으나 걱정할 필요는 없습니다.",
  "그러나 분수처럼 왈칵 토할 때는 의사와 의논하여야 합니다.",
  "트림을 할 때에는 깨끗한 타올을 받쳐주면 좋습니다.",
  "한 쪽 젖을 먹인 후 트림을 시키고, 기저귀가 젖었으면 갈아주고 다른 쪽 젖을 먹입니다.",
  "만약에 아기가 트림을 잘 하지 않아도 모유를 먹는 경우에는 걱정할 필요가 없습니다."
];

// 수유일지 항목
export const feedingLogItems: FeedingScheduleItem[] = [
  { time: "시간", activity: "수유 시작 시간 기록" },
  { time: "지속시간", activity: "수유가 지속된 시간" },
  { time: "젖", activity: "왼쪽/오른쪽 어느 젖을 먹였는지" },
  { time: "트림", activity: "트림을 했는지 여부" },
  { time: "기저귀", activity: "소변/대변 여부와 횟수" },
  { time: "특이사항", activity: "수유 중 특별한 반응이나 변화" }
];

// 수유일지 예시 데이터
export const sampleFeedingLog: FeedingLogEntry[] = [
  {
    date: "9/1",
    time: "AM 09:00",
    feedingTime: "20/20",
    formulaAmount: "",
    stool: "",
    urine: "",
    notes: "약간 올림"
  },
  {
    date: "9/1",
    time: "AM 10:30",
    feedingTime: "10/25",
    formulaAmount: "",
    stool: "",
    urine: "*",
    notes: ""
  }
];

// 분유 수유 가이드
export const formulaFeedingGuides: FormulaGuide[] = [
  {
    ageGroup: "3-6개월",
    dailyFeedings: 6,
    amountPerKg: 120,
    maxDailyAmount: 960,
    guidelines: [
      "체중 1kg당 약 120cc의 분유가 필요합니다",
      "하루 수유량이 960cc는 넘기지 않도록 합니다",
      "아기가 더 먹으려 해도 제한량을 준수하세요",
      "하루에 아기가 얼마나 수유를 하는지 기록하세요"
    ]
  }
];

// 수유 관련 추가 정보
export const additionalBreastfeedingInfo = {
  title: "수유일지 작성하기",
  description: "아기에게 엄마젖을 처음으로 먹이는 산모는 병원에서 하는 것처럼 아래 방식으로 도표를 만들어서 기록을 해두면 도움이 됩니다.",
  references: [
    "미디어 자료실 : 임신 출산 - 모유수유 동영상",
    "대한산부인과학회 : 모유수유 안내,모유수유를 위한 유방마사지 안내",
    "대한모유수유의학회 : 전문가를 위한 모유수유 지침서, 제2판",
    "마더세이프 : 모유를 안전하게 보관하는 방법"
  ]
};
