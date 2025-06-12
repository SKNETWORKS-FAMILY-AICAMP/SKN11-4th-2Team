// 발달 모니터링 관련 타입 정의

import { MapaderApiResponse, PaginatedResponse } from './index';

// 발달 영역 타입
export type DevelopmentArea =
  | 'physical'
  | 'cognitive'
  | 'language'
  | 'social'
  | 'emotional'
  | 'self_care';

// 연령 그룹 타입
export type AgeGroup =
  | '0-3months'
  | '3-6months'
  | '6-9months'
  | '9-12months'
  | '12-18months'
  | '18-24months'
  | '24-36months';

// 기록 유형 타입
export type RecordType =
  | 'development_record'
  | 'milestone_achievement'
  | 'observation'
  | 'concern';

// 자녀 정보 (발달 기록에서 사용)
export interface ChildInfo {
  id: string;
  name: string;
}

// 발달 기록 이미지
export interface DevelopmentRecordImage {
  id: string;
  image_url: string;
  order: number;
}

// 발달 기록 타입 (백엔드 응답 형식에 맞춤)
export interface DevelopmentRecord {
  id: string;
  childId: string;
  date: string;
  ageGroup: AgeGroup;
  developmentArea: DevelopmentArea;
  title: string;
  description: string;
  recordType: RecordType;
  createdAt: string;
  updatedAt: string;
}

// 프론트엔드에서 사용하는 발달 기록 타입 (카멜케이스)
export interface DevelopmentRecordFrontend {
  id: string;
  child: ChildInfo;
  date: string;
  ageGroup: AgeGroup;
  developmentArea: DevelopmentArea;
  title: string;
  description: string;
  recordType: RecordType;
  images: string[];
  createdAt: string;
}

// 발달 기록 생성 요청
export interface CreateDevelopmentRecordRequest {
  childId: string;
  date: string; // YYYY-MM-DD 형식
  ageGroup: AgeGroup;
  developmentArea: DevelopmentArea;
  title: string;
  description: string;
  recordType: RecordType;
  images?: string[];
}

// 발달 기록 수정 요청
export interface UpdateDevelopmentRecordRequest {
  date?: string;
  ageGroup?: AgeGroup;
  developmentArea?: DevelopmentArea;
  title?: string;
  description?: string;
  recordType?: RecordType;
  images?: string[];
}

// 발달 이정표 타입
export interface Milestone {
  id: string;
  age_group: AgeGroup;
  age_group_display?: string;
  development_area: DevelopmentArea;
  development_area_display?: string;
  title: string;
  description: string;
  order: number;
  is_active: boolean;
}

// 자녀별 달성 이정표 타입
export interface ChildMilestone {
  id: string;
  child: string;
  child_name?: string;
  milestone: {
    id: string;
    title: string;
    age_group: AgeGroup;
    development_area: DevelopmentArea;
  };
  achieved_date: string; // YYYY-MM-DD 형식
  notes?: string;
  created_at: string;
}

// 이정표 달성 기록 요청
export interface CreateChildMilestoneRequest {
  childId: string;
  milestoneId: string;
  achievedDate: string; // YYYY-MM-DD 형식
  notes?: string;
}

// 발달 통계 타입
export interface DevelopmentStats {
  totalRecords: number;
  recordsByArea: Record<DevelopmentArea, number>;
  recordsByType: Record<RecordType, number>;
  recentActivity: {
    recordsThisWeek: number;
    recordsThisMonth: number;
  };
  milestoneProgress: {
    achieved: number;
    total: number;
    percentage: number;
  };
}

// 발달 기록 목록 조회 파라미터
export interface DevelopmentRecordsParams {
  page?: number;
  limit?: number;
  childId?: string;
  developmentArea?: DevelopmentArea;
  ageGroup?: AgeGroup;
  recordType?: RecordType;
}

// 발달 이정표 목록 조회 파라미터
export interface MilestonesParams {
  ageGroup?: AgeGroup;
  developmentArea?: DevelopmentArea;
}

// 자녀별 달성 이정표 조회 파라미터
export interface ChildMilestonesParams {
  childId: string;
}

// 발달 통계 조회 파라미터
export interface DevelopmentStatsParams {
  childId?: string;
  period?: 'week' | 'month' | 'year' | 'all';
}

// API 응답 타입들
export type DevelopmentRecordsResponse = PaginatedResponse<DevelopmentRecord>;
export type DevelopmentRecordResponse = MapaderApiResponse<DevelopmentRecord>;
export type MilestonesResponse = MapaderApiResponse<Milestone[]>;
export type ChildMilestonesResponse = MapaderApiResponse<ChildMilestone[]>;
export type CreateChildMilestoneResponse = MapaderApiResponse<ChildMilestone>;
export type DevelopmentStatsResponse = MapaderApiResponse<DevelopmentStats>;

// 발달 영역 한글 매핑
export const DEVELOPMENT_AREA_LABELS: Record<DevelopmentArea, string> = {
  physical: '신체 발달',
  cognitive: '인지 발달',
  language: '언어 발달',
  social: '사회성 발달',
  emotional: '정서 발달',
  self_care: '자조 능력',
};

// 연령 그룹 한글 매핑
export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  '0-3months': '0-3개월',
  '3-6months': '3-6개월',
  '6-9months': '6-9개월',
  '9-12months': '9-12개월',
  '12-18months': '12-18개월',
  '18-24months': '18-24개월',
  '24-36months': '24-36개월',
};

// 기록 유형 한글 매핑
export const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  development_record: '발달 기록',
  milestone_achievement: '이정표 달성',
  observation: '관찰 기록',
  concern: '우려사항',
};

// 백엔드 응답을 프론트엔드 형식으로 변환하는 헬퍼 함수
export function transformDevelopmentRecord(
  backendRecord: DevelopmentRecord,
): DevelopmentRecordFrontend {
  return {
    id: backendRecord.id,
    child: {
      id: backendRecord.childId,
      name: '',
    },
    date: backendRecord.date,
    ageGroup: backendRecord.ageGroup,
    developmentArea: backendRecord.developmentArea,
    title: backendRecord.title,
    description: backendRecord.description,
    recordType: backendRecord.recordType,
    images: [],
    createdAt: backendRecord.createdAt,
  };
}
