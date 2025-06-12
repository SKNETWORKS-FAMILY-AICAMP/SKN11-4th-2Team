'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { developmentToys, DevelopmentToy } from '../data/developmentData';

interface DevelopmentToysComponentProps {
  ageGroup?: string;
  showAll?: boolean;
}

export const DevelopmentToysComponent = ({
  ageGroup,
  showAll = false,
}: DevelopmentToysComponentProps) => {
  const filteredToys = showAll
    ? developmentToys
    : developmentToys.filter((toy) => toy.ageGroup === ageGroup);

  if (filteredToys.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>발달 놀이도구</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {ageGroup}에 적합한 놀이도구 정보가 준비 중입니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">연령별 추천 발달 놀이도구</h3>
      {filteredToys.map((toyGroup, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {toyGroup.ageGroup} 추천 놀이도구
              <Badge variant="outline">{toyGroup.toys.length}개</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {toyGroup.toys.map((toy, toyIndex) => (
                <div
                  key={toyIndex}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={toy.src}
                      alt={toy.alt}
                      className="max-w-full max-h-full object-contain rounded-lg"
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>,
                      ) => {
                        e.currentTarget.style.display = 'none';
                        if (
                          e.currentTarget.nextElementSibling instanceof
                          HTMLElement
                        ) {
                          e.currentTarget.nextElementSibling.style.display =
                            'flex';
                        }
                      }}
                    />
                    <div
                      className="hidden items-center justify-center text-muted-foreground text-sm"
                      style={{ display: 'none' }}
                    >
                      이미지 준비중
                    </div>
                  </div>
                  <h4 className="font-medium text-center">{toy.name}</h4>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {toyGroup.ageGroup} 발달에 적합
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>발달 효과:</strong> {toyGroup.ageGroup} 시기에는
                {toyGroup.ageGroup === '4-6개월' &&
                  ' 감각 발달과 손-눈 협응력을 기를 수 있는 놀이도구가 중요합니다.'}
                {toyGroup.ageGroup === '7-9개월' &&
                  ' 소근육 발달과 인지 능력을 향상시키는 놀이도구가 도움이 됩니다.'}
                {toyGroup.ageGroup === '10-12개월' &&
                  ' 문제해결 능력과 창의성을 기를 수 있는 놀이도구를 추천합니다.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
