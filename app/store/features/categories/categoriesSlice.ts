import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import { AdminExperienceCategory } from '../../../types/adminApi';

export type Category = AdminExperienceCategory;

export const CATEGORY_KEYS = [
  'miracles',
  'prayers',
  'dreams',
  'darshan',
  'blessings',
  'general',
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export interface CreateCategoryPayload {
  category: CategoryKey;
  label: string;
}

export interface UpdateCategoryPayload {
  category: CategoryKey;
  label: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  submitting: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategoriesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
      state.loading = false;
    },
    fetchCategoriesFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    createCategoryStart(
      state,
      action: PayloadAction<CreateCategoryPayload>,
    ) {
      void action;
      state.submitting = true;
      state.error = null;
    },
    createCategorySuccess(state, action: PayloadAction<Category>) {
      const index = state.categories.findIndex(
        ({ category }) => category === action.payload.category,
      );

      if (index === -1) {
        state.categories.push(action.payload);
      } else {
        state.categories[index] = action.payload;
      }

      state.categories.sort((first, second) =>
        first.label.localeCompare(second.label),
      );
      state.submitting = false;
    },
    createCategoryFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.submitting = false;
    },
    updateCategoryStart(
      state,
      action: PayloadAction<UpdateCategoryPayload>,
    ) {
      void action;
      state.submitting = true;
      state.error = null;
    },
    updateCategorySuccess(state, action: PayloadAction<Category>) {
      const index = state.categories.findIndex(
        ({ category }) => category === action.payload.category,
      );

      if (index !== -1) {
        state.categories[index] = action.payload;
      }

      state.categories.sort((first, second) =>
        first.label.localeCompare(second.label),
      );
      state.submitting = false;
    },
    updateCategoryFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.submitting = false;
    },
    clearCategoryError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  createCategoryStart,
  createCategorySuccess,
  createCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
  updateCategoryFailure,
  clearCategoryError,
} = categoriesSlice.actions;

export const selectCategories = (state: RootState) => state.categories.categories;
export const selectCategoriesLoading = (state: RootState) => state.categories.loading;
export const selectCategoriesSubmitting = (state: RootState) => state.categories.submitting;
export const selectCategoriesError = (state: RootState) => state.categories.error;

export default categoriesSlice.reducer;
