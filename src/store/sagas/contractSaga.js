// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  CONTRACT_ACTIONS,
  setCreateContractFailure,
  setCreateContractSucceed,
  setDeleteContractFailure,
  setDeleteContractSucceed,
  setFetchContractFailure,
  setFetchContractSucceed,
  setUpdateContractFailure,
  setUpdateContractSucceed,
} from "../actions/contractAction";
import { supabaseClient } from "../../config/SupabaseClient";
function* standardQuery(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("contracts")
      .select()
      .eq("companyId", filter.payload.companyId)
      .order("employeeName", { ascending: false });

    if (error && status !== 406) {
      console.log(`error${error.toString()}`);
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchContractSucceed(data));
    }
  } catch (error) {
    yield put(setFetchContractFailure(error));
    TOAST.error(`Contract Failed:${error.toString()}`);
  }
}

function* listContract(action) {
  try {
    const { companyId, discipline, patientIds } = action.payload || {};

    if (!companyId) {
      throw new Error("companyId is required");
    }

    // Build the query
    let query = supabaseClient
      .from("contracts")
      .select("*")
      .eq("companyId", companyId);

    if (discipline) {
      query = query.eq("employeeId", discipline); // fixed the ":" bug
    }
    if (patientIds?.length > 0) {
      query = query.in("patientCd", patientIds);
    }
    query = query.order("employeeName", { ascending: false });
    // Execute the query
    const { data, error, status } = yield query;

    if (error && status !== 406) {
      throw error;
    }

    yield put(setFetchContractSucceed(data || []));
  } catch (err) {
    yield put(setFetchContractFailure(err));
    TOAST?.error?.(`Employee fetch failed: ${err.message || err.toString()}`);
  }
}

function* CreateContract(rqst) {
  try {
    console.log("[CreateContracts]", rqst.payload);
    let { error } = yield supabaseClient
      .from("contracts")
      .insert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Contract] : ${error.toString()}`);
      yield put(
        setCreateContractFailure(`[create Contract] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreateContractSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Contract] : ${error.toString()}`);
    yield put(
      setCreateContractFailure(`[create Contract] : ${error.toString()}`)
    );
  }
}

function* UpdateContract(rqst) {
  try {
    console.log("[UpdateContracts]", rqst.payload);
    let { error } = yield supabaseClient
      .from("contracts")
      .upsert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[update Contract] : ${error.toString()}`);
      yield put(
        setUpdateContractFailure(`[update Contract] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdateContractSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Contract] : ${error.toString()}`);
    yield put(
      setUpdateContractFailure(`[update Contract] : ${error.toString()}`)
    );
  }
}

function* DeleteContract(rqst) {
  try {
    console.log("[UpdateContracts]", rqst.payload);
    let { error } = yield supabaseClient
      .from("contracts")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Contract] : ${error.toString()}`);
      yield put(
        setDeleteContractFailure(`[delete Contract] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeleteContractSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Contract] : ${error.toString()}`);
    yield put(
      setDeleteContractFailure(`[delete Contract] : ${error.toString()}`)
    );
  }
}

function* contractsagaWatcher<T>(): Iterable<T> {
  yield takeEvery(CONTRACT_ACTIONS.ATTEMPT_TO_FETCH_CONTRACT, listContract);
  yield takeLatest(CONTRACT_ACTIONS.ATTEMPT_TO_CREATE_CONTRACT, CreateContract);
  yield takeLatest(CONTRACT_ACTIONS.ATTEMPT_TO_UPDATE_CONTRACT, UpdateContract);
  yield takeLatest(CONTRACT_ACTIONS.ATTEMPT_TO_DELETE_CONTRACT, DeleteContract);
}

export default contractsagaWatcher;
