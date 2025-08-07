// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  TRAINING_ACTIONS,
  setCreateTrainingFailure,
  setCreateTrainingSucceed,
  setDeleteTrainingFailure,
  setDeleteTrainingSucceed,
  setFetchTrainingFailure,
  setFetchTrainingSucceed,
  setUpdateTrainingFailure,
  setUpdateTrainingSucceed,
} from "../actions/trainingAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listTraining(filter) {
  try {
    console.log("[Filter training]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("trainings")
      .select()
      .eq("companyId", filter.payload.companyId)
      .gte("created_at", `${filter.payload.from} 00:00`)
      .lt("created_at", `${filter.payload.to} 23:59`);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchTrainingSucceed(data));
    }
  } catch (error) {
    yield put(setFetchTrainingFailure(error));
    TOAST.error(`Training Failed:${error.toString()}`);
  }
}

function* createTraining(rqst) {
  try {
    console.log("[createTrainings]", rqst.payload);
    let { error } = yield supabaseClient
      .from("trainings")
      .insert([rqst.payload], {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Training] : ${error.toString()}`);
      yield put(
        setCreateTrainingFailure(`[create Training] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreateTrainingSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Training] : ${error.toString()}`);
    yield put(
      setCreateTrainingFailure(`[create Training] : ${error.toString()}`)
    );
  }
}

function* updateTraining(rqst) {
  try {
    console.log("[updateTrainings]", rqst.payload);
    let { error } = yield supabaseClient
      .from("trainings")
      .upsert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[update Training] : ${error.toString()}`);
      yield put(
        setUpdateTrainingFailure(`[update Training] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdateTrainingSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Training] : ${error.toString()}`);
    yield put(
      setUpdateTrainingFailure(`[update Training] : ${error.toString()}`)
    );
  }
}

function* deleteTraining(rqst) {
  try {
    console.log("[updateTrainings]", rqst.payload);
    let { error } = yield supabaseClient
      .from("trainings")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Training] : ${error.toString()}`);
      yield put(
        setDeleteTrainingFailure(`[delete Training] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeleteTrainingSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Training] : ${error.toString()}`);
    yield put(
      setDeleteTrainingFailure(`[delete training] : ${error.toString()}`)
    );
  }
}

function* trainingSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(TRAINING_ACTIONS.ATTEMPT_TO_FETCH_TRAINING, listTraining);
  yield takeLatest(TRAINING_ACTIONS.ATTEMPT_TO_CREATE_TRAINING, createTraining);
  yield takeLatest(TRAINING_ACTIONS.ATTEMPT_TO_UPDATE_TRAINING, updateTraining);
  yield takeLatest(TRAINING_ACTIONS.ATTEMPT_TO_DELETE_TRAINING, deleteTraining);
}

export default trainingSagaWatcher;
