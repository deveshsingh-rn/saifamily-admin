import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import { fetchSanghaGroupsSuccess, fetchSanghaGroupsFailure, fetchSanghaGroupsStart } from './sanghaSlice';

function* fetchSanghaGroupsSaga(): Generator {
  try {
    const response = yield call(api.get, '/api/admin/sangha/groups');
    yield put(fetchSanghaGroupsSuccess(response.data.groups));
  } catch (error: any) {
    yield put(fetchSanghaGroupsFailure(error.message));
  }
}

export function* watchFetchSanghaGroups() {
  yield takeLatest(fetchSanghaGroupsStart.type, fetchSanghaGroupsSaga);
}
