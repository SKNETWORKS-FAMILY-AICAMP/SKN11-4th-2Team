import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string; // 사용자 지정 이미지 URL
  alt?: string; // 이미지 대체 텍스트
}

export function Logo({
  className,
  variant = 'default',
  showText = false, // 기본값을 false로 변경
  size = 'md',
  imageUrl,
  alt = '마파덜 로고',
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  const textColor = variant === 'white' ? 'text-white' : 'text-primary';
  const accentColor = variant === 'white' ? '#FFFFFF' : '#3B82F6'; // primary blue
  const secondaryColor = variant === 'white' ? '#E2E8F0' : '#93C5FD'; // lighter blue

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        {imageUrl ? (
          // 사용자가 제공한 이미지가 있으면 이미지 표시
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={alt}
            className="h-full w-auto object-contain"
          />
        ) : (
          // 이미지가 없으면 기본 SVG 로고 표시
          <svg
            width="auto"
            height="100%"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-auto"
          >
            {/* 부모와 아이를 상징하는 원형 */}
            <circle cx="24" cy="18" r="12" fill={accentColor} />
            <circle cx="18" cy="14" r="4" fill="white" opacity="0.9" />
            <circle cx="30" cy="14" r="4" fill="white" opacity="0.9" />
            <circle cx="24" cy="22" r="3" fill="white" opacity="0.9" />

            {/* 부담을 덜어주는 날개 형태 */}
            <path
              d="M12 28C8 30 6 34 6 38C14 34 18 34 24 36C30 34 34 34 42 38C42 34 40 30 36 28C32 26 28 26 24 28C20 26 16 26 12 28Z"
              fill={secondaryColor}
            />
            <path
              d="M12 28C16 30 20 30 24 28C28 30 32 30 36 28"
              stroke={accentColor}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {showText && (
        <span className={cn('font-bold text-2xl tracking-tight', textColor)}>
          마파덜
        </span>
      )}
    </div>
  );
}
