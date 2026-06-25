import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SanghaGroup, CreateSanghaGroupPayload, UpdateSanghaGroupPayload } from '@/types/sanghaGroup';
import { SanghaMember, UpdateMemberActionPayload } from '@/types/sanghaMember';
import { SanghaReport, ResolveSanghaReportPayload, SanghaReportStatus } from '@/types/sanghaReport';
import { SendAnnouncementPayload } from '@/types/sanghaAnnouncement';
import { SanghaLiveStream } from '@/types/sanghaLiveStream';
import { SanghaAnalytics, SanghaAuditLog } from '@/types/sanghaMeta';
import { PaginatedResponse } from '@/types/api';

export interface UpdateGroupActionPayload {
  id: string;
  payload: UpdateSanghaGroupPayload;
}

export interface RemoveMemberActionPayload {
  groupId: string;
  memberId: string;
}

interface SanghaState {
  groups: SanghaGroup[];
  reports: SanghaReport[];
  members: SanghaMember[];
  liveStreams: SanghaLiveStream[];
  analytics: SanghaAnalytics | null;
  auditLogs: {
    logs: SanghaAuditLog[];
    totalPages: number;
    currentPage: number;
  };
  loading: boolean;
  loadingReports: boolean;
  loadingMembers: boolean;
  loadingLiveStreams: boolean;
  loadingAuditLogs: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: SanghaState = {
  groups: [],
  reports: [],
  members: [],
  liveStreams: [],
  analytics: null,
  auditLogs: { logs: [], totalPages: 1, currentPage: 1 },
  loading: false,
  loadingReports: false,
  loadingMembers: false,
  loadingLiveStreams: false,
  loadingAuditLogs: false,
  submitting: false,
  error: null,
};

const sanghaSlice = createSlice({
  name: 'sangha',
  initialState,
  reducers: {
    fetchSanghaGroupsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSanghaGroupsSuccess(state, action: PayloadAction<SanghaGroup[]>) {
      state.groups = action.payload;
      state.loading = false;
    },
    fetchSanghaGroupsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    addSanghaGroupStart(state, action: PayloadAction<CreateSanghaGroupPayload>) {
      state.submitting = true;
      state.error = null;
    },
    addSanghaGroupSuccess(state, action: PayloadAction<SanghaGroup>) {
      state.groups.push(action.payload);
      state.submitting = false;
    },
    addSanghaGroupFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
    updateSanghaGroupStart(state, action: PayloadAction<UpdateGroupActionPayload>) {
      state.submitting = true;
      state.error = null;
    },
    updateSanghaGroupSuccess(state, action: PayloadAction<SanghaGroup>) {
      const index = state.groups.findIndex(group => group.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
      state.submitting = false;
    },
    updateSanghaGroupFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
    deleteSanghaGroupStart(state, action: PayloadAction<string>) {
      state.submitting = true;
      state.error = null;
    },
    deleteSanghaGroupSuccess(state, action: PayloadAction<string>) {
      state.groups = state.groups.filter(group => group.id !== action.payload);
      state.submitting = false;
    },
    deleteSanghaGroupFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },

    // Group Verification
    verifyGroupStart(state, action: PayloadAction<string>) {
      state.submitting = true;
      state.error = null;
    },
    unverifyGroupStart(state, action: PayloadAction<string>) {
      state.submitting = true;
      state.error = null;
    },

    // Reports Moderation
    fetchSanghaReportsStart(state, action: PayloadAction<SanghaReportStatus | undefined>) {
      state.loadingReports = true;
      state.error = null;
    },
    fetchSanghaReportsSuccess(state, action: PayloadAction<SanghaReport[]>) {
      state.reports = action.payload;
      state.loadingReports = false;
    },
    fetchSanghaReportsFailure(state, action: PayloadAction<string>) {
      state.loadingReports = false;
      state.error = action.payload;
    },
    resolveSanghaReportStart(state, action: PayloadAction<ResolveSanghaReportPayload>) {
      state.submitting = true;
      state.error = null;
    },
    resolveSanghaReportSuccess(state, action: PayloadAction<SanghaReport>) {
      const index = state.reports.findIndex(report => report.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
      state.submitting = false;
    },
    resolveSanghaReportFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },

    // Announcements
    sendAnnouncementStart(state, action: PayloadAction<SendAnnouncementPayload>) {
      state.submitting = true;
      state.error = null;
    },
    sendAnnouncementSuccess(state) {
      state.submitting = false;
    },
    sendAnnouncementFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },

    // Live Streams
    fetchLiveStreamsStart(state) {
      state.loadingLiveStreams = true;
      state.error = null;
    },
    fetchLiveStreamsSuccess(state, action: PayloadAction<SanghaLiveStream[]>) {
      state.liveStreams = action.payload;
      state.loadingLiveStreams = false;
    },
    fetchLiveStreamsFailure(state, action: PayloadAction<string>) {
      state.loadingLiveStreams = false;
      state.error = action.payload;
    },
    endLiveStreamStart(state, action: PayloadAction<string>) {
      state.submitting = true;
    },
    endLiveStreamSuccess(state, action: PayloadAction<SanghaLiveStream>) {
      const index = state.liveStreams.findIndex(stream => stream.id === action.payload.id);
      if (index !== -1) state.liveStreams[index] = action.payload;
      state.submitting = false;
    },
    removeLiveStreamRecordingStart(state, action: PayloadAction<string>) {
      state.submitting = true;
    },
    removeLiveStreamRecordingSuccess(state, action: PayloadAction<string>) {
      const index = state.liveStreams.findIndex(stream => stream.id === action.payload);
      if (index !== -1) state.liveStreams[index].hasRecording = false;
      state.submitting = false;
    },
    liveStreamActionFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },

    // Analytics & Logs
    fetchSanghaAnalyticsStart(state) { state.loading = true; state.error = null; },
    fetchSanghaAnalyticsSuccess(state, action: PayloadAction<SanghaAnalytics>) { state.analytics = action.payload; state.loading = false; },
    fetchSanghaAnalyticsFailure(state, action: PayloadAction<string>) { state.loading = false; state.error = action.payload; },
    fetchSanghaAuditLogsStart(state, action: PayloadAction<{ page: number; limit: number }>) { state.loadingAuditLogs = true; state.error = null; },
    fetchSanghaAuditLogsSuccess(state, action: PayloadAction<PaginatedResponse<SanghaAuditLog>>) {
      state.auditLogs.logs = action.payload.data;
      state.auditLogs.totalPages = action.payload.totalPages;
      state.auditLogs.currentPage = action.payload.currentPage;
      state.loadingAuditLogs = false;
    },
    fetchSanghaAuditLogsFailure(state, action: PayloadAction<string>) { state.loadingAuditLogs = false; state.error = action.payload; },

    // Group Members
    fetchGroupMembersStart(state, action: PayloadAction<string>) {
      state.loadingMembers = true;
      state.members = [];
      state.error = null;
    },
    fetchGroupMembersSuccess(state, action: PayloadAction<SanghaMember[]>) {
      state.members = action.payload;
      state.loadingMembers = false;
    },
    fetchGroupMembersFailure(state, action: PayloadAction<string>) {
      state.loadingMembers = false;
      state.error = action.payload;
    },
    updateGroupMemberRoleStart(state, action: PayloadAction<UpdateMemberActionPayload>) {
      state.submitting = true;
      state.error = null;
    },
    updateGroupMemberRoleSuccess(state, action: PayloadAction<SanghaMember>) {
      const index = state.members.findIndex(member => member.id === action.payload.id);
      if (index !== -1) {
        state.members[index] = action.payload;
      }
      state.submitting = false;
    },
    updateGroupMemberRoleFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
    removeGroupMemberStart(state, action: PayloadAction<RemoveMemberActionPayload>) {
      state.submitting = true;
      state.error = null;
    },
    removeGroupMemberSuccess(state, action: PayloadAction<string>) {
      state.members = state.members.filter(member => member.id !== action.payload);
      state.submitting = false;
    },
    removeGroupMemberFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
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
  fetchGroupMembersStart, fetchGroupMembersSuccess, fetchGroupMembersFailure,
  updateGroupMemberRoleStart, updateGroupMemberRoleSuccess, updateGroupMemberRoleFailure,
  removeGroupMemberStart, removeGroupMemberSuccess, removeGroupMemberFailure,
} = sanghaSlice.actions;

export default sanghaSlice.reducer;
