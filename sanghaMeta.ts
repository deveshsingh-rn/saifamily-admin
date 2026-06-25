export interface SanghaAnalytics {
  totalGroups: number;
  officialGroups: number;
  totalMembers: number;
  totalPosts: number;
  pendingReports: number;
  liveStreams: number;
}

export interface SanghaAuditLog {
  id: string;
  admin: {
    id: string;
    name: string;
  };
  action: string;
  target: {
    type: string;
    id: string;
  };
  createdAt: string;
}