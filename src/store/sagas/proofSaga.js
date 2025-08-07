// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  PROOF_ACTIONS,
  setCreateProofFailure,
  setCreateProofSucceed,
  setDeleteProofFailure,
  setDeleteProofSucceed,
  setFetchProofFailure,
  setFetchProofSucceed,
  setUpdateProofFailure,
  setUpdateProofSucceed,
} from "../actions/proofAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listProof(filter) {
  try {
    console.log("[Filter]", filter.payload);

    let { data, error, status } = yield supabaseClient
      .from("photos")
      .select()
      .eq("record_id", filter.payload.id)
      .eq("companyId", filter.payload.companyId);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchProofSucceed(data));
    }
  } catch (error) {
    yield put(setFetchProofFailure(error));
    TOAST.error(`Proof Failed:${error.toString()}`);
  }
}

function* CreateProof(rqst) {
  try {
    console.log("[CreateProofs]", rqst.payload);
    let { error } = yield supabaseClient.from("photos").insert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[create Proof] : ${error.toString()}`);
      yield put(setCreateProofFailure(`[create Proof] : ${error.toString()}`));
      throw error;
    }
    yield put(setCreateProofSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Proof] : ${error.toString()}`);
    yield put(setCreateProofFailure(`[create proof] : ${error.toString()}`));
  }
}

function* UpdateProof(rqst) {
  try {
    console.log("[UpdateProofs]", rqst.payload);
    let { error } = yield supabaseClient.from("photos").upsert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[update Proof] : ${error.toString()}`);
      yield put(setUpdateProofFailure(`[update Proof] : ${error.toString()}`));
      throw error;
    }
    yield put(setUpdateProofSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Proof] : ${error.toString()}`);
    yield put(setUpdateProofFailure(`[update Proof] : ${error.toString()}`));
  }
}

function* DeleteProof(rqst) {
  try {
    console.log("[UpdateProofs]", rqst.payload);
    let { error } = yield supabaseClient
      .from("photos")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Proof] : ${error.toString()}`);
      yield put(setDeleteProofFailure(`[delete Proof] : ${error.toString()}`));
      throw error;
    }
    yield put(setDeleteProofSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Proof] : ${error.toString()}`);
    yield put(setDeleteProofFailure(`[delete Proof] : ${error.toString()}`));
  }
}

function* proofSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(PROOF_ACTIONS.ATTEMPT_TO_FETCH_PROOF, listProof);
  yield takeLatest(PROOF_ACTIONS.ATTEMPT_TO_CREATE_PROOF, CreateProof);
  yield takeLatest(PROOF_ACTIONS.ATTEMPT_TO_UPDATE_PROOF, UpdateProof);
  yield takeLatest(PROOF_ACTIONS.ATTEMPT_TO_DELETE_PROOF, DeleteProof);
}

export default proofSagaWatcher;
