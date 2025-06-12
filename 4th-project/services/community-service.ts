import apiClient from './api-client';
import {
  Category,
  Post,
  PostDetail,
  CommunityComment,
  CommunityStats,
  CreatePostRequest,
  UpdatePostRequest,
  SolvePostRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  ToggleLikeRequest,
  ToggleLikeResponse,
  PostsParams,
  CategoriesParams,
  CategoriesResponse,
  PostsResponse,
  PostDetailResponse,
  CreatePostResponse,
  UpdatePostResponse,
  CreateCommentResponse,
  UpdateCommentResponse,
  ToggleLikeApiResponse,
  CommunityStatsResponse,
  PostType,
  PostStatus,
  LikeTargetType,
  POST_TYPE_LABELS,
  POST_STATUS_LABELS,
} from '../types/community';
import { MapaderApiResponse } from '../types/index';

/**
 * 커뮤니티 관련 API 서비스
 */
export class CommunityService {
  private static readonly BASE_PATH = '/community';

  // ========== 카테고리 관련 ==========

  /**
   * 카테고리 목록 조회
   */
  static async getCategories(
    params: CategoriesParams = {},
  ): Promise<CategoriesResponse> {
    const queryParams = new URLSearchParams();

    if (params.postType) queryParams.append('postType', params.postType);

    const url = `${this.BASE_PATH}/categories${queryParams.toString() ? `?${queryParams.toString()}` : '/'}`;
    return await apiClient.get<CategoriesResponse>(url);
  }

  // ========== 게시물 관련 ==========

  /**
   * 게시물 목록 조회
   */
  static async getPosts(params: PostsParams = {}): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.categoryId) queryParams.append('category_id', params.categoryId);
    if (params.search) queryParams.append('search', params.search);
    if (params.postType) queryParams.append('post_type', params.postType);

    const url = `${this.BASE_PATH}/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<PostsResponse>(url);
  }

  /**
   * 게시물 상세 조회
   */
  static async getPost(postId: string): Promise<PostDetailResponse> {
    return await apiClient.get<PostDetailResponse>(
      `${this.BASE_PATH}/posts/${postId}`,
    );
  }

  /**
   * 게시물 작성
   */
  static async createPost(
    postData: CreatePostRequest,
  ): Promise<CreatePostResponse> {
    return await apiClient.post<CreatePostResponse>(
      `${this.BASE_PATH}/posts/`,
      postData,
    );
  }

  /**
   * 게시물 수정
   */
  static async updatePost(
    postId: string,
    postData: UpdatePostRequest,
  ): Promise<UpdatePostResponse> {
    return await apiClient.put<UpdatePostResponse>(
      `${this.BASE_PATH}/posts/${postId}`,
      postData,
    );
  }

  /**
   * 게시물 삭제
   */
  static async deletePost(
    postId: string,
  ): Promise<MapaderApiResponse<{ message: string }>> {
    return await apiClient.delete<MapaderApiResponse<{ message: string }>>(
      `${this.BASE_PATH}/posts/${postId}`,
    );
  }

  /**
   * 게시물 해결 상태 변경 (질문 타입만)
   */
  static async solvePost(
    postId: string,
    solveData: SolvePostRequest,
  ): Promise<UpdatePostResponse> {
    return await apiClient.put<UpdatePostResponse>(
      `${this.BASE_PATH}/posts/${postId}/solve`,
      solveData,
    );
  }

  // ========== 댓글 관련 ==========

  /**
   * 댓글 작성
   */
  static async createComment(
    commentData: CreateCommentRequest,
  ): Promise<CreateCommentResponse> {
    return await apiClient.post<CreateCommentResponse>(
      `${this.BASE_PATH}/comments/`,
      commentData,
    );
  }

  /**
   * 댓글 수정
   */
  static async updateComment(
    commentId: string,
    commentData: UpdateCommentRequest,
  ): Promise<UpdateCommentResponse> {
    return await apiClient.put<UpdateCommentResponse>(
      `${this.BASE_PATH}/comments/${commentId}`,
      commentData,
    );
  }

  /**
   * 댓글 삭제
   */
  static async deleteComment(
    commentId: string,
  ): Promise<MapaderApiResponse<{ message: string }>> {
    return await apiClient.delete<MapaderApiResponse<{ message: string }>>(
      `${this.BASE_PATH}/comments/${commentId}`,
    );
  }

  // ========== 좋아요 관련 ==========

  /**
   * 좋아요 토글
   */
  static async toggleLike({
    targetId,
    targetType,
  }: ToggleLikeRequest): Promise<ToggleLikeApiResponse> {
    // CSRF 토큰을 가져옵니다
    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1];

    return await apiClient.post<ToggleLikeApiResponse>(
      `${this.BASE_PATH}/likes/toggle`,
      {
        target_id: targetId,
        target_type: targetType,
      },
      {
        headers: {
          'X-CSRFToken': csrfToken, // CSRF 토큰을 헤더에 추가
        },
      },
    );
  }

  // ========== 통계 관련 ==========

  /**
   * 커뮤니티 통계 조회
   */
  static async getStats(): Promise<CommunityStatsResponse> {
    return await apiClient.get<CommunityStatsResponse>(
      `${this.BASE_PATH}/stats`,
    );
  }

  // ========== 헬퍼 함수들 ==========

  /**
   * 게시물 타입 한글 라벨 가져오기
   */
  static getPostTypeLabel(postType: PostType): string {
    return POST_TYPE_LABELS[postType];
  }

  /**
   * 게시물 상태 한글 라벨 가져오기
   */
  static getPostStatusLabel(status: PostStatus): string {
    return POST_STATUS_LABELS[status];
  }

  /**
   * 게시물 제목 유효성 검사
   */
  static validatePostTitle(title: string): boolean {
    return title.trim().length >= 1 && title.trim().length <= 200;
  }

  /**
   * 게시물 내용 유효성 검사
   */
  static validatePostContent(content: string): boolean {
    return content.trim().length >= 1 && content.trim().length <= 10000;
  }

  /**
   * 댓글 내용 유효성 검사
   */
  static validateCommentContent(content: string): boolean {
    return content.trim().length >= 1 && content.trim().length <= 1000;
  }

  /**
   * 댓글을 생성일자순으로 정렬
   */
  static sortCommentsByDate(comments: CommunityComment[]): CommunityComment[] {
    return [...comments].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  }

  /**
   * 게시물을 카테고리별로 그룹화
   */
  static groupPostsByCategory(posts: Post[]): Record<string, Post[]> {
    const grouped: Record<string, Post[]> = {};

    posts.forEach((post) => {
      const categoryName = post.category.name;
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(post);
    });

    return grouped;
  }

  /**
   * 게시물을 타입별로 그룹화
   */
  static groupPostsByType(posts: Post[]): Record<string, Post[]> {
    const grouped: Record<string, Post[]> = {};

    posts.forEach((post) => {
      if (!grouped[post.post_type]) {
        grouped[post.post_type] = [];
      }
      grouped[post.post_type].push(post);
    });

    return grouped;
  }

  /**
   * 게시물 목록을 최신순으로 정렬
   */
  static sortPostsByLatest(posts: Post[]): Post[] {
    return [...posts].sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }

  /**
   * 게시물 목록을 인기순으로 정렬 (조회수 + 좋아요 + 댓글 수 기준)
   */
  static sortPostsByPopularity(posts: Post[]): Post[] {
    return [...posts].sort((a, b) => {
      const scoreA = a.view_count + a.like_count * 2 + a.comment_count * 3;
      const scoreB = b.view_count + b.like_count * 2 + b.comment_count * 3;
      return scoreB - scoreA;
    });
  }

  /**
   * 핀된 게시물과 일반 게시물 분리
   */
  static separatePinnedPosts(posts: Post[]): {
    pinned: Post[];
    normal: Post[];
  } {
    const pinned = posts.filter((post) => post.is_pinned);
    const normal = posts.filter((post) => !post.is_pinned);

    return { pinned, normal };
  }

  /**
   * 검색어로 게시물 필터링 (클라이언트 사이드)
   */
  static filterPostsBySearch(posts: Post[], searchTerm: string): Post[] {
    if (!searchTerm.trim()) return posts;

    const term = searchTerm.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term),
    );
  }

  /**
   * 해결된/미해결 질문 필터링
   */
  static filterQuestionsBySolved(posts: Post[], isSolved?: boolean): Post[] {
    if (isSolved === undefined) return posts;

    return posts.filter(
      (post) => post.post_type === 'question' && post.is_solved === isSolved,
    );
  }
}

export default CommunityService;
