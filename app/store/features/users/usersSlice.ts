import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';

export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalUsers: 0,
};

interface PaginatedUsersResponse {
    items: User[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart(state, action: PayloadAction<{ page: number; limit: number; search?: string; status?: string }>) {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess(state, action: PayloadAction<PaginatedUsersResponse>) {
      state.users = action.payload.items;
      state.totalUsers = action.payload.total;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.pages;
      state.loading = false;
    },
    fetchUsersFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStatusStart(state, action: PayloadAction<{ userId: string; isActive: boolean }>) {
        // Can set a specific loading state for the user row if needed
        state.error = null;
    },
    updateUserStatusSuccess(state, action: PayloadAction<User>) {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
            state.users[index] = action.payload;
        }
    },
    updateUserStatusFailure(state, action: PayloadAction<string>) {
        state.error = action.payload;
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
export const selectUsersError = (state: RootState) => state.users.error;
export const selectUsersCurrentPage = (state: RootState) => state.users.currentPage;
export const selectUsersTotalPages = (state: RootState) => state.users.totalPages;

export default usersSlice.reducer;
