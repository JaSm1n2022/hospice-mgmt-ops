// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  ASSIGNMENT_ACTIONS,
  setCreateAssignmentFailure,
  setCreateAssignmentSucceed,
  setDeleteAssignmentFailure,
  setDeleteAssignmentSucceed,
  setFetchAssignmentFailure,
  setFetchAssignmentSucceed,
  setUpdateAssignmentFailure,
  setUpdateAssignmentSucceed,
} from "../actions/assignmentAction";
import { supabaseClient } from "../../config/SupabaseClient";

export function* listAssignment(action) {
  try {
    const { companyId, discipline } = action.payload || {};

    if (!companyId) {
      throw new Error("companyId is required");
    }

    // Build the query
    let query = supabaseClient
      .from("assignments")
      .select("*")
      .eq("companyId", companyId);

    if (discipline) {
      query = query.contains("disciplines", [discipline]);
    }

    // Execute the query
    const { data, error, status } = yield query;

    if (error && status !== 406) {
      throw error;
    }

    yield put(setFetchAssignmentSucceed(data || []));
  } catch (err) {
    yield put(setFetchAssignmentFailure(err));
    TOAST?.error?.(`Employee fetch failed: ${err.message || err.toString()}`);
  }
}

function* CreateAssignment(rqst) {
  try {
    console.log("[CreateAssignments]", rqst.payload);
    let { error } = yield supabaseClient
      .from("assignments")
      .insert([rqst.payload], {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Assignment] : ${error.toString()}`);
      yield put(
        setCreateAssignmentFailure(`[create Assignment] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreateAssignmentSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Assignment] : ${error.toString()}`);
    yield put(
      setCreateAssignmentFailure(`[create assignment] : ${error.toString()}`)
    );
  }
}

function* UpdateAssignment(rqst) {
  try {
    console.log("[UpdateAssignments]", rqst.payload);
    let { error } = yield supabaseClient
      .from("assignments")
      .upsert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[update Assignment] : ${error.toString()}`);
      yield put(
        setUpdateAssignmentFailure(`[update Assignment] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdateAssignmentSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Assignment] : ${error.toString()}`);
    yield put(
      setUpdateAssignmentFailure(`[update Assignment] : ${error.toString()}`)
    );
  }
}

function* DeleteAssignment(rqst) {
  try {
    console.log("[UpdateAssignments]", rqst.payload);
    let { error } = yield supabaseClient
      .from("assignments")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Assignment] : ${error.toString()}`);
      yield put(
        setDeleteAssignmentFailure(`[delete Assignment] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeleteAssignmentSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Assignment] : ${error.toString()}`);
    yield put(
      setDeleteAssignmentFailure(`[delete Assignment] : ${error.toString()}`)
    );
  }
}

function* assignmentSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(
    ASSIGNMENT_ACTIONS.ATTEMPT_TO_FETCH_ASSIGNMENT,
    listAssignment
  );
  yield takeLatest(
    ASSIGNMENT_ACTIONS.ATTEMPT_TO_CREATE_ASSIGNMENT,
    CreateAssignment
  );
  yield takeLatest(
    ASSIGNMENT_ACTIONS.ATTEMPT_TO_UPDATE_ASSIGNMENT,
    UpdateAssignment
  );
  yield takeLatest(
    ASSIGNMENT_ACTIONS.ATTEMPT_TO_DELETE_ASSIGNMENT,
    DeleteAssignment
  );
}

export default assignmentSagaWatcher;
