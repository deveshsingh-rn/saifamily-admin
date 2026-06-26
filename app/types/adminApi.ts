export interface OffsetPagination {
  limit: number;
  offset: number;
  total: number;
  nextOffset: number | null;
}

export type OffsetPaginatedResponse<ResourceKey extends string, Resource> = {
  pagination: OffsetPagination;
} & Record<ResourceKey, Resource[]>;

export interface ApiErrorResponse {
  message?: string;
  error?: string | { message?: string };
  code?: string;
  statusCode?: number;
}

export interface AdminUser {
  id: string;
  memberId: string | null;
  name: string | null;
  handle: string | null;
  email: string | null;
  mobileNumber: string | null;
  role: 'devotee' | 'mandir_admin' | 'super_admin' | string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminContentAuthor {
  id: string;
  memberId: string | null;
  name: string | null;
  handle: string | null;
  isActive: boolean;
}

export interface AdminEngagementCount {
  likes: number;
  comments: number;
  reposts: number;
  bookmarks: number;
}

export interface AdminContentItem {
  id: string;
  content: string;
  category: string;
  location: string | null;
  createdAt: string;
  author: AdminContentAuthor;
  _count: AdminEngagementCount;
}

export interface AdminExperienceCategory {
  category: string;
  label: string;
}

export type AdminUsersResponse = OffsetPaginatedResponse<'users', AdminUser>;
export type AdminContentResponse = OffsetPaginatedResponse<'experiences', AdminContentItem>;
