import { AxiosError, AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import {
  ContentResponse,
  deleteContentFailure,
  deleteContentStart,
  deleteContentSuccess,
  fetchContentFailure,
  fetchContentStart,
  fetchContentSuccess,
} from './contentSlice';

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string; error?: { message?: string } }
      | undefined;

    return data?.message ?? data?.error?.message ?? error.message;
  }

  return error instanceof Error ? error.message : 'Content request failed';
}

function* fetchContentSaga(
  action: ReturnType<typeof fetchContentStart>,
): Generator {
  try {
    const response = (yield call(api.get, '/api/admin/content', {
      params: action.payload,
    })) as AxiosResponse<ContentResponse>;

    yield put(fetchContentSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchContentFailure(getErrorMessage(error)));
  }
}

function* deleteContentSaga(
  action: ReturnType<typeof deleteContentStart>,
): Generator {
  try {
    const { contentId, query } = action.payload;
    yield call(api.delete, `/api/admin/content/${contentId}`);
    yield put(deleteContentSuccess(contentId));
    yield put(fetchContentStart(query));
  } catch (error: unknown) {
    yield put(deleteContentFailure(getErrorMessage(error)));
  }
}

export function* watchFetchContent() {
  yield takeLatest(fetchContentStart.type, fetchContentSaga);
  yield takeLatest(deleteContentStart.type, deleteContentSaga);
}
