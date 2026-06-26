import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { getExperiences, deleteExperience } from '@/experiences.api';
import {
  fetchExperiencesStart,
  fetchExperiencesSuccess,
  fetchExperiencesFailure,
  deleteExperienceStart,
  deleteExperienceSuccess,
  deleteExperienceFailure,
} from './experiences.slice';
import { Experience } from '@/experience';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong.';

function* fetchExperiencesSaga(action: PayloadAction<string | undefined>): Generator {
  try {
    const searchQuery = action.payload || '';
    const experiences = (yield call(getExperiences, searchQuery)) as Experience[];
    yield put(fetchExperiencesSuccess(experiences));
  } catch (error: unknown) {
    yield put(fetchExperiencesFailure(getErrorMessage(error)));
  }
}

function* deleteExperienceSaga(action: PayloadAction<string>): Generator {
  try {
    const experienceId = action.payload;
    yield call(deleteExperience, experienceId);
    yield put(deleteExperienceSuccess(experienceId));
    // Optional: you could refetch the list here instead
    // yield put(fetchExperiencesStart());
  } catch (error: unknown) {
    yield put(deleteExperienceFailure(getErrorMessage(error)));
  }
}

function* onFetchExperiences() {
  yield takeLatest(fetchExperiencesStart.type, fetchExperiencesSaga);
}

function* onDeleteExperience() {
  yield takeLatest(deleteExperienceStart.type, deleteExperienceSaga);
}

export function* experiencesSaga() {
  yield all([call(onFetchExperiences), call(onDeleteExperience)]);
}
