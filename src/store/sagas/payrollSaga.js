// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  PAYROLL_ACTIONS,
  setCreatePayrollFailure,
  setCreatePayrollSucceed,
  setDeletePayrollFailure,
  setDeletePayrollSucceed,
  setFetchPayrollFailure,
  setFetchPayrollSucceed,
  setUpdatePayrollFailure,
  setUpdatePayrollSucceed,
} from "../actions/payrollAction";
import { supabaseClient } from "../../config/SupabaseClient";
function* standardQuery(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("payrolls")
      .select()
      .gte("payDate", `${filter.payload.from} 00:00`)
      .lt("payDate", `${filter.payload.to} 23:59`)
      .eq("companyId", filter.payload.companyId)
      .order("payDate", { ascending: false });

    if (error && status !== 406) {
      console.log(`error${error.toString()}`);
      throw error;
    }

    if (data) {
      yield put(setFetchPayrollSucceed(data));
    }
  } catch (error) {
    yield put(setFetchPayrollFailure(error));
    TOAST.error(`Payroll Failed:${error.toString()}`);
  }
}

function* listPayroll(filter) {
  console.log("[List Payroll", filter);

  yield standardQuery(filter);
}

function* CreatePayroll(rqst) {
  try {
    console.log("[CreatePayrolls]", rqst.payload);
    let { error } = yield supabaseClient.from("payrolls").insert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[create Payroll] : ${error.toString()}`);
      yield put(
        setCreatePayrollFailure(`[create Payroll] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreatePayrollSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Payroll] : ${error.toString()}`);
    yield put(
      setCreatePayrollFailure(`[create Payroll] : ${error.toString()}`)
    );
  }
}

function* UpdatePayroll(rqst) {
  try {
    console.log("[UpdatePayrolls]", rqst.payload);
    let { error } = yield supabaseClient.from("payrolls").upsert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[update Payroll] : ${error.toString()}`);
      yield put(
        setUpdatePayrollFailure(`[update Payroll] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdatePayrollSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Payroll] : ${error.toString()}`);
    yield put(
      setUpdatePayrollFailure(`[update Payroll] : ${error.toString()}`)
    );
  }
}

function* DeletePayroll(rqst) {
  try {
    console.log("[UpdatePayrolls]", rqst.payload);
    let { error } = yield supabaseClient
      .from("payrolls")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Payroll] : ${error.toString()}`);
      yield put(
        setDeletePayrollFailure(`[delete Payroll] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeletePayrollSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Payroll] : ${error.toString()}`);
    yield put(
      setDeletePayrollFailure(`[delete Payroll] : ${error.toString()}`)
    );
  }
}

function* payrollsagaWatcher<T>(): Iterable<T> {
  yield takeEvery(PAYROLL_ACTIONS.ATTEMPT_TO_FETCH_PAYROLL, listPayroll);
  yield takeLatest(PAYROLL_ACTIONS.ATTEMPT_TO_CREATE_PAYROLL, CreatePayroll);
  yield takeLatest(PAYROLL_ACTIONS.ATTEMPT_TO_UPDATE_PAYROLL, UpdatePayroll);
  yield takeLatest(PAYROLL_ACTIONS.ATTEMPT_TO_DELETE_PAYROLL, DeletePayroll);
}

export default payrollsagaWatcher;
