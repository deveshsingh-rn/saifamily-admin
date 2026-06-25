import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import {
  sendOtpStart,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
} from './authSlice';

function* sendOtpSaga(action: ReturnType<typeof sendOtpStart>): Generator {
  try {
    yield call(api.post, '/auth/send-otp', { mobileNumber: action.payload.mobileNumber });
    yield put(sendOtpSuccess());
  } catch (error: any) {
    yield put(sendOtpFailure(error.message));
  }
}

function* verifyOtpSaga(action: ReturnType<typeof verifyOtpStart>): Generator {
  try {
    const response = yield call(api.post, '/auth/verify-otp', {
      mobileNumber: action.payload.mobileNumber,
      otp: action.payload.otp,
    });
    yield put(verifyOtpSuccess(response.data));
  } catch (error: any) {
    yield put(verifyOtpFailure(error.message));
  }
}

export function* watchAuth() {
  yield takeLatest(sendOtpStart.type, sendOtpSaga);
  yield takeLatest(verifyOtpStart.type, verifyOtpSaga);
}
