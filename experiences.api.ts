import { axiosInstance } from '@/axios';
import { Experience } from '@/experience';

// The data payload for creating a new experience
export type CreateExperiencePayload = Omit<Experience, '_id' | 'createdAt'>;

export const getExperiences = async (
  searchQuery: string = ''
): Promise<Experience[]> => {
  try {
    const response = await axiosInstance.get(
      `/api/admin/content?search=${searchQuery}`
    );
    // Assuming the API returns an object with a 'data' property containing the array
    return response.data.data;
  } catch (error) {
    console.error('Error fetching admin content (experiences):', error);
    throw error;
  }
};

export const deleteExperience = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/admin/content/${id}`);
  } catch (error) {
    console.error(`Error deleting admin content (experience) with id ${id}:`, error);
    throw error;
  }
};

export const createExperience = async (
  payload: CreateExperiencePayload
): Promise<Experience> => {
  try {
    const response = await axiosInstance.post('/api/admin/content', payload);
    return response.data.data;
  } catch (error) {
    console.error('Error creating admin content (experience):', error);
    throw error;
  }
};