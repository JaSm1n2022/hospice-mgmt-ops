// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  TRANSPORTATION_ACTIONS,
  setCreateTransportationFailure,
  setCreateTransportationSucceed,
  setDeleteTransportationFailure,
  setDeleteTransportationSucceed,
  setFetchTransportationFailure,
  setFetchTransportationSucceed,
  setUpdateTransportationFailure,
  setUpdateTransportationSucceed,
} from "../actions/transportationAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listTransportation(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("transportations")
      .select()
      .eq("companyId", filter.payload.companyId);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchTransportationSucceed(data));
    }
  } catch (error) {
    yield put(setFetchTransportationFailure(error));
    TOAST.error(`Transportation Failed:${error.toString()}`);
  }
}

function* createTransportation(rqst) {
  try {
    console.log("[CreateTransportations]", rqst.payload);
    let { error } = yield supabaseClient
      .from("transportations")
      .insert([rqst.payload], {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Transportation] : ${error.toString()}`);
      yield put(
        setCreateTransportationFailure(
          `[create Transportation] : ${error.toString()}`
        )
      );
      throw error;
    }
    yield put(setCreateTransportationSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Transportation] : ${error.toString()}`);
    yield put(
      setCreateTransportationFailure(
        `[create transportation] : ${error.toString()}`
      )
    );
  }
}

function* updateTransportation(rqst) {
  try {
    console.log("[UpdateTransportations]", rqst.payload);
    let { error } = yield supabaseClient
      .from("transportations")
      .upsert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[update Transportation] : ${error.toString()}`);
      yield put(
        setUpdateTransportationFailure(
          `[update Transportation] : ${error.toString()}`
        )
      );
      throw error;
    }
    yield put(setUpdateTransportationSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Transportation] : ${error.toString()}`);
    yield put(
      setUpdateTransportationFailure(
        `[update Transportation] : ${error.toString()}`
      )
    );
  }
}

function* deleteTransportation(rqst) {
  try {
    console.log("[UpdateTransportations]", rqst.payload);
    let { error } = yield supabaseClient
      .from("transportations")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Transportation] : ${error.toString()}`);
      yield put(
        setDeleteTransportationFailure(
          `[delete Transportation] : ${error.toString()}`
        )
      );
      throw error;
    }
    yield put(setDeleteTransportationSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Transportation] : ${error.toString()}`);
    yield put(
      setDeleteTransportationFailure(
        `[delete Transportation] : ${error.toString()}`
      )
    );
  }
}

function* transportationSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(
    TRANSPORTATION_ACTIONS.ATTEMPT_TO_FETCH_TRANSPORTATION,
    listTransportation
  );
  yield takeLatest(
    TRANSPORTATION_ACTIONS.ATTEMPT_TO_CREATE_TRANSPORTATION,
    createTransportation
  );
  yield takeLatest(
    TRANSPORTATION_ACTIONS.ATTEMPT_TO_UPDATE_TRANSPORTATION,
    updateTransportation
  );
  yield takeLatest(
    TRANSPORTATION_ACTIONS.ATTEMPT_TO_DELETE_TRANSPORTATION,
    deleteTransportation
  );
}

export default transportationSagaWatcher;
