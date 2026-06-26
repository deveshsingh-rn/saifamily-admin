import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';

interface AuthState {
  userId: string | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean;
}

export const ADMIN_ROLES = ['super_admin', 'mandir_admin'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const isAdminRole = (role: string | null): role is AdminRole =>
  role === 'super_admin' || role === 'mandir_admin';

const initialState: AuthState = {
  userId: null,
  token: null,
  role: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
  registrationSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Mobile OTP actions
    sendOtpStart(state, action: PayloadAction<{ mobileNumber: string }>) {
      void action;
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
      void action;
      state.loading = true;
      state.error = null;
    },
    verifyOtpSuccess(
      state,
      action: PayloadAction<{ userId: string; token: string; role: string }>,
    ) {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.loading = false;
    },
    verifyOtpFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    // Email/Password actions
    loginStart(state, action: PayloadAction<{ email: string; password: string }>) {
      void action;
      state.loading = true;
      state.error = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{ userId: string; token: string; role: string }>,
    ) {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    // Registration actions
    registerStart(state, action: PayloadAction<{ name: string; email: string; password: string }>) {
      void action;
      state.loading = true;
      state.error = null;
      state.registrationSuccess = false;
    },
    registerSuccess(state) {
      state.loading = false;
      state.registrationSuccess = true;
      // User may need to verify email, so not authenticated yet
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
      state.registrationSuccess = false;
    },
    
    clearRegistrationSuccess(state) {
      state.registrationSuccess = false;
    },

    // General actions
    hydrateAuth(
      state,
      action: PayloadAction<{ userId: string; token: string; role: string } | null>,
    ) {
      state.userId = action.payload?.userId ?? null;
      state.token = action.payload?.token ?? null;
      state.role = action.payload?.role ?? null;
      state.isAuthenticated = Boolean(action.payload);
      state.isInitialized = true;
    },
    logout(state) {
      state.userId = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.loading = false;
      state.error = null;
      state.registrationSuccess = false;
    },
    clearAuthError(state) {
      state.error = null;
    }
  },
});

export const {
  sendOtpStart,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  clearRegistrationSuccess,
  hydrateAuth,
  logout,
  clearAuthError,
} = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthInitialized = (state: RootState) => state.auth.isInitialized;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUser = (state: RootState) => state.auth.userId;
export const selectAuthRole = (state: RootState) => state.auth.role;
export const selectIsAdmin = (state: RootState) => isAdminRole(state.auth.role);
export const selectRegistrationSuccess = (state: RootState) => state.auth.registrationSuccess;

export default authSlice.reducer;
