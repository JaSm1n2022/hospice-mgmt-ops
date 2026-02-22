// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  EMPLOYEE_CHECKLIST_ACTIONS,
  setCreateEmployeeChecklistFailure,
  setCreateEmployeeChecklistSucceed,
  setDeleteEmployeeChecklistFailure,
  setDeleteEmployeeChecklistSucceed,
  setFetchEmployeeChecklistFailure,
  setFetchEmployeeChecklistSucceed,
  setUpdateEmployeeChecklistFailure,
  setUpdateEmployeeChecklistSucceed,
} from "../actions/employeeChecklistAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listEmployeeChecklist(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("employee_checklist")
      .select()
      .eq("companyId", filter.payload.companyId);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got employee checklists]", data);
      yield put(setFetchEmployeeChecklistSucceed(data));
    }
  } catch (error) {
    yield put(setFetchEmployeeChecklistFailure(error));
    TOAST.error(`Employee Checklist Fetch Failed:${error.toString()}`);
  }
}

function* createEmployeeChecklist(rqst) {
  try {
    console.log("[CreateEmployeeChecklist]", rqst.payload);
    let { error } = yield supabaseClient
      .from("employee_checklist")
      .insert([rqst.payload], {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Employee Checklist] : ${error.toString()}`);
      yield put(
        setCreateEmployeeChecklistFailure(`[create Employee Checklist] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreateEmployeeChecklistSucceed({ success: true }));
    TOAST.success("Employee Checklist created successfully");
  } catch (error) {
    console.log(`[create Employee Checklist] : ${error.toString()}`);
    yield put(
      setCreateEmployeeChecklistFailure(`[create Employee Checklist] : ${error.toString()}`)
    );
  }
}

function* updateEmployeeChecklist(rqst) {
  try {
    console.log("[UpdateEmployeeChecklist]", rqst.payload);
    let { error } = yield supabaseClient.from("employee_checklist").upsert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[update Employee Checklist] : ${error.toString()}`);
      yield put(
        setUpdateEmployeeChecklistFailure(`[update Employee Checklist] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdateEmployeeChecklistSucceed({ success: true }));
    TOAST.success("Employee Checklist updated successfully");
  } catch (error) {
    console.log(`[update Employee Checklist] : ${error.toString()}`);
    yield put(
      setUpdateEmployeeChecklistFailure(`[update Employee Checklist] : ${error.toString()}`)
    );
  }
}

function* deleteEmployeeChecklist(rqst) {
  try {
    console.log("[DeleteEmployeeChecklist]", rqst.payload);
    let { error } = yield supabaseClient
      .from("employee_checklist")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Employee Checklist] : ${error.toString()}`);
      yield put(
        setDeleteEmployeeChecklistFailure(`[delete Employee Checklist] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeleteEmployeeChecklistSucceed({ success: true }));
    TOAST.success("Employee Checklist deleted successfully");
  } catch (error) {
    console.log(`[delete Employee Checklist] : ${error.toString()}`);
    yield put(
      setDeleteEmployeeChecklistFailure(`[delete Employee Checklist] : ${error.toString()}`)
    );
  }
}

function* employeeChecklistSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(EMPLOYEE_CHECKLIST_ACTIONS.ATTEMPT_TO_FETCH_EMPLOYEE_CHECKLIST, listEmployeeChecklist);
  yield takeLatest(EMPLOYEE_CHECKLIST_ACTIONS.ATTEMPT_TO_CREATE_EMPLOYEE_CHECKLIST, createEmployeeChecklist);
  yield takeLatest(EMPLOYEE_CHECKLIST_ACTIONS.ATTEMPT_TO_UPDATE_EMPLOYEE_CHECKLIST, updateEmployeeChecklist);
  yield takeLatest(EMPLOYEE_CHECKLIST_ACTIONS.ATTEMPT_TO_DELETE_EMPLOYEE_CHECKLIST, deleteEmployeeChecklist);
}

export default employeeChecklistSagaWatcher;
