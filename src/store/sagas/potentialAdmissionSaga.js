// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  POTENTIAL_ADMISSION_ACTIONS,
  setCreatePotentialAdmissionFailure,
  setCreatePotentialAdmissionSucceed,
  setDeletePotentialAdmissionFailure,
  setDeletePotentialAdmissionSucceed,
  setFetchPotentialAdmissionFailure,
  setFetchPotentialAdmissionSucceed,
  setUpdatePotentialAdmissionFailure,
  setUpdatePotentialAdmissionSucceed,
} from "../actions/potentialAdmissionAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listPotentialAdmission(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("potential_admissions")
      .select()
      .eq("companyId", filter.payload.companyId);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchPotentialAdmissionSucceed(data));
    }
  } catch (error) {
    yield put(setFetchPotentialAdmissionFailure(error));
    TOAST.error(`Potential Admission Failed: ${error.toString()}`);
  }
}

function* createPotentialAdmission(rqst) {
  try {
    console.log("=== CREATE SAGA TRIGGERED ===");
    console.log("[createPotentialAdmission]", rqst.payload);
    let { error } = yield supabaseClient
      .from("potential_admissions")
      .insert([rqst.payload], {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log("CREATE SAGA - ERROR OCCURRED");
      console.log(`[create Potential Admission] : ${error.toString()}`);
      yield put(
        setCreatePotentialAdmissionFailure(`[create Potential Admission] : ${error.toString()}`)
      );
      TOAST.error("Failed to create Potential Admission. Please try again.");
      throw error;
    }
    console.log("CREATE SAGA - SUCCESS");
    yield put(setCreatePotentialAdmissionSucceed({ success: true }));
    TOAST.ok("Potential Admission created successfully");
  } catch (error) {
    console.log("CREATE SAGA - CATCH BLOCK");
    console.log(`[create Potential Admission] : ${error.toString()}`);
    yield put(
      setCreatePotentialAdmissionFailure(`[create Potential Admission] : ${error.toString()}`)
    );
    TOAST.error("Failed to create Potential Admission. Please try again.");
  }
}

function* updatePotentialAdmission(rqst) {
  try {
    console.log("=== UPDATE SAGA TRIGGERED ===");
    console.log("[updatePotentialAdmission]", rqst.payload);
    let { error } = yield supabaseClient.from("potential_admissions").upsert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log("UPDATE SAGA - ERROR OCCURRED");
      console.log(`[update Potential Admission] : ${error.toString()}`);
      yield put(
        setUpdatePotentialAdmissionFailure(`[update Potential Admission] : ${error.toString()}`)
      );
      TOAST.error("Failed to update Potential Admission. Please try again.");
      throw error;
    }
    console.log("UPDATE SAGA - SUCCESS");
    yield put(setUpdatePotentialAdmissionSucceed({ success: true }));
    TOAST.ok("Potential Admission updated successfully");
  } catch (error) {
    console.log("UPDATE SAGA - CATCH BLOCK");
    console.log(`[update Potential Admission] : ${error.toString()}`);
    yield put(
      setUpdatePotentialAdmissionFailure(`[update Potential Admission] : ${error.toString()}`)
    );
    TOAST.error("Failed to update Potential Admission. Please try again.");
  }
}

function* deletePotentialAdmission(rqst) {
  try {
    console.log("[deletePotentialAdmission]", rqst.payload);
    let { error } = yield supabaseClient
      .from("potential_admissions")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Potential Admission] : ${error.toString()}`);
      yield put(
        setDeletePotentialAdmissionFailure(`[delete Potential Admission] : ${error.toString()}`)
      );
      TOAST.error("Failed to delete Potential Admission. Please try again.");
      throw error;
    }
    yield put(setDeletePotentialAdmissionSucceed({ success: true }));
    TOAST.ok("Potential Admission deleted successfully");
  } catch (error) {
    console.log(`[delete Potential Admission] : ${error.toString()}`);
    yield put(
      setDeletePotentialAdmissionFailure(`[delete Potential Admission] : ${error.toString()}`)
    );
    TOAST.error("Failed to delete Potential Admission. Please try again.");
  }
}

function* potentialAdmissionSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(POTENTIAL_ADMISSION_ACTIONS.ATTEMPT_TO_FETCH_POTENTIAL_ADMISSION, listPotentialAdmission);
  yield takeLatest(POTENTIAL_ADMISSION_ACTIONS.ATTEMPT_TO_CREATE_POTENTIAL_ADMISSION, createPotentialAdmission);
  yield takeLatest(POTENTIAL_ADMISSION_ACTIONS.ATTEMPT_TO_UPDATE_POTENTIAL_ADMISSION, updatePotentialAdmission);
  yield takeLatest(POTENTIAL_ADMISSION_ACTIONS.ATTEMPT_TO_DELETE_POTENTIAL_ADMISSION, deletePotentialAdmission);
}

export default potentialAdmissionSagaWatcher;
