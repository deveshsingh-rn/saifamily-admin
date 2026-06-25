export type SanghaMemberRole = 'owner' | 'moderator' | 'member';

export interface SanghaMember {
  id: string; // This is the membership ID
  user: {
    id: string; // This is the user ID
    name: string;
    profileImage?: string;
  };
  role: SanghaMemberRole;
  joinedAt: string;
}

export interface UpdateMemberRolePayload {
  role: SanghaMemberRole;
  note?: string;
}

export interface UpdateMemberActionPayload {
  groupId: string;
  memberId: string;
  payload: UpdateMemberRolePayload;
}