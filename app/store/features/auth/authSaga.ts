import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { getApiErrorMessage } from '../../../services/apiError';
import api from '../../../services/api';
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from '../../../services/authSession';
import {
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
  logout,
  isAdminRole,
} from './authSlice';

interface AuthResponse {
  user: {
    id: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

function persistSession(response: AuthResponse): void {
  writeAuthSession({
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
    userId: response.user.id,
    role: response.user.role,
  });
}

function* clearSessionSaga(): Generator {
  const session = readAuthSession();

  try {
    if (session?.refreshToken) {
      yield call(api.post, '/api/auth/logout', {
        refreshToken: session.refreshToken,
      });
    }
  } catch {
    // Local logout must still complete if server-side revocation is unavailable.
  } finally {
    yield call(clearAuthSession);
  }
}

function* sendOtpSaga(action: ReturnType<typeof sendOtpStart>): Generator {
  try {
    yield call(api.post, '/api/auth/mobile/send-otp', { mobileNumber: action.payload.mobileNumber });
    yield put(sendOtpSuccess());
  } catch (error: unknown) {
    yield put(sendOtpFailure(getApiErrorMessage(error, 'OTP request failed')));
  }
}

function* verifyOtpSaga(action: ReturnType<typeof verifyOtpStart>): Generator {
  try {
    const response = (yield call(api.post, '/api/auth/mobile/verify-otp', {
      mobileNumber: action.payload.mobileNumber.trim(),
      otp: action.payload.otp.trim(),
    })) as AxiosResponse<AuthResponse>;

    if (!isAdminRole(response.data.user.role)) {
      throw new Error('This account does not have admin panel access');
    }

    yield call(persistSession, response.data);
    yield put(verifyOtpSuccess({
      userId: response.data.user.id,
      token: response.data.tokens.accessToken,
      role: response.data.user.role,
    }));
  } catch (error: unknown) {
    yield put(verifyOtpFailure(getApiErrorMessage(error, 'OTP verification failed')));
  }
}

function* loginSaga(action: ReturnType<typeof loginStart>): Generator {
  try {
    const response = (yield call(
      api.post,
      '/api/auth/email/login',
      action.payload,
    )) as AxiosResponse<AuthResponse>;

    if (!isAdminRole(response.data.user.role)) {
      throw new Error('This account does not have admin panel access');
    }

    yield call(persistSession, response.data);
    yield put(loginSuccess({
      userId: response.data.user.id,
      token: response.data.tokens.accessToken,
      role: response.data.user.role,
    }));
  } catch (error: unknown) {
    yield put(loginFailure(getApiErrorMessage(error, 'Login failed')));
  }
}

function* registerSaga(action: ReturnType<typeof registerStart>): Generator {
  try {
    yield call(api.post, '/api/auth/email/register', action.payload);
    yield put(registerSuccess());
    // You might want to automatically trigger login or show a "please verify your email" message here.
  } catch (error: unknown) {
    yield put(registerFailure(getApiErrorMessage(error, 'Registration failed')));
  }
}


export function* watchAuth() {
  yield takeLatest(sendOtpStart.type, sendOtpSaga);
  yield takeLatest(verifyOtpStart.type, verifyOtpSaga);
  yield takeLatest(loginStart.type, loginSaga);
  yield takeLatest(registerStart.type, registerSaga);
  yield takeLatest(logout.type, clearSessionSaga);
}
