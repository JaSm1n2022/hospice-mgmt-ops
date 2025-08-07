// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  SUBCATEGORY_ACTIONS,
  setCreateSubCategoryFailure,
  setCreateSubCategorySucceed,
  setDeleteSubCategoryFailure,
  setDeleteSubCategorySucceed,
  setFetchSubCategoryFailure,
  setFetchSubCategorySucceed,
  setUpdateSubCategoryFailure,
  setUpdateSubCategorySucceed,
} from "../actions/subCategoryAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listSubCategory(filter) {
  try {
    console.log("[Filter subcategory]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("subcategories")
      .select()
      .eq("companyId", filter.payload.companyId);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchSubCategorySucceed(data));
    }
  } catch (error) {
    yield put(setFetchSubCategoryFailure(error));
    TOAST.error(`SubCategory Failed:${error.toString()}`);
  }
}

function* createSubCategory(rqst) {
  try {
    console.log("[createSubCategorys]", rqst.payload);
    let { error } = yield supabaseClient
      .from("subcategories")
      .insert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create SubCategory] : ${error.toString()}`);
      yield put(
        setCreateSubCategoryFailure(
          `[create SubCategory] : ${error.toString()}`
        )
      );
      throw error;
    }
    yield put(setCreateSubCategorySucceed({ success: true }));
  } catch (error) {
    console.log(`[create SubCategory] : ${error.toString()}`);
    yield put(
      setCreateSubCategoryFailure(`[create SubCategory] : ${error.toString()}`)
    );
  }
}

function* updateSubCategory(rqst) {
  try {
    console.log("[updateSubCategorys]", rqst.payload);
    let { error } = yield supabaseClient
      .from("subcategories")
      .upsert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[update SubCategory] : ${error.toString()}`);
      yield put(
        setUpdateSubCategoryFailure(
          `[update SubCategory] : ${error.toString()}`
        )
      );
      throw error;
    }
    yield put(setUpdateSubCategorySucceed({ success: true }));
  } catch (error) {
    console.log(`[update SubCategory] : ${error.toString()}`);
    yield put(
      setUpdateSubCategoryFailure(`[update SubCategory] : ${error.toString()}`)
    );
  }
}

function* deleteSubCategory(rqst) {
  try {
    console.log("[updateSubCategorys]", rqst.payload);
    let { error } = yield supabaseClient
      .from("subcategories")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete SubCategory] : ${error.toString()}`);
      yield put(
        setDeleteSubCategoryFailure(
          `[delete SubCategory] : ${error.toString()}`
        )
      );
      throw error;
    }
    yield put(setDeleteSubCategorySucceed({ success: true }));
  } catch (error) {
    console.log(`[delete SubCategory] : ${error.toString()}`);
    yield put(
      setDeleteSubCategoryFailure(`[delete subcategory] : ${error.toString()}`)
    );
  }
}

function* subcategorySagaWatcher<T>(): Iterable<T> {
  yield takeEvery(
    SUBCATEGORY_ACTIONS.ATTEMPT_TO_FETCH_SUBCATEGORY,
    listSubCategory
  );
  yield takeLatest(
    SUBCATEGORY_ACTIONS.ATTEMPT_TO_CREATE_SUBCATEGORY,
    createSubCategory
  );
  yield takeLatest(
    SUBCATEGORY_ACTIONS.ATTEMPT_TO_UPDATE_SUBCATEGORY,
    updateSubCategory
  );
  yield takeLatest(
    SUBCATEGORY_ACTIONS.ATTEMPT_TO_DELETE_SUBCATEGORY,
    deleteSubCategory
  );
}

export default subcategorySagaWatcher;
