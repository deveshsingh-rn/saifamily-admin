export type SanghaGroupPurpose = 'city_chapter' | 'seva' | 'bhajan' | 'online_global' | 'satsang' | 'study' | 'general';
export type SanghaGroupPrivacy = 'public' | 'private' | 'invite_only';
export type SanghaGroupActivityStatus = 'active' | 'inactive';

export interface SanghaGroup {
  id: string;
  name: string;
  purpose: SanghaGroupPurpose;
  privacy: SanghaGroupPrivacy;
  description?: string;
  city?: string;
  state?: string;
  country?: string;
  isOfficial: boolean;
  activityStatus: SanghaGroupActivityStatus;
  owner: {
    id: string;
    name: string;
  };
  _count: {
    members: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type CreateSanghaGroupPayload = Pick<SanghaGroup, 'name' | 'purpose' | 'privacy' | 'description' | 'city' | 'state' | 'country'> & { ownerUserId: string; isOfficial?: boolean };
export type UpdateSanghaGroupPayload = Partial<Pick<SanghaGroup, 'name' | 'description' | 'privacy' | 'activityStatus'>>;