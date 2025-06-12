import apiClient from './api-client';
import type { Child, ChildrenResponse } from '@/types/child';

export interface CreateChildRequest {
  name: string;
  birth_date: string; // YYYY-MM-DD 형식
  gender?: 'male' | 'female';
}

export interface UpdateChildRequest {
  name?: string;
  birth_date?: string; // YYYY-MM-DD 형식
  gender?: 'male' | 'female';
}

export interface ChildResponse {
  success: boolean;
  data: Child;
}

export class ChildService {
  private static readonly BASE_PATH = '/users/children';

  /**
   * 자녀 목록 조회
   */
  static async getChildren(): Promise<ChildrenResponse> {
    return await apiClient.get<ChildrenResponse>(this.BASE_PATH);
  }

  /**
   * 새로운 자녀 정보 생성
   */
  static async createChild(
    childData: CreateChildRequest,
  ): Promise<ChildResponse> {
    return await apiClient.post<ChildResponse>(this.BASE_PATH, childData);
  }

  /**
   * 특정 자녀의 상세 정보 조회
   */
  static async getChild(childId: string): Promise<ChildResponse> {
    return await apiClient.get<ChildResponse>(`${this.BASE_PATH}/${childId}`);
  }

  /**
   * 자녀 정보 수정
   */
  static async updateChild(
    childId: string,
    childData: UpdateChildRequest,
  ): Promise<ChildResponse> {
    return await apiClient.put<ChildResponse>(
      `${this.BASE_PATH}/${childId}`,
      childData,
    );
  }

  /**
   * 자녀 정보 삭제 (소프트 삭제)
   */
  static async deleteChild(childId: string): Promise<ChildResponse> {
    return await apiClient.delete<ChildResponse>(
      `${this.BASE_PATH}/${childId}`,
    );
  }
}

export const getChildren = ChildService.getChildren;
