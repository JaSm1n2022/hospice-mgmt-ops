// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  PROFILE_ACTIONS,
  setCreateProfileFailure,
  setCreateProfileSucceed,
  setDeleteProfileFailure,
  setDeleteProfileSucceed,
  setFetchProfileFailure,
  setFetchProfileSucceed,
  setUpdateProfileFailure,
  setUpdateProfileSucceed,
} from "../actions/profileAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listProfile(filter) {
  try {
    console.log("[Filter profile]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("profiles")
      .select()
      .eq("username", filter.payload.email);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchProfileSucceed(data));
    }
  } catch (error) {
    yield put(setFetchProfileFailure(error));
    TOAST.error(`Profile Failed:${error.toString()}`);
  }
}

function* createProfile(rqst) {
  try {
    console.log("[createProfiles]", rqst.payload);
    let { error } = yield supabaseClient
      .from("profiles")
      .insert([rqst.payload], {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Profile] : ${error.toString()}`);
      yield put(
        setCreateProfileFailure(`[create Profile] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreateProfileSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Profile] : ${error.toString()}`);
    yield put(
      setCreateProfileFailure(`[create Profile] : ${error.toString()}`)
    );
  }
}

function* updateProfile(rqst) {
  try {
    console.log("[updateProfiles]", rqst.payload);
    let { error } = yield supabaseClient.from("profiles").upsert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[update Profile] : ${error.toString()}`);
      yield put(
        setUpdateProfileFailure(`[update Profile] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdateProfileSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Profile] : ${error.toString()}`);
    yield put(
      setUpdateProfileFailure(`[update Profile] : ${error.toString()}`)
    );
  }
}

function* deleteProfile(rqst) {
  try {
    console.log("[updateProfiles]", rqst.payload);
    let { error } = yield supabaseClient
      .from("profiles")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Profile] : ${error.toString()}`);
      yield put(
        setDeleteProfileFailure(`[delete Profile] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeleteProfileSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Profile] : ${error.toString()}`);
    yield put(
      setDeleteProfileFailure(`[delete profile] : ${error.toString()}`)
    );
  }
}

function* profileSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(PROFILE_ACTIONS.ATTEMPT_TO_FETCH_PROFILE, listProfile);
  yield takeLatest(PROFILE_ACTIONS.ATTEMPT_TO_CREATE_PROFILE, createProfile);
  yield takeLatest(PROFILE_ACTIONS.ATTEMPT_TO_UPDATE_PROFILE, updateProfile);
  yield takeLatest(PROFILE_ACTIONS.ATTEMPT_TO_DELETE_PROFILE, deleteProfile);
}

export default profileSagaWatcher;
