import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SanghaGroup, CreateSanghaGroupPayload, UpdateSanghaGroupPayload } from '@/types/sanghaGroup';

export interface UpdateGroupActionPayload {
  id: string;
  payload: UpdateSanghaGroupPayload;
}

interface SanghaState {
  groups: SanghaGroup[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: SanghaState = {
  groups: [],
  loading: false,
  submitting: false,
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
    fetchSanghaGroupsSuccess(state, action: PayloadAction<SanghaGroup[]>) {
      state.groups = action.payload;
      state.loading = false;
    },
    fetchSanghaGroupsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    addSanghaGroupStart(state, action: PayloadAction<CreateSanghaGroupPayload>) {
      state.submitting = true;
      state.error = null;
    },
    addSanghaGroupSuccess(state, action: PayloadAction<SanghaGroup>) {
      state.groups.push(action.payload);
      state.submitting = false;
    },
    addSanghaGroupFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
    updateSanghaGroupStart(state, action: PayloadAction<UpdateGroupActionPayload>) {
      state.submitting = true;
      state.error = null;
    },
    updateSanghaGroupSuccess(state, action: PayloadAction<SanghaGroup>) {
      const index = state.groups.findIndex(group => group.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
      state.submitting = false;
    },
    updateSanghaGroupFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
    deleteSanghaGroupStart(state, action: PayloadAction<string>) {
      state.submitting = true;
      state.error = null;
    },
    deleteSanghaGroupSuccess(state, action: PayloadAction<string>) {
      state.groups = state.groups.filter(group => group.id !== action.payload);
      state.submitting = false;
    },
    deleteSanghaGroupFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSanghaGroupsStart, fetchSanghaGroupsSuccess, fetchSanghaGroupsFailure,
  addSanghaGroupStart, addSanghaGroupSuccess, addSanghaGroupFailure,
  updateSanghaGroupStart, updateSanghaGroupSuccess, updateSanghaGroupFailure,
  deleteSanghaGroupStart, deleteSanghaGroupSuccess, deleteSanghaGroupFailure,
} = sanghaSlice.actions;

export default sanghaSlice.reducer;
