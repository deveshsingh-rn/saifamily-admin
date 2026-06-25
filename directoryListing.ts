export type DirectoryListingStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'suspended';

export interface DirectoryListing {
  id: string;
  businessName: string;
  category: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
  };
  status: DirectoryListingStatus;
  isVerified: boolean;
  city: string;
  createdAt: string;
}

export interface UpdateListingActionPayload {
  listingId: string;
  payload: { status?: DirectoryListingStatus; isVerified?: boolean };
}