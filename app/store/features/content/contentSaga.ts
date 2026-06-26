import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { getApiErrorMessage } from '../../../services/apiError';
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

function* fetchContentSaga(
  action: ReturnType<typeof fetchContentStart>,
): Generator {
  try {
    const response = (yield call(api.get, '/api/admin/content', {
      params: action.payload,
    })) as AxiosResponse<ContentResponse>;

    yield put(fetchContentSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchContentFailure(getApiErrorMessage(error, 'Content request failed')));
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
    yield put(deleteContentFailure(getApiErrorMessage(error, 'Content delete failed')));
  }
}

export function* watchFetchContent() {
  yield takeLatest(fetchContentStart.type, fetchContentSaga);
  yield takeLatest(deleteContentStart.type, deleteContentSaga);
}
