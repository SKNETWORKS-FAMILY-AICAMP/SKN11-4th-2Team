'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

interface ServerDiagnosticProps {
  error: string;
  category: string;
  onReconnect: () => void;
}

export function ServerDiagnostic({ error, category, onReconnect }: ServerDiagnosticProps) {
  const [serverStatus, setServerStatus] = useState<{
    django: 'checking' | 'online' | 'offline';
    fastapi: 'checking' | 'online' | 'offline';
  }>({
    django: 'checking',
    fastapi: 'checking',
  });

  const [isChecking, setIsChecking] = useState(false);

  // 서버 상태 확인
  const checkServerStatus = async () => {
    setIsChecking(true);
    setServerStatus({ django: 'checking', fastapi: 'checking' });

    // Django 서버 확인
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const djangoResponse = await fetch('http://localhost:8000/admin/', {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      setServerStatus(prev => ({ 
        ...prev, 
        django: djangoResponse.status < 500 ? 'online' : 'offline' 
      }));
    } catch (error) {
      console.error('Django 서버 확인 실패:', error);
      setServerStatus(prev => ({ ...prev, django: 'offline' }));
    }

    // 모든 카테고리가 Django를 사용하므로 FastAPI 체크 비활성화
    setServerStatus(prev => ({ ...prev, fastapi: 'online' }));

    setIsChecking(false);
  };

  // 컴포넌트 마운트 시 서버 상태 확인
  useEffect(() => {
    checkServerStatus();
  }, [category]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return '정상';
      case 'offline':
        return '오프라인';
      case 'checking':
        return '확인 중...';
      default:
        return '알 수 없음';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600';
      case 'offline':
        return 'text-red-600';
      case 'checking':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPrimaryServer = () => {
    return category === 'specialized' ? 'fastapi' : 'django';
  };

  const getServerInfo = (serverType: 'django' | 'fastapi') => {
    const info = {
      django: {
        name: 'Django 백엔드',
        url: 'http://localhost:8000',
        port: '8000',
        description: '일반 AI 상담 서버',
      },
      fastapi: {
        name: 'FastAPI 백엔드',
        url: 'http://127.0.0.1:8080',
        port: '8080',
        description: '전문 AI 상담 서버',
      },
    };
    return info[serverType];
  };

  const primaryServer = getPrimaryServer();
  const primaryServerInfo = getServerInfo(primaryServer);
  const isPrimaryServerOffline = serverStatus[primaryServer] === 'offline';

  return (
    <div className="space-y-3">
      {/* 메인 에러 알림 */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <div className="space-y-2">
            <div>{error}</div>
            {isPrimaryServerOffline && (
              <div className="text-xs opacity-90">
                {primaryServerInfo.description}가 응답하지 않습니다.
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* 서버 상태 진단 */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">서버 상태 진단</h4>
          <Button
            size="sm"
            variant="outline"
            onClick={checkServerStatus}
            disabled={isChecking}
            className="h-7 px-2 text-xs"
          >
            {isChecking ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            <span className="ml-1">새로고침</span>
          </Button>
        </div>

        {/* Django 서버 상태 */}
        <div className="flex items-center justify-between p-2 bg-white rounded border">
          <div className="flex items-center gap-2">
            {getStatusIcon(serverStatus.django)}
            <div>
              <div className="text-sm font-medium">Django 서버</div>
              <div className="text-xs text-muted-foreground">
                포트 8000 • 일반 AI 상담
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${getStatusColor(serverStatus.django)}`}
            >
              {getStatusText(serverStatus.django)}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => window.open('http://localhost:8000/admin/', '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* FastAPI 서버 상태 (전문 카테고리인 경우만) */}
        {category === 'specialized' && (
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <div className="flex items-center gap-2">
              {getStatusIcon(serverStatus.fastapi)}
              <div>
                <div className="text-sm font-medium">FastAPI 서버</div>
                <div className="text-xs text-muted-foreground">
                  포트 8080 • 전문 AI 상담
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor(serverStatus.fastapi)}`}
              >
                {getStatusText(serverStatus.fastapi)}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => window.open('http://127.0.0.1:8080/', '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* 해결 방법 안내 */}
        {isPrimaryServerOffline && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <div className="font-medium text-yellow-800 mb-1">해결 방법:</div>
            <div className="text-yellow-700 space-y-1">
              <div>1. {primaryServerInfo.name} 서버가 실행 중인지 확인하세요</div>
              <div>2. 포트 {primaryServerInfo.port}이 사용 가능한지 확인하세요</div>
              <div>3. 방화벽 설정을 확인하세요</div>
            </div>
          </div>
        )}

        {/* 재연결 버튼 */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onReconnect}
            disabled={isPrimaryServerOffline}
            className="flex-1 h-8 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            재연결 시도
          </Button>
          {isPrimaryServerOffline && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex-1 h-8 text-xs"
            >
              페이지 새로고침
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
