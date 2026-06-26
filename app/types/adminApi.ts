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

export type SanghaGroupPurpose =
  | 'city_chapter'
  | 'seva'
  | 'bhajan'
  | 'online_global'
  | 'satsang'
  | 'study'
  | 'general'
  | string;
export type SanghaGroupPrivacy = 'public' | 'private' | 'invite_only' | string;
export type SanghaGroupActivityStatus = 'active' | 'inactive' | string;
export type SanghaReportStatus = 'pending' | 'resolved' | 'dismissed';
export type SanghaLiveStreamStatus = 'scheduled' | 'live' | 'ended' | 'cancelled' | string;

export interface SanghaUserSummary {
  id: string;
  memberId: string | null;
  name: string | null;
  handle: string | null;
  profileImageUrl?: string | null;
  mobileNumber?: string | null;
}

export interface AdminSanghaGroup {
  id: string;
  slug: string;
  name: string;
  purpose: SanghaGroupPurpose;
  privacy: SanghaGroupPrivacy;
  activityStatus: SanghaGroupActivityStatus;
  bannerUrl: string | null;
  iconUrl: string | null;
  description: string | null;
  guidelines: string | null;
  purposeText: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  ownerUserId: string;
  isOfficial: boolean;
  verifiedAt: string | null;
  verifiedById: string | null;
  memberCount: number;
  postCount: number;
  eventCount: number;
  lastActivityAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  owner: SanghaUserSummary;
  _count: {
    members: number;
    posts: number;
    events: number;
    liveStreams: number;
    reports: number;
  };
}

export interface AdminSanghaReport {
  id: string;
  reporterUserId: string;
  targetType: string;
  targetId: string;
  groupId: string | null;
  reason: string;
  details: string | null;
  status: SanghaReportStatus;
  adminNote: string | null;
  resolvedAt: string | null;
  resolvedById: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: SanghaUserSummary;
  group: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface AdminSanghaLiveStream {
  id: string;
  groupId: string;
  eventId: string | null;
  hostUserId: string;
  title: string;
  description: string | null;
  type: string;
  visibility: string;
  status: SanghaLiveStreamStatus;
  scheduledAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
  thumbnailUrl: string | null;
  playbackUrl: string | null;
  recordingStatus: string | null;
  provider: string | null;
  providerChannelId: string | null;
  viewerCount: number;
  peakViewerCount: number;
  chatEnabled: boolean;
  reactionsEnabled: boolean;
  lastHeartbeatAt: string | null;
  createdAt: string;
  updatedAt: string;
  host: SanghaUserSummary;
  group: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    attendance: number;
    chatMessages: number;
    reactions: number;
  };
}

export interface AdminSanghaAuditLog {
  id: string;
  actorId: string | null;
  action: string;
  entity: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AdminSanghaAnalytics {
  window: Record<string, unknown>;
  groups: Record<string, number>;
  engagement: Record<string, number>;
  moderation: Record<string, number>;
}

export interface CreateSanghaGroupPayload {
  ownerUserId: string;
  name: string;
  purpose: string;
  privacy: string;
  description?: string;
  city?: string;
  state?: string;
  country?: string;
  isOfficial?: boolean;
}

export interface UpdateSanghaGroupPayload {
  name?: string;
  description?: string;
  privacy?: string;
  activityStatus?: string;
}

export interface UpdateSanghaMemberPayload {
  groupId: string;
  memberId: string;
  role: 'owner' | 'moderator' | 'member';
  note?: string;
}

export type SanghaGroupsResponse = OffsetPaginatedResponse<'groups', AdminSanghaGroup>;
export type SanghaReportsResponse = OffsetPaginatedResponse<'reports', AdminSanghaReport>;
export type SanghaLiveStreamsResponse = OffsetPaginatedResponse<'streams', AdminSanghaLiveStream>;
export type SanghaAuditLogsResponse = OffsetPaginatedResponse<'logs', AdminSanghaAuditLog>;
