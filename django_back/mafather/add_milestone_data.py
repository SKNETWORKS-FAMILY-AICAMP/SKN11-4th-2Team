"""
발달 이정표 기본 데이터 추가 스크립트
python manage.py shell < add_milestone_data.py
"""

from api_service.models import DevelopmentMilestone

# 기존 데이터 확인
if DevelopmentMilestone.objects.exists():
    print("이미 발달 이정표 데이터가 존재합니다.")
    exit()

# 발달 이정표 데이터 정의
milestones_data = [
    # 0-3개월 발달 이정표
    {
        'age_group': '0-3months',
        'development_area': 'physical',
        'title': '목 들기',
        'description': '엎드린 상태에서 잠시 목을 들 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '0-3months',
        'development_area': 'physical',
        'title': '손발 움직이기',
        'description': '팔다리를 활발하게 움직입니다.',
        'order': 2
    },
    {
        'age_group': '0-3months',
        'development_area': 'cognitive',
        'title': '시각적 추적',
        'description': '움직이는 물체를 눈으로 따라봅니다.',
        'order': 1
    },
    {
        'age_group': '0-3months',
        'development_area': 'cognitive',
        'title': '소리에 반응',
        'description': '큰 소리에 깜짝 놀라거나 반응을 보입니다.',
        'order': 2
    },
    {
        'age_group': '0-3months',
        'development_area': 'language',
        'title': '울음으로 의사표현',
        'description': '배고픔, 불편함 등을 울음으로 표현합니다.',
        'order': 1
    },
    {
        'age_group': '0-3months',
        'development_area': 'language',
        'title': '옹알이 시작',
        'description': '단순한 소리를 내기 시작합니다.',
        'order': 2
    },
    {
        'age_group': '0-3months',
        'development_area': 'social',
        'title': '사회적 미소',
        'description': '사람을 보고 의도적으로 미소를 짓습니다.',
        'order': 1
    },
    {
        'age_group': '0-3months',
        'development_area': 'social',
        'title': '시선 맞추기',
        'description': '돌보는 사람과 눈을 맞춥니다.',
        'order': 2
    },
    
    # 3-6개월 발달 이정표
    {
        'age_group': '3-6months',
        'development_area': 'physical',
        'title': '뒤집기',
        'description': '배에서 등으로, 등에서 배로 뒤집을 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '3-6months',
        'development_area': 'physical',
        'title': '물건 잡기',
        'description': '손을 뻗어 물건을 잡을 수 있습니다.',
        'order': 2
    },
    {
        'age_group': '3-6months',
        'development_area': 'cognitive',
        'title': '원인과 결과 이해',
        'description': '장난감을 흔들면 소리가 난다는 것을 이해합니다.',
        'order': 1
    },
    {
        'age_group': '3-6months',
        'development_area': 'cognitive',
        'title': '낯선 사람 인식',
        'description': '친숙한 사람과 낯선 사람을 구별합니다.',
        'order': 2
    },
    {
        'age_group': '3-6months',
        'development_area': 'language',
        'title': '다양한 옹알이',
        'description': '\'바바\', \'다다\' 등 다양한 소리를 냅니다.',
        'order': 1
    },
    {
        'age_group': '3-6months',
        'development_area': 'language',
        'title': '이름에 반응',
        'description': '자신의 이름을 부르면 반응을 보입니다.',
        'order': 2
    },
    {
        'age_group': '3-6months',
        'development_area': 'social',
        'title': '낯가림 시작',
        'description': '낯선 사람에게 경계심을 보이기 시작합니다.',
        'order': 1
    },
    {
        'age_group': '3-6months',
        'development_area': 'social',
        'title': '까꿍 놀이 즐기기',
        'description': '까꿍 놀이에 반응하고 즐거워합니다.',
        'order': 2
    },
    
    # 6-9개월 발달 이정표
    {
        'age_group': '6-9months',
        'development_area': 'physical',
        'title': '혼자 앉기',
        'description': '지지 없이 혼자 앉을 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '6-9months',
        'development_area': 'physical',
        'title': '기어다니기',
        'description': '배를 바닥에 대고 기어다닙니다.',
        'order': 2
    },
    {
        'age_group': '6-9months',
        'development_area': 'cognitive',
        'title': '물체 영속성',
        'description': '숨겨진 물건을 찾으려고 시도합니다.',
        'order': 1
    },
    {
        'age_group': '6-9months',
        'development_area': 'cognitive',
        'title': '모방 행동',
        'description': '간단한 동작을 따라합니다.',
        'order': 2
    },
    {
        'age_group': '6-9months',
        'development_area': 'language',
        'title': '첫 단어 준비',
        'description': '\'맘마\', \'아빠\' 등 의미있는 소리를 내기 시작합니다.',
        'order': 1
    },
    {
        'age_group': '6-9months',
        'development_area': 'language',
        'title': '간단한 지시 이해',
        'description': '\'안돼\', \'잘가\' 등 간단한 말을 이해합니다.',
        'order': 2
    },
    {
        'age_group': '6-9months',
        'development_area': 'self_care',
        'title': '컵 잡고 마시기',
        'description': '도움을 받아 컵을 잡고 마실 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '6-9months',
        'development_area': 'self_care',
        'title': '손가락으로 음식 집어먹기',
        'description': '작은 음식 조각을 손가락으로 집어 먹습니다.',
        'order': 2
    },
    
    # 9-12개월 발달 이정표
    {
        'age_group': '9-12months',
        'development_area': 'physical',
        'title': '붙잡고 서기',
        'description': '가구나 벽을 붙잡고 서 있을 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '9-12months',
        'development_area': 'physical',
        'title': '집게손가락으로 집기',
        'description': '엄지와 검지를 이용해 작은 물건을 집을 수 있습니다.',
        'order': 2
    },
    {
        'age_group': '9-12months',
        'development_area': 'cognitive',
        'title': '용기에서 물건 꺼내기',
        'description': '상자나 컵에서 물건을 꺼낼 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '9-12months',
        'development_area': 'cognitive',
        'title': '간단한 문제 해결',
        'description': '장애물을 피해 원하는 물건에 도달합니다.',
        'order': 2
    },
    {
        'age_group': '9-12months',
        'development_area': 'language',
        'title': '첫 단어',
        'description': '\'엄마\', \'아빠\' 등 의미있는 첫 단어를 말합니다.',
        'order': 1
    },
    {
        'age_group': '9-12months',
        'development_area': 'language',
        'title': '손짓으로 의사표현',
        'description': '손을 흔들어 \'안녕\' 인사를 합니다.',
        'order': 2
    },
    {
        'age_group': '9-12months',
        'development_area': 'social',
        'title': '애착 행동',
        'description': '주 양육자에게 강한 애착을 보입니다.',
        'order': 1
    },
    {
        'age_group': '9-12months',
        'development_area': 'social',
        'title': '다른 아기에게 관심',
        'description': '다른 아기를 보면 관심을 보입니다.',
        'order': 2
    },
    
    # 12-18개월 발달 이정표
    {
        'age_group': '12-18months',
        'development_area': 'physical',
        'title': '혼자 걷기',
        'description': '도움 없이 혼자 걸을 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '12-18months',
        'development_area': 'physical',
        'title': '계단 오르기',
        'description': '붙잡고 계단을 오를 수 있습니다.',
        'order': 2
    },
    {
        'age_group': '12-18months',
        'development_area': 'cognitive',
        'title': '블록 쌓기',
        'description': '2-3개의 블록을 쌓을 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '12-18months',
        'development_area': 'cognitive',
        'title': '모양 맞추기',
        'description': '간단한 모양 맞추기 놀이를 할 수 있습니다.',
        'order': 2
    },
    {
        'age_group': '12-18months',
        'development_area': 'language',
        'title': '어휘 증가',
        'description': '10-20개의 단어를 말할 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '12-18months',
        'development_area': 'language',
        'title': '신체 부위 가리키기',
        'description': '\'코가 어디에 있니?\' 하면 가리킬 수 있습니다.',
        'order': 2
    },
    {
        'age_group': '12-18months',
        'development_area': 'self_care',
        'title': '숟가락 사용하기',
        'description': '숟가락을 사용해 혼자 먹으려고 시도합니다.',
        'order': 1
    },
    {
        'age_group': '12-18months',
        'development_area': 'self_care',
        'title': '옷 벗기 도움',
        'description': '옷을 벗을 때 팔을 빼는 등 도움을 줍니다.',
        'order': 2
    },
    
    # 18-24개월 발달 이정표
    {
        'age_group': '18-24months',
        'development_area': 'physical',
        'title': '뛰어다니기',
        'description': '균형을 잡고 뛸 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '18-24months',
        'development_area': 'physical',
        'title': '공 차기',
        'description': '공을 앞으로 찰 수 있습니다.',
        'order': 2
    },
    {
        'age_group': '18-24months',
        'development_area': 'cognitive',
        'title': '상상 놀이',
        'description': '인형에게 밥을 주는 등 상상 놀이를 합니다.',
        'order': 1
    },
    {
        'age_group': '18-24months',
        'development_area': 'cognitive',
        'title': '분류하기',
        'description': '색깔이나 모양별로 물건을 분류합니다.',
        'order': 2
    },
    {
        'age_group': '18-24months',
        'development_area': 'language',
        'title': '두 단어 문장',
        'description': '\'엄마 가\', \'물 줘\' 등 두 단어로 문장을 만듭니다.',
        'order': 1
    },
    {
        'age_group': '18-24months',
        'development_area': 'language',
        'title': '50개 이상 어휘',
        'description': '50개 이상의 단어를 사용할 수 있습니다.',
        'order': 2
    },
    {
        'age_group': '18-24months',
        'development_area': 'social',
        'title': '병행 놀이',
        'description': '다른 아이 옆에서 같은 놀이를 합니다.',
        'order': 1
    },
    {
        'age_group': '18-24months',
        'development_area': 'social',
        'title': '감정 표현',
        'description': '기쁨, 화남 등의 감정을 명확히 표현합니다.',
        'order': 2
    },
    
    # 24-36개월 발달 이정표
    {
        'age_group': '24-36months',
        'development_area': 'physical',
        'title': '세발자전거 타기',
        'description': '세발자전거를 탈 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '24-36months',
        'development_area': 'physical',
        'title': '한 발로 서기',
        'description': '잠시 동안 한 발로 서 있을 수 있습니다.',
        'order': 2
    },
    {
        'age_group': '24-36months',
        'development_area': 'cognitive',
        'title': '퍼즐 맞추기',
        'description': '4-6조각 퍼즐을 맞출 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '24-36months',
        'development_area': 'cognitive',
        'title': '숫자 개념',
        'description': '1, 2, 3까지 셀 수 있습니다.',
        'order': 2
    },
    {
        'age_group': '24-36months',
        'development_area': 'language',
        'title': '3-4단어 문장',
        'description': '3-4개 단어로 이루어진 문장을 말합니다.',
        'order': 1
    },
    {
        'age_group': '24-36months',
        'development_area': 'language',
        'title': '질문하기',
        'description': '\'이게 뭐야?\', \'어디 갔어?\' 등 질문을 합니다.',
        'order': 2
    },
    {
        'age_group': '24-36months',
        'development_area': 'social',
        'title': '협동 놀이',
        'description': '다른 아이와 함께 놀이를 할 수 있습니다.',
        'order': 1
    },
    {
        'age_group': '24-36months',
        'development_area': 'social',
        'title': '규칙 이해',
        'description': '간단한 규칙을 이해하고 따릅니다.',
        'order': 2
    },
    {
        'age_group': '24-36months',
        'development_area': 'self_care',
        'title': '화장실 훈련 시작',
        'description': '화장실 가고 싶다는 의사를 표현합니다.',
        'order': 1
    },
    {
        'age_group': '24-36months',
        'development_area': 'self_care',
        'title': '간단한 옷 입기',
        'description': '티셔츠나 바지를 혼자 입으려고 시도합니다.',
        'order': 2
    },
    {
        'age_group': '24-36months',
        'development_area': 'emotional',
        'title': '감정 조절 시작',
        'description': '화가 났을 때 달래지기 시작합니다.',
        'order': 1
    },
    {
        'age_group': '24-36months',
        'development_area': 'emotional',
        'title': '공감 능력',
        'description': '다른 사람이 슬퍼하면 위로하려고 합니다.',
        'order': 2
    },
]

# 발달 이정표 데이터 생성
print("발달 이정표 데이터를 생성합니다...")

created_count = 0
for milestone_data in milestones_data:
    try:
        milestone = DevelopmentMilestone.objects.create(**milestone_data)
        created_count += 1
        print(f"생성됨: {milestone.age_group} - {milestone.development_area} - {milestone.title}")
    except Exception as e:
        print(f"오류 발생: {milestone_data['title']} - {str(e)}")

print(f"\n총 {created_count}개의 발달 이정표가 생성되었습니다.")

# 생성된 데이터 통계
print("\n=== 생성된 발달 이정표 통계 ===")
for age_group, age_name in DevelopmentMilestone.AGE_GROUP_CHOICES:
    count = DevelopmentMilestone.objects.filter(age_group=age_group).count()
    print(f"{age_name}: {count}개")

print("\n=== 발달 영역별 통계 ===")
for area_code, area_name in DevelopmentMilestone.DEVELOPMENT_AREA_CHOICES:
    count = DevelopmentMilestone.objects.filter(development_area=area_code).count()
    print(f"{area_name}: {count}개")

print("\n발달 이정표 데이터 생성이 완료되었습니다!")
