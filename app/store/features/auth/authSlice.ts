import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';

interface AuthState {
  userId: string | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  userId: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sendOtpStart(state, action: PayloadAction<{ mobileNumber: string }>) {
      state.loading = true;
      state.error = null;
    },
    sendOtpSuccess(state) {
      state.loading = false;
    },
    sendOtpFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    verifyOtpStart(state, action: PayloadAction<{ mobileNumber: string; otp: string }>) {
      state.loading = true;
      state.error = null;
    },
    verifyOtpSuccess(state, action: PayloadAction<{ userId: string; token: string }>) {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    verifyOtpFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.userId = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  sendOtpStart,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  logout,
} = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
