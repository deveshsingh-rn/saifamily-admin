import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import { fetchContentSuccess, fetchContentFailure, fetchContentStart } from './contentSlice';

function* fetchContentSaga(): Generator {
  try {
    const response = yield call(api.get, '/api/admin/content');
    yield put(fetchContentSuccess(response.data.contents));
  } catch (error: any) {
    yield put(fetchContentFailure(error.message));
  }
}

export function* watchFetchContent() {
  yield takeLatest(fetchContentStart.type, fetchContentSaga);
}
