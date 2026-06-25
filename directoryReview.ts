export type DirectoryReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export interface DirectoryReview {
  id: string;
  listing: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    name: string;
  };
  rating: number;
  comment: string;
  status: DirectoryReviewStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateReviewStatusPayload {
  reviewId: string;
  status: DirectoryReviewStatus;
}