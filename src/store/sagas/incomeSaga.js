// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  INCOME_ACTIONS,
  setCreateIncomeFailure,
  setCreateIncomeSucceed,
  setDeleteIncomeFailure,
  setDeleteIncomeSucceed,
  setFetchIncomeFailure,
  setFetchIncomeSucceed,
  setUpdateIncomeFailure,
  setUpdateIncomeSucceed,
  setUploadFileFailure,
  setUploadFileSucceed,
  setFetchFilesFailure,
  setFetchFilesSucceed,
} from "../actions/incomeAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listIncome(filter) {
  try {
    console.log("[Income Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("income")
      .select()
      .eq("companyId", filter.payload.companyId)
      .order("date_paid", { ascending: false });

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[Income Data]", data);
      yield put(setFetchIncomeSucceed(data));
    }
  } catch (error) {
    yield put(setFetchIncomeFailure(error));
    TOAST.error(`Failed to load income: ${error.toString()}`);
  }
}

function* createIncome(rqst) {
  try {
    console.log("[Create Income]", rqst.payload);
    let { error } = yield supabaseClient.from("income").insert([rqst.payload], {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[create Income] : ${error.toString()}`);
      yield put(
        setCreateIncomeFailure(`[create Income] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreateIncomeSucceed({ success: true }));
    TOAST.ok("Income entry created successfully");
  } catch (error) {
    console.log(`[create Income2] : ${error.toString()}`);
    yield put(setCreateIncomeFailure(`[create income] : ${error.toString()}`));
    TOAST.error(`Failed to create income: ${error.toString()}`);
  }
}

function* updateIncome(rqst) {
  try {
    console.log("[Update Income]", rqst.payload);
    let { error } = yield supabaseClient.from("income").upsert(rqst.payload, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) {
      console.log(`[update Income] : ${error.toString()}`);
      yield put(
        setUpdateIncomeFailure(`[update Income] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdateIncomeSucceed({ success: true }));
    TOAST.ok("Income entry updated successfully");
  } catch (error) {
    console.log(`[update Income] : ${error.toString()}`);
    yield put(setUpdateIncomeFailure(`[update Income] : ${error.toString()}`));
    TOAST.error(`Failed to update income: ${error.toString()}`);
  }
}

function* deleteIncome(rqst) {
  try {
    console.log("[Delete Income]", rqst.payload);
    let { error } = yield supabaseClient
      .from("income")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Income] : ${error.toString()}`);
      yield put(
        setDeleteIncomeFailure(`[delete Income] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeleteIncomeSucceed({ success: true }));
    TOAST.ok("Income entry deleted successfully");
  } catch (error) {
    console.log(`[delete Income] : ${error.toString()}`);
    yield put(setDeleteIncomeFailure(`[delete Income] : ${error.toString()}`));
    TOAST.error(`Failed to delete income: ${error.toString()}`);
  }
}

function* uploadFile(rqst) {
  try {
    console.log("[Upload File]", rqst.payload);
    const { file, payor, fileType, payPeriod, companyId } = rqst.payload;

    // Generate unique filename
    const timestamp = new Date().getTime();
    const fileName = `${companyId}/${payPeriod}/${fileType}_${timestamp}_${file.name}`;

    // Upload file to Supabase storage
    const {
      data: uploadData,
      error: uploadError,
    } = yield supabaseClient.storage
      .from("income-files")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.log(`[upload File] : ${uploadError.toString()}`);
      yield put(
        setUploadFileFailure(`[upload File] : ${uploadError.toString()}`)
      );
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from("income-files")
      .getPublicUrl(fileName);

    // Save file metadata to database
    const fileMetadata = {
      companyId,
      payor,
      fileType,
      payPeriod,
      fileName: file.name,
      filePath: fileName,
      fileUrl: urlData.publicUrl,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    };

    let { error: dbError } = yield supabaseClient
      .from("income_files")
      .insert([fileMetadata], {
        returning: "minimal",
      });

    if (dbError) {
      console.log(`[save file metadata] : ${dbError.toString()}`);
      yield put(
        setUploadFileFailure(`[save file metadata] : ${dbError.toString()}`)
      );
      throw dbError;
    }

    yield put(
      setUploadFileSucceed({ success: true, fileUrl: urlData.publicUrl })
    );
    TOAST.ok(`File ${file.name} uploaded successfully`);
  } catch (error) {
    console.log(`[upload File] : ${error.toString()}`);
    yield put(setUploadFileFailure(`[upload File] : ${error.toString()}`));
    TOAST.error(`Failed to upload file: ${error.toString()}`);
  }
}

function* listFiles(filter) {
  try {
    console.log("[Files Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("income_files")
      .select()
      .eq("companyId", filter.payload.companyId)
      .order("uploadedAt", { ascending: false });

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[Files Data]", data);
      yield put(setFetchFilesSucceed(data));
    }
  } catch (error) {
    yield put(setFetchFilesFailure(error));
    TOAST.error(`Failed to load files: ${error.toString()}`);
  }
}

function* incomeSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(INCOME_ACTIONS.ATTEMPT_TO_FETCH_INCOME, listIncome);
  yield takeLatest(INCOME_ACTIONS.ATTEMPT_TO_CREATE_INCOME, createIncome);
  yield takeLatest(INCOME_ACTIONS.ATTEMPT_TO_UPDATE_INCOME, updateIncome);
  yield takeLatest(INCOME_ACTIONS.ATTEMPT_TO_DELETE_INCOME, deleteIncome);
  yield takeLatest(INCOME_ACTIONS.ATTEMPT_TO_UPLOAD_FILE, uploadFile);
  yield takeEvery(INCOME_ACTIONS.ATTEMPT_TO_FETCH_FILES, listFiles);
}

export default incomeSagaWatcher;
