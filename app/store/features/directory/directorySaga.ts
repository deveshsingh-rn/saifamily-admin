import { call, put, takeLatest, all } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import api from '../../../services/api';
import { getApiErrorMessage } from '../../../services/apiError';
import { showToast } from '../../../services/toast';
import {
  DirectoryAnalytics,
  DirectoryAuditLogsResponse,
  DirectoryListing,
  DirectoryListingsResponse,
  DirectoryReport,
  DirectoryReportsResponse,
  DirectoryReview,
  DirectoryReviewsResponse,
} from '../../../types/adminApi';
import {
  approveDirectoryListingStart,
  approveDirectoryReviewStart,
  directoryListingMutationSuccess,
  directoryMutationFailure,
  directoryReportMutationSuccess,
  directoryReviewMutationSuccess,
  fetchDirectoryAnalyticsFailure,
  fetchDirectoryAnalyticsStart,
  fetchDirectoryAnalyticsSuccess,
  fetchDirectoryAuditLogsFailure,
  fetchDirectoryAuditLogsStart,
  fetchDirectoryAuditLogsSuccess,
  fetchDirectoryListingsFailure,
  fetchDirectoryListingsStart,
  fetchDirectoryListingsSuccess,
  fetchDirectoryReportsFailure,
  fetchDirectoryReportsStart,
  fetchDirectoryReportsSuccess,
  fetchDirectoryReviewsFailure,
  fetchDirectoryReviewsStart,
  fetchDirectoryReviewsSuccess,
  hideDirectoryReviewStart,
  rejectDirectoryListingStart,
  rejectDirectoryReviewStart,
  resolveDirectoryReportStart,
  restoreDirectoryListingStart,
  restoreDirectoryReviewStart,
  suspendDirectoryListingStart,
  unverifyDirectoryListingStart,
  verifyDirectoryListingStart,
} from './directorySlice';

interface ReviewMutationResponse {
  review: DirectoryReview;
}

interface ReportMutationResponse {
  report: DirectoryReport;
}

interface ListingMutationResponse {
  listing: DirectoryListing;
}

function* fetchDirectoryReviewsSaga(
  action: ReturnType<typeof fetchDirectoryReviewsStart>,
): Generator {
  try {
    const response = (yield call(api.get, '/api/admin/directory/reviews', {
      params: action.payload,
    })) as AxiosResponse<DirectoryReviewsResponse>;
    yield put(fetchDirectoryReviewsSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchDirectoryReviewsFailure(getApiErrorMessage(error, 'Directory reviews request failed')));
  }
}

function* fetchDirectoryReportsSaga(
  action: ReturnType<typeof fetchDirectoryReportsStart>,
): Generator {
  try {
    const response = (yield call(api.get, '/api/admin/directory/reports', {
      params: action.payload,
    })) as AxiosResponse<DirectoryReportsResponse>;
    yield put(fetchDirectoryReportsSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchDirectoryReportsFailure(getApiErrorMessage(error, 'Directory reports request failed')));
  }
}

function* fetchDirectoryListingsSaga(
  action: ReturnType<typeof fetchDirectoryListingsStart>,
): Generator {
  try {
    const response = (yield call(api.get, '/api/admin/directory/listings', {
      params: action.payload,
    })) as AxiosResponse<DirectoryListingsResponse>;
    yield put(fetchDirectoryListingsSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchDirectoryListingsFailure(getApiErrorMessage(error, 'Directory listings request failed')));
  }
}

function* fetchDirectoryAnalyticsSaga(): Generator {
  try {
    const response = (yield call(
      api.get,
      '/api/admin/directory/analytics',
      { params: { days: 30 } },
    )) as AxiosResponse<DirectoryAnalytics>;
    yield put(fetchDirectoryAnalyticsSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchDirectoryAnalyticsFailure(getApiErrorMessage(error, 'Directory analytics request failed')));
  }
}

function* fetchDirectoryAuditLogsSaga(
  action: ReturnType<typeof fetchDirectoryAuditLogsStart>,
): Generator {
  try {
    const response = (yield call(api.get, '/api/admin/directory/audit-logs', {
      params: action.payload,
    })) as AxiosResponse<DirectoryAuditLogsResponse>;
    yield put(fetchDirectoryAuditLogsSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchDirectoryAuditLogsFailure(getApiErrorMessage(error, 'Directory audit logs request failed')));
  }
}

function* reviewMutationSaga(
  action:
    | ReturnType<typeof approveDirectoryReviewStart>
    | ReturnType<typeof rejectDirectoryReviewStart>
    | ReturnType<typeof hideDirectoryReviewStart>
    | ReturnType<typeof restoreDirectoryReviewStart>,
  endpointAction: 'approve' | 'reject' | 'hide' | 'restore',
): Generator {
  try {
    const response = (yield call(
      api.post,
      `/api/admin/directory/reviews/${action.payload.id}/${endpointAction}`,
      { note: action.payload.note },
    )) as AxiosResponse<ReviewMutationResponse>;
    yield put(directoryReviewMutationSuccess(response.data.review));
    yield call(showToast, {
      title: 'Review updated',
      message: `Review ${endpointAction} action completed.`,
      variant: 'success',
    });
  } catch (error: unknown) {
    yield put(directoryMutationFailure(getApiErrorMessage(error, 'Directory review action failed')));
  }
}

function* resolveDirectoryReportSaga(
  action: ReturnType<typeof resolveDirectoryReportStart>,
): Generator {
  try {
    const response = (yield call(
      api.post,
      `/api/admin/directory/reports/${action.payload.id}/resolve`,
      {
        status: action.payload.status ?? 'resolved',
        note: action.payload.note,
      },
    )) as AxiosResponse<ReportMutationResponse>;
    yield put(directoryReportMutationSuccess(response.data.report));
    yield call(showToast, {
      title: 'Report updated',
      message: `Report marked ${response.data.report.status}.`,
      variant: 'success',
    });
  } catch (error: unknown) {
    yield put(directoryMutationFailure(getApiErrorMessage(error, 'Directory report action failed')));
  }
}

function* listingMutationSaga(
  action:
    | ReturnType<typeof approveDirectoryListingStart>
    | ReturnType<typeof rejectDirectoryListingStart>
    | ReturnType<typeof suspendDirectoryListingStart>
    | ReturnType<typeof restoreDirectoryListingStart>
    | ReturnType<typeof verifyDirectoryListingStart>
    | ReturnType<typeof unverifyDirectoryListingStart>,
  endpointAction: 'approve' | 'reject' | 'suspend' | 'restore' | 'verify' | 'unverify',
): Generator {
  try {
    const response = (yield call(
      api.post,
      `/api/admin/directory/listings/${action.payload.id}/${endpointAction}`,
      {
        reason: action.payload.reason,
        note: action.payload.note,
        verificationStatus: action.payload.verificationStatus,
      },
    )) as AxiosResponse<ListingMutationResponse>;
    yield put(directoryListingMutationSuccess(response.data.listing));
    yield call(showToast, {
      title: 'Listing updated',
      message: `Listing ${endpointAction} action completed.`,
      variant: 'success',
    });
  } catch (error: unknown) {
    yield put(directoryMutationFailure(getApiErrorMessage(error, 'Directory listing action failed')));
  }
}

function* approveDirectoryReviewSaga(
  action: ReturnType<typeof approveDirectoryReviewStart>,
): Generator {
  yield* reviewMutationSaga(action, 'approve');
}

function* rejectDirectoryReviewSaga(
  action: ReturnType<typeof rejectDirectoryReviewStart>,
): Generator {
  yield* reviewMutationSaga(action, 'reject');
}

function* hideDirectoryReviewSaga(
  action: ReturnType<typeof hideDirectoryReviewStart>,
): Generator {
  yield* reviewMutationSaga(action, 'hide');
}

function* restoreDirectoryReviewSaga(
  action: ReturnType<typeof restoreDirectoryReviewStart>,
): Generator {
  yield* reviewMutationSaga(action, 'restore');
}

function* approveDirectoryListingSaga(
  action: ReturnType<typeof approveDirectoryListingStart>,
): Generator {
  yield* listingMutationSaga(action, 'approve');
}

function* rejectDirectoryListingSaga(
  action: ReturnType<typeof rejectDirectoryListingStart>,
): Generator {
  yield* listingMutationSaga(action, 'reject');
}

function* suspendDirectoryListingSaga(
  action: ReturnType<typeof suspendDirectoryListingStart>,
): Generator {
  yield* listingMutationSaga(action, 'suspend');
}

function* restoreDirectoryListingSaga(
  action: ReturnType<typeof restoreDirectoryListingStart>,
): Generator {
  yield* listingMutationSaga(action, 'restore');
}

function* verifyDirectoryListingSaga(
  action: ReturnType<typeof verifyDirectoryListingStart>,
): Generator {
  yield* listingMutationSaga(action, 'verify');
}

function* unverifyDirectoryListingSaga(
  action: ReturnType<typeof unverifyDirectoryListingStart>,
): Generator {
  yield* listingMutationSaga(action, 'unverify');
}

export function* watchDirectory() {
  yield all([
    takeLatest(fetchDirectoryReviewsStart.type, fetchDirectoryReviewsSaga),
    takeLatest(fetchDirectoryReportsStart.type, fetchDirectoryReportsSaga),
    takeLatest(fetchDirectoryListingsStart.type, fetchDirectoryListingsSaga),
    takeLatest(fetchDirectoryAnalyticsStart.type, fetchDirectoryAnalyticsSaga),
    takeLatest(fetchDirectoryAuditLogsStart.type, fetchDirectoryAuditLogsSaga),
    takeLatest(approveDirectoryReviewStart.type, approveDirectoryReviewSaga),
    takeLatest(rejectDirectoryReviewStart.type, rejectDirectoryReviewSaga),
    takeLatest(hideDirectoryReviewStart.type, hideDirectoryReviewSaga),
    takeLatest(restoreDirectoryReviewStart.type, restoreDirectoryReviewSaga),
    takeLatest(resolveDirectoryReportStart.type, resolveDirectoryReportSaga),
    takeLatest(approveDirectoryListingStart.type, approveDirectoryListingSaga),
    takeLatest(rejectDirectoryListingStart.type, rejectDirectoryListingSaga),
    takeLatest(suspendDirectoryListingStart.type, suspendDirectoryListingSaga),
    takeLatest(restoreDirectoryListingStart.type, restoreDirectoryListingSaga),
    takeLatest(verifyDirectoryListingStart.type, verifyDirectoryListingSaga),
    takeLatest(unverifyDirectoryListingStart.type, unverifyDirectoryListingSaga),
  ]);
}
