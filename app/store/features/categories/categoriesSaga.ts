import { AxiosError, AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import {
  Category,
  createCategoryFailure,
  createCategoryStart,
  createCategorySuccess,
  fetchCategoriesFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  updateCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
} from './categoriesSlice';

interface CategoriesResponse {
  categories: Category[];
}

interface CategoryResponse {
  category: Category;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string; error?: { message?: string } }
      | undefined;

    return data?.message ?? data?.error?.message ?? error.message;
  }

  return error instanceof Error ? error.message : 'Category request failed';
}

function* fetchCategoriesSaga(): Generator {
  try {
    const response = (yield call(
      api.get,
      '/api/admin/categories',
    )) as AxiosResponse<CategoriesResponse>;
    yield put(fetchCategoriesSuccess(response.data.categories));
  } catch (error: unknown) {
    yield put(fetchCategoriesFailure(getErrorMessage(error)));
  }
}

function* createCategorySaga(
  action: ReturnType<typeof createCategoryStart>,
): Generator {
  try {
    const response = (yield call(
      api.post,
      '/api/admin/categories',
      action.payload,
    )) as AxiosResponse<CategoryResponse>;
    yield put(createCategorySuccess(response.data.category));
  } catch (error: unknown) {
    yield put(createCategoryFailure(getErrorMessage(error)));
  }
}

function* updateCategorySaga(
  action: ReturnType<typeof updateCategoryStart>,
): Generator {
  try {
    const { category, label } = action.payload;
    const response = (yield call(
      api.patch,
      `/api/admin/categories/${encodeURIComponent(category)}`,
      { label },
    )) as AxiosResponse<CategoryResponse>;
    yield put(updateCategorySuccess(response.data.category));
  } catch (error: unknown) {
    yield put(updateCategoryFailure(getErrorMessage(error)));
  }
}

export function* watchFetchCategories() {
  yield takeLatest(fetchCategoriesStart.type, fetchCategoriesSaga);
  yield takeLatest(createCategoryStart.type, createCategorySaga);
  yield takeLatest(updateCategoryStart.type, updateCategorySaga);
}
