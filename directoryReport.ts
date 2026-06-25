export type DirectoryReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface DirectoryReport {
  id: string;
  listing: {
    id:string;
    businessName: string;
  };
  user: {
    id: string;
    name: string;
  };
  reason: 'spam' | 'inappropriate' | 'scam' | 'duplicate' | 'wrong_info' | 'other';
  details?: string;
  status: DirectoryReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ResolveReportPayload {
  reportId: string;
  status: 'resolved' | 'dismissed';
  note?: string;
}