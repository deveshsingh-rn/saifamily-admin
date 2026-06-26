import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';

export interface AdminContent {
  id: string;
  content: string;
  category: string;
  location: string | null;
  createdAt: string;
  author: {
    id: string;
    memberId: string;
    name: string;
    handle: string;
    isActive: boolean;
  };
  _count: {
    likes: number;
    comments: number;
    reposts: number;
    bookmarks: number;
  };
}

export interface ContentQuery {
  limit: number;
  offset: number;
  category?: string;
}

export interface ContentResponse {
  experiences: AdminContent[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    nextOffset: number | null;
  };
}

interface ContentState {
  contents: AdminContent[];
  loading: boolean;
  deletingId: string | null;
  error: string | null;
  limit: number;
  offset: number;
  total: number;
  nextOffset: number | null;
}

const initialState: ContentState = {
  contents: [],
  loading: false,
  deletingId: null,
  error: null,
  limit: 20,
  offset: 0,
  total: 0,
  nextOffset: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    fetchContentStart(state, _action: PayloadAction<ContentQuery>) {
      void _action;
      state.loading = true;
      state.error = null;
    },
    fetchContentSuccess(state, action: PayloadAction<ContentResponse>) {
      state.contents = action.payload.experiences;
      state.limit = action.payload.pagination.limit;
      state.offset = action.payload.pagination.offset;
      state.total = action.payload.pagination.total;
      state.nextOffset = action.payload.pagination.nextOffset;
      state.loading = false;
    },
    fetchContentFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    deleteContentStart(
      state,
      action: PayloadAction<{ contentId: string; query: ContentQuery }>,
    ) {
      state.deletingId = action.payload.contentId;
      state.error = null;
    },
    deleteContentSuccess(state, action: PayloadAction<string>) {
      state.contents = state.contents.filter(({ id }) => id !== action.payload);
      state.total = Math.max(0, state.total - 1);
      state.deletingId = null;
    },
    deleteContentFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.deletingId = null;
    },
  },
});

export const {
  fetchContentStart,
  fetchContentSuccess,
  fetchContentFailure,
  deleteContentStart,
  deleteContentSuccess,
  deleteContentFailure,
} = contentSlice.actions;

export const selectContent = (state: RootState) => state.content.contents;
export const selectContentLoading = (state: RootState) => state.content.loading;
export const selectContentDeletingId = (state: RootState) => state.content.deletingId;
export const selectContentError = (state: RootState) => state.content.error;
export const selectContentLimit = (state: RootState) => state.content.limit;
export const selectContentOffset = (state: RootState) => state.content.offset;
export const selectContentTotal = (state: RootState) => state.content.total;

export default contentSlice.reducer;
