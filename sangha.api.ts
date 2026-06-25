import { axiosInstance } from '@/axios';
import {
  SanghaGroup,
  CreateSanghaGroupPayload,
  UpdateSanghaGroupPayload,
} from '@/sanghaGroup';
import { SanghaMember, UpdateMemberRolePayload } from '@/sanghaMember';
import { SanghaReport, SanghaReportStatus, ResolveSanghaReportPayload } from '@/sanghaReport';
import { SendAnnouncementPayload } from '@/sanghaAnnouncement';
import { SanghaLiveStream } from '@/sanghaLiveStream';
import { SanghaAnalytics, SanghaAuditLog } from '@/sanghaMeta';
// import { PaginatedResponse } from '@/types/api';

export const getSanghaGroups = async (): Promise<SanghaGroup[]> => {
  try {
    const response = await axiosInstance.get('/api/admin/sangha/groups');
    return response.data.groups || [];
  } catch (error) {
    console.error('Error fetching Sangha groups:', error);
    throw error;
  }
};

export const createSanghaGroup = async (
  payload: CreateSanghaGroupPayload
): Promise<SanghaGroup> => {
  try {
    const response = await axiosInstance.post('/api/admin/sangha/groups', payload);
    return response.data.group;
  } catch (error) {
    console.error('Error creating Sangha group:', error);
    throw error;
  }
};

export const updateSanghaGroup = async (
  id: string,
  payload: UpdateSanghaGroupPayload
): Promise<SanghaGroup> => {
  try {
    const response = await axiosInstance.patch(`/api/admin/sangha/groups/${id}`, payload);
    return response.data.group;
  } catch (error) {
    console.error(`Error updating Sangha group ${id}:`, error);
    throw error;
  }
};

export const deleteSanghaGroup = async (id: string): Promise<void> => {
  try {
    // This is an archive action
    await axiosInstance.delete(`/api/admin/sangha/groups/${id}`);
  } catch (error) {
    console.error(`Error deleting/archiving Sangha group ${id}:`, error);
    throw error;
  }
};

export const getGroupMembers = async (groupId: string): Promise<SanghaMember[]> => {
  try {
    // Using the public-facing endpoint as it's suitable for admin use too.
    const response = await axiosInstance.get(`/api/sangha/groups/${groupId}/members`);
    return response.data.members || [];
  } catch (error) {
    console.error(`Error fetching members for group ${groupId}:`, error);
    throw error;
  }
};

export const updateMemberRole = async (
  groupId: string,
  memberId: string,
  payload: UpdateMemberRolePayload
): Promise<SanghaMember> => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/sangha/groups/${groupId}/members/${memberId}`,
      payload
    );
    return response.data.member;
  } catch (error) {
    console.error(`Error updating role for member ${memberId} in group ${groupId}:`, error);
    throw error;
  }
};

export const removeMember = async (groupId: string, memberId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/admin/sangha/groups/${groupId}/members/${memberId}`);
  } catch (error) {
    console.error(`Error removing member ${memberId} from group ${groupId}:`, error);
    throw error;
  }
};

export const verifySanghaGroup = async (groupId: string): Promise<SanghaGroup> => {
  try {
    const response = await axiosInstance.post(`/api/admin/sangha/groups/${groupId}/verify`);
    return response.data.group;
  } catch (error) {
    console.error(`Error verifying Sangha group ${groupId}:`, error);
    throw error;
  }
};

export const unverifySanghaGroup = async (groupId: string): Promise<SanghaGroup> => {
  try {
    const response = await axiosInstance.post(
      `/api/admin/sangha/groups/${groupId}/unverify`
    );
    return response.data.group;
  } catch (error) {
    console.error(`Error unverifying Sangha group ${groupId}:`, error);
    throw error;
  }
};

export const getSanghaReports = async (status?: SanghaReportStatus): Promise<SanghaReport[]> => {
  try {
    const response = await axiosInstance.get('/api/admin/sangha/reports', {
      params: { status },
    });
    return response.data.reports || [];
  } catch (error) {
    console.error('Error fetching Sangha reports:', error);
    throw error;
  }
};

export const resolveSanghaReport = async (
  reportId: string,
  status: 'resolved' | 'dismissed',
  note?: string
): Promise<SanghaReport> => {
  try {
    const response = await axiosInstance.post(
      `/api/admin/sangha/reports/${reportId}/resolve`,
      { status, note }
    );
    return response.data.report;
  } catch (error) {
    console.error(`Error resolving Sangha report ${reportId}:`, error);
    throw error;
  }
};

export const sendSanghaAnnouncement = async (
  payload: SendAnnouncementPayload
): Promise<void> => {
  try {
    await axiosInstance.post('/api/admin/sangha/announcements', payload);
  } catch (error) {
    console.error('Error sending Sangha announcement:', error);
    throw error;
  }
};

export const getLiveStreams = async (): Promise<SanghaLiveStream[]> => {
  try {
    const response = await axiosInstance.get('/api/admin/sangha/live-streams');
    return response.data.streams || [];
  } catch (error) {
    console.error('Error fetching live streams:', error);
    throw error;
  }
};

export const endLiveStream = async (streamId: string): Promise<SanghaLiveStream> => {
  try {
    const response = await axiosInstance.post(`/api/admin/sangha/live-streams/${streamId}/end`);
    return response.data.stream;
  } catch (error) {
    console.error(`Error ending live stream ${streamId}:`, error);
    throw error;
  }
};

export const removeLiveStreamRecording = async (streamId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/admin/sangha/live-streams/${streamId}/recording`);
  } catch (error) {
    console.error(`Error removing recording for stream ${streamId}:`, error);
    throw error;
  }
};

export const getSanghaAnalytics = async (): Promise<SanghaAnalytics> => {
  try {
    const response = await axiosInstance.get('/api/admin/sangha/analytics');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Sangha analytics:', error);
    throw error;
  }
};

export const getSanghaAuditLogs = async (page: number, limit: number): Promise<PaginatedResponse<SanghaAuditLog>> => {
  try {
    const response = await axiosInstance.get('/api/admin/sangha/audit-logs', {
      params: { page, limit },
    });
    return response.data; // Assuming API returns { data: [], totalPages, currentPage }
  } catch (error) {
    console.error('Error fetching Sangha audit logs:', error);
    throw error;
  }
};