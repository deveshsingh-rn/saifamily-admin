import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import { fetchUsersSuccess, fetchUsersFailure, fetchUsersStart } from './usersSlice';

function* fetchUsersSaga(): Generator {
  try {
    const response = yield call(api.get, '/api/admin/users');
    yield put(fetchUsersSuccess(response.data.users));
  } catch (error: any) {
    yield put(fetchUsersFailure(error.message));
  }
}

export function* watchFetchUsers() {
  yield takeLatest(fetchUsersStart.type, fetchUsersSaga);
}
