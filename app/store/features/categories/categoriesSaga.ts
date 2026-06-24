import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import { fetchCategoriesSuccess, fetchCategoriesFailure, fetchCategoriesStart } from './categoriesSlice';

function* fetchCategoriesSaga(): Generator {
  try {
    const response = yield call(api.get, '/api/admin/categories');
    yield put(fetchCategoriesSuccess(response.data.categories));
  } catch (error: any) {
    yield put(fetchCategoriesFailure(error.message));
  }
}

export function* watchFetchCategories() {
  yield takeLatest(fetchCategoriesStart.type, fetchCategoriesSaga);
}
