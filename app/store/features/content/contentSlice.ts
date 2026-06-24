import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';

interface Content {
  id: string;
  content: string;
  category: string;
}

interface ContentState {
  contents: Content[];
  loading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  contents: [],
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    fetchContentStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchContentSuccess(state, action: PayloadAction<Content[]>) {
      state.contents = action.payload;
      state.loading = false;
    },
    fetchContentFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchContentStart, fetchContentSuccess, fetchContentFailure } = contentSlice.actions;

export const selectContent = (state: RootState) => state.content.contents;
export const selectContentLoading = (state: RootState) => state.content.loading;
export const selectContentError = (state: RootState) => state.content.error;

export default contentSlice.reducer;
