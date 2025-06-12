import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Baby, Clock } from 'lucide-react';
import { 
  breastfeedingTips, 
  burpingMethods, 
  burpingNotes,
  feedingLogItems,
  additionalBreastfeedingInfo,
  sampleFeedingLog,
  formulaFeedingGuides,
  BreastfeedingTip,
  BurpingMethod,
  FeedingLogEntry,
  FormulaGuide
} from '../data/nutritionData';

interface BreastfeedingGuideComponentProps {
  showTips?: boolean;
  showBurpingGuide?: boolean;
  showFeedingLog?: boolean;
  showFormula?: boolean;
}

export const BreastfeedingGuideComponent = ({
  showTips = true,
  showBurpingGuide = true,
  showFeedingLog = true,
  showFormula = false
}: BreastfeedingGuideComponentProps) => {

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Baby className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold">모유수유 가이드</h2>
      </div>

      {showTips && (
        <div>
          <h3 className="text-xl font-semibold mb-4">모유수유 기본 가이드</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {breastfeedingTips.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="w-5 h-5 text-pink-500" />
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tip.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-sm">
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {showFormula && (
        <div>
          <h3 className="text-xl font-semibold mb-4">분유수유 가이드</h3>
          
          {formulaFeedingGuides.map((guide, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  {guide.ageGroup} 분유수유
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">
                      기본 정보
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>하루 수유 횟수:</span>
                        <span className="font-medium">{guide.dailyFeedings}회</span>
                      </div>
                      <div className="flex justify-between">
                        <span>체중 1kg당 필요량:</span>
                        <span className="font-medium">{guide.amountPerKg}cc</span>
                      </div>
                      <div className="flex justify-between">
                        <span>최대 일일 수유량:</span>
                        <span className="font-medium">{guide.maxDailyAmount}cc</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300">
                      수유 가이드라인
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {guide.guidelines.map((guideline, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          {guideline}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    계산 예시
                  </h5>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    체중 7kg인 5개월 아기의 경우: 7kg × 120cc = 840cc (하루 총 수유량)
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showBurpingGuide && (
        <div>
          <h3 className="text-xl font-semibold mb-4">트림 시키는 방법</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {burpingMethods.map((method, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">{index + 1}</Badge>
                    {method.method}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">
                트림 관련 주의사항
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {burpingNotes.map((note, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-yellow-700 dark:text-yellow-300">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                    {note}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {showFeedingLog && (
        <div>
          <h3 className="text-xl font-semibold mb-4">{additionalBreastfeedingInfo.title}</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                수유 기록표 작성 방법
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {additionalBreastfeedingInfo.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <h4 className="font-semibold mb-3">수유 기록 항목</h4>
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          기록 항목
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">
                          기록 내용
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedingLogItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="border border-gray-300 p-3 font-medium">
                            {item.time}
                          </td>
                          <td className="border border-gray-300 p-3">
                            {item.activity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="overflow-x-auto">
                  <h4 className="font-semibold mb-3">수유일지 예시</h4>
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-300 p-2 text-center font-semibold">날짜</th>
                        <th className="border border-gray-300 p-2 text-center font-semibold">시간</th>
                        <th className="border border-gray-300 p-2 text-center font-semibold">수유시간(좌/우)</th>
                        <th className="border border-gray-300 p-2 text-center font-semibold">분유량</th>
                        <th className="border border-gray-300 p-2 text-center font-semibold">대변</th>
                        <th className="border border-gray-300 p-2 text-center font-semibold">소변</th>
                        <th className="border border-gray-300 p-2 text-center font-semibold">특이사항</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleFeedingLog.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="border border-gray-300 p-2 text-center">{entry.date}</td>
                          <td className="border border-gray-300 p-2 text-center">{entry.time}</td>
                          <td className="border border-gray-300 p-2 text-center">{entry.feedingTime}</td>
                          <td className="border border-gray-300 p-2 text-center">{entry.formulaAmount}</td>
                          <td className="border border-gray-300 p-2 text-center">{entry.stool}</td>
                          <td className="border border-gray-300 p-2 text-center">{entry.urine}</td>
                          <td className="border border-gray-300 p-2 text-center">{entry.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">
                추가 정보 참고
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {additionalBreastfeedingInfo.references.map((ref, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-blue-700 dark:text-blue-300">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    {ref}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <Heart className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>도움말:</strong> 모유수유가 어려우시거나 문제가 있으시면 
          소아과 전문의나 모유수유 상담사에게 도움을 요청하세요.
        </AlertDescription>
      </Alert>
    </div>
  );
};
