export interface OffsetPagination {
  limit: number;
  offset: number;
  total: number;
  nextOffset: number | null;
  hasMore?: boolean;
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

export type DirectoryReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden';
export type DirectoryReportStatus = 'pending' | 'resolved' | 'dismissed';
export type DirectoryListingStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'suspended';
export type DirectoryVerificationStatus = 'unverified' | 'verified';

export interface DirectoryUserSummary {
  id: string;
  memberId: string | null;
  name: string | null;
  handle: string | null;
  profileImageUrl?: string | null;
  mobileNumber?: string | null;
  isActive?: boolean;
}

export interface DirectoryListingSummary {
  id: string;
  businessName: string;
  slug: string;
  status: DirectoryListingStatus | string;
  ownerUserId?: string;
}

export interface DirectoryReview {
  id: string;
  listingId: string;
  reviewerUserId: string;
  rating: number;
  content: string | null;
  status: DirectoryReviewStatus;
  verifiedInteraction: boolean;
  createdAt: string;
  updatedAt: string;
  listing: DirectoryListingSummary;
  reviewer: DirectoryUserSummary;
  _count: {
    votes: number;
  };
}

export interface DirectoryReport {
  id: string;
  listingId: string;
  reporterUserId: string;
  reason: string;
  details: string | null;
  status: DirectoryReportStatus;
  adminNote: string | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
  createdAt: string;
  updatedAt: string;
  listing: DirectoryListingSummary & {
    owner?: DirectoryUserSummary;
  };
  reporter: DirectoryUserSummary;
}

export interface DirectoryListing {
  id: string;
  businessName: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  status: DirectoryListingStatus;
  verificationStatus: DirectoryVerificationStatus | string;
  phoneNumber: string | null;
  whatsappNumber: string | null;
  email: string | null;
  websiteUrl: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  rejectedReason: string | null;
  suspendedReason: string | null;
  publishedAt: string | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    slug: string;
    name: string;
    color: string | null;
    icon: string | null;
  };
  owner: DirectoryUserSummary;
  _count: {
    bookmarks: number;
    recommendations: number;
    enquiries: number;
  };
}

export interface DirectoryAuditLog {
  id: string;
  actorId: string | null;
  actor: DirectoryUserSummary | null;
  action: string;
  entity: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface DirectoryAnalytics {
  range: Record<string, unknown>;
  totals: Record<string, number>;
  moderation: Record<string, number>;
  recent: Record<string, unknown>;
  breakdowns: Record<string, unknown>;
  topCategories: Array<{
    id: string;
    slug: string;
    name: string;
    color: string | null;
    icon: string | null;
    listingCount: number;
  }>;
  topCities: Array<{
    city: string;
    listingCount: number;
  }>;
}

export type DirectoryReviewsResponse = OffsetPaginatedResponse<'reviews', DirectoryReview>;
export type DirectoryReportsResponse = OffsetPaginatedResponse<'reports', DirectoryReport>;
export type DirectoryListingsResponse = OffsetPaginatedResponse<'listings', DirectoryListing>;
export type DirectoryAuditLogsResponse = OffsetPaginatedResponse<'logs', DirectoryAuditLog>;
