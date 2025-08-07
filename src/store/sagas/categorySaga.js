// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  CATEGORY_ACTIONS,
  setCreateCategoryFailure,
  setCreateCategorySucceed,
  setDeleteCategoryFailure,
  setDeleteCategorySucceed,
  setFetchCategoryFailure,
  setFetchCategorySucceed,
  setUpdateCategoryFailure,
  setUpdateCategorySucceed,
} from "../actions/categoryAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listCategory(filter) {
  try {
    console.log("[Filter category]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("categories")
      .select()
      .eq("companyId", filter.payload.companyId);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchCategorySucceed(data));
    }
  } catch (error) {
    yield put(setFetchCategoryFailure(error));
    TOAST.error(`Category Failed:${error.toString()}`);
  }
}

function* createCategory(rqst) {
  try {
    console.log("[createCategorys]", rqst.payload);
    let { error } = yield supabaseClient
      .from("categories")
      .insert([rqst.payload], {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Category] : ${error.toString()}`);
      yield put(
        setCreateCategoryFailure(`[create Category] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreateCategorySucceed({ success: true }));
  } catch (error) {
    console.log(`[create Category] : ${error.toString()}`);
    yield put(
      setCreateCategoryFailure(`[create Category] : ${error.toString()}`)
    );
  }
}

function* updateCategory(rqst) {
  try {
    console.log("[updateCategorys]", rqst.payload);
    let { error } = yield supabaseClient
      .from("categories")
      .upsert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[update Category] : ${error.toString()}`);
      yield put(
        setUpdateCategoryFailure(`[update Category] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdateCategorySucceed({ success: true }));
  } catch (error) {
    console.log(`[update Category] : ${error.toString()}`);
    yield put(
      setUpdateCategoryFailure(`[update Category] : ${error.toString()}`)
    );
  }
}

function* deleteCategory(rqst) {
  try {
    console.log("[updateCategorys]", rqst.payload);
    let { error } = yield supabaseClient
      .from("categories")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Category] : ${error.toString()}`);
      yield put(
        setDeleteCategoryFailure(`[delete Category] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeleteCategorySucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Category] : ${error.toString()}`);
    yield put(
      setDeleteCategoryFailure(`[delete category] : ${error.toString()}`)
    );
  }
}

function* categorySagaWatcher<T>(): Iterable<T> {
  yield takeEvery(CATEGORY_ACTIONS.ATTEMPT_TO_FETCH_CATEGORY, listCategory);
  yield takeLatest(CATEGORY_ACTIONS.ATTEMPT_TO_CREATE_CATEGORY, createCategory);
  yield takeLatest(CATEGORY_ACTIONS.ATTEMPT_TO_UPDATE_CATEGORY, updateCategory);
  yield takeLatest(CATEGORY_ACTIONS.ATTEMPT_TO_DELETE_CATEGORY, deleteCategory);
}

export default categorySagaWatcher;
