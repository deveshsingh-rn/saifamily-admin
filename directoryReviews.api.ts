import { axiosInstance } from '@/lib/axios';
import { DirectoryReview, DirectoryReviewStatus } from '@/types/directoryReview';

export const getDirectoryReviews = async (
  status?: DirectoryReviewStatus
): Promise<DirectoryReview[]> => {
  try {
    const response = await axiosInstance.get('/api/admin/directory/reviews', {
      params: { status },
    });
    return response.data.reviews || [];
  } catch (error) {
    console.error('Error fetching directory reviews:', error);
    throw error;
  }
};

export const updateDirectoryReviewStatus = async (
  reviewId: string,
  status: DirectoryReviewStatus
): Promise<DirectoryReview> => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/directory/reviews/${reviewId}/status`,
      { status }
    );
    return response.data.review;
  } catch (error) {
    console.error(`Error updating review ${reviewId} status:`, error);
    throw error;
  }
};

export const restoreDirectoryReview = async (reviewId: string): Promise<DirectoryReview> => {
  try {
    const response = await axiosInstance.post(`/api/admin/directory/reviews/${reviewId}/restore`);
    return response.data.review;
  } catch (error) {
    console.error(`Error restoring review ${reviewId}:`, error);
    throw error;
  }
};