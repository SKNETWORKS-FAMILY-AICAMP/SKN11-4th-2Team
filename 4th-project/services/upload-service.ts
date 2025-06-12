// Next.js API를 통한 S3 파일 업로드 서비스

import {
  UploadedFile,
  ImageUploadResponse,
  ProfileImageUploadResponse,
  MultipleUploadResult,
  UploadFileType,
  ImageResizeOptions,
  ImageUploadApiResponse,
  ProfileImageUploadApiResponse,
  MultipleUploadApiResponse,
  UPLOAD_CONFIGS,
  UPLOAD_ERROR_CODES,
  UPLOAD_ERROR_MESSAGES,
  FileUploadError
} from '../types/upload';

/**
 * 파일 업로드 관련 API 서비스 (Next.js API Routes 사용)
 */
export class UploadService {
  private static readonly API_BASE_PATH = '/api/upload';

  // ========== 업로드 메서드들 ==========

  /**
   * 일반 이미지 업로드
   */
  static async uploadImage(
    file: File,
    resizeOptions?: ImageResizeOptions
  ): Promise<ImageUploadApiResponse> {
    this.validateFile(file, 'image');

    const formData = new FormData();
    formData.append('image', file);
    
    if (resizeOptions) {
      formData.append('resizeOptions', JSON.stringify(resizeOptions));
    }

    try {
      const response = await fetch(`${this.API_BASE_PATH}/image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`업로드 실패: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleUploadError(error);
    }
  }

  /**
   * 프로필 이미지 업로드 (썸네일 생성 포함)
   */
  static async uploadProfileImage(file: File): Promise<ProfileImageUploadApiResponse> {
    this.validateFile(file, 'profile');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${this.API_BASE_PATH}/profile`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`프로필 이미지 업로드 실패: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleUploadError(error);
    }
  }

  /**
   * 다중 파일 업로드
   */
  static async uploadMultipleFiles(
    files: File[],
    fileType: UploadFileType = 'image'
  ): Promise<MultipleUploadApiResponse> {
    if (files.length === 0) {
      throw new Error(UPLOAD_ERROR_MESSAGES[UPLOAD_ERROR_CODES.NO_FILE_PROVIDED]);
    }

    // 각 파일 유효성 검사
    files.forEach(file => this.validateFile(file, fileType));

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    formData.append('fileType', fileType);

    try {
      const response = await fetch(`${this.API_BASE_PATH}/multiple`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`다중 파일 업로드 실패: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleUploadError(error);
    }
  }

  /**
   * Base64 이미지 업로드
   */
  static async uploadBase64Image(
    base64Data: string,
    filename: string,
    resizeOptions?: ImageResizeOptions
  ): Promise<ImageUploadApiResponse> {
    try {
      const response = await fetch(`${this.API_BASE_PATH}/base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          base64Data,
          filename,
          resizeOptions
        })
      });

      if (!response.ok) {
        throw new Error(`Base64 이미지 업로드 실패: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleUploadError(error);
    }
  }

  /**
   * 파일 삭제 (S3에서 삭제)
   */
  static async deleteFile(fileKey: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.API_BASE_PATH}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ fileKey })
      });

      if (!response.ok) {
        throw new Error(`파일 삭제 실패: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleUploadError(error);
    }
  }

  // ========== 유틸리티 메서드들 ==========

  /**
   * 파일 유효성 검사
   */
  private static validateFile(file: File, type: UploadFileType): void {
    const config = UPLOAD_CONFIGS[type];

    // 파일 크기 검사
    if (file.size > config.maxFileSize) {
      throw new Error(
        `${UPLOAD_ERROR_MESSAGES[UPLOAD_ERROR_CODES.FILE_TOO_LARGE]} (최대 ${this.formatFileSize(config.maxFileSize)})`
      );
    }

    // 파일 타입 검사
    if (!config.allowedMimeTypes.includes(file.type)) {
      throw new Error(
        `${UPLOAD_ERROR_MESSAGES[UPLOAD_ERROR_CODES.INVALID_FILE_TYPE]} (허용: ${config.allowedMimeTypes.join(', ')})`
      );
    }
  }

  /**
   * 파일 크기 포맷팅
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 파일 확장자 추출
   */
  static getFileExtension(filename: string): string {
    return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
  }

  /**
   * MIME 타입에서 파일 확장자 추출
   */
  static getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'application/pdf': 'pdf'
    };
    
    return mimeToExt[mimeType] || 'bin';
  }

  /**
   * 파일명 생성 (중복 방지)
   */
  static generateFileName(originalName: string, prefix?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = this.getFileExtension(originalName);
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    
    return `${prefix ? prefix + '_' : ''}${baseName}_${timestamp}_${random}.${extension}`;
  }

  /**
   * 이미지 파일 여부 확인
   */
  static isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * 파일 타입 검증
   */
  static validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  /**
   * 이미지 미리보기 URL 생성
   */
  static createImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isImageFile(file)) {
        reject(new Error('이미지 파일이 아닙니다.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => {
        reject(new Error('파일 읽기 실패'));
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * 여러 이미지 미리보기 URL 생성
   */
  static async createMultipleImagePreviews(files: File[]): Promise<string[]> {
    const previews: string[] = [];
    
    for (const file of files) {
      if (this.isImageFile(file)) {
        try {
          const preview = await this.createImagePreview(file);
          previews.push(preview);
        } catch (error) {
          console.warn(`미리보기 생성 실패: ${file.name}`, error);
        }
      }
    }
    
    return previews;
  }

  /**
   * 업로드 진행률 추적 가능한 업로드
   */
  static uploadWithProgress(
    file: File,
    type: UploadFileType,
    onProgress?: (percentage: number) => void
  ): Promise<ImageUploadApiResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('image', file);

      // 진행률 이벤트
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded / e.total) * 100);
            onProgress(percentage);
          }
        });
      }

      // 완료 이벤트
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('응답 파싱 실패'));
          }
        } else {
          reject(new Error(`업로드 실패: ${xhr.status}`));
        }
      });

      // 에러 이벤트
      xhr.addEventListener('error', () => {
        reject(new Error('네트워크 오류'));
      });

      // 요청 전송
      xhr.open('POST', `${this.API_BASE_PATH}/${type}`);
      xhr.setRequestHeader('Authorization', `Bearer ${this.getAuthToken()}`);
      xhr.send(formData);
    });
  }

  // ========== 내부 헬퍼 메서드들 ==========

  /**
   * 인증 토큰 가져오기
   */
  private static getAuthToken(): string {
    if (typeof window !== 'undefined') {
      const storageKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || 
        '1bb247a99a0f51d506109711452f30b12e274cf882fa46ab6f917fe16e203147';
      return localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey) || '';
    }
    return '';
  }

  /**
   * 업로드 에러 처리
   */
  private static handleUploadError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }
    
    return new Error(UPLOAD_ERROR_MESSAGES[UPLOAD_ERROR_CODES.UPLOAD_FAILED]);
  }

  /**
   * 파일 URL에서 S3 키 추출
   */
  static extractS3KeyFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1); // 맨 앞의 '/' 제거
    } catch {
      return url;
    }
  }

  /**
   * CDN URL로 변환 (필요한 경우)
   */
  static convertToCdnUrl(s3Url: string): string {
    const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN;
    if (cdnDomain && s3Url.includes('.amazonaws.com')) {
      return s3Url.replace(/https:\/\/[^.]+\.s3[^.]*\.amazonaws\.com/, `https://${cdnDomain}`);
    }
    return s3Url;
  }
}

export default UploadService;
