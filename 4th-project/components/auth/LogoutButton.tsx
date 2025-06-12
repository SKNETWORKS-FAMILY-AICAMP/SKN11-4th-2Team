'use client';

import { Button } from '@/components/ui/button';
import { useIntegratedAuth } from '@/hooks/use-integrated-auth'; // 통합 인증 훅 사용
import { AuthService } from '@/lib/auth'; // JWT 토큰 관리
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
  onLogoutSuccess?: () => void;
}

export default function LogoutButton({
  variant = 'outline',
  size = 'default',
  showIcon = true,
  children,
  className,
  onLogoutSuccess,
}: LogoutButtonProps) {
  const { isLoading } = useIntegratedAuth();

  const handleLogout = async () => {
    try {
      // Django JWT 토큰에 로그아웃 요청 보내기
      const refreshToken = AuthService.getRefreshToken();
      if (refreshToken) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${AuthService.getAccessToken()}`,
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
        } catch (error) {
          console.error('Django 로그아웃 오류:', error);
        }
      }
      
      // 세션 스토리지에서 JWT 토큰 제거
      AuthService.clearTokens();
      
      // NextAuth 로그아웃
      await signOut({ redirect: false });
      
      toast.success('성공적으로 로그아웃되었습니다.');
      
      if (onLogoutSuccess) {
        onLogoutSuccess();
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || '로그아웃'}
    </Button>
  );
}
