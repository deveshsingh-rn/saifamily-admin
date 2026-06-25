import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, CreateCategoryPayload } from '@/types/category';

export interface UpdateCategoryActionPayload {
  categoryName: string;
  payload: { label: string };
}

export interface CategoriesState {
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
      state.loading = false;
      state.error = action.payload;
    },
    addCategoryStart(state, action: PayloadAction<CreateCategoryPayload>) {
      state.submitting = true;
      state.error = null;
    },
    addCategorySuccess(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload);
      state.submitting = false;
    },
    addCategoryFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
    updateCategoryStart(
      state,
      action: PayloadAction<UpdateCategoryActionPayload>
    ) {
      state.submitting = true;
      state.error = null;
    },
    updateCategorySuccess(state, action: PayloadAction<Category>) {
      const index = state.categories.findIndex(
        (cat) => cat._id === action.payload._id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      state.submitting = false;
    },
    updateCategoryFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addCategoryStart,
  addCategorySuccess,
  addCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
  updateCategoryFailure,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;