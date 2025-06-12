// 커뮤니티 관련 타입 정의

import { MapaderApiResponse, PaginatedResponse } from './index';

// 게시물 타입
export type PostType = 'question' | 'story' | 'tip';

// 게시물 상태
export type PostStatus = 'published' | 'draft' | 'hidden';

// 좋아요 대상 타입
export type LikeTargetType = 'post' | 'comment';

// 카테고리 타입
export interface Category {
  id: string;
  name: string;
  description: string;
  post_type: string;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
}

// 작성자 정보
export interface Author {
  id: string;
  name: string;
  profileImage?: string;
}

// 이미지 정보
export interface PostImage {
  id: string;
  imageUrl: string;
  altText?: string;
  order: number;
}

// 댓글 타입
export interface CommunityComment {
  id: string;
  user: {
    id: string;
    email: string;
    name: string;
    profile_image: string;
    auth_provider: string;
    created_at: string;
    updated_at: string;
  };
  content: string;
  like_count: number;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
}

// 게시물 타입
export interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
  category: Category;
  post_type: string;
  is_anonymous: boolean;
  is_pinned: boolean;
  is_solved: boolean;
  view_count: number;
  comment_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  thumbnail?: string;
  tags?: string[];
}

// 게시물 상세 (댓글 포함)
export interface PostDetail {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    image: string;
    level: string;
    posts: number;
  };
  category: string;
  tags: string[];
  comments: number;
  views: number;
  likes: number;
  created: string;
  isBookmarked: boolean;
  is_liked?: boolean;
  thumbnail?: string;
}

// 게시물 생성 요청
export interface CreatePostRequest {
  post_type: PostType;
  category_id: string;
  title: string;
  content: string;
  status: PostStatus;
  isAnonymous: boolean;
  images?: {
    imageUrl: string;
    altText?: string;
    order: number;
  }[];
}

// 게시물 수정 요청
export interface UpdatePostRequest {
  categoryId?: string;
  title?: string;
  content?: string;
  status?: PostStatus;
  isAnonymous?: boolean;
  images?: {
    imageUrl: string;
    altText?: string;
    order: number;
  }[];
}

// 게시물 해결 상태 변경 요청
export interface SolvePostRequest {
  isSolved: boolean;
}

// 댓글 생성 요청
export interface CreateCommentRequest {
  post_id: string;
  content: string;
  is_anonymous: boolean;
}

// 댓글 수정 요청
export interface UpdateCommentRequest {
  content: string;
}

// 좋아요 토글 요청
export interface ToggleLikeRequest {
  targetId: string;
  targetType: LikeTargetType;
}

// 좋아요 토글 응답
export interface ToggleLikeResponse {
  is_liked: boolean;
  like_count: number;
}

// 커뮤니티 통계
export interface CommunityStats {
  totalPosts: {
    questions: number;
    stories: number;
    tips: number;
  };
  totalComments: number;
  popularCategories: {
    name: string;
    count: number;
    postType: PostType;
  }[];
  recentActivity: {
    postsThisWeek: number;
    commentsThisWeek: number;
  };
}

// 게시물 목록 조회 파라미터
export interface PostsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  postType?: string;
}

// 카테고리 목록 조회 파라미터
export interface CategoriesParams {
  postType?: PostType;
}

// API 응답 타입들
export type CategoriesResponse = MapaderApiResponse<Category[]>;
export interface PostsResponse {
  success: boolean;
  data: Post[];
  pagination: {
    total_pages: number;
    count: number;
    current_page: number;
    next: string | null;
    previous: string | null;
  };
}
export type PostDetailResponse = MapaderApiResponse<PostDetail>;
export type CreatePostResponse = MapaderApiResponse<Post>;
export type UpdatePostResponse = MapaderApiResponse<Post>;
export type CreateCommentResponse = MapaderApiResponse<CommunityComment>;
export type UpdateCommentResponse = MapaderApiResponse<CommunityComment>;
export type ToggleLikeApiResponse = MapaderApiResponse<ToggleLikeResponse>;
export type CommunityStatsResponse = MapaderApiResponse<CommunityStats>;

// 게시물 타입 한글 매핑
export const POST_TYPE_LABELS: Record<PostType, string> = {
  question: '질문',
  story: '이야기',
  tip: '팁',
};

// 게시물 상태 한글 매핑
export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  published: '게시됨',
  draft: '임시저장',
  hidden: '숨김',
};

export interface User {
  id: string;
  email: string;
  name: string;
  profile_image: string;
  auth_provider: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  count: number;
  page: number;
  total_pages: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
  next: string | null;
  previous: string | null;
}
