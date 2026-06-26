import { call, put, takeLatest, all } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import api from '../../../services/api';
import { getApiErrorMessage } from '../../../services/apiError';
import { showToast } from '../../../services/toast';
import {
  AdminSanghaAnalytics,
  AdminSanghaGroup,
  AdminSanghaLiveStream,
  AdminSanghaReport,
  SanghaAuditLogsResponse,
  SanghaGroupsResponse,
  SanghaLiveStreamsResponse,
  SanghaReportsResponse,
} from '../../../types/adminApi';
import {
  addSanghaGroupFailure,
  addSanghaGroupStart,
  addSanghaGroupSuccess,
  deleteSanghaGroupFailure,
  deleteSanghaGroupStart,
  deleteSanghaGroupSuccess,
  endLiveStreamStart,
  endLiveStreamSuccess,
  fetchLiveStreamsFailure,
  fetchLiveStreamsStart,
  fetchLiveStreamsSuccess,
  fetchSanghaAnalyticsFailure,
  fetchSanghaAnalyticsStart,
  fetchSanghaAnalyticsSuccess,
  fetchSanghaAuditLogsFailure,
  fetchSanghaAuditLogsStart,
  fetchSanghaAuditLogsSuccess,
  fetchSanghaGroupsFailure,
  fetchSanghaGroupsStart,
  fetchSanghaGroupsSuccess,
  fetchSanghaReportsFailure,
  fetchSanghaReportsStart,
  fetchSanghaReportsSuccess,
  liveStreamActionFailure,
  removeGroupMemberFailure,
  removeGroupMemberStart,
  removeGroupMemberSuccess,
  removeLiveStreamRecordingStart,
  removeLiveStreamRecordingSuccess,
  resolveSanghaReportFailure,
  resolveSanghaReportStart,
  resolveSanghaReportSuccess,
  sendAnnouncementFailure,
  sendAnnouncementStart,
  sendAnnouncementSuccess,
  unverifyGroupStart,
  updateGroupMemberRoleFailure,
  updateGroupMemberRoleStart,
  updateGroupMemberRoleSuccess,
  updateSanghaGroupFailure,
  updateSanghaGroupStart,
  updateSanghaGroupSuccess,
  verifyGroupStart,
} from './sanghaSlice';

interface GroupResponse {
  group: AdminSanghaGroup;
}
interface ReportResponse {
  report: AdminSanghaReport;
}

interface StreamResponse {
  stream: AdminSanghaLiveStream;
}

function* fetchSanghaGroupsSaga(
  action: ReturnType<typeof fetchSanghaGroupsStart>,
): Generator {
  try {
    const response = (yield call(api.get, '/api/admin/sangha/groups', {
      params: action.payload ?? { limit: 20, offset: 0 },
    })) as AxiosResponse<SanghaGroupsResponse>;
    yield put(fetchSanghaGroupsSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchSanghaGroupsFailure(getApiErrorMessage(error, 'Sangha groups request failed')));
  }
}

function* addSanghaGroupSaga(
  action: ReturnType<typeof addSanghaGroupStart>,
): Generator {
  try {
    const response = (yield call(
      api.post,
      '/api/admin/sangha/groups',
      action.payload,
    )) as AxiosResponse<GroupResponse>;
    yield put(addSanghaGroupSuccess(response.data.group));
    yield call(showToast, { title: 'Sangha group created', variant: 'success' });
  } catch (error: unknown) {
    yield put(addSanghaGroupFailure(getApiErrorMessage(error, 'Sangha group create failed')));
  }
}

function* updateSanghaGroupSaga(
  action: ReturnType<typeof updateSanghaGroupStart>,
): Generator {
  try {
    const response = (yield call(
      api.patch,
      `/api/admin/sangha/groups/${action.payload.id}`,
      action.payload.payload,
    )) as AxiosResponse<GroupResponse>;
    yield put(updateSanghaGroupSuccess(response.data.group));
    yield call(showToast, { title: 'Sangha group updated', variant: 'success' });
  } catch (error: unknown) {
    yield put(updateSanghaGroupFailure(getApiErrorMessage(error, 'Sangha group update failed')));
  }
}

function* deleteSanghaGroupSaga(
  action: ReturnType<typeof deleteSanghaGroupStart>,
): Generator {
  try {
    yield call(api.delete, `/api/admin/sangha/groups/${action.payload}`);
    yield put(deleteSanghaGroupSuccess(action.payload));
    yield call(showToast, { title: 'Sangha group archived', variant: 'success' });
  } catch (error: unknown) {
    yield put(deleteSanghaGroupFailure(getApiErrorMessage(error, 'Sangha group archive failed')));
  }
}

function* verifyGroupSaga(
  action: ReturnType<typeof verifyGroupStart>,
): Generator {
  try {
    const response = (yield call(
      api.post,
      `/api/admin/sangha/groups/${action.payload}/verify`,
      {},
    )) as AxiosResponse<GroupResponse>;
    yield put(updateSanghaGroupSuccess(response.data.group));
    yield call(showToast, { title: 'Sangha group verified', variant: 'success' });
  } catch (error: unknown) {
    yield put(updateSanghaGroupFailure(getApiErrorMessage(error, 'Sangha group verify failed')));
  }
}

function* unverifyGroupSaga(
  action: ReturnType<typeof unverifyGroupStart>,
): Generator {
  try {
    const response = (yield call(
      api.post,
      `/api/admin/sangha/groups/${action.payload}/unverify`,
      {},
    )) as AxiosResponse<GroupResponse>;
    yield put(updateSanghaGroupSuccess(response.data.group));
    yield call(showToast, { title: 'Sangha group unverified', variant: 'success' });
  } catch (error: unknown) {
    yield put(updateSanghaGroupFailure(getApiErrorMessage(error, 'Sangha group unverify failed')));
  }
}

function* fetchSanghaReportsSaga(
  action: ReturnType<typeof fetchSanghaReportsStart>,
): Generator {
  try {
    const response = (yield call(api.get, '/api/admin/sangha/reports', {
      params: action.payload ?? { limit: 20, offset: 0 },
    })) as AxiosResponse<SanghaReportsResponse>;
    yield put(fetchSanghaReportsSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchSanghaReportsFailure(getApiErrorMessage(error, 'Sangha reports request failed')));
  }
}

function* resolveSanghaReportSaga(
  action: ReturnType<typeof resolveSanghaReportStart>,
): Generator {
  try {
    const response = (yield call(
      api.post,
      `/api/admin/sangha/reports/${action.payload.id}/resolve`,
      {
        status: action.payload.status ?? 'resolved',
        note: action.payload.note,
      },
    )) as AxiosResponse<ReportResponse>;
    yield put(resolveSanghaReportSuccess(response.data.report));
    yield call(showToast, { title: 'Sangha report updated', variant: 'success' });
  } catch (error: unknown) {
    yield put(resolveSanghaReportFailure(getApiErrorMessage(error, 'Sangha report resolve failed')));
  }
}

function* sendAnnouncementSaga(
  action: ReturnType<typeof sendAnnouncementStart>,
): Generator {
  try {
    yield call(api.post, '/api/admin/sangha/announcements', action.payload);
    yield put(sendAnnouncementSuccess());
    yield call(showToast, { title: 'Announcement sent', variant: 'success' });
  } catch (error: unknown) {
    yield put(sendAnnouncementFailure(getApiErrorMessage(error, 'Sangha announcement failed')));
  }
}

function* fetchLiveStreamsSaga(
  action: ReturnType<typeof fetchLiveStreamsStart>,
): Generator {
  try {
    const response = (yield call(api.get, '/api/admin/sangha/live-streams', {
      params: action.payload ?? { limit: 20, offset: 0 },
    })) as AxiosResponse<SanghaLiveStreamsResponse>;
    yield put(fetchLiveStreamsSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchLiveStreamsFailure(getApiErrorMessage(error, 'Sangha live streams request failed')));
  }
}

function* endLiveStreamSaga(
  action: ReturnType<typeof endLiveStreamStart>,
): Generator {
  try {
    const response = (yield call(
      api.post,
      `/api/admin/sangha/live-streams/${action.payload}/end`,
      {},
    )) as AxiosResponse<StreamResponse>;
    yield put(endLiveStreamSuccess(response.data.stream));
    yield call(showToast, { title: 'Live stream ended', variant: 'success' });
  } catch (error: unknown) {
    yield put(liveStreamActionFailure(getApiErrorMessage(error, 'Sangha live stream end failed')));
  }
}

function* removeLiveStreamRecordingSaga(
  action: ReturnType<typeof removeLiveStreamRecordingStart>,
): Generator {
  try {
    yield call(api.delete, `/api/admin/sangha/live-streams/${action.payload}/recording`);
    yield put(removeLiveStreamRecordingSuccess(action.payload));
    yield call(showToast, { title: 'Recording removed', variant: 'success' });
  } catch (error: unknown) {
    yield put(liveStreamActionFailure(getApiErrorMessage(error, 'Sangha recording removal failed')));
  }
}

function* fetchSanghaAnalyticsSaga(): Generator {
  try {
    const response = (yield call(
      api.get,
      '/api/admin/sangha/analytics',
      { params: { days: 30 } },
    )) as AxiosResponse<AdminSanghaAnalytics>;
    yield put(fetchSanghaAnalyticsSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchSanghaAnalyticsFailure(getApiErrorMessage(error, 'Sangha analytics request failed')));
  }
}

function* fetchSanghaAuditLogsSaga(
  action: ReturnType<typeof fetchSanghaAuditLogsStart>,
): Generator {
  try {
    const response = (yield call(api.get, '/api/admin/sangha/audit-logs', {
      params: action.payload ?? { limit: 50, offset: 0 },
    })) as AxiosResponse<SanghaAuditLogsResponse>;
    yield put(fetchSanghaAuditLogsSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchSanghaAuditLogsFailure(getApiErrorMessage(error, 'Sangha audit logs request failed')));
  }
}

function* updateGroupMemberRoleSaga(
  action: ReturnType<typeof updateGroupMemberRoleStart>,
): Generator {
  try {
    yield call(
      api.patch,
      `/api/admin/sangha/groups/${action.payload.groupId}/members/${action.payload.memberId}`,
      { role: action.payload.role, note: action.payload.note },
    );
    yield put(updateGroupMemberRoleSuccess());
    yield call(showToast, { title: 'Member role updated', variant: 'success' });
  } catch (error: unknown) {
    yield put(updateGroupMemberRoleFailure(getApiErrorMessage(error, 'Sangha member role update failed')));
  }
}

function* removeGroupMemberSaga(
  action: ReturnType<typeof removeGroupMemberStart>,
): Generator {
  try {
    yield call(
      api.delete,
      `/api/admin/sangha/groups/${action.payload.groupId}/members/${action.payload.memberId}`,
    );
    yield put(removeGroupMemberSuccess());
    yield call(showToast, { title: 'Member removed', variant: 'success' });
  } catch (error: unknown) {
    yield put(removeGroupMemberFailure(getApiErrorMessage(error, 'Sangha member remove failed')));
  }
}

export function* sanghaSaga() {
  yield all([
    takeLatest(fetchSanghaGroupsStart.type, fetchSanghaGroupsSaga),
    takeLatest(addSanghaGroupStart.type, addSanghaGroupSaga),
    takeLatest(updateSanghaGroupStart.type, updateSanghaGroupSaga),
    takeLatest(deleteSanghaGroupStart.type, deleteSanghaGroupSaga),
    takeLatest(verifyGroupStart.type, verifyGroupSaga),
    takeLatest(unverifyGroupStart.type, unverifyGroupSaga),
    takeLatest(fetchSanghaReportsStart.type, fetchSanghaReportsSaga),
    takeLatest(resolveSanghaReportStart.type, resolveSanghaReportSaga),
    takeLatest(sendAnnouncementStart.type, sendAnnouncementSaga),
    takeLatest(fetchLiveStreamsStart.type, fetchLiveStreamsSaga),
    takeLatest(endLiveStreamStart.type, endLiveStreamSaga),
    takeLatest(removeLiveStreamRecordingStart.type, removeLiveStreamRecordingSaga),
    takeLatest(fetchSanghaAnalyticsStart.type, fetchSanghaAnalyticsSaga),
    takeLatest(fetchSanghaAuditLogsStart.type, fetchSanghaAuditLogsSaga),
    takeLatest(updateGroupMemberRoleStart.type, updateGroupMemberRoleSaga),
    takeLatest(removeGroupMemberStart.type, removeGroupMemberSaga),
  ]);
}
