'use client';

import { DevelopmentRecordForm } from '@/components/development/development-record-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AgeGroup } from '@/types/development';
import { useEffect, useState, Suspense } from 'react';
import type { Child } from '@/types/user';
import { useRouter, useSearchParams } from 'next/navigation';
import { useIntegratedAuth } from '@/hooks/use-integrated-auth';
import apiClient from '@/services/api-client';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  profile_image?: string;
  auth_provider?: string;
  is_new_user: boolean;
  children: Child[];
}

interface ProfileResponse {
  success: boolean;
  data: UserProfile;
  message: string;
}

function DevelopmentRecordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: isAuthLoading } = useIntegratedAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ageGroupId = searchParams.get('age') as AgeGroup | null;
  const selectedChildId = searchParams.get('childId');

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<ProfileResponse>('/auth/profile/');
        if (response.success) {
          setChildren(response.data.children);
        }
      } catch (error) {
        console.error('프로필 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthLoading) {
      loadProfile();
    }
  }, [isAuthenticated, isAuthLoading]);

  const handleChildChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('childId', value);
    router.push(url.toString());
  };

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  if (isAuthLoading || isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/development" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>발달 모니터링</span>
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">발달 기록</h1>
        <p className="text-muted-foreground">
          아이의 발달 과정을 기록하고 관리하세요. 발달 영역별로 아이의 성장을
          추적할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>자녀 선택</CardTitle>
              <CardDescription>
                발달 기록을 작성할 자녀를 선택해주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedChildId || ''}
                onValueChange={handleChildChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="자녀를 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name} (
                      {new Date(child.birth_date).toLocaleDateString('ko-KR')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedChildId ? (
            <DevelopmentRecordForm
              initialAgeGroup={ageGroupId || undefined}
              childId={selectedChildId}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                발달 기록을 작성할 자녀를 선택해주세요
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>발달 기록 가이드</CardTitle>
              <CardDescription>
                아이의 발달을 효과적으로 기록하는 방법
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">기록 작성 팁</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>정기적으로 기록하는 습관을 들이세요 (주 1회 권장)</li>
                  <li>구체적인 행동이나 변화를 자세히 기록하세요</li>
                  <li>사진이나 동영상을 함께 기록하면 더 좋습니다</li>
                  <li>아이의 감정 상태나 반응도 함께 기록하세요</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">발달 영역 안내</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>
                    <strong>신체 발달</strong>: 대근육, 소근육 발달, 신체 성장
                  </li>
                  <li>
                    <strong>인지 발달</strong>: 문제 해결 능력, 기억력, 주의력
                  </li>
                  <li>
                    <strong>언어 발달</strong>: 언어 이해력, 표현력, 의사소통
                    능력
                  </li>
                  <li>
                    <strong>사회성 발달</strong>: 대인 관계, 감정 표현, 사회적
                    규칙 이해
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">기록 활용 방법</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>정기 검진 시 의사와 상담할 때 참고자료로 활용하세요</li>
                  <li>시간에 따른 아이의 발달 과정을 비교해보세요</li>
                  <li>발달 추적 페이지에서 영역별 발달 상황을 확인하세요</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DevelopmentRecordPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <DevelopmentRecordPageContent />
    </Suspense>
  );
}
