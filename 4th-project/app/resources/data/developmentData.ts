// 발달 이정표 관련 데이터

export interface DevelopmentMilestone {
  ageGroup: string;
  category: string;
  milestones: string[];
}

export interface AgeGroupDetail {
  ageGroup: string;
  description: string;
  characteristics: string;
  keyMilestones: string[];
}

export interface DevelopmentToy {
  ageGroup: string;
  toys: {
    name: string;
    src: string;
    alt: string;
  }[];
}

// 연령별 발달 이정표 데이터
export const developmentMilestones: DevelopmentMilestone[] = [
  {
    ageGroup: "3-4세",
    category: "사회성/감정",
    milestones: [
      "친구들에게 관심을 보이고 함께 놀기를 좋아한다.",
      "차례를 지키는 모습을 보인다.",
      "유도하지 않아도 친구들에게 애정을 보인다.",
      "게임에서 차례를 기다린다.",
      "울고 있는 친구를 염려한다.",
      "'내 것' 과 '그의 것' 또는 '그녀의 것' 이라는 개념을 이해한다.",
      "다양한 감정을 보인다.",
      "부모 중 어느 편과도 쉽게 떨어진다.",
      "일과에 큰 변화가 생기면 화를 낼 수도 있다.",
      "스스로 옷을 입고 벗는다."
    ]
  },
  {
    ageGroup: "3-4세",
    category: "언어/의사소통",
    milestones: [
      "두세 단계의 지시를 따른다.",
      "익숙한 물건들의 이름을 대부분 말할 수 있다.",
      "'안에', '위에', '아래에' 같은 단어를 이해한다.",
      "이름, 나이, 성별을 말한다.",
      "친구의 이름을 말한다.",
      "'나', '나를', '너' 및 몇 가지 복수형(자동차들, 개들, 고양이들) 등의 단어를 말한다.",
      "낯선 사람도 대체로 이해할 정도로 말을 충분히 잘한다.",
      "두세 문장을 사용하며 대화하고 문장으로 자신의 의사 표현을 한다."
    ]
  },
  {
    ageGroup: "3-4세",
    category: "인지(학습, 생각, 문제해결)",
    milestones: [
      "버튼, 레버 및 움직이는 부품이 있는 장난감을 다룰 수 있다.",
      "인형, 동물, 사람을 가지고 지어내기 놀이를 한다.",
      "셋이나 네 조각으로 된 퍼즐 맞추기를 한다.",
      "'둘'이 무엇을 의미하는지 이해한다.",
      "연필이나 크레용으로 원을 보고 따라 그린다.",
      "책장을 한 번에 한 장씩 넘긴다.",
      "6개 이상의 블록으로 탑을 쌓는다.",
      "병뚜껑을 돌려서 열고 닫으며 문 손잡이를 돌린다."
    ]
  },
  {
    ageGroup: "3-4세",
    category: "움직임/신체 발달",
    milestones: [
      "잘 기어오른다.",
      "쉽게 달린다.",
      "세발자전거 페달을 밟는다.",
      "한 계단에 한 발씩 대며, 계단을 오르내린다.",
      "한쪽 발로 잠깐(2초)서 있는다."
    ]
  }
];

// 연령별 발달 놀이도구 데이터
export const developmentToys: DevelopmentToy[] = [
  {
    ageGroup: "4-6개월",
    toys: [
      {
        name: "돼지인형",
        src: "/cms/gen/images/sub/03_sub_002_007_08_9_1.jpg",
        alt: "4개월에서 6개월 아이 발달놀이도구1:돼지인형"
      },
      {
        name: "손노리개",
        src: "/cms/gen/images/sub/03_sub_002_007_08_9_2.jpg",
        alt: "4개월에서 6개월 아이 발달놀이도구2:손노리개"
      },
      {
        name: "오리인형",
        src: "/cms/gen/images/sub/03_sub_002_007_08_9_3.jpg",
        alt: "4개월에서 6개월 아이 발달놀이도구3:오리인형"
      }
    ]
  },
  {
    ageGroup: "7-9개월",
    toys: [
      {
        name: "컵",
        src: "/cms/gen/images/sub/03_sub_002_007_08_10_1.jpg",
        alt: "7개월에서 9개월 아이 발달놀이도구1:컵"
      },
      {
        name: "수저",
        src: "/cms/gen/images/sub/03_sub_002_007_08_10_2.jpg",
        alt: "7개월에서 9개월 아이 발달놀이도구2:수저"
      },
      {
        name: "블록",
        src: "/cms/gen/images/sub/03_sub_002_007_08_10_3.jpg",
        alt: "7개월에서 9개월 아이 발달놀이도구3:블록"
      },
      {
        name: "퍼즐",
        src: "/cms/gen/images/sub/03_sub_002_007_08_10_4.jpg",
        alt: "7개월에서 9개월 아이 발달놀이도구4:퍼즐"
      }
    ]
  },
  {
    ageGroup: "10-12개월",
    toys: [
      {
        name: "저금통",
        src: "/cms/gen/images/sub/03_sub_002_007_08_11_1.jpg",
        alt: "10개월에서 12개월 아이 발달놀이도구1:저금통"
      }
    ]
  }
];

// 연령대별 상세 정보
export const ageGroupDetails: AgeGroupDetail[] = [
  {
    ageGroup: "0-3개월",
    description: "신생아 적응기",
    characteristics: "신생아는 반사적 행동이 주를 이루며, 점차 의도적인 움직임과 사회적 반응이 나타납니다. 수유와 수면 패턴이 점차 규칙적으로 변합니다.",
    keyMilestones: [
      "목 가누기",
      "사회적 미소", 
      "소리에 반응",
      "기본적인 반사작용"
    ]
  },
  {
    ageGroup: "3-6개월", 
    description: "기본 운동 발달기",
    characteristics: "목 가누기가 완성되고 뒤집기가 시작됩니다. 사회적 상호작용이 늘어나고 옹알이를 통한 의사소통이 시작됩니다.",
    keyMilestones: [
      "뒤집기",
      "앉기 시도",
      "옹알이",
      "물건 잡기"
    ]
  },
  {
    ageGroup: "6-9개월",
    description: "탐색 활동기", 
    characteristics: "앉기와 기어다니기를 통해 세상을 탐색하기 시작합니다. 낯가림이 시작되고 애착 관계가 더욱 뚜렷해집니다.",
    keyMilestones: [
      "혼자 앉기",
      "기어다니기", 
      "이름에 반응",
      "낯가림"
    ]
  },
  {
    ageGroup: "9-12개월",
    description: "이동 시작기",
    characteristics: "서기와 걷기 준비가 시작되고, 첫 단어가 나옵니다. 정신운동 발달이 급속히 이루어지는 시기입니다.", 
    keyMilestones: [
      "잡고 서기",
      "첫 단어",
      "손가락으로 집기",
      "까꿍 놀이"
    ]
  },
  {
    ageGroup: "12-18개월",
    description: "보행 완성기",
    characteristics: "독립적인 보행이 완성되고 어휘가 급격히 늘어납니다. 자율성이 증가하며 간단한 일상생활 참여가 가능해집니다.",
    keyMilestones: [
      "혼자 걷기",
      "단어 5-10개",
      "컵으로 마시기", 
      "간단한 지시 따르기"
    ]
  },
  {
    ageGroup: "18-24개월",
    description: "언어 폭발기",
    characteristics: "언어 폭발기로 두 단어 조합이 시작됩니다. 상상 놀이가 시작되고 자아 인식이 뚜렷해집니다.",
    keyMilestones: [
      "뛰기",
      "두 단어 조합",
      "계단 오르기",
      "숟가락 사용"
    ]
  }
];
