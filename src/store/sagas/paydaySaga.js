// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  PAYDAY_ACTIONS,
  setCreatePaydayFailure,
  setCreatePaydaySucceed,
  setDeletePaydayFailure,
  setDeletePaydaySucceed,
  setFetchPaydayFailure,
  setFetchPaydaySucceed,
  setUpdatePaydayFailure,
  setUpdatePaydaySucceed,
} from "../actions/paydayAction";
import { supabaseClient } from "../../config/SupabaseClient";
function* standardQuery(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("paydays")
      .select()
      .eq("companyId", filter.payload.companyId)
      .order("payday", { ascending: false });

    if (error && status !== 406) {
      console.log(`error${error.toString()}`);
      throw error;
    }

    if (data) {
      yield put(setFetchPaydaySucceed(data));
    }
  } catch (error) {
    yield put(setFetchPaydayFailure(error));
    TOAST.error(`Payday Failed:${error.toString()}`);
  }
}

function* paydayQuery(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("paydays")
      .select()
      .eq("payday", filter.payload.payday)
      .eq("companyId", filter.payload.companyId)
      .order("payday", { ascending: false });

    if (error && status !== 406) {
      console.log(`error${error.toString()}`);
      throw error;
    }

    if (data) {
      yield put(setFetchPaydaySucceed(data));
    }
  } catch (error) {
    yield put(setFetchPaydayFailure(error));
    TOAST.error(`Payday Failed:${error.toString()}`);
  }
}
function* listPayday(filter) {
  console.log("[List Payday", filter);
  if (filter.payload.payday) {
    yield paydayQuery(filter);
  } else {
    yield standardQuery(filter);
  }
}

function* CreatePayday(rqst) {
  try {
    console.log("[CreatePaydays]", rqst.payload);
    let { error } = yield supabaseClient.from("paydays").insert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[create Payday] : ${error.toString()}`);
      yield put(
        setCreatePaydayFailure(`[create Payday] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreatePaydaySucceed({ success: true }));
  } catch (error) {
    console.log(`[create Payday] : ${error.toString()}`);
    yield put(setCreatePaydayFailure(`[create Payday] : ${error.toString()}`));
  }
}

function* UpdatePayday(rqst) {
  try {
    console.log("[UpdatePaydays]", rqst.payload);
    let { error } = yield supabaseClient.from("paydays").upsert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[update Payday] : ${error.toString()}`);
      yield put(
        setUpdatePaydayFailure(`[update Payday] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdatePaydaySucceed({ success: true }));
  } catch (error) {
    console.log(`[update Payday] : ${error.toString()}`);
    yield put(setUpdatePaydayFailure(`[update Payday] : ${error.toString()}`));
  }
}

function* DeletePayday(rqst) {
  try {
    console.log("[UpdatePaydays]", rqst.payload);
    let { error } = yield supabaseClient
      .from("paydays")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Payday] : ${error.toString()}`);
      yield put(
        setDeletePaydayFailure(`[delete Payday] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeletePaydaySucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Payday] : ${error.toString()}`);
    yield put(setDeletePaydayFailure(`[delete Payday] : ${error.toString()}`));
  }
}

function* paydaysagaWatcher<T>(): Iterable<T> {
  yield takeEvery(PAYDAY_ACTIONS.ATTEMPT_TO_FETCH_PAYDAY, listPayday);
  yield takeLatest(PAYDAY_ACTIONS.ATTEMPT_TO_CREATE_PAYDAY, CreatePayday);
  yield takeLatest(PAYDAY_ACTIONS.ATTEMPT_TO_UPDATE_PAYDAY, UpdatePayday);
  yield takeLatest(PAYDAY_ACTIONS.ATTEMPT_TO_DELETE_PAYDAY, DeletePayday);
}

export default paydaysagaWatcher;
