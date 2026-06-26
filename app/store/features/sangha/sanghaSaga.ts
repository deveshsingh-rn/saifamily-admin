import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  getSanghaGroups,
  createSanghaGroup,
  updateSanghaGroup,
  deleteSanghaGroup,
  verifySanghaGroup,
  unverifySanghaGroup,
  getSanghaReports,
  resolveSanghaReport,
  sendSanghaAnnouncement,
  getLiveStreams,
  endLiveStream,
  removeLiveStreamRecording,
  getSanghaAnalytics,
  getSanghaAuditLogs,
  getGroupMembers,
  updateMemberRole,
  removeMember,
} from '@/sangha.api';
import {
  fetchSanghaGroupsStart,
  fetchSanghaGroupsSuccess,
  fetchSanghaGroupsFailure,
  addSanghaGroupStart,
  addSanghaGroupSuccess,
  addSanghaGroupFailure,
  updateSanghaGroupStart,
  updateSanghaGroupSuccess,
  updateSanghaGroupFailure,
  deleteSanghaGroupStart,
  deleteSanghaGroupSuccess,
  deleteSanghaGroupFailure,
  verifyGroupStart,
  unverifyGroupStart,
  fetchSanghaReportsStart,
  fetchSanghaReportsSuccess,
  fetchSanghaReportsFailure,
  resolveSanghaReportStart,
  resolveSanghaReportSuccess,
  resolveSanghaReportFailure,
  sendAnnouncementStart,
  sendAnnouncementSuccess,
  sendAnnouncementFailure,
  fetchLiveStreamsStart,
  fetchLiveStreamsSuccess,
  fetchLiveStreamsFailure,
  endLiveStreamStart, endLiveStreamSuccess,
  removeLiveStreamRecordingStart, removeLiveStreamRecordingSuccess,
  liveStreamActionFailure,
  fetchSanghaAnalyticsStart, fetchSanghaAnalyticsSuccess, fetchSanghaAnalyticsFailure,
  fetchSanghaAuditLogsStart, fetchSanghaAuditLogsSuccess, fetchSanghaAuditLogsFailure,
  fetchGroupMembersStart,
  fetchGroupMembersSuccess,
  fetchGroupMembersFailure,
  updateGroupMemberRoleStart,
  updateGroupMemberRoleSuccess,
  updateGroupMemberRoleFailure,
  removeGroupMemberStart,
  removeGroupMemberSuccess,
  removeGroupMemberFailure,
  UpdateGroupActionPayload,
  RemoveMemberActionPayload,
} from './sanghaSlice';
import { SanghaGroup, CreateSanghaGroupPayload } from '@/sanghaGroup';
import { SanghaMember, UpdateMemberActionPayload } from '@/sanghaMember';
import { SanghaReport, ResolveSanghaReportPayload, SanghaReportStatus } from '@/sanghaReport';
import { SendAnnouncementPayload } from '@/sanghaAnnouncement';
import { SanghaLiveStream } from '@/sanghaLiveStream';
import { SanghaAnalytics, SanghaAuditLog } from '@/sanghaMeta';
import { PaginatedResponse } from '@/api';
import { ApiErrorResponse } from '../../../types/adminApi';

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<ApiErrorResponse>;

  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    'Something went wrong while processing the Sangha request.'
  );
};

function* fetchSanghaGroupsSaga(): Generator {
  try {
    const groups = (yield call(getSanghaGroups)) as SanghaGroup[];
    yield put(fetchSanghaGroupsSuccess(groups));
  } catch (error: unknown) {
    yield put(fetchSanghaGroupsFailure(getErrorMessage(error)));
  }
}

function* addSanghaGroupSaga(action: PayloadAction<CreateSanghaGroupPayload>): Generator {
  try {
    const newGroup = (yield call(createSanghaGroup, action.payload)) as SanghaGroup;
    yield put(addSanghaGroupSuccess(newGroup));
  } catch (error: unknown) {
    yield put(addSanghaGroupFailure(getErrorMessage(error)));
  }
}

function* updateSanghaGroupSaga(action: PayloadAction<UpdateGroupActionPayload>): Generator {
  try {
    const { id, payload } = action.payload;
    const updatedGroup = (yield call(updateSanghaGroup, id, payload)) as SanghaGroup;
    yield put(updateSanghaGroupSuccess(updatedGroup));
  } catch (error: unknown) {
    yield put(updateSanghaGroupFailure(getErrorMessage(error)));
  }
}

function* deleteSanghaGroupSaga(action: PayloadAction<string>): Generator {
  try {
    const groupId = action.payload;
    yield call(deleteSanghaGroup, groupId);
    yield put(deleteSanghaGroupSuccess(groupId));
  } catch (error: unknown) {
    yield put(deleteSanghaGroupFailure(getErrorMessage(error)));
  }
}

function* verifyGroupSaga(action: PayloadAction<string>): Generator {
  try {
    const groupId = action.payload;
    const updatedGroup = (yield call(verifySanghaGroup, groupId)) as SanghaGroup;
    yield put(updateSanghaGroupSuccess(updatedGroup));
  } catch (error: unknown) {
    yield put(updateSanghaGroupFailure(getErrorMessage(error)));
  }
}

function* unverifyGroupSaga(action: PayloadAction<string>): Generator {
  try {
    const groupId = action.payload;
    const updatedGroup = (yield call(unverifySanghaGroup, groupId)) as SanghaGroup;
    yield put(updateSanghaGroupSuccess(updatedGroup));
  } catch (error: unknown) {
    yield put(updateSanghaGroupFailure(getErrorMessage(error)));
  }
}

function* fetchSanghaReportsSaga(action: PayloadAction<SanghaReportStatus | undefined>): Generator {
  try {
    const reports = (yield call(getSanghaReports, action.payload)) as SanghaReport[];
    yield put(fetchSanghaReportsSuccess(reports));
  } catch (error: unknown) {
    yield put(fetchSanghaReportsFailure(getErrorMessage(error)));
  }
}

function* resolveSanghaReportSaga(action: PayloadAction<ResolveSanghaReportPayload>): Generator {
  try {
    const { reportId, status, note } = action.payload;
    const updatedReport = (yield call(resolveSanghaReport, reportId, status, note)) as SanghaReport;
    yield put(resolveSanghaReportSuccess(updatedReport));
  } catch (error: unknown) {
    yield put(resolveSanghaReportFailure(getErrorMessage(error)));
  }
}

function* sendAnnouncementSaga(action: PayloadAction<SendAnnouncementPayload>): Generator {
  try {
    yield call(sendSanghaAnnouncement, action.payload);
    yield put(sendAnnouncementSuccess());
  } catch (error: unknown) {
    yield put(sendAnnouncementFailure(getErrorMessage(error)));
  }
}

function* fetchLiveStreamsSaga(): Generator {
  try {
    const streams = (yield call(getLiveStreams)) as SanghaLiveStream[];
    yield put(fetchLiveStreamsSuccess(streams));
  } catch (error: unknown) {
    yield put(fetchLiveStreamsFailure(getErrorMessage(error)));
  }
}

function* endLiveStreamSaga(action: PayloadAction<string>): Generator {
  try {
    const streamId = action.payload;
    const updatedStream = (yield call(endLiveStream, streamId)) as SanghaLiveStream;
    yield put(endLiveStreamSuccess(updatedStream));
  } catch (error: unknown) {
    yield put(liveStreamActionFailure(getErrorMessage(error)));
  }
}

function* removeLiveStreamRecordingSaga(action: PayloadAction<string>): Generator {
  try {
    const streamId = action.payload;
    yield call(removeLiveStreamRecording, streamId);
    yield put(removeLiveStreamRecordingSuccess(streamId));
  } catch (error: unknown) {
    yield put(liveStreamActionFailure(getErrorMessage(error)));
  }
}

function* fetchSanghaAnalyticsSaga(): Generator {
  try {
    const analytics = (yield call(getSanghaAnalytics)) as SanghaAnalytics;
    yield put(fetchSanghaAnalyticsSuccess(analytics));
  } catch (error: unknown) {
    yield put(fetchSanghaAnalyticsFailure(getErrorMessage(error)));
  }
}

function* fetchSanghaAuditLogsSaga(action: PayloadAction<{ page: number; limit: number }>): Generator {
  try {
    const { page, limit } = action.payload;
    const response = (yield call(getSanghaAuditLogs, page, limit)) as PaginatedResponse<SanghaAuditLog>;
    yield put(fetchSanghaAuditLogsSuccess(response));
  } catch (error: unknown) {
    yield put(fetchSanghaAuditLogsFailure(getErrorMessage(error)));
  }
}

function* fetchGroupMembersSaga(action: PayloadAction<string>): Generator {
  try {
    const groupId = action.payload;
    const members = (yield call(getGroupMembers, groupId)) as SanghaMember[];
    yield put(fetchGroupMembersSuccess(members));
  } catch (error: unknown) {
    yield put(fetchGroupMembersFailure(getErrorMessage(error)));
  }
}

function* updateGroupMemberRoleSaga(action: PayloadAction<UpdateMemberActionPayload>): Generator {
  try {
    const { groupId, memberId, payload } = action.payload;
    const updatedMember = (yield call(updateMemberRole, groupId, memberId, payload)) as SanghaMember;
    yield put(updateGroupMemberRoleSuccess(updatedMember));
  } catch (error: unknown) {
    yield put(updateGroupMemberRoleFailure(getErrorMessage(error)));
  }
}

function* removeGroupMemberSaga(action: PayloadAction<RemoveMemberActionPayload>): Generator {
  try {
    const { groupId, memberId } = action.payload;
    yield call(removeMember, groupId, memberId);
    yield put(removeGroupMemberSuccess(memberId));
  } catch (error: unknown) {
    yield put(removeGroupMemberFailure(getErrorMessage(error)));
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
    takeLatest(fetchGroupMembersStart.type, fetchGroupMembersSaga),
    takeLatest(updateGroupMemberRoleStart.type, updateGroupMemberRoleSaga),
    takeLatest(removeGroupMemberStart.type, removeGroupMemberSaga),
  ]);
}
