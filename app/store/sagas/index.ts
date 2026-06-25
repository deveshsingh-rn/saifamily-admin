import { all } from 'redux-saga/effects';
import { watchFetchUsers } from '../features/users/usersSaga';
import { watchFetchContent } from '../features/content/contentSaga';
import { watchFetchCategories } from '../features/categories/categoriesSaga';
import { watchFetchSanghaGroups } from '../features/sangha/sanghaSaga';
import { watchAuth } from '../features/auth/authSaga';

export default function* rootSaga() {
  yield all([
    watchFetchUsers(),
    watchFetchContent(),
    watchFetchCategories(),
    watchFetchSanghaGroups(),
    watchAuth(),
  ]);
}
