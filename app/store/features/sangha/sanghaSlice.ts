import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import {
  AdminSanghaAnalytics,
  AdminSanghaAuditLog,
  AdminSanghaGroup,
  AdminSanghaLiveStream,
  AdminSanghaReport,
  CreateSanghaGroupPayload,
  OffsetPagination,
  SanghaAuditLogsResponse,
  SanghaGroupsResponse,
  SanghaLiveStreamsResponse,
  SanghaReportsResponse,
  SanghaReportStatus,
  UpdateSanghaGroupPayload,
  UpdateSanghaMemberPayload,
} from '../../../types/adminApi';

export interface SanghaListQuery {
  limit: number;
  offset: number;
  status?: string;
  q?: string;
}

export interface UpdateGroupActionPayload {
  id: string;
  payload: UpdateSanghaGroupPayload;
}

export interface SanghaModerationPayload {
  id: string;
  status?: 'resolved' | 'dismissed';
  note?: string;
}

export interface SendAnnouncementPayload {
  groupId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface RemoveMemberActionPayload {
  groupId: string;
  memberId: string;
}

interface SanghaResourceState<Resource> {
  items: Resource[];
  loading: boolean;
  error: string | null;
  pagination: OffsetPagination;
  lastQuery: SanghaListQuery;
}

interface SanghaState {
  groups: SanghaResourceState<AdminSanghaGroup>;
  reports: SanghaResourceState<AdminSanghaReport>;
  liveStreams: SanghaResourceState<AdminSanghaLiveStream>;
  auditLogs: SanghaResourceState<AdminSanghaAuditLog>;
  analytics: {
    data: AdminSanghaAnalytics | null;
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

const defaultQuery: SanghaListQuery = {
  limit: 20,
  offset: 0,
};

const initialResourceState = <Resource>(): SanghaResourceState<Resource> => ({
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

const initialState: SanghaState = {
  groups: initialResourceState<AdminSanghaGroup>(),
  reports: initialResourceState<AdminSanghaReport>(),
  liveStreams: initialResourceState<AdminSanghaLiveStream>(),
  auditLogs: {
    ...initialResourceState<AdminSanghaAuditLog>(),
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

const sanghaSlice = createSlice({
  name: 'sangha',
  initialState,
  reducers: {
    fetchSanghaGroupsStart(state, action: PayloadAction<SanghaListQuery | undefined>) {
      state.groups.loading = true;
      state.groups.error = null;
      state.groups.lastQuery = action.payload ?? defaultQuery;
    },
    fetchSanghaGroupsSuccess(state, action: PayloadAction<SanghaGroupsResponse>) {
      state.groups.items = action.payload.groups;
      state.groups.pagination = action.payload.pagination;
      state.groups.loading = false;
    },
    fetchSanghaGroupsFailure(state, action: PayloadAction<string>) {
      state.groups.error = action.payload;
      state.groups.loading = false;
    },
    addSanghaGroupStart(state, action: PayloadAction<CreateSanghaGroupPayload>) {
      state.submittingAction = 'group:create';
      state.mutationError = null;
      void action;
    },
    addSanghaGroupSuccess(state, action: PayloadAction<AdminSanghaGroup>) {
      state.groups.items = [action.payload, ...state.groups.items];
      state.submittingAction = null;
    },
    addSanghaGroupFailure(state, action: PayloadAction<string>) {
      state.mutationError = action.payload;
      state.submittingAction = null;
    },
    updateSanghaGroupStart(state, action: PayloadAction<UpdateGroupActionPayload>) {
      state.submittingAction = `group:${action.payload.id}:update`;
      state.mutationError = null;
    },
    updateSanghaGroupSuccess(state, action: PayloadAction<AdminSanghaGroup>) {
      state.groups.items = replaceById(state.groups.items, action.payload);
      state.submittingAction = null;
    },
    updateSanghaGroupFailure(state, action: PayloadAction<string>) {
      state.mutationError = action.payload;
      state.submittingAction = null;
    },
    deleteSanghaGroupStart(state, action: PayloadAction<string>) {
      state.submittingAction = `group:${action.payload}:delete`;
      state.mutationError = null;
    },
    deleteSanghaGroupSuccess(state, action: PayloadAction<string>) {
      state.groups.items = state.groups.items.filter(({ id }) => id !== action.payload);
      state.submittingAction = null;
    },
    deleteSanghaGroupFailure(state, action: PayloadAction<string>) {
      state.mutationError = action.payload;
      state.submittingAction = null;
    },
    verifyGroupStart(state, action: PayloadAction<string>) {
      state.submittingAction = `group:${action.payload}:verify`;
      state.mutationError = null;
    },
    unverifyGroupStart(state, action: PayloadAction<string>) {
      state.submittingAction = `group:${action.payload}:unverify`;
      state.mutationError = null;
    },
    fetchSanghaReportsStart(state, action: PayloadAction<SanghaListQuery | undefined>) {
      state.reports.loading = true;
      state.reports.error = null;
      state.reports.lastQuery = action.payload ?? defaultQuery;
    },
    fetchSanghaReportsSuccess(state, action: PayloadAction<SanghaReportsResponse>) {
      state.reports.items = action.payload.reports;
      state.reports.pagination = action.payload.pagination;
      state.reports.loading = false;
    },
    fetchSanghaReportsFailure(state, action: PayloadAction<string>) {
      state.reports.error = action.payload;
      state.reports.loading = false;
    },
    resolveSanghaReportStart(state, action: PayloadAction<SanghaModerationPayload>) {
      state.submittingAction = `report:${action.payload.id}:resolve`;
      state.mutationError = null;
    },
    resolveSanghaReportSuccess(state, action: PayloadAction<AdminSanghaReport>) {
      state.reports.items = replaceById(state.reports.items, action.payload);
      state.submittingAction = null;
    },
    resolveSanghaReportFailure(state, action: PayloadAction<string>) {
      state.mutationError = action.payload;
      state.submittingAction = null;
    },
    sendAnnouncementStart(state, action: PayloadAction<SendAnnouncementPayload>) {
      state.submittingAction = `announcement:${action.payload.groupId}`;
      state.mutationError = null;
    },
    sendAnnouncementSuccess(state) {
      state.submittingAction = null;
    },
    sendAnnouncementFailure(state, action: PayloadAction<string>) {
      state.mutationError = action.payload;
      state.submittingAction = null;
    },
    fetchLiveStreamsStart(state, action: PayloadAction<SanghaListQuery | undefined>) {
      state.liveStreams.loading = true;
      state.liveStreams.error = null;
      state.liveStreams.lastQuery = action.payload ?? defaultQuery;
    },
    fetchLiveStreamsSuccess(state, action: PayloadAction<SanghaLiveStreamsResponse>) {
      state.liveStreams.items = action.payload.streams;
      state.liveStreams.pagination = action.payload.pagination;
      state.liveStreams.loading = false;
    },
    fetchLiveStreamsFailure(state, action: PayloadAction<string>) {
      state.liveStreams.error = action.payload;
      state.liveStreams.loading = false;
    },
    endLiveStreamStart(state, action: PayloadAction<string>) {
      state.submittingAction = `stream:${action.payload}:end`;
      state.mutationError = null;
    },
    endLiveStreamSuccess(state, action: PayloadAction<AdminSanghaLiveStream>) {
      state.liveStreams.items = replaceById(state.liveStreams.items, action.payload);
      state.submittingAction = null;
    },
    removeLiveStreamRecordingStart(state, action: PayloadAction<string>) {
      state.submittingAction = `stream:${action.payload}:recording`;
      state.mutationError = null;
    },
    removeLiveStreamRecordingSuccess(state, action: PayloadAction<string>) {
      const stream = state.liveStreams.items.find(({ id }) => id === action.payload);
      if (stream) {
        stream.recordingStatus = null;
        stream.playbackUrl = null;
      }
      state.submittingAction = null;
    },
    liveStreamActionFailure(state, action: PayloadAction<string>) {
      state.mutationError = action.payload;
      state.submittingAction = null;
    },
    fetchSanghaAnalyticsStart(state) {
      state.analytics.loading = true;
      state.analytics.error = null;
    },
    fetchSanghaAnalyticsSuccess(state, action: PayloadAction<AdminSanghaAnalytics>) {
      state.analytics.data = action.payload;
      state.analytics.loading = false;
    },
    fetchSanghaAnalyticsFailure(state, action: PayloadAction<string>) {
      state.analytics.error = action.payload;
      state.analytics.loading = false;
    },
    fetchSanghaAuditLogsStart(state, action: PayloadAction<SanghaListQuery | undefined>) {
      state.auditLogs.loading = true;
      state.auditLogs.error = null;
      state.auditLogs.lastQuery = action.payload ?? { limit: 50, offset: 0 };
    },
    fetchSanghaAuditLogsSuccess(state, action: PayloadAction<SanghaAuditLogsResponse>) {
      state.auditLogs.items = action.payload.logs;
      state.auditLogs.pagination = action.payload.pagination;
      state.auditLogs.loading = false;
    },
    fetchSanghaAuditLogsFailure(state, action: PayloadAction<string>) {
      state.auditLogs.error = action.payload;
      state.auditLogs.loading = false;
    },
    updateGroupMemberRoleStart(state, action: PayloadAction<UpdateSanghaMemberPayload>) {
      state.submittingAction = `member:${action.payload.memberId}:update`;
      state.mutationError = null;
    },
    updateGroupMemberRoleSuccess(state) {
      state.submittingAction = null;
    },
    updateGroupMemberRoleFailure(state, action: PayloadAction<string>) {
      state.mutationError = action.payload;
      state.submittingAction = null;
    },
    removeGroupMemberStart(state, action: PayloadAction<RemoveMemberActionPayload>) {
      state.submittingAction = `member:${action.payload.memberId}:remove`;
      state.mutationError = null;
    },
    removeGroupMemberSuccess(state) {
      state.submittingAction = null;
    },
    removeGroupMemberFailure(state, action: PayloadAction<string>) {
      state.mutationError = action.payload;
      state.submittingAction = null;
    },
  },
});

export const {
  fetchSanghaGroupsStart, fetchSanghaGroupsSuccess, fetchSanghaGroupsFailure,
  addSanghaGroupStart, addSanghaGroupSuccess, addSanghaGroupFailure,
  updateSanghaGroupStart, updateSanghaGroupSuccess, updateSanghaGroupFailure,
  deleteSanghaGroupStart, deleteSanghaGroupSuccess, deleteSanghaGroupFailure,
  verifyGroupStart,
  unverifyGroupStart,
  fetchSanghaReportsStart, fetchSanghaReportsSuccess, fetchSanghaReportsFailure,
  resolveSanghaReportStart, resolveSanghaReportSuccess, resolveSanghaReportFailure,
  sendAnnouncementStart, sendAnnouncementSuccess, sendAnnouncementFailure,
  fetchLiveStreamsStart, fetchLiveStreamsSuccess, fetchLiveStreamsFailure,
  endLiveStreamStart, endLiveStreamSuccess,
  removeLiveStreamRecordingStart, removeLiveStreamRecordingSuccess,
  liveStreamActionFailure,
  fetchSanghaAnalyticsStart, fetchSanghaAnalyticsSuccess, fetchSanghaAnalyticsFailure,
  fetchSanghaAuditLogsStart, fetchSanghaAuditLogsSuccess, fetchSanghaAuditLogsFailure,
  updateGroupMemberRoleStart, updateGroupMemberRoleSuccess, updateGroupMemberRoleFailure,
  removeGroupMemberStart, removeGroupMemberSuccess, removeGroupMemberFailure,
} = sanghaSlice.actions;

export const selectSanghaGroups = (state: RootState) => state.sangha.groups;
export const selectSanghaReports = (state: RootState) => state.sangha.reports;
export const selectSanghaLiveStreams = (state: RootState) => state.sangha.liveStreams;
export const selectSanghaAnalytics = (state: RootState) => state.sangha.analytics;
export const selectSanghaAuditLogs = (state: RootState) => state.sangha.auditLogs;
export const selectSanghaSubmittingAction = (state: RootState) => state.sangha.submittingAction;
export const selectSanghaMutationError = (state: RootState) => state.sangha.mutationError;

export const SANGHA_REPORT_STATUSES: SanghaReportStatus[] = [
  'pending',
  'resolved',
  'dismissed',
];

export default sanghaSlice.reducer;
