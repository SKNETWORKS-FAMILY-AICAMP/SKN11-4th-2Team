// 사용자 관련 타입 정의

import { MapaderApiResponse } from './index';

// 자녀 정보 타입
export interface Child {
  id: string;
  name: string;
  birth_date: string; // YYYY-MM-DD 형식 (API 응답에 맞게 변경)
  gender?: 'male' | 'female';
  age_months: number; // API 응답에 맞게 변경
  created_at: string; // API 응답에 맞게 변경
  updated_at: string; // API 응답에 맞게 추가
}

// 자녀 정보 생성 요청
export interface CreateChildRequest {
  name: string;
  birth_date: string; // YYYY-MM-DD 형식
  gender?: 'male' | 'female';
}

// 자녀 정보 수정 요청
export interface UpdateChildRequest {
  name: string;
  birth_date: string; // YYYY-MM-DD 형식 (API 요청에 맞게 변경)
  gender?: 'male' | 'female';
}

// API 응답 타입들
export type ChildrenListResponse = MapaderApiResponse<Child[]>;
export type ChildResponse = MapaderApiResponse<Child>;
export type DeleteChildResponse = MapaderApiResponse<{
  message: string;
}>;
