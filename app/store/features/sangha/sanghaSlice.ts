import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';

interface Group {
  id: string;
  name: string;
  purpose: string;
  privacy: string;
}

interface SanghaState {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

const initialState: SanghaState = {
  groups: [],
  loading: false,
  error: null,
};

const sanghaSlice = createSlice({
  name: 'sangha',
  initialState,
  reducers: {
    fetchSanghaGroupsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSanghaGroupsSuccess(state, action: PayloadAction<Group[]>) {
      state.groups = action.payload;
      state.loading = false;
    },
    fetchSanghaGroupsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchSanghaGroupsStart, fetchSanghaGroupsSuccess, fetchSanghaGroupsFailure } = sanghaSlice.actions;

export const selectSanghaGroups = (state: RootState) => state.sangha.groups;
export const selectSanghaGroupsLoading = (state: RootState) => state.sangha.loading;
export const selectSanghaGroupsError = (state: RootState) => state.sangha.error;

export default sanghaSlice.reducer;
