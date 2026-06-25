import { axiosInstance } from '@/axios';
import { DirectoryReport, DirectoryReportStatus } from '@/directoryReport';

export const getDirectoryReports = async (
  status?: DirectoryReportStatus
): Promise<DirectoryReport[]> => {
  try {
    const response = await axiosInstance.get('/api/admin/directory/reports', {
      params: { status },
    });
    return response.data.reports || [];
  } catch (error) {
    console.error('Error fetching directory reports:', error);
    throw error;
  }
};

export const resolveDirectoryReport = async (
  reportId: string,
  status: 'resolved' | 'dismissed',
  note?: string
): Promise<DirectoryReport> => {
  try {
    const response = await axiosInstance.post(
      `/api/admin/directory/reports/${reportId}/resolve`,
      { status, note }
    );
    return response.data.report;
  } catch (error) {
    console.error(`Error resolving report ${reportId}:`, error);
    throw error;
  }
};