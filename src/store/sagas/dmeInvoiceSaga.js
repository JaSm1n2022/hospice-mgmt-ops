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

    // Step 1: Insert DME Invoice records
    let { error } = yield supabaseClient.from("dme_invoices").insert(records, {
      returning: "minimal",
    });

    if (error) {
      console.log(`[Create DME Invoice Error]: ${error.toString()}`);
      yield put(setCreateDmeInvoiceFailure(`[Create DME Invoice]: ${error.toString()}`));
      TOAST.error(`Failed to save DME Invoice: ${error.toString()}`);
      throw error;
    }

    console.log("[DME Invoice created successfully, now updating patients...]");

    // Step 2: Update patient records with DME equipment and last invoice date
    const patientUpdates = items.map(item => {
      const patient = patientMap[item.patientCd];

      if (!patient || !patient.id) {
        console.warn(`Cannot update patient - Patient not found for patientCd: ${item.patientCd}`);
        return null;
      }

      // Merge existing DME with new equipment and remove duplicates
      const existingDme = patient.dme && Array.isArray(patient.dme) ? patient.dme : [];
      const newEquipments = item.equipments || [];

      // Combine arrays and remove duplicates (case-insensitive comparison)
      const combinedDme = [...existingDme, ...newEquipments];
      const uniqueDme = combinedDme.filter((equipment, index, self) => {
        const normalizedEquipment = equipment.trim().toLowerCase();
        return index === self.findIndex(e => e.trim().toLowerCase() === normalizedEquipment);
      });

      console.log(`[Patient ${item.patientCd}] Existing DME:`, existingDme);
      console.log(`[Patient ${item.patientCd}] New Equipment:`, newEquipments);
      console.log(`[Patient ${item.patientCd}] Unique DME:`, uniqueDme);

      return {
        id: patient.id,
        companyId: companyId, // Required for RLS
        dme: uniqueDme, // Update dme array with unique equipments
        dme_last_dt: invoice_dt, // Update last invoice date
        updatedUser: {
          name: userProfile.name,
          userId: userProfile.id,
          date: new Date(),
        },
      };
    }).filter(update => update !== null); // Remove null entries

    console.log("[Patient Updates to Apply]", patientUpdates);

    if (patientUpdates.length > 0) {
      // Use upsert to update patients
      let { error: patientError } = yield supabaseClient
        .from("patients")
        .upsert(patientUpdates, {
          returning: "minimal",
        });

      if (patientError) {
        console.log(`[Update Patients Error]: ${patientError.toString()}`);
        // Don't fail the whole operation, just log the error
        TOAST.warning(`DME Invoice saved, but some patient updates failed: ${patientError.toString()}`);
      } else {
        console.log("[Patients updated successfully with DME data]");
      }
    }

    yield put(setCreateDmeInvoiceSucceed({ success: true }));
    TOAST.ok("DME Invoice saved and patients updated successfully!");

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
