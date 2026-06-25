import { axiosInstance } from '@/lib/axios';
import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/types/category';

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get('/api/admin/categories');
    // Assuming the API returns an object with a 'data' property containing the array
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (
  payload: CreateCategoryPayload
): Promise<Category> => {
  try {
    const response = await axiosInstance.post('/api/admin/categories', payload);
    return response.data.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (
  categoryName: string,
  payload: UpdateCategoryPayload
): Promise<Category> => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/categories/${categoryName}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating category ${categoryName}:`, error);
    throw error;
  }
};