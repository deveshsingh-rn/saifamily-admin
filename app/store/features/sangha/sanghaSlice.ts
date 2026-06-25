import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SanghaGroup, CreateSanghaGroupPayload, UpdateSanghaGroupPayload } from '@/types/sanghaGroup';
import { SanghaMember, UpdateMemberActionPayload } from '@/types/sanghaMember';

export interface UpdateGroupActionPayload {
  id: string;
  payload: UpdateSanghaGroupPayload;
}

export interface RemoveMemberActionPayload {
  groupId: string;
  memberId: string;
}

interface SanghaState {
  groups: SanghaGroup[];
  members: SanghaMember[];
  loading: boolean;
  loadingMembers: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: SanghaState = {
  groups: [],
  members: [],
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

    // Group Members
    fetchGroupMembersStart(state, action: PayloadAction<string>) {
      state.loadingMembers = true;
      state.members = [];
      state.error = null;
    },
    fetchGroupMembersSuccess(state, action: PayloadAction<SanghaMember[]>) {
      state.members = action.payload;
      state.loadingMembers = false;
    },
    fetchGroupMembersFailure(state, action: PayloadAction<string>) {
      state.loadingMembers = false;
      state.error = action.payload;
    },
    updateGroupMemberRoleStart(state, action: PayloadAction<UpdateMemberActionPayload>) {
      state.submitting = true;
      state.error = null;
    },
    updateGroupMemberRoleSuccess(state, action: PayloadAction<SanghaMember>) {
      const index = state.members.findIndex(member => member.id === action.payload.id);
      if (index !== -1) {
        state.members[index] = action.payload;
      }
      state.submitting = false;
    },
    updateGroupMemberRoleFailure(state, action: PayloadAction<string>) {
      state.submitting = false;
      state.error = action.payload;
    },
    removeGroupMemberStart(state, action: PayloadAction<RemoveMemberActionPayload>) {
      state.submitting = true;
      state.error = null;
    },
    removeGroupMemberSuccess(state, action: PayloadAction<string>) {
      state.members = state.members.filter(member => member.id !== action.payload);
      state.submitting = false;
    },
    removeGroupMemberFailure(state, action: PayloadAction<string>) {
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
  fetchGroupMembersStart, fetchGroupMembersSuccess, fetchGroupMembersFailure,
  updateGroupMemberRoleStart, updateGroupMemberRoleSuccess, updateGroupMemberRoleFailure,
  removeGroupMemberStart, removeGroupMemberSuccess, removeGroupMemberFailure,
} = sanghaSlice.actions;

export default sanghaSlice.reducer;
