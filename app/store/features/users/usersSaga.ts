import { call, put, takeLatest, all } from 'redux-saga/effects';
import api from '../../../services/api';
import { 
    fetchUsersSuccess, 
    fetchUsersFailure, 
    fetchUsersStart,
    updateUserStatusStart,
    updateUserStatusSuccess,
    updateUserStatusFailure,
} from './usersSlice';

function* fetchUsersSaga(action: ReturnType<typeof fetchUsersStart>): Generator {
  try {
    const { page, limit, search, status } = action.payload;
    const params: any = { page, limit };
    if (search) {
      params.search = search;
    }
    if (status && status !== 'all') {
      params.status = status === 'active';
    }

    const response: any = yield call(api.get, '/api/admin/users', { params });
    yield put(fetchUsersSuccess(response.data));
  } catch (error: any) {
    yield put(fetchUsersFailure(error.response?.data?.message || error.message));
  }
}

function* updateUserStatusSaga(action: ReturnType<typeof updateUserStatusStart>): Generator {
    try {
        const { userId, isActive } = action.payload;
        const response: any = yield call(api.patch, `/api/admin/users/${userId}/status`, { isActive });
        yield put(updateUserStatusSuccess(response.data));
    } catch (error: any) {
        yield put(updateUserStatusFailure(error.response?.data?.message || error.message));
    }
}

export function* watchUsers() {
  yield all([
    takeLatest(fetchUsersStart.type, fetchUsersSaga),
    takeLatest(updateUserStatusStart.type, updateUserStatusSaga),
  ]);
}
