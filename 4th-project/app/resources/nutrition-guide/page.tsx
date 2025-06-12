import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BreastfeedingGuideComponent } from '../components/BreastfeedingGuideComponent';

export default function NutritionGuidePage() {
  const nutritionByAge = [
    {
      ageGroup: "0-6개월",
      mainNutrition: "모유 또는 분유",
      description: "생후 6개월까지는 모유나 분유만으로 충분한 영양을 공급받을 수 있습니다.",
      guidelines: [
        "모유수유: 아기가 원할 때마다 자주 수유 (하루 8-12회)",
        "분유수유: 체중 1kg당 150-200ml (하루 총량)",
        "생후 4-6개월부터 이유식 준비 신호 관찰",
        "별도의 물이나 다른 음식은 필요하지 않음"
      ],
      avoidFoods: ["꿀", "견과류", "생우유", "가공식품"],
      tips: "수유 후 트림을 꼭 시켜주고, 수유량보다는 체중 증가 추이를 관찰하세요."
    },
    {
      ageGroup: "6-12개월",
      mainNutrition: "모유/분유 + 이유식",
      description: "점진적으로 이유식을 시작하여 다양한 식품을 경험하게 해주세요.",
      guidelines: [
        "6개월: 미음, 으깬 과일부터 시작",
        "7-8개월: 죽 형태의 이유식, 새로운 식재료 추가",
        "9-10개월: 손으로 집어먹을 수 있는 음식 제공",
        "11-12개월: 가족 식단과 유사한 형태로 발전"
      ],
      avoidFoods: ["꿀", "견과류", "생우유", "염분이 높은 음식", "단 음료"],
      tips: "알레르기 반응을 관찰하며 새로운 식품은 3-5일 간격으로 도입하세요."
    },
    {
      ageGroup: "12-24개월",
      mainNutrition: "가족 식단 + 우유",
      description: "가족과 함께하는 식사를 통해 올바른 식습관을 형성하는 시기입니다.",
      guidelines: [
        "하루 3끼 식사 + 2-3회 간식",
        "우유 하루 400-600ml 정도",
        "다양한 식품군의 균형잡힌 섭취",
        "스스로 먹을 수 있도록 격려"
      ],
      avoidFoods: ["과도한 당분", "카페인", "너무 짠 음식", "딱딱한 견과류"],
      tips: "편식을 하더라도 강요하지 말고, 여러 번 노출시켜 자연스럽게 받아들이도록 하세요."
    }
  ];

  const essentialNutrients = [
    {
      name: "철분",
      importance: "빈혈 예방, 뇌 발달",
      sources: ["소고기", "닭고기", "계란 노른자", "시금치", "콩류"],
      deficiencySymptoms: ["창백함", "피로감", "식욕부진", "성장 지연"]
    },
    {
      name: "칼슘",
      importance: "뼈와 치아 발달",
      sources: ["우유", "치즈", "요구르트", "멸치", "브로콜리"],
      deficiencySymptoms: ["뼈 약함", "치아 발육 불량", "근육 경련"]
    },
    {
      name: "아연",
      importance: "면역력, 성장 발달",
      sources: ["고기류", "달걀", "치즈", "견과류", "씨앗류"],
      deficiencySymptoms: ["성장 지연", "식욕 감소", "상처 치유 지연"]
    },
    {
      name: "비타민 D",
      importance: "칼슘 흡수, 뼈 건강",
      sources: ["햇빛", "생선", "계란", "강화 우유"],
      deficiencySymptoms: ["뼈 연화", "성장 지연", "면역력 저하"]
    },
    {
      name: "오메가-3",
      importance: "뇌 발달, 시력 발달",
      sources: ["연어", "고등어", "호두", "아마씨"],
      deficiencySymptoms: ["학습능력 저하", "주의력 부족", "시력 문제"]
    }
  ];

  const commonNutritionProblems = [
    {
      problem: "편식",
      description: "특정 음식만 먹으려 하거나 새로운 음식을 거부하는 현상",
      solutions: [
        "다양한 방식으로 조리해서 제공",
        "아이가 좋아하는 음식과 함께 제공",
        "무리하게 강요하지 말고 여러 번 노출",
        "부모가 먼저 맛있게 먹는 모습 보여주기"
      ]
    },
    {
      problem: "식욕부진",
      description: "평소보다 음식 섭취량이 현저히 줄어드는 상태",
      solutions: [
        "식사 환경을 즐겁게 만들기",
        "간식 시간과 양 조절하기",
        "충분한 활동으로 에너지 소모하기",
        "지속적인 식욕부진 시 소아과 상담"
      ]
    },
    {
      problem: "과체중",
      description: "나이와 성별에 비해 체중이 과도하게 많이 나가는 상태",
      solutions: [
        "당분이 많은 음료와 간식 제한",
        "규칙적인 식사 시간 지키기",
        "충분한 신체활동 늘리기",
        "가족 모두 건강한 식습관 실천"
      ]
    }
  ];

  const mealPlanExample = {
    "아침": {
      "주식": "쌀죽 또는 빵",
      "부식": "계란, 과일",
      "유제품": "우유"
    },
    "점심": {
      "주식": "밥 또는 면",
      "부식": "고기/생선, 야채",
      "국물": "맑은 국"
    },
    "저녁": {
      "주식": "밥",
      "부식": "단백질, 야채",
      "국물": "된장국/미역국"
    },
    "간식": {
      "오전": "과일, 요구르트",
      "오후": "치즈, 전분류"
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">영유아 영양 가이드</h1>
        <p className="text-muted-foreground">
          연령별 영양 요구사항과 올바른 식습관 형성을 위한 종합 가이드입니다.
        </p>
      </div>

      <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          영양 정보는 일반적인 가이드라인입니다. 아이의 개별적인 상황에 따라 
          소아과 전문의나 영양사와 상담하시기 바랍니다.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="age-nutrition" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="age-nutrition">연령별 영양</TabsTrigger>
          <TabsTrigger value="nutrients">필수 영양소</TabsTrigger>
          <TabsTrigger value="problems">영양 문제</TabsTrigger>
          <TabsTrigger value="meal-plan">식단 예시</TabsTrigger>
          <TabsTrigger value="breastfeeding">모유수유</TabsTrigger>
        </TabsList>

        <TabsContent value="age-nutrition" className="mt-6">
          <div className="space-y-6">
            {nutritionByAge.map((age, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {age.ageGroup}
                    <Badge variant="outline">{age.mainNutrition}</Badge>
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">{age.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300">
                        영양 가이드라인
                      </h4>
                      <ul className="space-y-2">
                        {age.guidelines.map((guideline, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            {guideline}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-red-700 dark:text-red-300">
                        피해야 할 음식
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {age.avoidFoods.map((food, i) => (
                          <Badge key={i} variant="destructive" className="text-xs">
                            {food}
                          </Badge>
                        ))}
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>팁:</strong> {age.tips}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nutrients" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {essentialNutrients.map((nutrient, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{nutrient.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{nutrient.importance}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">
                        주요 공급원
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {nutrient.sources.map((source, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-orange-700 dark:text-orange-300">
                        결핍 증상
                      </h4>
                      <ul className="text-sm space-y-1">
                        {nutrient.deficiencySymptoms.map((symptom, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="problems" className="mt-6">
          <div className="space-y-6">
            {commonNutritionProblems.map((problem, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-red-700 dark:text-red-300">
                    {problem.problem}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{problem.description}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-3">해결 방법</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {problem.solutions.map((solution, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm">{solution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">
                전문가 상담이 필요한 경우
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <li>• 체중 증가가 현저히 부족하거나 과도한 경우</li>
                <li>• 알레르기 반응이나 소화 문제가 지속되는 경우</li>
                <li>• 특정 영양소 결핍이 의심되는 경우</li>
                <li>• 심각한 편식이나 거식이 지속되는 경우</li>
                <li>• 성장 지연이나 발달 문제가 관찰되는 경우</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meal-plan" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>12-24개월 하루 식단 예시</CardTitle>
              <p className="text-sm text-muted-foreground">
                아래는 참고용 식단 예시입니다. 아이의 식욕과 상황에 맞게 조절하세요.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(mealPlanExample).map(([mealTime, foods]) => (
                  <div key={mealTime}>
                    <h3 className="font-semibold mb-3 text-lg">
                      {mealTime === "간식" ? "간식 (2회)" : mealTime}
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(foods).map(([category, food]) => (
                        <div key={category} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <Badge variant="outline" className="min-w-fit">
                            {category}
                          </Badge>
                          <span className="text-sm">{food}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">식사 시간 가이드</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>아침:</strong> 오전 7-8시</li>
                  <li>• <strong>오전간식:</strong> 오전 10시</li>
                  <li>• <strong>점심:</strong> 오후 12-1시</li>
                  <li>• <strong>오후간식:</strong> 오후 3-4시</li>
                  <li>• <strong>저녁:</strong> 오후 6-7시</li>
                  <li>• <strong>야식:</strong> 가급적 피하기</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">건강한 식습관 만들기</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    가족과 함께 식사하기
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    TV나 스마트폰 없이 식사하기
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    아이가 스스로 먹을 수 있도록 격려
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    다양한 색깔의 음식 제공
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    충분한 시간을 갖고 천천히 먹기
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="breastfeeding" className="mt-6">
          <BreastfeedingGuideComponent 
            showTips={true}
            showBurpingGuide={true}
            showFeedingLog={true}
            showFormula={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}