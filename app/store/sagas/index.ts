import { all } from 'redux-saga/effects';
import { watchUsers } from '../features/users/usersSaga';
import { watchFetchContent } from '../features/content/contentSaga';
import { watchFetchCategories } from '../features/categories/categoriesSaga';
import { watchFetchSanghaGroups } from '../features/sangha/sanghaSaga';
import { watchAuth } from '../features/auth/authSaga';
import { watchAccount } from '../features/account/accountSaga';

export default function* rootSaga() {
  yield all([
    watchUsers(),
    watchFetchContent(),
    watchFetchCategories(),
    watchFetchSanghaGroups(),
    watchAuth(),
    watchAccount(),
  ]);
}
