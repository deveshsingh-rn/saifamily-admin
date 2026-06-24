import { combineReducers } from '@reduxjs/toolkit';
import usersReducer from '../features/users/usersSlice';
import contentReducer from '../features/content/contentSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import sanghaReducer from '../features/sangha/sanghaSlice';

const rootReducer = combineReducers({
  users: usersReducer,
  content: contentReducer,
  categories: categoriesReducer,
  sangha: sanghaReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
