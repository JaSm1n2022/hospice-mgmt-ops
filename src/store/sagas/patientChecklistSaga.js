// @flow
import { takeLatest, put } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  PATIENT_CHECKLIST_ACTIONS,
  setCreatePatientChecklistFailure,
  setCreatePatientChecklistSucceed,
  setDeletePatientChecklistFailure,
  setDeletePatientChecklistSucceed,
  setFetchPatientChecklistFailure,
  setFetchPatientChecklistSucceed,
  setUpdatePatientChecklistFailure,
  setUpdatePatientChecklistSucceed,
} from "../actions/patientChecklistAction";
import { supabaseClient } from "../../config/SupabaseClient";

export function* listPatientChecklist(action) {
  try {
    const { companyId } = action.payload || {};

    if (!companyId) {
      throw new Error("companyId is required");
    }

    const { data, error, status } = yield supabaseClient
      .from("patient_checklists")
      .select("*")
      .eq("companyId", companyId);

    if (error && status !== 406) {
      throw error;
    }

    yield put(setFetchPatientChecklistSucceed(data || []));
  } catch (err) {
    yield put(setFetchPatientChecklistFailure(err));
    TOAST?.error?.(`Patient checklist fetch failed: ${err.message || err.toString()}`);
  }
}

function* CreatePatientChecklist(rqst) {
  try {
    console.log("[CreatePatientChecklist]", rqst.payload);
    let { error } = yield supabaseClient
      .from("patient_checklists")
      .insert([rqst.payload], {
        returning: "minimal",
      });

    if (error) {
      console.log(`[create PatientChecklist] : ${error.toString()}`);
      yield put(
        setCreatePatientChecklistFailure(`[create PatientChecklist] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreatePatientChecklistSucceed({ success: true }));
  } catch (error) {
    console.log(`[create PatientChecklist] : ${error.toString()}`);
    yield put(
      setCreatePatientChecklistFailure(`[create PatientChecklist] : ${error.toString()}`)
    );
  }
}

function* UpdatePatientChecklist(rqst) {
  try {
    console.log("[UpdatePatientChecklist]", rqst.payload);
    let { error } = yield supabaseClient
      .from("patient_checklists")
      .update(rqst.payload)
      .eq("id", rqst.payload.id);

    if (error) {
      console.log(`[update PatientChecklist] : ${error.toString()}`);
      yield put(
        setUpdatePatientChecklistFailure(`[update PatientChecklist] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdatePatientChecklistSucceed({ success: true }));
  } catch (error) {
    console.log(`[update PatientChecklist] : ${error.toString()}`);
    yield put(
      setUpdatePatientChecklistFailure(`[update PatientChecklist] : ${error.toString()}`)
    );
  }
}

function* DeletePatientChecklist(rqst) {
  try {
    console.log("[DeletePatientChecklist]", rqst.payload);
    let { error } = yield supabaseClient
      .from("patient_checklists")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete PatientChecklist] : ${error.toString()}`);
      yield put(
        setDeletePatientChecklistFailure(`[delete PatientChecklist] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeletePatientChecklistSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete PatientChecklist] : ${error.toString()}`);
    yield put(
      setDeletePatientChecklistFailure(`[delete PatientChecklist] : ${error.toString()}`)
    );
  }
}

export default function* patientChecklistSagaWatcher() {
  yield takeLatest(
    PATIENT_CHECKLIST_ACTIONS.ATTEMPT_TO_FETCH_PATIENT_CHECKLIST,
    listPatientChecklist
  );
  yield takeLatest(
    PATIENT_CHECKLIST_ACTIONS.ATTEMPT_TO_CREATE_PATIENT_CHECKLIST,
    CreatePatientChecklist
  );
  yield takeLatest(
    PATIENT_CHECKLIST_ACTIONS.ATTEMPT_TO_UPDATE_PATIENT_CHECKLIST,
    UpdatePatientChecklist
  );
  yield takeLatest(
    PATIENT_CHECKLIST_ACTIONS.ATTEMPT_TO_DELETE_PATIENT_CHECKLIST,
    DeletePatientChecklist
  );
}
