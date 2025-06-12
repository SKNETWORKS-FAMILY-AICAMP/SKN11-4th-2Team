export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

// 공통 API 응답 형식 (마파덜 API 명세서 기준)
export interface MapaderApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

// 페이지네이션 타입
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// 페이지네이션이 포함된 응답 타입
export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: Pagination;
  };
}

// 인증 관련 타입들
export * from './auth';
// 사용자 관련 타입들
export * from './user';
// 발달 모니터링 관련 타입들
export * from './development';
// 커뮤니티 관련 타입들
export * from './community';
// AI 상담(ChatBot) 관련 타입들
export * from './chatbot';
// 파일 업로드 관련 타입들
export * from './upload';
