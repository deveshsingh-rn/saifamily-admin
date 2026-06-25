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

function* fetchCategoriesSaga(): Generator {
  try {
    const categories = (yield call(getCategories)) as Category[];
    yield put(fetchCategoriesSuccess(categories));
  } catch (error: any) {
    yield put(fetchCategoriesFailure(error.message));
  }
}

function* addCategorySaga(action: PayloadAction<CreateCategoryPayload>): Generator {
  try {
    const newCategory = (yield call(createCategory, action.payload)) as Category;
    yield put(addCategorySuccess(newCategory));
  } catch (error: any) {
    yield put(addCategoryFailure(error.message));
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
  } catch (error: any) {
    yield put(updateCategoryFailure(error.message));
  }
}

export function* categoriesSaga() {
  yield all([
    takeLatest(fetchCategoriesStart.type, fetchCategoriesSaga),
    takeLatest(addCategoryStart.type, addCategorySaga),
    takeLatest(updateCategoryStart.type, updateCategorySaga),
  ]);
}