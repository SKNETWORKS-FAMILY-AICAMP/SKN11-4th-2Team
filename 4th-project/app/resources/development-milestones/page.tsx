import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Info } from 'lucide-react';
import { DevelopmentToysComponent } from '../components/DevelopmentToysComponent';
import { DetailedMilestonesComponent } from '../components/DetailedMilestonesComponent';

interface Milestone {
  ageGroup: string;
  title: string;
  description: string;
  developmentArea: string;
  order: number;
}

export default function DevelopmentMilestonesPage() {
  const milestones: Milestone[] = [
    // 0-3개월
    {
      ageGroup: "0-3개월",
      title: "목 가누기",
      description: "엎드린 상태에서 머리를 들고 목을 가눌 수 있어요",
      developmentArea: "신체발달",
      order: 1
    },
    {
      ageGroup: "0-3개월",
      title: "사회적 미소",
      description: "다른 사람을 보고 의미있는 미소를 지을 수 있어요",
      developmentArea: "사회성발달",
      order: 2
    },
    {
      ageGroup: "0-3개월",
      title: "소리에 반응",
      description: "소리가 나는 쪽으로 고개를 돌리거나 반응을 보여요",
      developmentArea: "인지발달",
      order: 3
    },
    
    // 3-6개월
    {
      ageGroup: "3-6개월",
      title: "뒤집기",
      description: "스스로 뒤집을 수 있어요 (배→등, 등→배)",
      developmentArea: "신체발달",
      order: 1
    },
    {
      ageGroup: "3-6개월",
      title: "앉기 시도",
      description: "지지해주면 앉은 자세를 유지할 수 있어요",
      developmentArea: "신체발달",
      order: 2
    },
    {
      ageGroup: "3-6개월",
      title: "옹알이",
      description: "'바바바', '마마마' 같은 음절을 반복해서 말해요",
      developmentArea: "언어발달",
      order: 3
    },
    {
      ageGroup: "3-6개월",
      title: "물건 잡기",
      description: "손으로 물건을 잡고 입으로 가져가요",
      developmentArea: "인지발달",
      order: 4
    },
    
    // 6-9개월
    {
      ageGroup: "6-9개월",
      title: "혼자 앉기",
      description: "도움 없이 혼자 앉아있을 수 있어요",
      developmentArea: "신체발달",
      order: 1
    },
    {
      ageGroup: "6-9개월",
      title: "기어다니기",
      description: "배밀이나 네발로 기어다닐 수 있어요",
      developmentArea: "신체발달",
      order: 2
    },
    {
      ageGroup: "6-9개월",
      title: "이름에 반응",
      description: "자신의 이름을 부르면 반응을 보여요",
      developmentArea: "언어발달",
      order: 3
    },
    {
      ageGroup: "6-9개월",
      title: "낯가림",
      description: "낯선 사람을 보면 울거나 엄마에게 매달려요",
      developmentArea: "사회성발달",
      order: 4
    },
    
    // 9-12개월
    {
      ageGroup: "9-12개월",
      title: "잡고 서기",
      description: "가구나 벽을 잡고 서있을 수 있어요",
      developmentArea: "신체발달",
      order: 1
    },
    {
      ageGroup: "9-12개월",
      title: "첫 단어",
      description: "'엄마', '아빠' 같은 의미있는 첫 단어를 말해요",
      developmentArea: "언어발달",
      order: 2
    },
    {
      ageGroup: "9-12개월",
      title: "손가락으로 집기",
      description: "엄지와 검지로 작은 물건을 집을 수 있어요",
      developmentArea: "신체발달",
      order: 3
    },
    {
      ageGroup: "9-12개월",
      title: "까꿍 놀이",
      description: "까꿍 놀이를 이해하고 즐거워해요",
      developmentArea: "인지발달",
      order: 4
    },
    
    // 12-18개월
    {
      ageGroup: "12-18개월",
      title: "혼자 걷기",
      description: "도움 없이 혼자 걸을 수 있어요",
      developmentArea: "신체발달",
      order: 1
    },
    {
      ageGroup: "12-18개월",
      title: "단어 5-10개",
      description: "5-10개의 단어를 말할 수 있어요",
      developmentArea: "언어발달",
      order: 2
    },
    {
      ageGroup: "12-18개월",
      title: "컵으로 마시기",
      description: "컵을 들고 혼자 물을 마실 수 있어요",
      developmentArea: "자립발달",
      order: 3
    },
    {
      ageGroup: "12-18개월",
      title: "간단한 지시 따르기",
      description: "'이리 와', '앉아' 같은 간단한 지시를 따라할 수 있어요",
      developmentArea: "인지발달",
      order: 4
    },
    
    // 18-24개월
    {
      ageGroup: "18-24개월",
      title: "뛰기",
      description: "두 발을 함께 들어 뛸 수 있어요",
      developmentArea: "신체발달",
      order: 1
    },
    {
      ageGroup: "18-24개월",
      title: "두 단어 조합",
      description: "'엄마 가', '물 줘' 같은 두 단어를 조합해서 말해요",
      developmentArea: "언어발달",
      order: 2
    },
    {
      ageGroup: "18-24개월",
      title: "계단 오르기",
      description: "손잡이를 잡고 계단을 올라갈 수 있어요",
      developmentArea: "신체발달",
      order: 3
    },
    {
      ageGroup: "18-24개월",
      title: "숟가락 사용",
      description: "숟가락을 사용해서 혼자 밥을 먹을 수 있어요",
      developmentArea: "자립발달",
      order: 4
    }
  ];

  const developmentAreas = [
    { id: 'physical', name: '신체발달', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { id: 'cognitive', name: '인지발달', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { id: 'language', name: '언어발달', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    { id: 'social', name: '사회성발달', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    { id: 'selfcare', name: '자립발달', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' }
  ];

  const ageGroups = [
    { id: '0-3months', name: '0-3개월', description: '신생아 적응기' },
    { id: '3-6months', name: '3-6개월', description: '기본 운동 발달기' },
    { id: '6-9months', name: '6-9개월', description: '탐색 활동기' },
    { id: '9-12months', name: '9-12개월', description: '이동 시작기' },
    { id: '12-18months', name: '12-18개월', description: '보행 완성기' },
    { id: '18-24months', name: '18-24개월', description: '언어 폭발기' }
  ];

  const getAreaColor = (area: string) => {
    const areaInfo = developmentAreas.find(dev => dev.name === area);
    return areaInfo ? areaInfo.color : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getMilestonesByAge = (ageGroup: string) => {
    return milestones.filter(milestone => milestone.ageGroup === ageGroup);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">발달 이정표 가이드</h1>
        <p className="text-muted-foreground">
          연령별 주요 발달 이정표를 확인하고 아이의 성장을 모니터링하세요. 
          모든 아이는 개별적인 발달 속도를 가지므로 참고용으로 활용하세요.
        </p>
      </div>

      <div className="mb-6">
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  발달 이정표 활용 팁
                </h3>
                <div className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                  <p>• 제시된 연령은 평균적인 발달 시기로, ±2개월 정도의 차이는 정상입니다</p>
                  <p>• 한 영역이 늦어도 다른 영역이 정상이라면 크게 걱정하지 마세요</p>
                  <p>• 지속적인 관찰과 기록을 통해 아이만의 발달 패턴을 파악하세요</p>
                  <p>• 여러 영역에서 지연이 의심되면 소아과 전문의와 상담하세요</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">발달 영역별 분류</h2>
        <div className="flex flex-wrap gap-2">
          {developmentAreas.map((area) => (
            <Badge key={area.id} className={area.color}>
              {area.name}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="0-3months" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {ageGroups.map((group) => (
            <TabsTrigger key={group.id} value={group.id} className="text-xs">
              {group.name}
            </TabsTrigger>
          ))}
          <TabsTrigger value="detailed" className="text-xs">
            상세 정보
          </TabsTrigger>
          <TabsTrigger value="toys" className="text-xs">
            놀이도구
          </TabsTrigger>
        </TabsList>

        {ageGroups.map((group) => (
          <TabsContent key={group.id} value={group.id} className="mt-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{group.name}</h3>
              <p className="text-muted-foreground text-sm">{group.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getMilestonesByAge(group.name).map((milestone, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight">
                        {milestone.title}
                      </CardTitle>
                      <Badge className={getAreaColor(milestone.developmentArea)}>
                        {milestone.developmentArea}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {milestone.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Circle className="w-4 h-4" />
                      <span>체크리스트에 추가하여 관찰해보세요</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <h4 className="font-semibold mb-2">이 시기 발달 특징</h4>
              <div className="text-sm text-muted-foreground">
                {group.name === '0-3개월' && (
                  <p>신생아는 반사적 행동이 주를 이루며, 점차 의도적인 움직임과 사회적 반응이 나타납니다. 수유와 수면 패턴이 점차 규칙적으로 변합니다.</p>
                )}
                {group.name === '3-6개월' && (
                  <p>목 가누기가 완성되고 뒤집기가 시작됩니다. 사회적 상호작용이 늘어나고 옹알이를 통한 의사소통이 시작됩니다.</p>
                )}
                {group.name === '6-9개월' && (
                  <p>앉기와 기어다니기를 통해 세상을 탐색하기 시작합니다. 낯가림이 시작되고 애착 관계가 더욱 뚜렷해집니다.</p>
                )}
                {group.name === '9-12개월' && (
                  <p>서기와 걷기 준비가 시작되고, 첫 단어가 나옵니다. 정신운동 발달이 급속히 이루어지는 시기입니다.</p>
                )}
                {group.name === '12-18개월' && (
                  <p>독립적인 보행이 완성되고 어휘가 급격히 늘어납니다. 자율성이 증가하며 간단한 일상생활 참여가 가능해집니다.</p>
                )}
                {group.name === '18-24개월' && (
                  <p>언어 폭발기로 두 단어 조합이 시작됩니다. 상상 놀이가 시작되고 자아 인식이 뚜렷해집니다.</p>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
        
        <TabsContent value="detailed" className="mt-6">
          <DetailedMilestonesComponent />
        </TabsContent>
        
        <TabsContent value="toys" className="mt-6">
          <DevelopmentToysComponent showAll={true} />
        </TabsContent>
      </Tabs>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">발달 지연 신호</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                같은 연령대 대비 여러 영역에서 뚜렷한 지연
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                이전에 할 수 있던 것을 못하게 됨 (퇴행)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                18개월에도 의미있는 단어가 없음
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                24개월에도 두 단어 조합을 하지 못함
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                눈 맞춤이나 사회적 상호작용 회피
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">발달 촉진 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                충분한 바닥 시간 제공 (엎드리기, 자유 놀이)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                풍부한 언어적 상호작용 (대화, 책 읽기)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                연령에 적합한 장난감과 놀이 제공
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                규칙적인 일과와 충분한 수면
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                사회적 상호작용 기회 제공
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}