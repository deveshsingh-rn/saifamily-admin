import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
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
} from './authSlice';

function* sendOtpSaga(action: ReturnType<typeof sendOtpStart>): Generator {
  try {
    yield call(api.post, '/api/auth/mobile/send-otp', { mobileNumber: action.payload.mobileNumber });
    yield put(sendOtpSuccess());
  } catch (error: any) {
    yield put(sendOtpFailure(error.response?.data?.message || error.message));
  }
}

function* verifyOtpSaga(action: ReturnType<typeof verifyOtpStart>): Generator {
  try {
    const response: any = yield call(api.post, '/api/auth/mobile/verify-otp', {
      mobileNumber: action.payload.mobileNumber,
      otp: action.payload.otp,
    });
    yield put(verifyOtpSuccess(response.data));
  } catch (error: any) {
    yield put(verifyOtpFailure(error.response?.data?.message || error.message));
  }
}

function* loginSaga(action: ReturnType<typeof loginStart>): Generator {
  try {
    const response: any = yield call(api.post, '/api/auth/email/login', action.payload);
    yield put(loginSuccess(response.data));
  } catch (error: any) {
    yield put(loginFailure(error.response?.data?.message || error.message));
  }
}

function* registerSaga(action: ReturnType<typeof registerStart>): Generator {
  try {
    yield call(api.post, '/api/auth/email/register', action.payload);
    yield put(registerSuccess());
    // You might want to automatically trigger login or show a "please verify your email" message here.
  } catch (error: any) {
    yield put(registerFailure(error.response?.data?.message || error.message));
  }
}


export function* watchAuth() {
  yield takeLatest(sendOtpStart.type, sendOtpSaga);
  yield takeLatest(verifyOtpStart.type, verifyOtpSaga);
  yield takeLatest(loginStart.type, loginSaga);
  yield takeLatest(registerStart.type, registerSaga);
}
