export interface SendAnnouncementPayload {
  groupId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}