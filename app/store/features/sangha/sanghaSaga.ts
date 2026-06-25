import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  getSanghaGroups,
  createSanghaGroup,
  updateSanghaGroup,
  deleteSanghaGroup,
} from '@/services/sangha.api';
import {
  fetchSanghaGroupsStart,
  fetchSanghaGroupsSuccess,
  fetchSanghaGroupsFailure,
  addSanghaGroupStart,
  addSanghaGroupSuccess,
  addSanghaGroupFailure,
  updateSanghaGroupStart,
  updateSanghaGroupSuccess,
  updateSanghaGroupFailure,
  deleteSanghaGroupStart,
  deleteSanghaGroupSuccess,
  deleteSanghaGroupFailure,
  UpdateGroupActionPayload,
} from './sanghaSlice';
import { SanghaGroup, CreateSanghaGroupPayload } from '@/types/sanghaGroup';

function* fetchSanghaGroupsSaga(): Generator {
  try {
    const groups = (yield call(getSanghaGroups)) as SanghaGroup[];
    yield put(fetchSanghaGroupsSuccess(groups));
  } catch (error: any) {
    yield put(fetchSanghaGroupsFailure(error.message));
  }
}

function* addSanghaGroupSaga(action: PayloadAction<CreateSanghaGroupPayload>): Generator {
  try {
    const newGroup = (yield call(createSanghaGroup, action.payload)) as SanghaGroup;
    yield put(addSanghaGroupSuccess(newGroup));
  } catch (error: any) {
    yield put(addSanghaGroupFailure(error.message));
  }
}

function* updateSanghaGroupSaga(action: PayloadAction<UpdateGroupActionPayload>): Generator {
  try {
    const { id, payload } = action.payload;
    const updatedGroup = (yield call(updateSanghaGroup, id, payload)) as SanghaGroup;
    yield put(updateSanghaGroupSuccess(updatedGroup));
  } catch (error: any) {
    yield put(updateSanghaGroupFailure(error.message));
  }
}

function* deleteSanghaGroupSaga(action: PayloadAction<string>): Generator {
  try {
    const groupId = action.payload;
    yield call(deleteSanghaGroup, groupId);
    yield put(deleteSanghaGroupSuccess(groupId));
  } catch (error: any) {
    yield put(deleteSanghaGroupFailure(error.message));
  }
}

export function* sanghaSaga() {
  yield all([
    takeLatest(fetchSanghaGroupsStart.type, fetchSanghaGroupsSaga),
    takeLatest(addSanghaGroupStart.type, addSanghaGroupSaga),
    takeLatest(updateSanghaGroupStart.type, updateSanghaGroupSaga),
    takeLatest(deleteSanghaGroupStart.type, deleteSanghaGroupSaga),
  ]);
}
