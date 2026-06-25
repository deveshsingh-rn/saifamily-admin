import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DirectoryCategory, CreateDirectoryCategoryPayload, UpdateDirectoryCategoryPayload } from '@/types/directoryCategory';
import { DirectoryReview, DirectoryReviewStatus } from '@/types/directoryReview';
import { DirectoryReport, DirectoryReportStatus as ReportStatus, ResolveReportPayload } from '@/types/directoryReport';
import { DirectoryListing, DirectoryListingStatus as ListingStatus, UpdateListingActionPayload } from '@/types/directoryListing';
import { DirectoryAnalytics, DirectoryAuditLog } from '@/types/directoryMeta';

export interface UpdateActionPayload {
  id: string;
  payload: UpdateDirectoryCategoryPayload;
}

export interface UpdateReviewStatusActionPayload {
  reviewId: string;
  status: DirectoryReviewStatus;
}

export interface DirectoryState {
  categories: DirectoryCategory[];
  reviews: DirectoryReview[];
  reports: DirectoryReport[];
  listings: DirectoryListing[];
  analytics: DirectoryAnalytics | null;
  auditLogs: DirectoryAuditLog[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: DirectoryState = {
  categories: [],
  reviews: [],
  reports: [],
  listings: [],
  analytics: null,
  auditLogs: [],
  loading: false,
  submitting: false,
  error: null,
};

const directorySlice = createSlice({
  name: 'directory',
  initialState,
  reducers: {
    // Fetch
    fetchDirectoryCategoriesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDirectoryCategoriesSuccess(state, action: PayloadAction<DirectoryCategory[]>) {
      state.categories = action.payload;
      state.loading = false;
    },
    fetchDirectoryCategoriesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Create
    addDirectoryCategoryStart(state, action: PayloadAction<CreateDirectoryCategoryPayload>) {
      state.submitting = true;
      state.error = null;
    },
    addDirectoryCategorySuccess(state, action: PayloadAction<DirectoryCategory>) {
      state.categories.push(action.payload);
      state.submitting = false;
    },
    addDirectoryCategoryFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
    // Update
    updateDirectoryCategoryStart(state, action: PayloadAction<UpdateActionPayload>) {
      state.submitting = true;
      state.error = null;
    },
    updateDirectoryCategorySuccess(state, action: PayloadAction<DirectoryCategory>) {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      state.submitting = false;
    },
    updateDirectoryCategoryFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
    // Delete (soft)
    deleteDirectoryCategoryStart(state, action: PayloadAction<string>) {
      state.submitting = true;
      state.error = null;
    },
    deleteDirectoryCategorySuccess(state, action: PayloadAction<DirectoryCategory>) {
      // Update the item instead of removing it, as it's a soft delete
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      state.submitting = false;
    },
    deleteDirectoryCategoryFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },

    // Reviews
    fetchDirectoryReviewsStart(state, action: PayloadAction<DirectoryReviewStatus | undefined>) {
      state.loading = true;
      state.error = null;
    },
    fetchDirectoryReviewsSuccess(state, action: PayloadAction<DirectoryReview[]>) {
      state.reviews = action.payload;
      state.loading = false;
    },
    fetchDirectoryReviewsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateDirectoryReviewStatusStart(state, action: PayloadAction<UpdateReviewStatusActionPayload>) {
      state.submitting = true;
      state.error = null;
    },
    restoreDirectoryReviewStart(state, action: PayloadAction<string>) {
      state.submitting = true;
      state.error = null;
    },
    updateDirectoryReviewStatusSuccess(state, action: PayloadAction<DirectoryReview>) {
      const index = state.reviews.findIndex(review => review.id === action.payload.id);
      if (index !== -1) {
        state.reviews[index] = action.payload;
      }
      state.submitting = false;
    },
    updateDirectoryReviewStatusFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },

    // Reports
    fetchDirectoryReportsStart(state, action: PayloadAction<ReportStatus | undefined>) {
      state.loading = true;
      state.error = null;
    },
    fetchDirectoryReportsSuccess(state, action: PayloadAction<DirectoryReport[]>) {
      state.reports = action.payload;
      state.loading = false;
    },
    fetchDirectoryReportsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resolveDirectoryReportStart(state, action: PayloadAction<ResolveReportPayload>) {
      state.submitting = true;
      state.error = null;
    },
    resolveDirectoryReportSuccess(state, action: PayloadAction<DirectoryReport>) {
      const index = state.reports.findIndex(report => report.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
      state.submitting = false;
    },
    resolveDirectoryReportFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },

    // Listings
    fetchDirectoryListingsStart(state, action: PayloadAction<ListingStatus | undefined>) {
      state.loading = true;
      state.error = null;
    },
    fetchDirectoryListingsSuccess(state, action: PayloadAction<DirectoryListing[]>) {
      state.listings = action.payload;
      state.loading = false;
    },
    fetchDirectoryListingsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateDirectoryListingStart(state, action: PayloadAction<UpdateListingActionPayload>) {
      state.submitting = true;
      state.error = null;
    },
    updateDirectoryListingSuccess(state, action: PayloadAction<DirectoryListing>) {
      const index = state.listings.findIndex(listing => listing.id === action.payload.id);
      if (index !== -1) {
        state.listings[index] = action.payload;
      }
      state.submitting = false;
    },
    updateDirectoryListingFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },

    // Analytics & Logs
    fetchDirectoryAnalyticsStart(state) { state.loading = true; state.error = null; },
    fetchDirectoryAnalyticsSuccess(state, action: PayloadAction<DirectoryAnalytics>) { state.analytics = action.payload; state.loading = false; },
    fetchDirectoryAnalyticsFailure(state, action: PayloadAction<string>) { state.loading = false; state.error = action.payload; },
    fetchDirectoryAuditLogsStart(state) { state.loading = true; state.error = null; },
    fetchDirectoryAuditLogsSuccess(state, action: PayloadAction<DirectoryAuditLog[]>) { state.auditLogs = action.payload; state.loading = false; },
    fetchDirectoryAuditLogsFailure(state, action: PayloadAction<string>) { state.loading = false; state.error = action.payload; },
  },
});

export const {
  fetchDirectoryCategoriesStart, fetchDirectoryCategoriesSuccess, fetchDirectoryCategoriesFailure,
  addDirectoryCategoryStart, addDirectoryCategorySuccess, addDirectoryCategoryFailure,
  updateDirectoryCategoryStart, updateDirectoryCategorySuccess, updateDirectoryCategoryFailure,
  deleteDirectoryCategoryStart, deleteDirectoryCategorySuccess, deleteDirectoryCategoryFailure,
  fetchDirectoryReviewsStart, fetchDirectoryReviewsSuccess, fetchDirectoryReviewsFailure,
  updateDirectoryReviewStatusStart, restoreDirectoryReviewStart, updateDirectoryReviewStatusSuccess, updateDirectoryReviewStatusFailure,
  fetchDirectoryReportsStart, fetchDirectoryReportsSuccess, fetchDirectoryReportsFailure,
  resolveDirectoryReportStart, resolveDirectoryReportSuccess, resolveDirectoryReportFailure,
  fetchDirectoryListingsStart, fetchDirectoryListingsSuccess, fetchDirectoryListingsFailure,
  updateDirectoryListingStart, updateDirectoryListingSuccess, updateDirectoryListingFailure,
  fetchDirectoryAnalyticsStart, fetchDirectoryAnalyticsSuccess, fetchDirectoryAnalyticsFailure,
  fetchDirectoryAuditLogsStart, fetchDirectoryAuditLogsSuccess, fetchDirectoryAuditLogsFailure,
} = directorySlice.actions;

export default directorySlice.reducer;