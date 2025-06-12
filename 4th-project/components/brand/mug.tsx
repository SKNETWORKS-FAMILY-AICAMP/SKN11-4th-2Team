import { Logo } from '../logo';

export function MugPreview() {
  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-4">머그컵 디자인</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* 머그컵 디자인 1 - 기본형 */}
        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {/* 머그컵 형태 */}
            <div className="w-[60%] h-[70%] bg-white rounded-md shadow-sm relative">
              {/* 머그컵 손잡이 */}
              <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-[15%] h-[40%] border-r-4 border-t-4 border-b-4 border-gray-200 rounded-r-full"></div>

              {/* 로고 배치 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%]">
                <Logo size="sm" />
                <p className="text-[10px] text-center text-muted-foreground mt-1">
                  육아 부담을 덜어드립니다
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-center mt-2">기본형 - 화이트</p>
        </div>

        {/* 머그컵 디자인 2 - 컬러형 */}
        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {/* 머그컵 형태 */}
            <div className="w-[60%] h-[70%] bg-primary rounded-md shadow-sm relative">
              {/* 머그컵 손잡이 */}
              <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-[15%] h-[40%] border-r-4 border-t-4 border-b-4 border-blue-400 rounded-r-full"></div>

              {/* 로고 배치 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%]">
                <Logo variant="white" size="sm" />
                <p className="text-[10px] text-center text-white mt-1">
                  육아 부담을 덜어드립니다
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-center mt-2">컬러형 - 블루</p>
        </div>
      </div>
    </div>
  );
}
