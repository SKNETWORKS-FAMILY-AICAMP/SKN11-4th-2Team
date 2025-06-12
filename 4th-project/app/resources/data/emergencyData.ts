// 응급상황 관련 데이터

export interface EmergencyCondition {
  category: string;
  conditions: string[];
  severity: 'high' | 'medium' | 'low';
  description?: string;
}

export interface SafetyTip {
  category: string;
  title: string;
  tips: string[];
}

export interface EmergencyContact {
  name: string;
  number: string;
  description: string;
}

// 이른둥이 응급상황 데이터
export const prematureEmergencyConditions: EmergencyCondition[] = [
  {
    category: "호흡계",
    conditions: [
      "호흡곤란",
      "무호흡",
      "기관지폐이형성증",
      "폐렴"
    ],
    severity: "high",
    description: "호흡 관련 응급상황은 즉시 치료가 필요합니다."
  },
  {
    category: "심혈관계", 
    conditions: [
      "저혈압",
      "동맥관 개존증",
      "울혈성 심부전",
      "쇼크"
    ],
    severity: "high",
    description: "심혈관계 문제는 생명과 직결됩니다."
  },
  {
    category: "혈액계",
    conditions: [
      "빈혈",
      "DIC(파종성 혈관 내 응고 병증)"
    ],
    severity: "medium",
    description: "혈액 관련 문제는 지속적인 모니터링이 필요합니다."
  },
  {
    category: "위장관계",
    conditions: [
      "수유 곤란",
      "신생아 괴사 장염"
    ],
    severity: "medium",
    description: "소화기계 문제는 영양 공급에 영향을 줍니다."
  },
  {
    category: "영양",
    conditions: [
      "영양 장애"
    ],
    severity: "low",
    description: "적절한 영양 공급이 중요합니다."
  },
  {
    category: "대사장애",
    conditions: [
      "저혈당",
      "전해질 불균형"
    ],
    severity: "medium",
    description: "대사 균형 유지가 필요합니다."
  }
];

// 안전 관련 팁 데이터
export const safetyTips: SafetyTip[] = [
  {
    category: "수면 안전",
    title: "1. 수면",
    tips: [
      "아기를 등을 대고 재우고, 침대 매트리스가 단단한지 확인합니다.",
      "침대에는 베개, 담요, 범퍼, 장난감을 두지 않습니다.",
      "침대를 창문, 휘장, 전기선과 기타 끈으로부터 멀리 둡니다.",
      "모든 모빌, 매달아 두는 장난감을 치웠는지 확인합니다."
    ]
  },
  {
    category: "장난감 안전",
    title: "2. 장난감",
    tips: [
      "전기 콘센트가 필요한 장난감은 주지 않습니다. 건전지를 이용하는 장난감의 경우, 건전지 케이스가 안전한지 확인합니다.",
      "레고 등의 작은 부품 장난감도 아이 손이 닿지 않게 해야 합니다.",
      "비닐 조각이나 풍선 등도 질식사를 유발할 수 있습니다."
    ]
  },
  {
    category: "자동차 안전",
    title: "3. 자동차 안전",
    tips: [
      "모든 아이들은 뒷좌석에 후방으로 장착된 카시트에 앉아야 합니다.",
      "카시트는 권장 체격의 최대치에 이를 때까지 사용합니다.",
      "잠시라도 차에 아이만 남겨두어서는 안됩니다.",
      "차 문과 트렁크는 항상 잠가 놓도록 합니다.",
      "운전 중에 아기가 카시트 밖으로 기어오르도록 해서는 안 됩니다.",
      "뒷문의 아동 안전 잠금장치를 사용하는 것을 고려합니다."
    ]
  },
  {
    category: "가정 안전",
    title: "4. 가정안전",
    tips: [
      "질식시킬 수 있는 위험한 음식은 피하고, 아기가 입에 음식을 물고 걸어 다니지 않도록 합니다.",
      "창문에는 방범창을 설치하고 아기가 문을 밀거나 열 수 없도록 합니다. 스크린은 창문에서 아기가 떨어지는 것을 막지 못합니다.",
      "가구의 전기 콘센트를 막거나 커버를 사용해서 전기 콘센트를 덮습니다. 세탁용 청소용 세제는 안전 잠금장치를 하여 장에 넣어둡니다.",
      "접지회로 차단기를 사용하여 감전사를 막아야 합니다.",
      "전기 코드를 아기 손이 닿지 않는 곳에 둡니다.",
      "모든 약은 아기 손이 닿지 않는 곳에 둡니다.",
      "아기가 개에 물리지 않도록 지켜봅니다. 친근한 개라도 언제든 물 수 있기 때문입니다.",
      "연기감지기와 일산화탄소 알람이 작동하는지 확인합니다.",
      "식사나 요리를 하는 동안에는 아이가 부엌에 오지 못하게 합니다."
    ]
  }
];

// 응급연락처 데이터
export const emergencyContacts: EmergencyContact[] = [
  {
    name: "응급실",
    number: "119",
    description: "생명이 위급한 응급상황"
  },
  {
    name: "소아과 응급실", 
    number: "지역별 상이",
    description: "소아 전문 응급처치"
  },
  {
    name: "중독정보센터",
    number: "1588-7129", 
    description: "중독사고 발생시"
  },
  {
    name: "화상정보센터",
    number: "1339",
    description: "화상사고 발생시"
  }
];

// 신생아 집중치료실(NICU) 정보
export const nicuInfo = {
  title: "신생아 집중치료실(Neonatal Intensive Care Unit, NICU)이란?",
  description: "아기가 일찍 태어나거나 건강상의 문제가 있거나 출생이 어려웠던 경우 신생아 치료 전문가 팀으로부터 24시간 내내 집중적인 치료가 가능한 시설인 신생아 집중치료실(NICU)에 입원하여 치료받습니다."
};

// 이른둥이 정의
export const prematureDefinition = {
  title: "이른둥이란?",
  content: [
    "“분만 예정일”은 일반적으로 임신주수로 40주가 되는 때를 말합니다.",
    "분만 예정일보다 3주 이상 일찍 출생한 임신기간 37주 미만의 아기를 “미숙아” 또는 “이른둥이”라고 합니다.",
    "특히 출생체중 1,500g 미만 아기를 “극소저출생체중아”, 1,000g 미만 아기를 “초극소저출생체중아”라고 부릅니다.",
    "이른둥이는 태내에서 충분하게 성장과 발달이 이루어지기 전에 출생하여 생존을 위해 여러 방면의 도움을 필요로 합니다."
  ]
};
