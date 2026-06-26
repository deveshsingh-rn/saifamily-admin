import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  getCategories,
  createCategory,
  updateCategory,
} from '@/categories.api';
import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addCategoryStart,
  addCategorySuccess,
  addCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
  updateCategoryFailure,
  UpdateCategoryActionPayload,
} from './categories.slice';
import { Category, CreateCategoryPayload } from '@/category';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong.';

function* fetchCategoriesSaga(): Generator {
  try {
    const categories = (yield call(getCategories)) as Category[];
    yield put(fetchCategoriesSuccess(categories));
  } catch (error: unknown) {
    yield put(fetchCategoriesFailure(getErrorMessage(error)));
  }
}

function* addCategorySaga(action: PayloadAction<CreateCategoryPayload>): Generator {
  try {
    const newCategory = (yield call(createCategory, action.payload)) as Category;
    yield put(addCategorySuccess(newCategory));
  } catch (error: unknown) {
    yield put(addCategoryFailure(getErrorMessage(error)));
  }
}

function* updateCategorySaga(
  action: PayloadAction<UpdateCategoryActionPayload>
): Generator {
  try {
    const { categoryName, payload } = action.payload;
    const updatedCategory = (yield call(
      updateCategory,
      categoryName,
      payload
    )) as Category;
    yield put(updateCategorySuccess(updatedCategory));
  } catch (error: unknown) {
    yield put(updateCategoryFailure(getErrorMessage(error)));
  }
}

export function* categoriesSaga() {
  yield all([
    takeLatest(fetchCategoriesStart.type, fetchCategoriesSaga),
    takeLatest(addCategoryStart.type, addCategorySaga),
    takeLatest(updateCategoryStart.type, updateCategorySaga),
  ]);
}
