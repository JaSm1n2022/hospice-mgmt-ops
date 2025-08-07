// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  TASKS_ACTIONS,
  setCreateTasksFailure,
  setCreateTasksSucceed,
  setDeleteTasksFailure,
  setDeleteTasksSucceed,
  setFetchTasksFailure,
  setFetchTasksSucceed,
  setUpdateTasksFailure,
  setUpdateTasksSucceed,
} from "../actions/tasksAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listTasks(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("tasks")
      .select()
      .eq("companyId", filter.payload.companyId)
      .gte("assignedDt", `${filter.payload.from} 00:00`)
      .lt("assignedDt", `${filter.payload.to} 23:59`);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchTasksSucceed(data));
    }
  } catch (error) {
    yield put(setFetchTasksFailure(error));
    TOAST.error(`Tasks Failed:${error.toString()}`);
  }
}

function* createTasks(rqst) {
  try {
    console.log("[CreateTaskss]", rqst.payload);
    let { error } = yield supabaseClient.from("tasks").insert([rqst.payload], {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[create Tasks] : ${error.toString()}`);
      yield put(setCreateTasksFailure(`[create Tasks] : ${error.toString()}`));
      throw error;
    }
    yield put(setCreateTasksSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Tasks] : ${error.toString()}`);
    yield put(setCreateTasksFailure(`[create tasks] : ${error.toString()}`));
  }
}

function* updateTasks(rqst) {
  try {
    console.log("[UpdateTaskss]", rqst.payload);
    let { error } = yield supabaseClient.from("tasks").upsert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[update Tasks] : ${error.toString()}`);
      yield put(setUpdateTasksFailure(`[update Tasks] : ${error.toString()}`));
      throw error;
    }
    yield put(setUpdateTasksSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Tasks] : ${error.toString()}`);
    yield put(setUpdateTasksFailure(`[update Tasks] : ${error.toString()}`));
  }
}

function* deleteTasks(rqst) {
  try {
    console.log("[UpdateTaskss]", rqst.payload);
    let { error } = yield supabaseClient
      .from("tasks")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Tasks] : ${error.toString()}`);
      yield put(setDeleteTasksFailure(`[delete Tasks] : ${error.toString()}`));
      throw error;
    }
    yield put(setDeleteTasksSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Tasks] : ${error.toString()}`);
    yield put(setDeleteTasksFailure(`[delete Tasks] : ${error.toString()}`));
  }
}

function* tasksSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(TASKS_ACTIONS.ATTEMPT_TO_FETCH_TASKS, listTasks);
  yield takeLatest(TASKS_ACTIONS.ATTEMPT_TO_CREATE_TASKS, createTasks);
  yield takeLatest(TASKS_ACTIONS.ATTEMPT_TO_UPDATE_TASKS, updateTasks);
  yield takeLatest(TASKS_ACTIONS.ATTEMPT_TO_DELETE_TASKS, deleteTasks);
}

export default tasksSagaWatcher;
