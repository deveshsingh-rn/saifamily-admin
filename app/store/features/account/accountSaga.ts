import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosError } from 'axios';
import api from '../../../services/api';
import { createAccountStart, createAccountSuccess, createAccountFailure } from './accountSlice';
import { loginSuccess } from '../auth/authSlice';
import { ApiErrorResponse } from '../../../types/adminApi';

interface CreateAccountResponse {
  token?: string;
  userId?: string;
  role?: string;
}

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<ApiErrorResponse>;

  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    'Something went wrong while creating the account.'
  );
};

function* createAccountSaga(action: ReturnType<typeof createAccountStart>): Generator {
  try {
    // The API call might need to be a multipart/form-data request if it includes a file upload.
    // This basic implementation assumes a JSON payload. The API service needs to be updated for file uploads.
    const response = (yield call(api.post, '/accounts', action.payload)) as {
      data: CreateAccountResponse;
    };
    
    // After creating an account, the user might be automatically logged in.
    // If so, we can dispatch loginSuccess with the new user and token data.
    // The exact response from POST /accounts needs to be confirmed from the API docs.
    // Assuming it returns the same payload as login:
    if (response.data.token && response.data.userId && response.data.role) {
        yield put(loginSuccess({
          userId: response.data.userId,
          token: response.data.token,
          role: response.data.role,
        }));
    }

    yield put(createAccountSuccess());

  } catch (error: unknown) {
    yield put(createAccountFailure(getErrorMessage(error)));
  }
}

export function* watchAccount() {
  yield takeLatest(createAccountStart.type, createAccountSaga);
}
