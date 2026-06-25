import { axiosInstance } from '@/axios';
import {
  DirectoryCategory,
  CreateDirectoryCategoryPayload,
  UpdateDirectoryCategoryPayload,
} from '@/directoryCategory';

// Using the public endpoint to list categories as there's no admin-specific GET in the collection.
export const getDirectoryCategories = async (): Promise<DirectoryCategory[]> => {
  try {
    const response = await axiosInstance.get('/api/directory/categories');
    // The public endpoint returns { categories: [...] }
    return response.data.categories || [];
  } catch (error) {
    console.error('Error fetching directory categories:', error);
    throw error;
  }
};

export const createDirectoryCategory = async (
  payload: CreateDirectoryCategoryPayload
): Promise<DirectoryCategory> => {
  try {
    const response = await axiosInstance.post('/api/admin/directory/categories', payload);
    return response.data.category;
  } catch (error) {
    console.error('Error creating directory category:', error);
    throw error;
  }
};

export const updateDirectoryCategory = async (
  id: string,
  payload: UpdateDirectoryCategoryPayload
): Promise<DirectoryCategory> => {
  try {
    const response = await axiosInstance.patch(`/api/admin/directory/categories/${id}`, payload);
    return response.data.category;
  } catch (error) {
    console.error(`Error updating directory category ${id}:`, error);
    throw error;
  }
};

// This is a soft delete (sets isActive to false)
export const deleteDirectoryCategory = async (id: string): Promise<DirectoryCategory> => {
  try {
    const response = await axiosInstance.delete(`/api/admin/directory/categories/${id}`);
    return response.data.category;
  } catch (error) {
    console.error(`Error deleting directory category ${id}:`, error);
    throw error;
  }
};