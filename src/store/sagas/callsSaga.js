// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  CALLS_ACTIONS,
  setCreateCallsFailure,
  setCreateCallsSucceed,
  setDeleteCallsFailure,
  setDeleteCallsSucceed,
  setFetchCallsFailure,
  setFetchCallsSucceed,
  setUpdateCallsFailure,
  setUpdateCallsSucceed,
} from "../actions/callsAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listCalls(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("calllogs")
      .select()

      .eq("companyId", filter.payload.companyId)
      .gte("calledDt", `${filter.payload.from} 00:00`)
      .lt("calledDt", `${filter.payload.to} 23:59`);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchCallsSucceed(data));
    }
  } catch (error) {
    yield put(setFetchCallsFailure(error));
    TOAST.error(`Calls Failed:${error.toString()}`);
  }
}

function* createCalls(rqst) {
  try {
    console.log("[CreateCallss]", rqst.payload);
    let { error } = yield supabaseClient
      .from("calllogs")
      .insert([rqst.payload], {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Calls] : ${error.toString()}`);
      yield put(setCreateCallsFailure(`[create Calls] : ${error.toString()}`));
      throw error;
    }
    yield put(setCreateCallsSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Calls] : ${error.toString()}`);
    yield put(setCreateCallsFailure(`[create calls] : ${error.toString()}`));
  }
}

function* updateCalls(rqst) {
  try {
    console.log("[UpdateCallss]", rqst.payload);
    let { error } = yield supabaseClient.from("calllogs").upsert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[update Calls] : ${error.toString()}`);
      yield put(setUpdateCallsFailure(`[update Calls] : ${error.toString()}`));
      throw error;
    }
    yield put(setUpdateCallsSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Calls] : ${error.toString()}`);
    yield put(setUpdateCallsFailure(`[update Calls] : ${error.toString()}`));
  }
}

function* deleteCalls(rqst) {
  try {
    console.log("[UpdateCallss]", rqst.payload);
    let { error } = yield supabaseClient
      .from("calllogs")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Calls] : ${error.toString()}`);
      yield put(setDeleteCallsFailure(`[delete Calls] : ${error.toString()}`));
      throw error;
    }
    yield put(setDeleteCallsSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Calls] : ${error.toString()}`);
    yield put(setDeleteCallsFailure(`[delete Calls] : ${error.toString()}`));
  }
}

function* callsSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(CALLS_ACTIONS.ATTEMPT_TO_FETCH_CALLS, listCalls);
  yield takeLatest(CALLS_ACTIONS.ATTEMPT_TO_CREATE_CALLS, createCalls);
  yield takeLatest(CALLS_ACTIONS.ATTEMPT_TO_UPDATE_CALLS, updateCalls);
  yield takeLatest(CALLS_ACTIONS.ATTEMPT_TO_DELETE_CALLS, deleteCalls);
}

export default callsSagaWatcher;
