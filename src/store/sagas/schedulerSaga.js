import { call, put, takeLatest } from "redux-saga/effects";
import { supabaseClient } from "config/SupabaseClient";
import {
  FETCH_SCHEDULER_REQUESTING,
  fetchSchedulerSuccess,
  fetchSchedulerError,
  CREATE_SCHEDULER_REQUESTING,
  createSchedulerSuccess,
  createSchedulerError,
  UPDATE_SCHEDULER_REQUESTING,
  updateSchedulerSuccess,
  updateSchedulerError,
  DELETE_SCHEDULER_REQUESTING,
  deleteSchedulerSuccess,
  deleteSchedulerError,
} from "../actions/schedulerAction";

// Fetch Scheduler
function* fetchSchedulerSaga(action) {
  try {
    const { companyId } = action.data;
    const { data, error } = yield call(
      [supabaseClient, "from"],
      "scheduler"
    );

    if (error) throw error;

    const query = data
      .select("*")
      .eq("companyId", companyId)
      .order("scheduled_dt", { ascending: false });

    const { data: schedulers, error: fetchError } = yield call([query, "then"]);

    if (fetchError) throw fetchError;

    yield put(fetchSchedulerSuccess(schedulers || []));
  } catch (error) {
    console.error("Error fetching schedulers:", error);
    yield put(fetchSchedulerError(error.message));
  }
}

// Create Scheduler
function* createSchedulerSaga(action) {
  try {
    const payload = action.data;
    const { data, error } = yield call(
      [supabaseClient, "from"],
      "scheduler"
    );

    if (error) throw error;

    const { data: newScheduler, error: insertError } = yield call(
      [data.insert([payload]), "then"]
    );

    if (insertError) throw insertError;

    yield put(createSchedulerSuccess(newScheduler));
  } catch (error) {
    console.error("Error creating scheduler:", error);
    yield put(createSchedulerError(error.message));
  }
}

// Update Scheduler
function* updateSchedulerSaga(action) {
  try {
    const payload = action.data;
    const { id, ...updateData } = payload;

    updateData.updated_at = new Date();

    const { data, error } = yield call(
      [supabaseClient, "from"],
      "scheduler"
    );

    if (error) throw error;

    const { data: updatedScheduler, error: updateError } = yield call(
      [data.update(updateData).eq("id", id), "then"]
    );

    if (updateError) throw updateError;

    yield put(updateSchedulerSuccess(updatedScheduler));
  } catch (error) {
    console.error("Error updating scheduler:", error);
    yield put(updateSchedulerError(error.message));
  }
}

// Delete Scheduler
function* deleteSchedulerSaga(action) {
  try {
    const id = action.data;
    const { data, error } = yield call(
      [supabaseClient, "from"],
      "scheduler"
    );

    if (error) throw error;

    const { data: deletedScheduler, error: deleteError } = yield call(
      [data.delete().eq("id", id), "then"]
    );

    if (deleteError) throw deleteError;

    yield put(deleteSchedulerSuccess(deletedScheduler));
  } catch (error) {
    console.error("Error deleting scheduler:", error);
    yield put(deleteSchedulerError(error.message));
  }
}

export default function* schedulerSaga() {
  yield takeLatest(FETCH_SCHEDULER_REQUESTING, fetchSchedulerSaga);
  yield takeLatest(CREATE_SCHEDULER_REQUESTING, createSchedulerSaga);
  yield takeLatest(UPDATE_SCHEDULER_REQUESTING, updateSchedulerSaga);
  yield takeLatest(DELETE_SCHEDULER_REQUESTING, deleteSchedulerSaga);
}
