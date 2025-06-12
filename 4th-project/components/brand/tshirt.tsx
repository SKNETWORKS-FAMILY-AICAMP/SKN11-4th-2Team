import { Logo } from '../logo';

export function TshirtPreview() {
  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-4">티셔츠 디자인</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* 티셔츠 디자인 1 - 로고 중앙 */}
        <div className="relative">
          <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
            {/* 티셔츠 형태 */}
            <div className="w-[85%] h-[90%] bg-white rounded-lg shadow-sm relative">
              {/* 티셔츠 목 부분 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-[5%] bg-white border-t-0 rounded-b-lg"></div>

              {/* 로고 배치 */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%]">
                <Logo showText={true} />
              </div>

              {/* 슬로건 */}
              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 text-center w-full">
                <p className="text-xs text-muted-foreground">
                  초보 엄마 아빠의 육아 부담을 덜어드립니다
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-center mt-2">기본형 - 화이트</p>
        </div>

        {/* 티셔츠 디자인 2 - 컬러 배경 */}
        <div className="relative">
          <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
            {/* 티셔츠 형태 */}
            <div className="w-[85%] h-[90%] bg-primary rounded-lg shadow-sm relative">
              {/* 티셔츠 목 부분 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-[5%] bg-primary border-t-0 rounded-b-lg"></div>

              {/* 로고 배치 */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%]">
                <Logo variant="white" showText={true} />
              </div>

              {/* 슬로건 */}
              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 text-center w-full">
                <p className="text-xs text-white">
                  초보 엄마 아빠의 육아 부담을 덜어드립니다
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-center mt-2">컬러형 - 블루</p>
        </div>

        {/* 티셔츠 디자인 3 - 심볼만 */}
        <div className="relative">
          <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
            {/* 티셔츠 형태 */}
            <div className="w-[85%] h-[90%] bg-white rounded-lg shadow-sm relative">
              {/* 티셔츠 목 부분 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-[5%] bg-white border-t-0 rounded-b-lg"></div>

              {/* 로고 배치 - 왼쪽 가슴 */}
              <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[20%]">
                <Logo showText={false} />
              </div>

              {/* 텍스트 - 등 부분 */}
              <div className="absolute top-[60%] left-1/2 -translate-x-1/2 text-center">
                <p className="text-sm font-bold text-primary">마파덜</p>
                <p className="text-xs text-muted-foreground">MAPADER</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-center mt-2">심볼형 - 화이트</p>
        </div>

        {/* 티셔츠 디자인 4 - 패턴 */}
        <div className="relative">
          <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
            {/* 티셔츠 형태 */}
            <div className="w-[85%] h-[90%] bg-blue-50 rounded-lg shadow-sm relative overflow-hidden">
              {/* 티셔츠 목 부분 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-[5%] bg-blue-50 border-t-0 rounded-b-lg"></div>

              {/* 반복 패턴 배경 */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-4 gap-2 p-2">
                  {Array(20)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center justify-center">
                        <Logo showText={false} size="sm" />
                      </div>
                    ))}
                </div>
              </div>

              {/* 중앙 로고 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] bg-white/80 p-4 rounded-full">
                <Logo />
              </div>
            </div>
          </div>
          <p className="text-sm text-center mt-2">패턴형 - 라이트 블루</p>
        </div>
      </div>
    </div>
  );
}
