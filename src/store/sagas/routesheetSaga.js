// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  ROUTESHEET_ACTIONS,
  setCreateRoutesheetFailure,
  setCreateRoutesheetSucceed,
  setDeleteRoutesheetFailure,
  setDeleteRoutesheetSucceed,
  setFetchRoutesheetFailure,
  setFetchRoutesheetSucceed,
  setUpdateRoutesheetFailure,
  setUpdateRoutesheetSucceed,
} from "../actions/routesheetAction";
import { supabaseClient } from "../../config/SupabaseClient";
export function* listRoutesheet(action) {
  try {
    const { companyId, discipline } = action.payload || {};

    if (!companyId) {
      throw new Error("companyId is required");
    }

    // Build the query
    let query = supabaseClient
      .from("routesheets")
      .select("*")
      .eq("companyId", companyId)
      .gte("dosStart", `${action.payload.from} 00:00`)
      .lt("dosStart", `${action.payload.to} 23:59`);

    if (discipline) {
      query = query.eq("requestorId", discipline); // fixed the ":" bug
    }

    // Execute the query
    const { data, error, status } = yield query;

    if (error && status !== 406) {
      throw error;
    }

    yield put(setFetchRoutesheetSucceed(data || []));
  } catch (err) {
    yield put(setFetchRoutesheetFailure(err));
    TOAST?.error?.(`Routesheet fetch failed: ${err.message || err.toString()}`);
  }
}

function* createRoutesheet(rqst) {
  try {
    console.log("[createRoutesheets]", rqst.payload);
    let { error } = yield supabaseClient
      .from("routesheets")
      .insert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Routesheet] : ${error.toString()}`);
      yield put(
        setCreateRoutesheetFailure(`[create Routesheet] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreateRoutesheetSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Routesheet] : ${error.toString()}`);
    yield put(
      setCreateRoutesheetFailure(`[create Routesheet] : ${error.toString()}`)
    );
  }
}

function* updateRoutesheet(rqst) {
  try {
    console.log("[updateRoutesheets]", rqst.payload);
    let { error } = yield supabaseClient
      .from("routesheets")
      .upsert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[update Routesheet] : ${error.toString()}`);
      yield put(
        setUpdateRoutesheetFailure(`[update Routesheet] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdateRoutesheetSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Routesheet] : ${error.toString()}`);
    yield put(
      setUpdateRoutesheetFailure(`[update Routesheet] : ${error.toString()}`)
    );
  }
}

function* deleteRoutesheet(rqst) {
  try {
    console.log("[updateRoutesheets]", rqst.payload);
    let { error } = yield supabaseClient
      .from("routesheets")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Routesheet] : ${error.toString()}`);
      yield put(
        setDeleteRoutesheetFailure(`[delete Routesheet] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeleteRoutesheetSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Routesheet] : ${error.toString()}`);
    yield put(
      setDeleteRoutesheetFailure(`[delete routesheet] : ${error.toString()}`)
    );
  }
}

function* routesheetSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(
    ROUTESHEET_ACTIONS.ATTEMPT_TO_FETCH_ROUTESHEET,
    listRoutesheet
  );
  yield takeLatest(
    ROUTESHEET_ACTIONS.ATTEMPT_TO_CREATE_ROUTESHEET,
    createRoutesheet
  );
  yield takeLatest(
    ROUTESHEET_ACTIONS.ATTEMPT_TO_UPDATE_ROUTESHEET,
    updateRoutesheet
  );
  yield takeLatest(
    ROUTESHEET_ACTIONS.ATTEMPT_TO_DELETE_ROUTESHEET,
    deleteRoutesheet
  );
}

export default routesheetSagaWatcher;
