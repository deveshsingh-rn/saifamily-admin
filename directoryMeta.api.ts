import { axiosInstance } from '@/axios';
import { DirectoryAnalytics, DirectoryAuditLog } from '@/directoryMeta';

export const getDirectoryAnalytics = async (): Promise<DirectoryAnalytics> => {
  try {
    const response = await axiosInstance.get('/api/admin/directory/analytics');
    // Assuming the API returns an object with a 'data' property
    return response.data.data;
  } catch (error) {
    console.error('Error fetching directory analytics:', error);
    throw error;
  }
};

export const getDirectoryAuditLogs = async (): Promise<DirectoryAuditLog[]> => {
  try {
    const response = await axiosInstance.get('/api/admin/directory/audit-logs');
    // Assuming the API returns an object with a 'data' property containing the array
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching directory audit logs:', error);
    throw error;
  }
};