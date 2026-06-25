export interface DirectoryCategory {
  id: string; // Note: API uses 'id' for directory entities
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  iconFamily?: string;
  color?: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt: string;
}

export type CreateDirectoryCategoryPayload = Omit<DirectoryCategory, 'id' | 'createdAt' | 'isActive'> & { isActive?: boolean };
export type UpdateDirectoryCategoryPayload = Partial<Omit<DirectoryCategory, 'id' | 'createdAt' | 'isActive'>>;