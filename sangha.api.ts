import { axiosInstance } from '@/lib/axios';
import {
  SanghaGroup,
  CreateSanghaGroupPayload,
  UpdateSanghaGroupPayload,
} from '@/types/sanghaGroup';

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