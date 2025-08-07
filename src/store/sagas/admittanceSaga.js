// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  ADMITTANCE_ACTIONS,
  setCreateAdmittanceFailure,
  setCreateAdmittanceSucceed,
  setDeleteAdmittanceFailure,
  setDeleteAdmittanceSucceed,
  setFetchAdmittanceFailure,
  setFetchAdmittanceSucceed,
  setUpdateAdmittanceFailure,
  setUpdateAdmittanceSucceed,
} from "../actions/admittanceAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listAdmittance(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("admissions")
      .select()
      .eq("companyId", filter.payload.companyId);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchAdmittanceSucceed(data));
    }
  } catch (error) {
    yield put(setFetchAdmittanceFailure(error));
    TOAST.error(`Admittance Failed:${error.toString()}`);
  }
}

function* createAdmittance(rqst) {
  try {
    console.log("[CreateAdmittances]", rqst.payload);
    let { error } = yield supabaseClient
      .from("admissions")
      .insert([rqst.payload], {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Admittance] : ${error.toString()}`);
      yield put(
        setCreateAdmittanceFailure(`[create Admittance] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreateAdmittanceSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Admittance] : ${error.toString()}`);
    yield put(
      setCreateAdmittanceFailure(`[create admittance] : ${error.toString()}`)
    );
  }
}

function* updateAdmittance(rqst) {
  try {
    console.log("[UpdateAdmittances]", rqst.payload);
    let { error } = yield supabaseClient
      .from("admissions")
      .upsert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[update Admittance] : ${error.toString()}`);
      yield put(
        setUpdateAdmittanceFailure(`[update Admittance] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdateAdmittanceSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Admittance] : ${error.toString()}`);
    yield put(
      setUpdateAdmittanceFailure(`[update Admittance] : ${error.toString()}`)
    );
  }
}

function* deleteAdmittance(rqst) {
  try {
    console.log("[UpdateAdmittances]", rqst.payload);
    let { error } = yield supabaseClient
      .from("admissions")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Admittance] : ${error.toString()}`);
      yield put(
        setDeleteAdmittanceFailure(`[delete Admittance] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeleteAdmittanceSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Admittance] : ${error.toString()}`);
    yield put(
      setDeleteAdmittanceFailure(`[delete Admittance] : ${error.toString()}`)
    );
  }
}

function* admittanceSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(
    ADMITTANCE_ACTIONS.ATTEMPT_TO_FETCH_ADMITTANCE,
    listAdmittance
  );
  yield takeLatest(
    ADMITTANCE_ACTIONS.ATTEMPT_TO_CREATE_ADMITTANCE,
    createAdmittance
  );
  yield takeLatest(
    ADMITTANCE_ACTIONS.ATTEMPT_TO_UPDATE_ADMITTANCE,
    updateAdmittance
  );
  yield takeLatest(
    ADMITTANCE_ACTIONS.ATTEMPT_TO_DELETE_ADMITTANCE,
    deleteAdmittance
  );
}

export default admittanceSagaWatcher;
