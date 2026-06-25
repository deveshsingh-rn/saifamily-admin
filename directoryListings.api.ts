import { axiosInstance } from '@/axios';
import {
  DirectoryListing,
  DirectoryListingStatus,
} from '@/directoryListing';

export const getDirectoryListings = async (
  status?: DirectoryListingStatus
): Promise<DirectoryListing[]> => {
  try {
    const response = await axiosInstance.get('/api/admin/directory/listings', {
      params: { status },
    });
    return response.data.listings || [];
  } catch (error) {
    console.error('Error fetching directory listings:', error);
    throw error;
  }
};

export const updateDirectoryListing = async (
  listingId: string,
  payload: { status?: DirectoryListingStatus; isVerified?: boolean }
): Promise<DirectoryListing> => {
  try {
    // Using a generic PATCH endpoint as it's more flexible for multiple moderation actions
    const response = await axiosInstance.patch(
      `/api/admin/directory/listings/${listingId}`,
      payload
    );
    return response.data.listing;
  } catch (error) {
    console.error(`Error updating listing ${listingId}:`, error);
    throw error;
  }
};