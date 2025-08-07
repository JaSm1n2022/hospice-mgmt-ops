// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  CERTIFICATION_ACTIONS,
  setCreateCertificationFailure,
  setCreateCertificationSucceed,
  setDeleteCertificationFailure,
  setDeleteCertificationSucceed,
  setFetchCertificationFailure,
  setFetchCertificationSucceed,
  setUpdateCertificationFailure,
  setUpdateCertificationSucceed,
} from "../actions/certificationAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listCertification(filter) {
  try {
    console.log("[Filter certification]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("certifications")
      .select()
      .eq("companyId", filter.payload.companyId)
      .eq("id", filter.payload.id);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchCertificationSucceed(data));
    }
  } catch (error) {
    yield put(setFetchCertificationFailure(error));
    TOAST.error(`Certification Failed:${error.toString()}`);
  }
}

function* createCertification(rqst) {
  try {
    console.log("[createCertifications]", rqst.payload);
    let { error } = yield supabaseClient
      .from("certifications")
      .insert([rqst.payload], {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Certification] : ${error.toString()}`);
      yield put(
        setCreateCertificationFailure(
          `[create Certification] : ${error.toString()}`
        )
      );
      throw error;
    }
    yield put(setCreateCertificationSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Certification] : ${error.toString()}`);
    yield put(
      setCreateCertificationFailure(
        `[create Certification] : ${error.toString()}`
      )
    );
  }
}

function* updateCertification(rqst) {
  try {
    console.log("[updateCertifications]", rqst.payload);
    let { error } = yield supabaseClient
      .from("certifications")
      .upsert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[update Certification] : ${error.toString()}`);
      yield put(
        setUpdateCertificationFailure(
          `[update Certification] : ${error.toString()}`
        )
      );
      throw error;
    }
    yield put(setUpdateCertificationSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Certification] : ${error.toString()}`);
    yield put(
      setUpdateCertificationFailure(
        `[update Certification] : ${error.toString()}`
      )
    );
  }
}

function* deleteCertification(rqst) {
  try {
    console.log("[updateCertifications]", rqst.payload);
    let { error } = yield supabaseClient
      .from("certifications")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Certification] : ${error.toString()}`);
      yield put(
        setDeleteCertificationFailure(
          `[delete Certification] : ${error.toString()}`
        )
      );
      throw error;
    }
    yield put(setDeleteCertificationSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Certification] : ${error.toString()}`);
    yield put(
      setDeleteCertificationFailure(
        `[delete certification] : ${error.toString()}`
      )
    );
  }
}

function* certificationSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(
    CERTIFICATION_ACTIONS.ATTEMPT_TO_FETCH_CERTIFICATION,
    listCertification
  );
  yield takeLatest(
    CERTIFICATION_ACTIONS.ATTEMPT_TO_CREATE_CERTIFICATION,
    createCertification
  );
  yield takeLatest(
    CERTIFICATION_ACTIONS.ATTEMPT_TO_UPDATE_CERTIFICATION,
    updateCertification
  );
  yield takeLatest(
    CERTIFICATION_ACTIONS.ATTEMPT_TO_DELETE_CERTIFICATION,
    deleteCertification
  );
}

export default certificationSagaWatcher;
