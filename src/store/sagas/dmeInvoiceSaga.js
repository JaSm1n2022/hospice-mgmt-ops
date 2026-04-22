// @flow
import { takeLatest, put, select } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  DME_INVOICE_ACTIONS,
  setCreateDmeInvoiceFailure,
  setCreateDmeInvoiceSucceed,
  setFetchDmeInvoiceFailure,
  setFetchDmeInvoiceSucceed,
} from "../actions/dmeInvoiceAction";
import { supabaseClient } from "../../config/SupabaseClient";
import { patientListStateSelector } from "../selectors/patientSelector";

function* listDmeInvoice(filter) {
  try {
    console.log("[DME Invoice Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("dme_invoices")
      .select()
      .eq("companyId", filter.payload.companyId);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[DME Invoice Data]", data);
      yield put(setFetchDmeInvoiceSucceed(data));
    }
  } catch (error) {
    yield put(setFetchDmeInvoiceFailure(error));
    TOAST.error(`DME Invoice Fetch Failed: ${error.toString()}`);
  }
}

function* createDmeInvoice(rqst) {
  try {
    console.log("[Create DME Invoice]", rqst.payload);

    const { invoice_dt, items, companyId, userProfile } = rqst.payload;

    // Get patient list from Redux state to lookup patientId
    const patientListState = yield select(patientListStateSelector);
    const patientList = patientListState?.data || [];

    // Create a map for quick lookup of patientId by patientCd
    const patientMap = {};
    patientList.forEach(patient => {
      patientMap[patient.patientCd] = patient.id;
    });

    // Map items to database records
    const records = items.map(item => {
      const patientId = patientMap[item.patientCd];

      if (!patientId) {
        console.warn(`Patient ID not found for patientCd: ${item.patientCd}`);
      }

      return {
        patientCd: item.patientCd,
        patientId: patientId || null,
        equipments: item.equipments,
        invoice_amt: item.invoice_amt,
        invoice_dt: invoice_dt,
        companyId: companyId,
        createdUser: {
          name: userProfile.name,
          userId: userProfile.id,
          date: new Date(),
        },
        updatedUser: {
          name: userProfile.name,
          userId: userProfile.id,
          date: new Date(),
        },
      };
    });

    console.log("[DME Invoice Records to Insert]", records);

    let { error } = yield supabaseClient.from("dme_invoices").insert(records, {
      returning: "minimal",
    });

    if (error) {
      console.log(`[Create DME Invoice Error]: ${error.toString()}`);
      yield put(setCreateDmeInvoiceFailure(`[Create DME Invoice]: ${error.toString()}`));
      TOAST.error(`Failed to save DME Invoice: ${error.toString()}`);
      throw error;
    }

    yield put(setCreateDmeInvoiceSucceed({ success: true }));
    TOAST.success("DME Invoice saved successfully!");

  } catch (error) {
    console.log(`[Create DME Invoice Catch]: ${error.toString()}`);
    yield put(setCreateDmeInvoiceFailure(`[Create DME Invoice]: ${error.toString()}`));
  }
}

function* dmeInvoiceSagaWatcher<T>(): Iterable<T> {
  yield takeLatest(DME_INVOICE_ACTIONS.ATTEMPT_TO_FETCH_DME_INVOICE, listDmeInvoice);
  yield takeLatest(DME_INVOICE_ACTIONS.ATTEMPT_TO_CREATE_DME_INVOICE, createDmeInvoice);
}

export default dmeInvoiceSagaWatcher;
