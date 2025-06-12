import apiClient from './api-client';
import {
  Child,
  CreateChildRequest,
  UpdateChildRequest,
  ChildrenListResponse,
  ChildResponse,
  DeleteChildResponse,
} from '../types/user';

interface UpdateProfileRequest {
  name: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    profile_image: string;
    auth_provider: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * 사용자 관련 API 서비스
 */
export class UserService {
  private static readonly BASE_PATH = '/auth'; // /users에서 /auth로 변경
  private static readonly CHILDREN_PATH = '/users'; // 자녀 관련은 아직 /users 사용

  /**
   * 프로필 정보 업데이트
   */
  static async updateProfile(
    data: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> {
    try {
      const response = await apiClient.put<UpdateProfileResponse>(
        `${this.BASE_PATH}/profile/`, // /auth/profile/로 변경
        data,
      );
      return response;
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      throw new Error('프로필 업데이트에 실패했습니다');
    }
  }

  /**
   * 자녀 정보 목록 조회
   */
  static async getChildren(): Promise<ChildrenListResponse> {
    return await apiClient.get<ChildrenListResponse>(
      `${this.CHILDREN_PATH}/children/`,
    );
  }

  /**
   * 자녀 정보 추가
   */
  static async createChild(
    childData: CreateChildRequest,
  ): Promise<ChildResponse> {
    return await apiClient.post<ChildResponse>(
      `${this.CHILDREN_PATH}/children/`,
      childData,
    );
  }

  /**
   * 자녀 정보 수정
   */
  static async updateChild(
    childId: string,
    childData: UpdateChildRequest,
  ): Promise<ChildResponse> {
    return await apiClient.put<ChildResponse>(
      `${this.CHILDREN_PATH}/children/${childId}/`,
      childData,
    );
  }

  /**
   * 자녀 정보 삭제
   */
  static async deleteChild(childId: string): Promise<DeleteChildResponse> {
    return await apiClient.delete<DeleteChildResponse>(
      `${this.CHILDREN_PATH}/children/${childId}/`,
    );
  }

  /**
   * 자녀 나이(개월수) 계산 헬퍼 함수
   * @param birth_date - 생년월일 (YYYY-MM-DD 형식)
   * @returns 개월수
   */
  static calculateAgeMonths(birth_date: string): number {
    const birth = new Date(birth_date);
    const now = new Date();

    const yearDiff = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();

    return yearDiff * 12 + monthDiff;
  }

  /**
   * 생년월일 유효성 검사 헬퍼 함수
   * @param birth_date - 생년월일 (YYYY-MM-DD 형식)
   * @returns 유효성 여부
   */
  static validateBirthDate(birth_date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birth_date)) {
      return false;
    }

    const date = new Date(birth_date);
    const now = new Date();

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return false;
    }

    // 미래 날짜가 아닌지 확인
    if (date > now) {
      return false;
    }

    // 너무 과거 날짜가 아닌지 확인 (10년 전까지만 허용)
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(now.getFullYear() - 10);

    if (date < tenYearsAgo) {
      return false;
    }

    return true;
  }

  /**
   * 자녀 이름 유효성 검사 헬퍼 함수
   * @param name - 자녀 이름(별명)
   * @returns 유효성 여부
   */
  static validateChildName(name: string): boolean {
    // 1-20자 사이, 특수문자 제외
    const nameRegex = /^[가-힣a-zA-Z0-9\s]{1,20}$/;
    return nameRegex.test(name.trim());
  }
}

export default UserService;
