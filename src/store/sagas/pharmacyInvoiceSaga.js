// @flow
import { takeLatest, put, select } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  PHARMACY_INVOICE_ACTIONS,
  setCreatePharmacyInvoiceFailure,
  setCreatePharmacyInvoiceSucceed,
  setFetchPharmacyInvoiceFailure,
  setFetchPharmacyInvoiceSucceed,
  setDeletePharmacyInvoiceFailure,
  setDeletePharmacyInvoiceSucceed,
} from "../actions/pharmacyInvoiceAction";
import { supabaseClient } from "../../config/SupabaseClient";
import { patientListStateSelector } from "../selectors/patientSelector";

function* listPharmacyInvoice(filter) {
  try {
    console.log("[Pharmacy Invoice Filter]", filter.payload);

    let query = supabaseClient
      .from("pharmacy_invoices")
      .select()
      .eq("companyId", filter.payload.companyId);

    // Add date range filter if provided
    if (filter.payload.from && filter.payload.to) {
      query = query
        .gte("invoice_dt", filter.payload.from)
        .lte("invoice_dt", filter.payload.to);
    }

    // Order by invoice date descending
    query = query.order("invoice_dt", { ascending: false });

    let { data, error, status } = yield query;

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[Pharmacy Invoice Data]", data);
      yield put(setFetchPharmacyInvoiceSucceed(data));
    }
  } catch (error) {
    yield put(setFetchPharmacyInvoiceFailure(error));
    TOAST.error(`Pharmacy Invoice Fetch Failed: ${error.toString()}`);
  }
}

function* createPharmacyInvoice(rqst) {
  try {
    console.log("[Create Pharmacy Invoice]", rqst.payload);

    const { invoice_dt, items, companyId, userProfile } = rqst.payload;

    // Get patient list from Redux state to lookup patientId
    const patientListState = yield select(patientListStateSelector);
    const patientList = patientListState?.data || [];

    // Create a map for quick lookup of patient by patientCd
    const patientMap = {};
    patientList.forEach(patient => {
      patientMap[patient.patientCd] = patient;
    });

    // Map items to database records
    const records = items.map(item => {
      const patient = patientMap[item.patientCd];
      const patientId = patient?.id;

      if (!patientId) {
        console.warn(`Patient ID not found for patientCd: ${item.patientCd}`);
      }

      return {
        patientCd: item.patientCd,
        patientId: patientId || null,
        patientName: item.patientName || '',
        rxNumber: item.rxNumber || '',
        description: item.description || '',
        qty: item.qty || '',
        price: item.price || '0.00',
        tax: item.tax || '0.00',
        total: item.total || '0.00',
        rx_date: item.rxDate || null,
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

    console.log("[Pharmacy Invoice Records to Insert]", records);

    // Insert Pharmacy Invoice records
    let { error } = yield supabaseClient.from("pharmacy_invoices").insert(records, {
      returning: "minimal",
    });

    if (error) {
      throw error;
    }

    TOAST.success("Pharmacy Invoice created successfully!");
    yield put(setCreatePharmacyInvoiceSucceed(records));
  } catch (error) {
    console.error("[Create Pharmacy Invoice Error]", error);
    yield put(setCreatePharmacyInvoiceFailure(error));
    TOAST.error(`Pharmacy Invoice Creation Failed: ${error.toString()}`);
  }
}

function* deletePharmacyInvoice(rqst) {
  try {
    console.log("[Delete Pharmacy Invoice]", rqst.payload);

    const { ids } = rqst.payload;

    const { error } = yield supabaseClient
      .from("pharmacy_invoices")
      .delete()
      .in("id", ids);

    if (error) {
      throw error;
    }

    TOAST.success("Pharmacy Invoice(s) deleted successfully!");
    yield put(setDeletePharmacyInvoiceSucceed({ ids }));
  } catch (error) {
    console.error("[Delete Pharmacy Invoice Error]", error);
    yield put(setDeletePharmacyInvoiceFailure(error));
    TOAST.error(`Pharmacy Invoice Deletion Failed: ${error.toString()}`);
  }
}

export default function* rootSaga() {
  yield takeLatest(PHARMACY_INVOICE_ACTIONS.ATTEMPT_TO_FETCH_PHARMACY_INVOICE, listPharmacyInvoice);
  yield takeLatest(PHARMACY_INVOICE_ACTIONS.ATTEMPT_TO_CREATE_PHARMACY_INVOICE, createPharmacyInvoice);
  yield takeLatest(PHARMACY_INVOICE_ACTIONS.ATTEMPT_TO_DELETE_PHARMACY_INVOICE, deletePharmacyInvoice);
}
