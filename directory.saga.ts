import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  getDirectoryCategories,
  createDirectoryCategory,
  updateDirectoryCategory,
  deleteDirectoryCategory,
} from '@/directoryCategories.api';
import { getDirectoryReviews, updateDirectoryReviewStatus, restoreDirectoryReview } from '@/directoryReviews.api';
import { getDirectoryReports, resolveDirectoryReport } from '@/directoryReports.api';
import { getDirectoryListings, updateDirectoryListing } from '@/directoryListings.api';
import {
  fetchDirectoryCategoriesStart,
  fetchDirectoryCategoriesSuccess,
  fetchDirectoryCategoriesFailure,
  addDirectoryCategoryStart,
  addDirectoryCategorySuccess,
  addDirectoryCategoryFailure,
  updateDirectoryCategoryStart,
  updateDirectoryCategorySuccess,
  updateDirectoryCategoryFailure,
  deleteDirectoryCategoryStart,
  deleteDirectoryCategorySuccess,
  deleteDirectoryCategoryFailure,
  fetchDirectoryReviewsStart,
  fetchDirectoryReviewsSuccess,
  fetchDirectoryReviewsFailure,
  updateDirectoryReviewStatusStart,
  restoreDirectoryReviewStart,
  updateDirectoryReviewStatusSuccess,
  updateDirectoryReviewStatusFailure,
  fetchDirectoryReportsStart,
  fetchDirectoryReportsSuccess,
  fetchDirectoryReportsFailure,
  resolveDirectoryReportStart,
  resolveDirectoryReportSuccess,
  resolveDirectoryReportFailure,
  fetchDirectoryListingsStart,
  fetchDirectoryListingsSuccess,
  fetchDirectoryListingsFailure,
  updateDirectoryListingStart,
  updateDirectoryListingSuccess,
  updateDirectoryListingFailure,
  fetchDirectoryAnalyticsStart,
  fetchDirectoryAnalyticsSuccess,
  fetchDirectoryAnalyticsFailure,
  fetchDirectoryAuditLogsStart,
  fetchDirectoryAuditLogsSuccess,
  fetchDirectoryAuditLogsFailure,
  UpdateActionPayload,
  UpdateReviewStatusActionPayload,
} from './directory.slice';
import { DirectoryCategory, CreateDirectoryCategoryPayload } from '@/directoryCategory';
import { DirectoryReview, DirectoryReviewStatus } from '@/directoryReview';
import { DirectoryReport, DirectoryReportStatus as ReportStatus, ResolveReportPayload } from '@/directoryReport';
import { DirectoryListing, DirectoryListingStatus as ListingStatus, UpdateListingActionPayload } from '@/directoryListing';
import { DirectoryAnalytics, DirectoryAuditLog } from '@/directoryMeta';
import { getDirectoryAnalytics, getDirectoryAuditLogs } from './directoryMeta.api';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong.';

function* fetchDirectoryCategoriesSaga(): Generator {
  try {
    const categories = (yield call(getDirectoryCategories)) as DirectoryCategory[];
    yield put(fetchDirectoryCategoriesSuccess(categories));
  } catch (error: unknown) {
    yield put(fetchDirectoryCategoriesFailure(getErrorMessage(error)));
  }
}

function* addDirectoryCategorySaga(action: PayloadAction<CreateDirectoryCategoryPayload>): Generator {
  try {
    const newCategory = (yield call(createDirectoryCategory, action.payload)) as DirectoryCategory;
    yield put(addDirectoryCategorySuccess(newCategory));
  } catch (error: unknown) {
    yield put(addDirectoryCategoryFailure(getErrorMessage(error)));
  }
}

function* updateDirectoryCategorySaga(action: PayloadAction<UpdateActionPayload>): Generator {
  try {
    const { id, payload } = action.payload;
    const updatedCategory = (yield call(updateDirectoryCategory, id, payload)) as DirectoryCategory;
    yield put(updateDirectoryCategorySuccess(updatedCategory));
  } catch (error: unknown) {
    yield put(updateDirectoryCategoryFailure(getErrorMessage(error)));
  }
}

function* deleteDirectoryCategorySaga(action: PayloadAction<string>): Generator {
  try {
    const categoryId = action.payload;
    const updatedCategory = (yield call(deleteDirectoryCategory, categoryId)) as DirectoryCategory;
    yield put(deleteDirectoryCategorySuccess(updatedCategory));
  } catch (error: unknown) {
    yield put(deleteDirectoryCategoryFailure(getErrorMessage(error)));
  }
}

function* fetchDirectoryReviewsSaga(action: PayloadAction<DirectoryReviewStatus | undefined>): Generator {
  try {
    const reviews = (yield call(getDirectoryReviews, action.payload)) as DirectoryReview[];
    yield put(fetchDirectoryReviewsSuccess(reviews));
  } catch (error: unknown) {
    yield put(fetchDirectoryReviewsFailure(getErrorMessage(error)));
  }
}

function* updateDirectoryReviewStatusSaga(action: PayloadAction<UpdateReviewStatusActionPayload>): Generator {
  try {
    const { reviewId, status } = action.payload;
    const updatedReview = (yield call(updateDirectoryReviewStatus, reviewId, status)) as DirectoryReview;
    yield put(updateDirectoryReviewStatusSuccess(updatedReview));
  } catch (error: unknown) {
    yield put(updateDirectoryReviewStatusFailure(getErrorMessage(error)));
  }
}

function* restoreDirectoryReviewSaga(action: PayloadAction<string>): Generator {
  try {
    const reviewId = action.payload;
    const restoredReview = (yield call(restoreDirectoryReview, reviewId)) as DirectoryReview;
    yield put(updateDirectoryReviewStatusSuccess(restoredReview));
  } catch (error: unknown) {
    yield put(updateDirectoryReviewStatusFailure(getErrorMessage(error)));
  }
}

function* fetchDirectoryReportsSaga(action: PayloadAction<ReportStatus | undefined>): Generator {
  try {
    const reports = (yield call(getDirectoryReports, action.payload)) as DirectoryReport[];
    yield put(fetchDirectoryReportsSuccess(reports));
  } catch (error: unknown) {
    yield put(fetchDirectoryReportsFailure(getErrorMessage(error)));
  }
}

function* resolveDirectoryReportSaga(action: PayloadAction<ResolveReportPayload>): Generator {
  try {
    const { reportId, status, note } = action.payload;
    const updatedReport = (yield call(resolveDirectoryReport, reportId, status, note)) as DirectoryReport;
    yield put(resolveDirectoryReportSuccess(updatedReport));
  } catch (error: unknown) {
    yield put(resolveDirectoryReportFailure(getErrorMessage(error)));
  }
}

function* fetchDirectoryListingsSaga(action: PayloadAction<ListingStatus | undefined>): Generator {
  try {
    const listings = (yield call(getDirectoryListings, action.payload)) as DirectoryListing[];
    yield put(fetchDirectoryListingsSuccess(listings));
  } catch (error: unknown) {
    yield put(fetchDirectoryListingsFailure(getErrorMessage(error)));
  }
}

function* updateDirectoryListingSaga(action: PayloadAction<UpdateListingActionPayload>): Generator {
  try {
    const { listingId, payload } = action.payload;
    const updatedListing = (yield call(updateDirectoryListing, listingId, payload)) as DirectoryListing;
    yield put(updateDirectoryListingSuccess(updatedListing));
  } catch (error: unknown) {
    yield put(updateDirectoryListingFailure(getErrorMessage(error)));
  }
}

function* fetchDirectoryAnalyticsSaga(): Generator {
  try {
    const analytics = (yield call(getDirectoryAnalytics)) as DirectoryAnalytics;
    yield put(fetchDirectoryAnalyticsSuccess(analytics));
  } catch (error: unknown) {
    yield put(fetchDirectoryAnalyticsFailure(getErrorMessage(error)));
  }
}

function* fetchDirectoryAuditLogsSaga(): Generator {
  try {
    const auditLogs = (yield call(getDirectoryAuditLogs)) as DirectoryAuditLog[];
    yield put(fetchDirectoryAuditLogsSuccess(auditLogs));
  } catch (error: unknown) {
    yield put(fetchDirectoryAuditLogsFailure(getErrorMessage(error)));
  }
}

export function* directorySaga() {
  yield all([
    takeLatest(fetchDirectoryCategoriesStart.type, fetchDirectoryCategoriesSaga),
    takeLatest(addDirectoryCategoryStart.type, addDirectoryCategorySaga),
    takeLatest(updateDirectoryCategoryStart.type, updateDirectoryCategorySaga),
    takeLatest(deleteDirectoryCategoryStart.type, deleteDirectoryCategorySaga),
    takeLatest(fetchDirectoryReviewsStart.type, fetchDirectoryReviewsSaga),
    takeLatest(updateDirectoryReviewStatusStart.type, updateDirectoryReviewStatusSaga),
    takeLatest(restoreDirectoryReviewStart.type, restoreDirectoryReviewSaga),
    takeLatest(fetchDirectoryReportsStart.type, fetchDirectoryReportsSaga),
    takeLatest(resolveDirectoryReportStart.type, resolveDirectoryReportSaga),
    takeLatest(fetchDirectoryListingsStart.type, fetchDirectoryListingsSaga),
    takeLatest(updateDirectoryListingStart.type, updateDirectoryListingSaga),
    takeLatest(fetchDirectoryAnalyticsStart.type, fetchDirectoryAnalyticsSaga),
    takeLatest(fetchDirectoryAuditLogsStart.type, fetchDirectoryAuditLogsSaga),
  ]);
}
