import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import { AdminUser, AdminUsersResponse } from '../../../types/adminApi';

export type User = AdminUser;

export interface UsersQuery {
  limit: number;
  offset: number;
  search?: string;
  status?: 'all' | 'active' | 'inactive';
}

interface UsersState {
  users: User[];
  loading: boolean;
  updatingUserId: string | null;
  error: string | null;
  limit: number;
  offset: number;
  totalUsers: number;
  nextOffset: number | null;
  lastQuery: UsersQuery;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  updatingUserId: null,
  error: null,
  limit: 20,
  offset: 0,
  totalUsers: 0,
  nextOffset: null,
  lastQuery: {
    limit: 20,
    offset: 0,
    status: 'all',
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart(state, action: PayloadAction<UsersQuery>) {
      state.loading = true;
      state.error = null;
      state.lastQuery = action.payload;
    },
    fetchUsersSuccess(state, action: PayloadAction<AdminUsersResponse>) {
      state.users = action.payload.users;
      state.limit = action.payload.pagination.limit;
      state.offset = action.payload.pagination.offset;
      state.totalUsers = action.payload.pagination.total;
      state.nextOffset = action.payload.pagination.nextOffset;
      state.loading = false;
    },
    fetchUsersFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStatusStart(state, action: PayloadAction<{ userId: string; isActive: boolean }>) {
      state.updatingUserId = action.payload.userId;
      state.error = null;
    },
    updateUserStatusSuccess(state, action: PayloadAction<User>) {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      state.updatingUserId = null;
    },
    updateUserStatusFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.updatingUserId = null;
    },
  },
});

export const { 
    fetchUsersStart, 
    fetchUsersSuccess, 
    fetchUsersFailure,
    updateUserStatusStart,
    updateUserStatusSuccess,
    updateUserStatusFailure,
} = usersSlice.actions;

export const selectUsers = (state: RootState) => state.users.users;
export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersUpdatingUserId = (state: RootState) => state.users.updatingUserId;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectUsersLimit = (state: RootState) => state.users.limit;
export const selectUsersOffset = (state: RootState) => state.users.offset;
export const selectUsersTotal = (state: RootState) => state.users.totalUsers;
export const selectUsersLastQuery = (state: RootState) => state.users.lastQuery;
export const selectUsersCurrentPage = (state: RootState) =>
  Math.floor(state.users.offset / state.users.limit) + 1;
export const selectUsersTotalPages = (state: RootState) =>
  Math.max(1, Math.ceil(state.users.totalUsers / state.users.limit));

export default usersSlice.reducer;
