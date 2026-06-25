export type SanghaReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface SanghaReport {
  id: string;
  reporter: {
    id: string;
    name: string;
  };
  target: {
    type: 'Post' | 'User' | 'Group';
    id: string;
    content?: string;
  };
  reason: string;
  details?: string;
  status: SanghaReportStatus;
  createdAt: string;
}

export interface ResolveSanghaReportPayload {
  reportId: string;
  status: 'resolved' | 'dismissed';
  note?: string;
}