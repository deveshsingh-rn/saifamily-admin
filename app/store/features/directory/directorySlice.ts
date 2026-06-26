import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import {
  DirectoryAnalytics,
  DirectoryAuditLog,
  DirectoryAuditLogsResponse,
  DirectoryListing,
  DirectoryListingStatus,
  DirectoryListingsResponse,
  DirectoryReport,
  DirectoryReportsResponse,
  DirectoryReportStatus,
  DirectoryReview,
  DirectoryReviewsResponse,
  DirectoryReviewStatus,
  OffsetPagination,
} from '../../../types/adminApi';

export interface DirectoryListQuery {
  limit: number;
  offset: number;
  status?: string;
  q?: string;
  rating?: number;
  listingId?: string;
  verificationStatus?: string;
  categoryId?: string;
  city?: string;
}

export interface DirectoryAuditLogQuery {
  limit: number;
  offset: number;
  actorId?: string;
  entity?: string;
  entityId?: string;
  action?: string;
}

export interface DirectoryModerationPayload {
  id: string;
  note?: string;
  reason?: string;
  status?: 'resolved' | 'dismissed';
  verificationStatus?: 'verified';
}

interface DirectoryResourceState<Resource> {
  items: Resource[];
  loading: boolean;
  error: string | null;
  pagination: OffsetPagination;
  lastQuery: DirectoryListQuery;
}

interface DirectoryState {
  reviews: DirectoryResourceState<DirectoryReview>;
  reports: DirectoryResourceState<DirectoryReport>;
  listings: DirectoryResourceState<DirectoryListing>;
  auditLogs: {
    items: DirectoryAuditLog[];
    loading: boolean;
    error: string | null;
    pagination: OffsetPagination;
    lastQuery: DirectoryAuditLogQuery;
  };
  analytics: {
    data: DirectoryAnalytics | null;
    loading: boolean;
    error: string | null;
  };
  submittingAction: string | null;
  mutationError: string | null;
}

const defaultPagination: OffsetPagination = {
  limit: 20,
  offset: 0,
  total: 0,
  nextOffset: null,
  hasMore: false,
};

const defaultQuery: DirectoryListQuery = {
  limit: 20,
  offset: 0,
};

const initialResourceState = <Resource>(): DirectoryResourceState<Resource> => ({
  items: [],
  loading: false,
  error: null,
  pagination: defaultPagination,
  lastQuery: defaultQuery,
});

const replaceById = <Resource extends { id: string }>(
  items: Resource[],
  updated: Resource,
) => {
  const index = items.findIndex(({ id }) => id === updated.id);

  if (index === -1) {
    return items;
  }

  const nextItems = [...items];
  nextItems[index] = updated;
  return nextItems;
};

const initialState: DirectoryState = {
  reviews: initialResourceState<DirectoryReview>(),
  reports: initialResourceState<DirectoryReport>(),
  listings: initialResourceState<DirectoryListing>(),
  auditLogs: {
    items: [],
    loading: false,
    error: null,
    pagination: defaultPagination,
    lastQuery: { limit: 50, offset: 0 },
  },
  analytics: {
    data: null,
    loading: false,
    error: null,
  },
  submittingAction: null,
  mutationError: null,
};

const directorySlice = createSlice({
  name: 'directory',
  initialState,
  reducers: {
    fetchDirectoryReviewsStart(state, action: PayloadAction<DirectoryListQuery>) {
      state.reviews.loading = true;
      state.reviews.error = null;
      state.reviews.lastQuery = action.payload;
    },
    fetchDirectoryReviewsSuccess(state, action: PayloadAction<DirectoryReviewsResponse>) {
      state.reviews.items = action.payload.reviews;
      state.reviews.pagination = action.payload.pagination;
      state.reviews.loading = false;
    },
    fetchDirectoryReviewsFailure(state, action: PayloadAction<string>) {
      state.reviews.error = action.payload;
      state.reviews.loading = false;
    },
    fetchDirectoryReportsStart(state, action: PayloadAction<DirectoryListQuery>) {
      state.reports.loading = true;
      state.reports.error = null;
      state.reports.lastQuery = action.payload;
    },
    fetchDirectoryReportsSuccess(state, action: PayloadAction<DirectoryReportsResponse>) {
      state.reports.items = action.payload.reports;
      state.reports.pagination = action.payload.pagination;
      state.reports.loading = false;
    },
    fetchDirectoryReportsFailure(state, action: PayloadAction<string>) {
      state.reports.error = action.payload;
      state.reports.loading = false;
    },
    fetchDirectoryListingsStart(state, action: PayloadAction<DirectoryListQuery>) {
      state.listings.loading = true;
      state.listings.error = null;
      state.listings.lastQuery = action.payload;
    },
    fetchDirectoryListingsSuccess(state, action: PayloadAction<DirectoryListingsResponse>) {
      state.listings.items = action.payload.listings;
      state.listings.pagination = action.payload.pagination;
      state.listings.loading = false;
    },
    fetchDirectoryListingsFailure(state, action: PayloadAction<string>) {
      state.listings.error = action.payload;
      state.listings.loading = false;
    },
    fetchDirectoryAnalyticsStart(state) {
      state.analytics.loading = true;
      state.analytics.error = null;
    },
    fetchDirectoryAnalyticsSuccess(state, action: PayloadAction<DirectoryAnalytics>) {
      state.analytics.data = action.payload;
      state.analytics.loading = false;
    },
    fetchDirectoryAnalyticsFailure(state, action: PayloadAction<string>) {
      state.analytics.error = action.payload;
      state.analytics.loading = false;
    },
    fetchDirectoryAuditLogsStart(state, action: PayloadAction<DirectoryAuditLogQuery>) {
      state.auditLogs.loading = true;
      state.auditLogs.error = null;
      state.auditLogs.lastQuery = action.payload;
    },
    fetchDirectoryAuditLogsSuccess(state, action: PayloadAction<DirectoryAuditLogsResponse>) {
      state.auditLogs.items = action.payload.logs;
      state.auditLogs.pagination = action.payload.pagination;
      state.auditLogs.loading = false;
    },
    fetchDirectoryAuditLogsFailure(state, action: PayloadAction<string>) {
      state.auditLogs.error = action.payload;
      state.auditLogs.loading = false;
    },
    approveDirectoryReviewStart(state, action: PayloadAction<DirectoryModerationPayload>) {
      state.submittingAction = `review:${action.payload.id}:approve`;
      state.mutationError = null;
    },
    rejectDirectoryReviewStart(state, action: PayloadAction<DirectoryModerationPayload>) {
      state.submittingAction = `review:${action.payload.id}:reject`;
      state.mutationError = null;
    },
    hideDirectoryReviewStart(state, action: PayloadAction<DirectoryModerationPayload>) {
      state.submittingAction = `review:${action.payload.id}:hide`;
      state.mutationError = null;
    },
    restoreDirectoryReviewStart(state, action: PayloadAction<DirectoryModerationPayload>) {
      state.submittingAction = `review:${action.payload.id}:restore`;
      state.mutationError = null;
    },
    directoryReviewMutationSuccess(state, action: PayloadAction<DirectoryReview>) {
      state.reviews.items = replaceById(state.reviews.items, action.payload);
      state.submittingAction = null;
    },
    resolveDirectoryReportStart(state, action: PayloadAction<DirectoryModerationPayload>) {
      state.submittingAction = `report:${action.payload.id}:resolve`;
      state.mutationError = null;
    },
    directoryReportMutationSuccess(state, action: PayloadAction<DirectoryReport>) {
      state.reports.items = replaceById(state.reports.items, action.payload);
      state.submittingAction = null;
    },
    approveDirectoryListingStart(state, action: PayloadAction<DirectoryModerationPayload>) {
      state.submittingAction = `listing:${action.payload.id}:approve`;
      state.mutationError = null;
    },
    rejectDirectoryListingStart(state, action: PayloadAction<DirectoryModerationPayload>) {
      state.submittingAction = `listing:${action.payload.id}:reject`;
      state.mutationError = null;
    },
    suspendDirectoryListingStart(state, action: PayloadAction<DirectoryModerationPayload>) {
      state.submittingAction = `listing:${action.payload.id}:suspend`;
      state.mutationError = null;
    },
    restoreDirectoryListingStart(state, action: PayloadAction<DirectoryModerationPayload>) {
      state.submittingAction = `listing:${action.payload.id}:restore`;
      state.mutationError = null;
    },
    verifyDirectoryListingStart(state, action: PayloadAction<DirectoryModerationPayload>) {
      state.submittingAction = `listing:${action.payload.id}:verify`;
      state.mutationError = null;
    },
    unverifyDirectoryListingStart(state, action: PayloadAction<DirectoryModerationPayload>) {
      state.submittingAction = `listing:${action.payload.id}:unverify`;
      state.mutationError = null;
    },
    directoryListingMutationSuccess(state, action: PayloadAction<DirectoryListing>) {
      state.listings.items = replaceById(state.listings.items, action.payload);
      state.submittingAction = null;
    },
    directoryMutationFailure(state, action: PayloadAction<string>) {
      state.mutationError = action.payload;
      state.submittingAction = null;
    },
  },
});

export const {
  fetchDirectoryReviewsStart,
  fetchDirectoryReviewsSuccess,
  fetchDirectoryReviewsFailure,
  fetchDirectoryReportsStart,
  fetchDirectoryReportsSuccess,
  fetchDirectoryReportsFailure,
  fetchDirectoryListingsStart,
  fetchDirectoryListingsSuccess,
  fetchDirectoryListingsFailure,
  fetchDirectoryAnalyticsStart,
  fetchDirectoryAnalyticsSuccess,
  fetchDirectoryAnalyticsFailure,
  fetchDirectoryAuditLogsStart,
  fetchDirectoryAuditLogsSuccess,
  fetchDirectoryAuditLogsFailure,
  approveDirectoryReviewStart,
  rejectDirectoryReviewStart,
  hideDirectoryReviewStart,
  restoreDirectoryReviewStart,
  directoryReviewMutationSuccess,
  resolveDirectoryReportStart,
  directoryReportMutationSuccess,
  approveDirectoryListingStart,
  rejectDirectoryListingStart,
  suspendDirectoryListingStart,
  restoreDirectoryListingStart,
  verifyDirectoryListingStart,
  unverifyDirectoryListingStart,
  directoryListingMutationSuccess,
  directoryMutationFailure,
} = directorySlice.actions;

export const selectDirectoryReviews = (state: RootState) => state.directory.reviews;
export const selectDirectoryReports = (state: RootState) => state.directory.reports;
export const selectDirectoryListings = (state: RootState) => state.directory.listings;
export const selectDirectoryAnalytics = (state: RootState) => state.directory.analytics;
export const selectDirectoryAuditLogs = (state: RootState) => state.directory.auditLogs;
export const selectDirectorySubmittingAction = (state: RootState) =>
  state.directory.submittingAction;
export const selectDirectoryMutationError = (state: RootState) =>
  state.directory.mutationError;

export const DIRECTORY_REVIEW_STATUSES: DirectoryReviewStatus[] = [
  'pending',
  'approved',
  'rejected',
  'hidden',
];

export const DIRECTORY_REPORT_STATUSES: DirectoryReportStatus[] = [
  'pending',
  'resolved',
  'dismissed',
];

export const DIRECTORY_LISTING_STATUSES: DirectoryListingStatus[] = [
  'pending_review',
  'approved',
  'rejected',
  'suspended',
];

export default directorySlice.reducer;
