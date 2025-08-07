// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  DME_ACTIONS,
  setCreateDmeFailure,
  setCreateDmeSucceed,
  setDeleteDmeFailure,
  setDeleteDmeSucceed,
  setFetchDmeFailure,
  setFetchDmeSucceed,
  setUpdateDmeFailure,
  setUpdateDmeSucceed,
} from "../actions/dmeAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listDme(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("dmes")
      .select()
      .eq("companyId", filter.payload.companyId);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchDmeSucceed(data));
    }
  } catch (error) {
    yield put(setFetchDmeFailure(error));
    TOAST.error(`Dme Failed:${error.toString()}`);
  }
}

function* createDme(rqst) {
  try {
    console.log("[CreateDmes]", rqst.payload);
    let { error } = yield supabaseClient.from("dmes").insert([rqst.payload], {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[create Dme] : ${error.toString()}`);
      yield put(setCreateDmeFailure(`[create Dme] : ${error.toString()}`));
      throw error;
    }
    yield put(setCreateDmeSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Dme] : ${error.toString()}`);
    yield put(setCreateDmeFailure(`[create dme] : ${error.toString()}`));
  }
}

function* updateDme(rqst) {
  try {
    console.log("[UpdateDmes]", rqst.payload);
    let { error } = yield supabaseClient.from("dmes").upsert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[update Dme] : ${error.toString()}`);
      yield put(setUpdateDmeFailure(`[update Dme] : ${error.toString()}`));
      throw error;
    }
    yield put(setUpdateDmeSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Dme] : ${error.toString()}`);
    yield put(setUpdateDmeFailure(`[update Dme] : ${error.toString()}`));
  }
}

function* deleteDme(rqst) {
  try {
    console.log("[UpdateDmes]", rqst.payload);
    let { error } = yield supabaseClient
      .from("dmes")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Dme] : ${error.toString()}`);
      yield put(setDeleteDmeFailure(`[delete Dme] : ${error.toString()}`));
      throw error;
    }
    yield put(setDeleteDmeSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Dme] : ${error.toString()}`);
    yield put(setDeleteDmeFailure(`[delete Dme] : ${error.toString()}`));
  }
}

function* dmeSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(DME_ACTIONS.ATTEMPT_TO_FETCH_DME, listDme);
  yield takeLatest(DME_ACTIONS.ATTEMPT_TO_CREATE_DME, createDme);
  yield takeLatest(DME_ACTIONS.ATTEMPT_TO_UPDATE_DME, updateDme);
  yield takeLatest(DME_ACTIONS.ATTEMPT_TO_DELETE_DME, deleteDme);
}

export default dmeSagaWatcher;
