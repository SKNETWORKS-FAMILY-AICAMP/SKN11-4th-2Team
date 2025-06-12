'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Child } from '@/types/user';
import { AddChildModal } from './add-child-modal';

interface ChildrenSectionProps {
  children: Child[];
  onChildrenUpdate?: () => void; // 자녀 정보 업데이트 콜백
}

export function ChildrenSection({ children, onChildrenUpdate }: ChildrenSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>자녀 정보</CardTitle>
        <AddChildModal onSuccess={onChildrenUpdate} />
      </CardHeader>
      <CardContent>
        {children.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <Card key={child.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{child.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      <p>생년월일: {new Date(child.birth_date).toLocaleDateString('ko-KR')}</p>
                      <p>성별: {child.gender === 'male' ? '남성' : child.gender === 'female' ? '여성' : '미지정'}</p>
                      <p>나이: {child.age_months}개월</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              등록된 자녀 정보가 없습니다.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
