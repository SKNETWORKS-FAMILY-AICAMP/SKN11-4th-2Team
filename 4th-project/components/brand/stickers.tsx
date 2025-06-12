import { Logo } from '../logo';

export function StickersPreview() {
  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-4">스티커 디자인</h3>

      <div className="grid grid-cols-3 gap-4">
        {/* 원형 스티커 - 로고만 */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square bg-white rounded-full shadow-md flex items-center justify-center p-4 border">
            <Logo showText={false} size="lg" />
          </div>
          <p className="text-xs text-center mt-2">원형 심볼</p>
        </div>

        {/* 원형 스티커 - 로고 + 텍스트 */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square bg-white rounded-full shadow-md flex flex-col items-center justify-center p-4 border">
            <Logo size="sm" />
            <p className="text-[10px] text-muted-foreground mt-1">
              육아 부담을 덜어드립니다
            </p>
          </div>
          <p className="text-xs text-center mt-2">원형 로고 + 텍스트</p>
        </div>

        {/* 원형 스티커 - 컬러 배경 */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square bg-primary rounded-full shadow-md flex items-center justify-center p-4 border">
            <Logo variant="white" showText={false} size="lg" />
          </div>
          <p className="text-xs text-center mt-2">원형 컬러</p>
        </div>

        {/* 사각형 스티커 */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square bg-white rounded-lg shadow-md flex items-center justify-center p-4 border">
            <Logo size="md" />
          </div>
          <p className="text-xs text-center mt-2">사각형 기본</p>
        </div>

        {/* 사각형 스티커 - 그라데이션 */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-md flex items-center justify-center p-4 border">
            <Logo variant="white" size="md" />
          </div>
          <p className="text-xs text-center mt-2">사각형 그라데이션</p>
        </div>

        {/* 다이컷 스티커 */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square flex items-center justify-center">
            <div className="w-[90%] h-[90%] relative">
              {/* 로고 형태를 따라 다이컷된 스티커 형태 표현 */}
              <div className="absolute inset-0 bg-white rounded-full shadow-md border flex items-center justify-center">
                <Logo showText={false} size="lg" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md border text-center">
                <p className="text-xs font-bold text-primary">마파덜</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-center mt-2">다이컷 스티커</p>
        </div>
      </div>
    </div>
  );
}
