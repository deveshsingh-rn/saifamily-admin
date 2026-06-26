import { combineReducers } from '@reduxjs/toolkit';
import usersReducer from '../features/users/usersSlice';
import contentReducer from '../features/content/contentSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import sanghaReducer from '../features/sangha/sanghaSlice';
import directoryReducer from '../features/directory/directorySlice';
import authReducer from '../features/auth/authSlice';
import accountReducer from '../features/account/accountSlice';

const rootReducer = combineReducers({
  users: usersReducer,
  content: contentReducer,
  categories: categoriesReducer,
  sangha: sanghaReducer,
  directory: directoryReducer,
  auth: authReducer,
  account: accountReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
