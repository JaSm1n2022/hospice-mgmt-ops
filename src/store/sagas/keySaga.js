// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  KEY_ACTIONS,
  setCreateKeyFailure,
  setCreateKeySucceed,
  setDeleteKeyFailure,
  setDeleteKeySucceed,
  setFetchKeyFailure,
  setFetchKeySucceed,
  setUpdateKeyFailure,
  setUpdateKeySucceed,
} from "../actions/keyAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listKey(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("keys")
      .select()
      .eq("companyId", filter.payload.companyId);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchKeySucceed(data));
    }
  } catch (error) {
    yield put(setFetchKeyFailure(error));
    TOAST.error(`Key Failed:${error.toString()}`);
  }
}

function* createKey(rqst) {
  try {
    console.log("[CreateKeys]", rqst.payload);
    let { error } = yield supabaseClient.from("keys").insert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[create Key] : ${error.toString()}`);
      yield put(setCreateKeyFailure(`[create Key] : ${error.toString()}`));
      throw error;
    }
    yield put(setCreateKeySucceed({ success: true }));
  } catch (error) {
    console.log(`[create Key] : ${error.toString()}`);
    yield put(setCreateKeyFailure(`[create key] : ${error.toString()}`));
  }
}

function* updateKey(rqst) {
  try {
    console.log("[UpdateKeys]", rqst.payload);
    let { error } = yield supabaseClient.from("keys").upsert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[update Key] : ${error.toString()}`);
      yield put(setUpdateKeyFailure(`[update Key] : ${error.toString()}`));
      throw error;
    }
    yield put(setUpdateKeySucceed({ success: true }));
  } catch (error) {
    console.log(`[update Key] : ${error.toString()}`);
    yield put(setUpdateKeyFailure(`[update Key] : ${error.toString()}`));
  }
}

function* deleteKey(rqst) {
  try {
    console.log("[UpdateKeys]", rqst.payload);
    let { error } = yield supabaseClient
      .from("keys")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Key] : ${error.toString()}`);
      yield put(setDeleteKeyFailure(`[delete Key] : ${error.toString()}`));
      throw error;
    }
    yield put(setDeleteKeySucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Key] : ${error.toString()}`);
    yield put(setDeleteKeyFailure(`[delete Key] : ${error.toString()}`));
  }
}

function* keySagaWatcher<T>(): Iterable<T> {
  yield takeEvery(KEY_ACTIONS.ATTEMPT_TO_FETCH_KEY, listKey);
  yield takeLatest(KEY_ACTIONS.ATTEMPT_TO_CREATE_KEY, createKey);
  yield takeLatest(KEY_ACTIONS.ATTEMPT_TO_UPDATE_KEY, updateKey);
  yield takeLatest(KEY_ACTIONS.ATTEMPT_TO_DELETE_KEY, deleteKey);
}

export default keySagaWatcher;
