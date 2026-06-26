import { all } from 'redux-saga/effects';
import { watchUsers } from '../features/users/usersSaga';
import { watchFetchContent } from '../features/content/contentSaga';
import { watchFetchCategories } from '../features/categories/categoriesSaga';
import { sanghaSaga } from '../features/sangha/sanghaSaga';
import { watchDirectory } from '../features/directory/directorySaga';
import { watchAuth } from '../features/auth/authSaga';
import { watchAccount } from '../features/account/accountSaga';

export default function* rootSaga() {
  yield all([
    watchUsers(),
    watchFetchContent(),
    watchFetchCategories(),
    sanghaSaga(),
    watchDirectory(),
    watchAuth(),
    watchAccount(),
  ]);
}
