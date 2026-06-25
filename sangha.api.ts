import { axiosInstance } from '@/lib/axios';
import {
  SanghaGroup,
  CreateSanghaGroupPayload,
  UpdateSanghaGroupPayload,
} from '@/types/sanghaGroup';
import { SanghaMember, UpdateMemberRolePayload } from '@/types/sanghaMember';

export const getSanghaGroups = async (): Promise<SanghaGroup[]> => {
  try {
    const response = await axiosInstance.get('/api/admin/sangha/groups');
    return response.data.groups || [];
  } catch (error) {
    console.error('Error fetching Sangha groups:', error);
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