import apiClient from './api-client';

/**
 * CSRF 토큰 관련 API 서비스
 */
export class CSRFService {
  /**
   * CSRF 토큰 가져오기
   */
  static async getCSRFToken(): Promise<void> {
    try {
      await apiClient.get('/auth/csrf/');
      console.log('🔐 CSRF 토큰 가져오기 성공');
    } catch (error) {
      console.error('❌ CSRF 토큰 가져오기 실패:', error);
      throw error;
    }
  }

  /**
   * 현재 브라우저에 CSRF 토큰이 있는지 확인
   */
  static hasCSRFToken(): boolean {
    if (typeof document === 'undefined') {
      return false;
    }

    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1];

    return !!