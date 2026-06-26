import { call, put, takeLatest, all } from 'redux-saga/effects';
import { getApiErrorMessage } from '../../../services/apiError';
import api from '../../../services/api';
import { 
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUsersStart,
  updateUserStatusStart,
  updateUserStatusSuccess,
  updateUserStatusFailure,
} from './usersSlice';
import { AdminUser, AdminUsersResponse } from '../../../types/adminApi';

interface UsersRequestParams {
  limit: number;
  offset: number;
  q?: string;
  isActive?: boolean;
}

interface UpdateUserStatusResponse {
  user?: AdminUser;
}

const isAdminUser = (value: AdminUser | UpdateUserStatusResponse): value is AdminUser =>
  'id' in value && 'isActive' in value;

function* fetchUsersSaga(action: ReturnType<typeof fetchUsersStart>): Generator {
  try {
    const { limit, offset, search, status } = action.payload;
    const params: UsersRequestParams = { limit, offset };

    if (search) {
      params.q = search;
    }

    if (status === 'active' || status === 'inactive') {
      params.isActive = status === 'active';
    }

    const response = (yield call(api.get, '/api/admin/users', { params })) as {
      data: AdminUsersResponse;
    };
    yield put(fetchUsersSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchUsersFailure(getApiErrorMessage(error, 'User request failed')));
  }
}

function* updateUserStatusSaga(action: ReturnType<typeof updateUserStatusStart>): Generator {
  try {
    const { userId, isActive } = action.payload;
    const response = (yield call(api.patch, `/api/admin/users/${userId}/status`, {
      isActive,
    })) as { data: AdminUser | UpdateUserStatusResponse };
    const updatedUser = isAdminUser(response.data) ? response.data : response.data.user;

    if (!updatedUser) {
      throw new Error('User status update succeeded without returning a user.');
    }

    yield put(updateUserStatusSuccess(updatedUser));
  } catch (error: unknown) {
    yield put(updateUserStatusFailure(getApiErrorMessage(error, 'User status update failed')));
  }
}

export function* watchUsers() {
  yield all([
    takeLatest(fetchUsersStart.type, fetchUsersSaga),
    takeLatest(updateUserStatusStart.type, updateUserStatusSaga),
  ]);
}
