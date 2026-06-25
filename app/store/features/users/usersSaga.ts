import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import { fetchUsersSuccess, fetchUsersFailure, fetchUsersStart } from './usersSlice';

function* fetchUsersSaga(action: ReturnType<typeof fetchUsersStart>): Generator {
  try {
    const { page, limit } = action.payload;
    const response: any = yield call(api.get, '/api/admin/users', {
      params: { page, limit },
    });
    yield put(fetchUsersSuccess(response.data));
  } catch (error: any) {
    yield put(fetchUsersFailure(error.response?.data?.message || error.message));
  }
}

export function* watchFetchUsers() {
  yield takeLatest(fetchUsersStart.type, fetchUsersSaga);
}
