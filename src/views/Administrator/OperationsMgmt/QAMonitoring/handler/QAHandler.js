import { call, put, takeLatest } from 'redux-saga/effects';
import { QA_ACTIONS } from 'store/actions/qaAction';
import {
  setFetchQASucceed,
  setFetchQAFailure,
  setCreateQASucceed,
  setCreateQAFailure,
  setUpdateQASucceed,
  setUpdateQAFailure,
  setDeleteQASucceed,
  setDeleteQAFailure,
} from 'store/actions/qaAction';
import { supabaseClient } from '../../../../../config/SupabaseClient';

// Fetch QA
function* attemptToFetchQA(action) {
  try {
    const { companyId } = action.payload || {};
    let query = supabaseClient.from('qa_monitoring').select('*');

    if (companyId) {
      query = query.eq('companyId', companyId);
    }

    const { data, error } = yield call([query, query.order], 'created_at', { ascending: false });

    if (error) {
      yield put(setFetchQAFailure(error));
    } else {
      yield put(setFetchQASucceed(data || []));
    }
  } catch (error) {
    yield put(setFetchQAFailure(error));
  }
}

// Create QA
function* attemptToCreateQA(action) {
  try {
    const { data, error } = yield call(
      [supabaseClient.from('qa_monitoring'), supabaseClient.from('qa_monitoring').insert],
      [action.payload]
    );
    if (error) {
      yield put(setCreateQAFailure(error));
    } else {
      yield put(setCreateQASucceed(data));
    }
  } catch (error) {
    yield put(setCreateQAFailure(error));
  }
}

// Update QA
function* attemptToUpdateQA(action) {
  try {
    const { id, ...updateData } = action.payload;
    const { data, error } = yield call(
      [supabaseClient.from('qa_monitoring').update(updateData).eq('id', id),
       supabaseClient.from('qa_monitoring').update(updateData).eq('id', id).select]
    );
    if (error) {
      yield put(setUpdateQAFailure(error));
    } else {
      yield put(setUpdateQASucceed(data));
    }
  } catch (error) {
    yield put(setUpdateQAFailure(error));
  }
}

// Delete QA
function* attemptToDeleteQA(action) {
  try {
    const { data, error } = yield call(
      [supabaseClient.from('qa_monitoring').delete().eq('id', action.payload.id),
       supabaseClient.from('qa_monitoring').delete().eq('id', action.payload.id).select]
    );
    if (error) {
      yield put(setDeleteQAFailure(error));
    } else {
      yield put(setDeleteQASucceed(data));
    }
  } catch (error) {
    yield put(setDeleteQAFailure(error));
  }
}

export default function* QAHandler() {
  yield takeLatest(QA_ACTIONS.ATTEMPT_TO_FETCH_QA, attemptToFetchQA);
  yield takeLatest(QA_ACTIONS.ATTEMPT_TO_CREATE_QA, attemptToCreateQA);
  yield takeLatest(QA_ACTIONS.ATTEMPT_TO_UPDATE_QA, attemptToUpdateQA);
  yield takeLatest(QA_ACTIONS.ATTEMPT_TO_DELETE_QA, attemptToDeleteQA);
}
