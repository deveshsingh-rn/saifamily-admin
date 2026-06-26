export interface DirectoryAnalytics {
  totalListings: number;
  pendingListings: number;
  approvedListings: number;
  totalReviews: number;
  pendingReviews: number;
  totalReports: number;
  pendingReports: number;
  // Add other analytics fields as they become available from the API
}

export interface DirectoryAuditLog {
  id: string;
  admin: {
    id: string;
    name: string;
  };
  action: string; // e.g., 'listing.approved', 'review.rejected'
  target: {
    type: 'Listing' | 'Review' | 'Report' | 'Category';
    id: string;
    name?: string; // A display name for the target, e.g., listing title
  };
  details?: Record<string, unknown>;
  createdAt: string;
}
