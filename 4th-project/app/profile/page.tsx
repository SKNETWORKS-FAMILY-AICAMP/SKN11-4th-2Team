'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChildrenSection } from '@/components/children/children-section';
import { EditProfileModal } from '@/components/profile/edit-profile-modal';
import { Skeleton } from '@/components/ui/skeleton';
import apiClient from '@/services/api-client';
import { Child } from '@/types/user';

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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 사용자 프로필 데이터 가져오기
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.get<ProfileResponse>('/auth/profile/');
      
      if (response.success) {
        setProfile(response.data);
      } else {
        throw new Error('프로필 데이터를 가져올 수 없습니다.');
      }
    } catch (error) {
      console.error('프로필 데이터 로드 실패:', error);
      setError(error instanceof Error ? error.message : '프로필을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 세션 상태 변경 시 프로필 데이터 로드
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  // 프로필 업데이트 성공 후 데이터 재로드
  const handleProfileUpdate = () => {
    fetchProfile();
  };

  // 로딩 상태
  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>프로필</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // 인증 실패
  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">로그인이 필요합니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive">{error}</p>
              <button
                onClick={fetchProfile}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                다시 시도
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 프로필 데이터가 없는 경우
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">프로필 데이터를 찾을 수 없습니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>프로필</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profile.profile_image || undefined}
                alt={profile.name || '프로필 이미지'}
              />
              <AvatarFallback>
                {profile.name?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <EditProfileModal 
                  currentName={profile.name || ''} 
                  onSuccess={handleProfileUpdate}
                />
              </div>
              <p className="text-muted-foreground">{profile.email}</p>
              {profile.auth_provider && (
                <p className="text-sm text-muted-foreground">
                  {profile.auth_provider} 계정으로 로그인
                </p>
              )}
              {profile.is_new_user && (
                <p className="text-sm text-green-600 font-medium">
                  새로 가입한 사용자
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ChildrenSection 
        children={profile.children} 
        onChildrenUpdate={handleProfileUpdate}
      />
    </div>
  );
}
