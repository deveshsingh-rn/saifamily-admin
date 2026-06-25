import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  getDirectoryCategories,
  createDirectoryCategory,
  updateDirectoryCategory,
  deleteDirectoryCategory,
} from '@/services/directoryCategories.api';
import { getDirectoryReviews, updateDirectoryReviewStatus, restoreDirectoryReview } from '@/services/directoryReviews.api';
import { getDirectoryReports, resolveDirectoryReport } from '@/services/directoryReports.api';
import { getDirectoryListings, updateDirectoryListing } from '@/services/directoryListings.api';
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
  UpdateActionPayload,
  UpdateReviewStatusActionPayload,
  UpdateListingActionPayload,
} from './directory.slice';
import { DirectoryCategory, CreateDirectoryCategoryPayload } from '@/types/directoryCategory';
import { DirectoryReview, DirectoryReviewStatus } from '@/types/directoryReview';
import { DirectoryReport, DirectoryReportStatus as ReportStatus, ResolveReportPayload } from '@/types/directoryReport';
import { DirectoryListing, DirectoryListingStatus as ListingStatus } from '@/types/directoryListing';

function* fetchDirectoryCategoriesSaga(): Generator {
  try {
    const categories = (yield call(getDirectoryCategories)) as DirectoryCategory[];
    yield put(fetchDirectoryCategoriesSuccess(categories));
  } catch (error: any) {
    yield put(fetchDirectoryCategoriesFailure(error.message));
  }
}

function* addDirectoryCategorySaga(action: PayloadAction<CreateDirectoryCategoryPayload>): Generator {
  try {
    const newCategory = (yield call(createDirectoryCategory, action.payload)) as DirectoryCategory;
    yield put(addDirectoryCategorySuccess(newCategory));
  } catch (error: any) {
    yield put(addDirectoryCategoryFailure(error.message));
  }
}

function* updateDirectoryCategorySaga(action: PayloadAction<UpdateActionPayload>): Generator {
  try {
    const { id, payload } = action.payload;
    const updatedCategory = (yield call(updateDirectoryCategory, id, payload)) as DirectoryCategory;
    yield put(updateDirectoryCategorySuccess(updatedCategory));
  } catch (error: any) {
    yield put(updateDirectoryCategoryFailure(error.message));
  }
}

function* deleteDirectoryCategorySaga(action: PayloadAction<string>): Generator {
  try {
    const categoryId = action.payload;
    const updatedCategory = (yield call(deleteDirectoryCategory, categoryId)) as DirectoryCategory;
    yield put(deleteDirectoryCategorySuccess(updatedCategory));
  } catch (error: any) {
    yield put(deleteDirectoryCategoryFailure(error.message));
  }
}

function* fetchDirectoryReviewsSaga(action: PayloadAction<DirectoryReviewStatus | undefined>): Generator {
  try {
    const reviews = (yield call(getDirectoryReviews, action.payload)) as DirectoryReview[];
    yield put(fetchDirectoryReviewsSuccess(reviews));
  } catch (error: any) {
    yield put(fetchDirectoryReviewsFailure(error.message));
  }
}

function* updateDirectoryReviewStatusSaga(action: PayloadAction<UpdateReviewStatusActionPayload>): Generator {
  try {
    const { reviewId, status } = action.payload;
    const updatedReview = (yield call(updateDirectoryReviewStatus, reviewId, status)) as DirectoryReview;
    yield put(updateDirectoryReviewStatusSuccess(updatedReview));
  } catch (error: any) {
    yield put(updateDirectoryReviewStatusFailure(error.message));
  }
}

function* restoreDirectoryReviewSaga(action: PayloadAction<string>): Generator {
  try {
    const reviewId = action.payload;
    const restoredReview = (yield call(restoreDirectoryReview, reviewId)) as DirectoryReview;
    yield put(updateDirectoryReviewStatusSuccess(restoredReview));
  } catch (error: any) {
    yield put(updateDirectoryReviewStatusFailure(error.message));
  }
}

function* fetchDirectoryReportsSaga(action: PayloadAction<ReportStatus | undefined>): Generator {
  try {
    const reports = (yield call(getDirectoryReports, action.payload)) as DirectoryReport[];
    yield put(fetchDirectoryReportsSuccess(reports));
  } catch (error: any) {
    yield put(fetchDirectoryReportsFailure(error.message));
  }
}

function* resolveDirectoryReportSaga(action: PayloadAction<ResolveReportPayload>): Generator {
  try {
    const { reportId, status, note } = action.payload;
    const updatedReport = (yield call(resolveDirectoryReport, reportId, status, note)) as DirectoryReport;
    yield put(resolveDirectoryReportSuccess(updatedReport));
  } catch (error: any) {
    yield put(resolveDirectoryReportFailure(error.message));
  }
}

function* fetchDirectoryListingsSaga(action: PayloadAction<ListingStatus | undefined>): Generator {
  try {
    const listings = (yield call(getDirectoryListings, action.payload)) as DirectoryListing[];
    yield put(fetchDirectoryListingsSuccess(listings));
  } catch (error: any) {
    yield put(fetchDirectoryListingsFailure(error.message));
  }
}

function* updateDirectoryListingSaga(action: PayloadAction<UpdateListingActionPayload>): Generator {
  try {
    const { listingId, payload } = action.payload;
    const updatedListing = (yield call(updateDirectoryListing, listingId, payload)) as DirectoryListing;
    yield put(updateDirectoryListingSuccess(updatedListing));
  } catch (error: any) {
    yield put(updateDirectoryListingFailure(error.message));
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
  ]);
}