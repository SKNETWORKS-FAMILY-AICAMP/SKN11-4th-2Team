import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EmergencyInfoComponent } from '../components/EmergencyInfoComponent';

export default function EmergencyGuidePage() {
  const emergencyConditions = [
    {
      category: "호흡계",
      conditions: [
        "호흡곤란",
        "무호흡",
        "기관지폐이형성증",
        "폐렴"
      ],
      severity: "high"
    },
    {
      category: "심혈관계",
      conditions: [
        "저혈압",
        "동맥관 개존증",
        "울혈성 심부전",
        "쇼크"
      ],
      severity: "high"
    },
    {
      category: "혈액계",
      conditions: [
        "빈혈",
        "DIC(파종성 혈관 내 응고 병증)"
      ],
      severity: "medium"
    },
    {
      category: "위장관계",
      conditions: [
        "수유 곤란",
        "신생아 괴사 장염"
      ],
      severity: "medium"
    },
    {
      category: "영양",
      conditions: [
        "영양 장애"
      ],
      severity: "low"
    },
    {
      category: "대사장애",
      conditions: [
        "저혈당",
        "전해질 불균형"
      ],
      severity: "medium"
    }
  ];

  const firstAidSteps = [
    {
      title: "의식 확인",
      steps: [
        "아기의 반응을 확인합니다",
        "부드럽게 어깨를 두드리며 반응을 살핍니다",
        "울음소리나 움직임을 관찰합니다"
      ]
    },
    {
      title: "호흡 확인",
      steps: [
        "가슴의 상하 움직임을 관찰합니다",
        "코와 입 근처에서 호흡을 느껴봅니다",
        "10초간 관찰하여 호흡 유무를 확인합니다"
      ]
    },
    {
      title: "응급처치",
      steps: [
        "기도를 확보합니다 (머리를 살짝 뒤로 젖힙니다)",
        "필요시 인공호흡을 실시합니다",
        "즉시 119에 신고합니다"
      ]
    }
  ];

  const emergencyContacts = [
    { name: "응급실", number: "119", description: "생명이 위급한 응급상황" },
    { name: "소아과 응급실", number: "지역별 상이", description: "소아 전문 응급처치" },
    { name: "중독정보센터", number: "1588-7129", description: "중독사고 발생시" },
    { name: "화상정보센터", number: "1339", description: "화상사고 발생시" }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-green-100 dark:bg-green-950/20 border-green-200 dark:border-green-800';
      default: return 'bg-gray-100 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return <Badge variant="destructive">긴급</Badge>;
      case 'medium': return <Badge variant="outline" className="border-yellow-500 text-yellow-700">주의</Badge>;
      case 'low': return <Badge variant="outline" className="border-green-500 text-green-700">관찰</Badge>;
      default: return <Badge variant="outline">일반</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">소아 응급상황 대처 가이드</h1>
        <p className="text-muted-foreground">
          영유아에게 발생할 수 있는 응급상황을 미리 알아두고 적절히 대처하세요.
        </p>
      </div>

      <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20">
        <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <AlertDescription className="text-red-800 dark:text-red-200 font-medium">
          <strong>중요:</strong> 이 정보는 응급상황 인지를 위한 참고자료입니다. 
          실제 응급상황 발생시 즉시 119에 신고하고 전문의의 진료를 받으세요.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="conditions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conditions">응급 증상</TabsTrigger>
          <TabsTrigger value="first-aid">응급처치</TabsTrigger>
          <TabsTrigger value="contacts">응급연락처</TabsTrigger>
          <TabsTrigger value="detailed-info">상세 정보</TabsTrigger>
        </TabsList>

        <TabsContent value="conditions" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyConditions.map((category, index) => (
              <Card key={index} className={getSeverityColor(category.severity)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category.category}
                    {getSeverityBadge(category.severity)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.conditions.map((condition, conditionIndex) => (
                      <li key={conditionIndex} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-current rounded-full opacity-60"></span>
                        <span className="text-sm">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              즉시 응급실로 가야 하는 증상
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700 dark:text-blue-300">
              <div>• 호흡곤란 또는 무호흡</div>
              <div>• 의식잃음 또는 반응 없음</div>
              <div>• 지속적인 구토</div>
              <div>• 고열(38.5°C 이상)</div>
              <div>• 경련 또는 발작</div>
              <div>• 심한 탈수 증상</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="first-aid" className="mt-6">
          <div className="space-y-6">
            {firstAidSteps.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {step.steps.map((substep, substepIndex) => (
                      <li key={substepIndex} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                          {substepIndex + 1}
                        </span>
                        <span className="text-sm">{substep}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">
                영유아 심폐소생술 주의사항
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                <li>• 1세 미만: 검지와 중지 두 손가락으로 가슴압박</li>
                <li>• 1세 이상: 한 손의 손바닥으로 가슴압박</li>
                <li>• 압박 깊이: 가슴 두께의 1/3 정도 (약 3-4cm)</li>
                <li>• 압박 속도: 분당 100-120회</li>
                <li>• 인공호흡: 가슴이 살짝 올라올 정도로만</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {contact.name}
                    <Badge variant="outline" className="text-lg font-bold text-red-600 border-red-600">
                      {contact.number}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>응급상황 신고 시 전달사항</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">기본 정보</h4>
                  <ul className="space-y-1">
                    <li>• 환자의 나이와 성별</li>
                    <li>• 현재 의식 상태</li>
                    <li>• 발생한 응급상황</li>
                    <li>• 현재 위치와 연락처</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">증상 정보</h4>
                  <ul className="space-y-1">
                    <li>• 증상 발생 시간</li>
                    <li>• 호흡과 맥박 상태</li>
                    <li>• 외상이나 출혈 여부</li>
                    <li>• 복용한 약물이나 음식</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detailed-info" className="mt-6">
          <EmergencyInfoComponent 
            showPrematureInfo={true}
            showSafetyTips={true}
            showContacts={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}