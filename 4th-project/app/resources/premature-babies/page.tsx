import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Baby, AlertTriangle, Activity, Calendar } from 'lucide-react';

export default function PrematureBabiesPage() {
  const healthProblems = [
    {
      system: "호흡계",
      problems: "호흡곤란증후군, 무호흡, 기관지폐형성장애",
      severity: "high"
    },
    {
      system: "신경계", 
      problems: "뇌실내출혈, 뇌실주위백질연화증",
      severity: "high"
    },
    {
      system: "안과계",
      problems: "미숙아망막병증", 
      severity: "medium"
    },
    {
      system: "순환계",
      problems: "저혈압, 동맥관 개존증, 울혈성 심부전, 쇼크",
      severity: "high"
    },
    {
      system: "혈액계",
      problems: "빈혈, DIC(파종성 혈관 내 응고 병증)",
      severity: "medium"
    },
    {
      system: "위장관계",
      problems: "수유 곤란, 신생아 괴사 장염",
      severity: "medium"
    },
    {
      system: "영양",
      problems: "영양 장애",
      severity: "low"
    },
    {
      system: "대사장애",
      problems: "저혈당, 전해질 불균형",
      severity: "medium"
    }
  ];

  const careStages = [
    {
      stage: "NICU 입원",
      period: "출생 직후 ~ 수주",
      description: "24시간 집중 모니터링과 전문 치료",
      keyActivities: [
        "호흡 지원",
        "영양 공급",
        "감염 예방",
        "발달 촉진 케어"
      ]
    },
    {
      stage: "중간 치료실",
      period: "상태 안정화 후",
      description: "점진적인 정상 환경 적응",
      keyActivities: [
        "모유수유 시작",
        "체중 증가 모니터링", 
        "부모 케어 교육",
        "퇴원 준비"
      ]
    },
    {
      stage: "가정 케어",
      period: "퇴원 후 ~ 2세",
      description: "지속적인 추적 관찰과 발달 지원",
      keyActivities: [
        "정기 검진",
        "발달 평가",
        "예방접종",
        "영양 관리"
      ]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return '즉시 치료 필요';
      case 'medium': return '지속적 관찰';
      case 'low': return '일반적 관리';
      default: return '관찰';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">이른둥이 종합 가이드</h1>
        <p className="text-muted-foreground">
          이른둥이(미숙아)의 정의, 건강 관리, 발달 지원에 대한 전문 정보를 제공합니다.
        </p>
      </div>

      <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <Heart className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>전문 의료진과의 상담이 중요합니다.</strong> 이 정보는 일반적인 가이드라인이며, 
          개별 아기의 상황에 따라 전문의와 상담하시기 바랍니다.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="definition" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="definition">이른둥이란?</TabsTrigger>
          <TabsTrigger value="health-issues">건강 문제</TabsTrigger>
          <TabsTrigger value="care-stages">케어 단계</TabsTrigger>
          <TabsTrigger value="development">발달 지원</TabsTrigger>
        </TabsList>

        <TabsContent value="definition" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="w-6 h-6 text-blue-500" />
                  이른둥이(미숙아)의 정의
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="mb-3">
                      <strong>"분만 예정일"</strong>은 일반적으로 임신주수로 40주가 되는 때를 말합니다. 
                      분만 예정일보다 3주 이상 일찍 출생한 <strong className="text-blue-600">임신기간 37주 미만</strong>의 
                      아기를 "미숙아" 또는 "이른둥이"라고 합니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                        <h4 className="font-semibold text-red-600 mb-2">극소저출생체중아</h4>
                        <p className="text-sm">출생체중 <strong>1,500g 미만</strong> 아기</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                        <h4 className="font-semibold text-red-600 mb-2">초극소저출생체중아</h4>
                        <p className="text-sm">출생체중 <strong>1,000g 미만</strong> 아기</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">왜 특별한 관리가 필요한가요?</h4>
                    <p className="text-sm">
                      이른둥이는 태내에서 충분하게 성장과 발달이 이루어지기 전에 출생하여 
                      생존을 위해 여러 방면의 도움을 필요로 합니다. 
                      폐, 심장, 뇌, 소화기관 등이 아직 미성숙하여 전문적인 의료 지원이 필수적입니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-500" />
                  신생아 집중치료실 (NICU)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    아기가 일찍 태어나거나 건강상의 문제가 있거나 출생이 어려웠던 경우 
                    신생아 치료 전문가 팀으로부터 <strong>24시간 내내 집중적인 치료</strong>가 
                    가능한 시설인 신생아 집중치료실(NICU)에 입원하여 치료받습니다.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 text-blue-600">전문 의료진</h4>
                      <ul className="text-sm space-y-1">
                        <li>• 신생아과 전문의</li>
                        <li>• 간호사</li>
                        <li>• 호흡치료사</li>
                        <li>• 영양사</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 text-green-600">첨단 장비</h4>
                      <ul className="text-sm space-y-1">
                        <li>• 인큐베이터</li>
                        <li>• 인공호흡기</li>
                        <li>• 심장 모니터</li>
                        <li>• 영양 공급 장치</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 text-purple-600">24시간 케어</h4>
                      <ul className="text-sm space-y-1">
                        <li>• 지속적 모니터링</li>
                        <li>• 즉시 응급 대응</li>
                        <li>• 개별 맞춤 치료</li>
                        <li>• 부모 참여 지원</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health-issues" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                건강상 어떤 문제가 생길 수 있을까요?
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                신생아 집중치료실에 입원한 동안 이른둥이들이 주로 겪을 수 있는 문제들입니다.
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        기관계
                      </th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">
                        주요 문제
                      </th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">
                        심각도
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthProblems.map((problem, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="border border-gray-300 p-3 font-medium">
                          {problem.system}
                        </td>
                        <td className="border border-gray-300 p-3">
                          {problem.problems}
                        </td>
                        <td className="border border-gray-300 p-3 text-center">
                          <Badge className={getSeverityColor(problem.severity)}>
                            {getSeverityText(problem.severity)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    <strong>즉시 치료 필요:</strong> 생명과 직결되어 즉각적인 의료진 개입이 필요한 문제들
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                  <Activity className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    <strong>지속적 관찰:</strong> 정기적인 모니터링과 관리가 필요한 문제들
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <Heart className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>일반적 관리:</strong> 적절한 영양과 환경 관리로 개선 가능한 문제들
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care-stages" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">이른둥이 케어 단계별 가이드</h2>
            
            {careStages.map((stage, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{stage.stage}</CardTitle>
                      <p className="text-sm text-muted-foreground">{stage.period}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">{stage.description}</p>
                  
                  <div>
                    <h4 className="font-semibold mb-3">주요 활동</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {stage.keyActivities.map((activity, idx) => (
                        <div key={idx} className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border text-center">
                          <span className="text-sm font-medium">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="development" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-purple-500" />
                  이른둥이 발달 지원
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">교정 연령 계산법</h3>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <p className="text-sm mb-2">
                        <strong>교정 연령</strong> = 실제 연령 - (40주 - 출생 시 임신주수)
                      </p>
                      <div className="text-xs text-purple-700 dark:text-purple-300">
                        예시: 32주에 태어난 아기가 생후 4개월(16주)인 경우<br/>
                        교정 연령 = 16주 - (40주 - 32주) = 8주 (생후 2개월)
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">발달 촉진 방법</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          캥거루 케어 (피부 접촉)
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          적절한 자극과 휴식의 균형
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          정기적인 발달 평가
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          전문 치료사와의 협력
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">장기 추적 관찰</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          신경 발달 검사 (6개월, 12개월, 18개월)
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          시력, 청력 검사
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          성장 모니터링
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          예방접종 일정 조정
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
              <CardHeader>
                <CardTitle className="text-pink-800 dark:text-pink-200">
                  부모를 위한 응원 메시지
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-pink-700 dark:text-pink-300 leading-relaxed">
                  이른둥이를 키우는 것은 쉽지 않은 여정입니다. 하지만 적절한 의료 지원과 
                  사랑 가득한 돌봄으로 많은 이른둥이들이 건강하게 자라나고 있습니다. 
                  의료진과의 협력을 통해 아이만의 속도로 성장해나가는 과정을 믿고 응원해주세요. 
                  부모님의 사랑이 가장 큰 치료제입니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}