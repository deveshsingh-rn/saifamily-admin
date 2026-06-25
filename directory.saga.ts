import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  getDirectoryCategories,
  createDirectoryCategory,
  updateDirectoryCategory,
  deleteDirectoryCategory,
} from '@/services/directoryCategories.api';
import {
  fetchDirectoryCategoriesStart,
  fetchDirectoryCategoriesSuccess,
  fetchDirectoryCategoriesFailure,
  addDirectoryCategoryStart,
  addDirectoryCategorySuccess,
  addDirectoryCategoryFailure,
  updateDirectoryCategoryStart,
  updateDirectoryCategorySuccess,
  updateDirectoryCategoryFailure,
  deleteDirectoryCategoryStart,
  deleteDirectoryCategorySuccess,
  deleteDirectoryCategoryFailure,
  UpdateActionPayload,
} from './directory.slice';
import { DirectoryCategory, CreateDirectoryCategoryPayload } from '@/types/directoryCategory';

function* fetchDirectoryCategoriesSaga(): Generator {
  try {
    const categories = (yield call(getDirectoryCategories)) as DirectoryCategory[];
    yield put(fetchDirectoryCategoriesSuccess(categories));
  } catch (error: any) {
    yield put(fetchDirectoryCategoriesFailure(error.message));
  }
}

function* addDirectoryCategorySaga(action: PayloadAction<CreateDirectoryCategoryPayload>): Generator {
  try {
    const newCategory = (yield call(createDirectoryCategory, action.payload)) as DirectoryCategory;
    yield put(addDirectoryCategorySuccess(newCategory));
  } catch (error: any) {
    yield put(addDirectoryCategoryFailure(error.message));
  }
}

function* updateDirectoryCategorySaga(action: PayloadAction<UpdateActionPayload>): Generator {
  try {
    const { id, payload } = action.payload;
    const updatedCategory = (yield call(updateDirectoryCategory, id, payload)) as DirectoryCategory;
    yield put(updateDirectoryCategorySuccess(updatedCategory));
  } catch (error: any) {
    yield put(updateDirectoryCategoryFailure(error.message));
  }
}

function* deleteDirectoryCategorySaga(action: PayloadAction<string>): Generator {
  try {
    const categoryId = action.payload;
    const updatedCategory = (yield call(deleteDirectoryCategory, categoryId)) as DirectoryCategory;
    yield put(deleteDirectoryCategorySuccess(updatedCategory));
  } catch (error: any) {
    yield put(deleteDirectoryCategoryFailure(error.message));
  }
}

export function* directorySaga() {
  yield all([
    takeLatest(fetchDirectoryCategoriesStart.type, fetchDirectoryCategoriesSaga),
    takeLatest(addDirectoryCategoryStart.type, addDirectoryCategorySaga),
    takeLatest(updateDirectoryCategoryStart.type, updateDirectoryCategorySaga),
    takeLatest(deleteDirectoryCategoryStart.type, deleteDirectoryCategorySaga),
  ]);
}