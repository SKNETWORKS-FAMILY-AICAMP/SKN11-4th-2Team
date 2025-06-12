import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { growthCategories, growthConcerns, healthyGrowthTips, growthChartGuidance, GrowthData } from '../data/growthData';
import { TrendingUp, AlertTriangle, Heart, Info } from 'lucide-react';

export default function GrowthChartPage() {
  const GrowthTable = ({ data, title, description }: { data: GrowthData[]; title: string; description?: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          {title}
          <Badge variant="outline">표준 데이터</Badge>
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-300 p-3 text-center" rowSpan={2}>
                  연령
                </th>
                <th className="border border-gray-300 p-3 text-center" colSpan={2}>
                  남아
                </th>
                <th className="border border-gray-300 p-3 text-center" colSpan={2}>
                  여아
                </th>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-300 p-3 text-center">체중(kg)</th>
                <th className="border border-gray-300 p-3 text-center">신장(cm)</th>
                <th className="border border-gray-300 p-3 text-center">체중(kg)</th>
                <th className="border border-gray-300 p-3 text-center">신장(cm)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="border border-gray-300 p-3 text-center font-medium">
                    {row.month}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">{row.maleWeight}</td>
                  <td className="border border-gray-300 p-3 text-center">{row.maleHeight}</td>
                  <td className="border border-gray-300 p-3 text-center">{row.femaleWeight}</td>
                  <td className="border border-gray-300 p-3 text-center">{row.femaleHeight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">연령별 신체적 성장 차트</h1>
        <p className="text-muted-foreground">
          아이의 월령별 평균 체중과 신장 정보를 확인하세요. 
          모든 아이는 개별적인 성장 속도를 가지므로, 이 수치는 참고용입니다.
        </p>
      </div>

      <div className="mb-6">
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  {growthChartGuidance.title}
                </h3>
                <div className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                  {growthChartGuidance.guidelines.map((guideline, index) => (
                    <p key={index}>• {guideline}</p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="infant-early" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="infant-early">영아기 초기</TabsTrigger>
          <TabsTrigger value="infant-late">영아기 후기</TabsTrigger>
          <TabsTrigger value="toddler">유아기</TabsTrigger>
        </TabsList>
        
        {growthCategories.map((category, index) => {
          const tabValue = index === 0 ? "infant-early" : index === 1 ? "infant-late" : "toddler";
          const colorClass = index === 0 ? "yellow" : index === 1 ? "green" : "purple";
          
          return (
            <TabsContent key={tabValue} value={tabValue} className="mt-6">
              <GrowthTable 
                data={category.data} 
                title={`${category.category} (${category.ageRange})`}
                description={category.description}
              />
              <div className={`mt-4 p-4 bg-${colorClass}-50 dark:bg-${colorClass}-950/20 rounded-lg`}>
                <h4 className={`font-semibold text-${colorClass}-800 dark:text-${colorClass}-200 mb-2`}>
                  이 시기 특징
                </h4>
                <p className={`text-${colorClass}-700 dark:text-${colorClass}-300 text-sm`}>
                  {category.characteristics}
                </p>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              성장 관련 주의사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {growthConcerns.map((concern, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  {concern}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-500" />
              건강한 성장을 위한 팁
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {healthyGrowthTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              성장 모니터링의 중요성
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
              아이의 성장은 단순히 키와 몸무게의 증가만을 의미하지 않습니다. 
              전반적인 건강 상태와 발달 정도를 나타내는 중요한 지표입니다. 
              정기적인 측정과 기록을 통해 아이만의 성장 패턴을 파악하고, 
              필요시 적절한 의료적 조치를 받을 수 있도록 하는 것이 중요합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
