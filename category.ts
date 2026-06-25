export interface Category {
  _id: string;
  category: string; // e.g., "miracles"
  label: string; // e.g., "Miracle Stories"
  createdAt?: string;
}

export type CreateCategoryPayload = Pick<Category, 'category' | 'label'>;
export type UpdateCategoryPayload = Pick<Category, 'label'>;