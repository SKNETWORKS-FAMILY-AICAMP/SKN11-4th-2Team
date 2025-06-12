import { Logo } from '../logo';

export function EcoBagPreview() {
  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-4">에코백 디자인</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* 에코백 디자인 1 - 중앙 로고 */}
        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {/* 에코백 형태 */}
            <div className="w-[80%] h-[90%] bg-white rounded-md shadow-sm relative">
              {/* 에코백 손잡이 */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[60%] h-[4%] border-t-2 border-gray-300 rounded"></div>

              {/* 로고 배치 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%]">
                <Logo />
                <p className="text-xs text-center text-muted-foreground mt-2">
                  초보 엄마 아빠의 육아 부담을 덜어드립니다
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-center mt-2">중앙 로고형</p>
        </div>

        {/* 에코백 디자인 2 - 패턴 */}
        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {/* 에코백 형태 */}
            <div className="w-[80%] h-[90%] bg-blue-50 rounded-md shadow-sm relative overflow-hidden">
              {/* 에코백 손잡이 */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[60%] h-[4%] border-t-2 border-blue-300 rounded"></div>

              {/* 반복 패턴 배경 */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-3 gap-4 p-4">
                  {Array(12)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center justify-center">
                        <Logo showText={false} size="sm" />
                      </div>
                    ))}
                </div>
              </div>

              {/* 하단 로고 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[60%]">
                <Logo />
              </div>
            </div>
          </div>
          <p className="text-sm text-center mt-2">패턴형</p>
        </div>
      </div>
    </div>
  );
}
