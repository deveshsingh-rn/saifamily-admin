import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DirectoryCategory, CreateDirectoryCategoryPayload, UpdateDirectoryCategoryPayload } from '@/types/directoryCategory';

export interface UpdateActionPayload {
  id: string;
  payload: UpdateDirectoryCategoryPayload;
}

export interface DirectoryState {
  categories: DirectoryCategory[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: DirectoryState = {
  categories: [],
  loading: false,
  submitting: false,
  error: null,
};

const directorySlice = createSlice({
  name: 'directory',
  initialState,
  reducers: {
    // Fetch
    fetchDirectoryCategoriesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDirectoryCategoriesSuccess(state, action: PayloadAction<DirectoryCategory[]>) {
      state.categories = action.payload;
      state.loading = false;
    },
    fetchDirectoryCategoriesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Create
    addDirectoryCategoryStart(state, action: PayloadAction<CreateDirectoryCategoryPayload>) {
      state.submitting = true;
      state.error = null;
    },
    addDirectoryCategorySuccess(state, action: PayloadAction<DirectoryCategory>) {
      state.categories.push(action.payload);
      state.submitting = false;
    },
    addDirectoryCategoryFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
    // Update
    updateDirectoryCategoryStart(state, action: PayloadAction<UpdateActionPayload>) {
      state.submitting = true;
      state.error = null;
    },
    updateDirectoryCategorySuccess(state, action: PayloadAction<DirectoryCategory>) {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      state.submitting = false;
    },
    updateDirectoryCategoryFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
    // Delete (soft)
    deleteDirectoryCategoryStart(state, action: PayloadAction<string>) {
      state.submitting = true;
      state.error = null;
    },
    deleteDirectoryCategorySuccess(state, action: PayloadAction<DirectoryCategory>) {
      // Update the item instead of removing it, as it's a soft delete
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      state.submitting = false;
    },
    deleteDirectoryCategoryFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDirectoryCategoriesStart, fetchDirectoryCategoriesSuccess, fetchDirectoryCategoriesFailure,
  addDirectoryCategoryStart, addDirectoryCategorySuccess, addDirectoryCategoryFailure,
  updateDirectoryCategoryStart, updateDirectoryCategorySuccess, updateDirectoryCategoryFailure,
  deleteDirectoryCategoryStart, deleteDirectoryCategorySuccess, deleteDirectoryCategoryFailure,
} = directorySlice.actions;

export default directorySlice.reducer;