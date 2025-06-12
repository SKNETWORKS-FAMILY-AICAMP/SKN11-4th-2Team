import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { developmentMilestones, ageGroupDetails, DevelopmentMilestone } from '../data/developmentData';

interface DetailedMilestonesComponentProps {
  selectedAgeGroup?: string;
  showAllCategories?: boolean;
}

export const DetailedMilestonesComponent = ({
  selectedAgeGroup,
  showAllCategories = true
}: DetailedMilestonesComponentProps) => {

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '사회성/감정': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case '언어/의사소통': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case '인지(학습, 생각, 문제해결)': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '움직임/신체 발달': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredMilestones = selectedAgeGroup 
    ? developmentMilestones.filter(m => m.ageGroup === selectedAgeGroup)
    : developmentMilestones;

  // 연령별로 그룹화
  const milestonesByAge = filteredMilestones.reduce((acc, milestone) => {
    if (!acc[milestone.ageGroup]) {
      acc[milestone.ageGroup] = [];
    }
    acc[milestone.ageGroup].push(milestone);
    return acc;
  }, {} as Record<string, DevelopmentMilestone[]>);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">상세 발달 이정표</h2>
        <p className="text-muted-foreground">
          실제 데이터를 기반으로 한 연령별 상세 발달 이정표입니다.
        </p>
      </div>

      {Object.keys(milestonesByAge).map((ageGroup) => (
        <div key={ageGroup} className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold">{ageGroup}</h3>
            <Badge variant="outline">{milestonesByAge[ageGroup].length}개 영역</Badge>
          </div>

          {/* 연령대 특징 표시 */}
          {ageGroupDetails.find(detail => detail.ageGroup === ageGroup) && (
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>이 시기 특징:</strong> {
                    ageGroupDetails.find(detail => detail.ageGroup === ageGroup)?.characteristics
                  }
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestonesByAge[ageGroup].map((milestone, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{milestone.category}</span>
                    <Badge className={getCategoryColor(milestone.category)}>
                      {milestone.milestones.length}개 항목
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {milestone.milestones.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(milestonesByAge).length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              선택한 연령대의 발달 이정표 데이터가 없습니다.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 발달 이정표 활용 팁 */}
      <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-200">
            발달 이정표 활용 팁
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
            <li>• 모든 아이는 개별적인 발달 속도를 가지므로 ±2개월 정도의 차이는 정상입니다</li>
            <li>• 한 영역이 늦어도 다른 영역이 정상이라면 크게 걱정하지 마세요</li>
            <li>• 지속적인 관찰과 기록을 통해 아이만의 발달 패턴을 파악하세요</li>
            <li>• 여러 영역에서 지연이 의심되면 소아과 전문의와 상담하세요</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
