import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import { createAccountStart, createAccountSuccess, createAccountFailure } from './accountSlice';
import { loginSuccess } from '../auth/authSlice';

function* createAccountSaga(action: ReturnType<typeof createAccountStart>): Generator {
  try {
    // The API call might need to be a multipart/form-data request if it includes a file upload.
    // This basic implementation assumes a JSON payload. The API service needs to be updated for file uploads.
    const response: any = yield call(api.post, '/accounts', action.payload);
    
    // After creating an account, the user might be automatically logged in.
    // If so, we can dispatch loginSuccess with the new user and token data.
    // The exact response from POST /accounts needs to be confirmed from the API docs.
    // Assuming it returns the same payload as login:
    if (response.data.token && response.data.userId) {
        yield put(loginSuccess({ userId: response.data.userId, token: response.data.token }));
    }

    yield put(createAccountSuccess());

  } catch (error: any) {
    yield put(createAccountFailure(error.response?.data?.message || error.message));
  }
}

export function* watchAccount() {
  yield takeLatest(createAccountStart.type, createAccountSaga);
}
