// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  OVERHEAD_ACTIONS,
  setCreateOverheadFailure,
  setCreateOverheadSucceed,
  setDeleteOverheadFailure,
  setDeleteOverheadSucceed,
  setFetchOverheadFailure,
  setFetchOverheadSucceed,
  setUpdateOverheadFailure,
  setUpdateOverheadSucceed,
} from "../actions/overheadAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listOverhead(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("overhead")
      .select()
      .eq("companyId", filter.payload.companyId);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchOverheadSucceed(data));
    }
  } catch (error) {
    yield put(setFetchOverheadFailure(error));
    TOAST.error(`Overhead Failed:${error.toString()}`);
  }
}

function* createOverhead(rqst) {
  try {
    console.log("[CreateOverheads]", rqst.payload);
    let { error } = yield supabaseClient
      .from("overhead")
      .insert([rqst.payload], {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Overhead] : ${error.toString()}`);
      yield put(
        setCreateOverheadFailure(`[create Overhead] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreateOverheadSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Overhead] : ${error.toString()}`);
    yield put(
      setCreateOverheadFailure(`[create overhead] : ${error.toString()}`)
    );
  }
}

function* updateOverhead(rqst) {
  try {
    console.log("[UpdateOverheads]", rqst.payload);
    let { error } = yield supabaseClient.from("overhead").upsert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[update Overhead] : ${error.toString()}`);
      yield put(
        setUpdateOverheadFailure(`[update Overhead] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdateOverheadSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Overhead] : ${error.toString()}`);
    yield put(
      setUpdateOverheadFailure(`[update Overhead] : ${error.toString()}`)
    );
  }
}

function* deleteOverhead(rqst) {
  try {
    console.log("[UpdateOverheads]", rqst.payload);
    let { error } = yield supabaseClient
      .from("overhead")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Overhead] : ${error.toString()}`);
      yield put(
        setDeleteOverheadFailure(`[delete Overhead] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeleteOverheadSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Overhead] : ${error.toString()}`);
    yield put(
      setDeleteOverheadFailure(`[delete Overhead] : ${error.toString()}`)
    );
  }
}

function* overheadSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(OVERHEAD_ACTIONS.ATTEMPT_TO_FETCH_OVERHEAD, listOverhead);
  yield takeLatest(OVERHEAD_ACTIONS.ATTEMPT_TO_CREATE_OVERHEAD, createOverhead);
  yield takeLatest(OVERHEAD_ACTIONS.ATTEMPT_TO_UPDATE_OVERHEAD, updateOverhead);
  yield takeLatest(OVERHEAD_ACTIONS.ATTEMPT_TO_DELETE_OVERHEAD, deleteOverhead);
}

export default overheadSagaWatcher;
