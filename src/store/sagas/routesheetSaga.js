// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  ROUTESHEET_ACTIONS,
  setCreateRoutesheetFailure,
  setCreateRoutesheetSucceed,
  setDeleteRoutesheetFailure,
  setDeleteRoutesheetSucceed,
  setFetchRoutesheetFailure,
  setFetchRoutesheetSucceed,
  setUpdateRoutesheetFailure,
  setUpdateRoutesheetSucceed,
  setSubmitRoutesheetToPayrollSucceed,
  setSubmitRoutesheetToPayrollFailure,
} from "../actions/routesheetAction";
import { supabaseClient } from "../../config/SupabaseClient";
export function* listRoutesheet(action) {
  try {
    const { companyId, discipline } = action.payload || {};

    if (!companyId) {
      throw new Error("companyId is required");
    }

    // Build the query
    let query = supabaseClient
      .from("routesheets")
      .select("*")
      .eq("companyId", companyId)
      .gte("dosStart", `${action.payload.from} 00:00`)
      .lt("dosStart", `${action.payload.to} 23:59`);

    if (discipline) {
      query = query.eq("requestorId", discipline); // fixed the ":" bug
    }

    // Execute the query
    const { data, error, status } = yield query;

    if (error && status !== 406) {
      throw error;
    }

    yield put(setFetchRoutesheetSucceed(data || []));
  } catch (err) {
    yield put(setFetchRoutesheetFailure(err));
    TOAST?.error?.(`Routesheet fetch failed: ${err.message || err.toString()}`);
  }
}

function* createRoutesheet(rqst) {
  try {
    console.log("[createRoutesheets]", rqst.payload);
    let { error } = yield supabaseClient
      .from("routesheets")
      .insert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Routesheet] : ${error.toString()}`);
      yield put(
        setCreateRoutesheetFailure(`[create Routesheet] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreateRoutesheetSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Routesheet] : ${error.toString()}`);
    yield put(
      setCreateRoutesheetFailure(`[create Routesheet] : ${error.toString()}`)
    );
  }
}

function* updateRoutesheet(rqst) {
  try {
    console.log("[updateRoutesheets]", rqst.payload);
    let { error } = yield supabaseClient
      .from("routesheets")
      .upsert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[update Routesheet] : ${error.toString()}`);
      yield put(
        setUpdateRoutesheetFailure(`[update Routesheet] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdateRoutesheetSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Routesheet] : ${error.toString()}`);
    yield put(
      setUpdateRoutesheetFailure(`[update Routesheet] : ${error.toString()}`)
    );
  }
}

function* deleteRoutesheet(rqst) {
  try {
    console.log("[updateRoutesheets]", rqst.payload);
    let { error } = yield supabaseClient
      .from("routesheets")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Routesheet] : ${error.toString()}`);
      yield put(
        setDeleteRoutesheetFailure(`[delete Routesheet] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeleteRoutesheetSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Routesheet] : ${error.toString()}`);
    yield put(
      setDeleteRoutesheetFailure(`[delete routesheet] : ${error.toString()}`)
    );
  }
}

function* submitRoutesheetToPayroll(rqst) {
  try {
    console.log("[submitRoutesheetToPayroll]", rqst.payload);
    const { selectedRoutesheets, payrollDueDate, currentUser } = rqst.payload;

    // Step 1: Validate that all selected routesheets have status "With Visit Notes"
    const invalidRows = selectedRoutesheets.filter(
      (row) => row.status !== "With Visit Notes"
    );
    if (invalidRows.length > 0) {
      const errorMsg =
        "Payroll submission is only allowed for routesheets with status 'With Visit Notes'. Please review your selection.";
      TOAST.error(errorMsg);
      yield put(setSubmitRoutesheetToPayrollFailure(errorMsg));
      return;
    }

    // Step 2: Fetch pay period from paydays table
    const { data: payday, error: paydayError } = yield supabaseClient
      .from("paydays")
      .select("start_period, end_period")
      .eq("payday", payrollDueDate)
      .eq("companyId", currentUser.companyId)
      .limit(1)
      .single();

    if (paydayError || !payday) {
      const errorMsg = "No payday record found for the selected due date.";
      TOAST.error(errorMsg);
      yield put(setSubmitRoutesheetToPayrollFailure(errorMsg));
      return;
    }

    // Step 3: Fetch patient IDs for routesheets that have patientCd
    const uniquePatientCds = [
      ...new Set(
        selectedRoutesheets
          .filter((row) => row.patientCd)
          .map((row) => row.patientCd)
      ),
    ];

    let patientLookup = {};
    if (uniquePatientCds.length > 0) {
      const { data: patients, error: patientError } = yield supabaseClient
        .from("patients")
        .select("id, patientCd")
        .in("patientCd", uniquePatientCds)
        .eq("companyId", currentUser.companyId);

      if (!patientError && patients) {
        patientLookup = patients.reduce((acc, patient) => {
          acc[patient.patientCd] = patient.id;
          return acc;
        }, {});
      }
    }

    // Step 4: Map routesheet data to payroll records
    const payrollRecords = selectedRoutesheets.map((row) => {
      // Extract date from timeIn, dosStart, or dos field
      let dosDate = "";
      if (row.timeIn) {
        // Extract YYYY-MM-DD from timeIn field
        dosDate = row.timeIn.split(" ")[0];
      } else if (row.dosStart) {
        // Extract YYYY-MM-DD from dosStart field
        dosDate = row.dosStart.split(" ")[0];
      } else if (row.dos) {
        // Use dos field if available
        dosDate = row.dos.split(" ")[0];
      }

      const record = {
        employeeId: row.requestorId,
        employeeName: row.requestor,
        employeeTitle: row.requestorTitle,
        employeeType: row.employeeType || "",
        payDate: payrollDueDate,
        serviceType: row.service,
        serviceCd: row.serviceCd,
        serviceRate: row.serviceRate || 0,
        noOfService: row.noOfService || 1,
        payAmount: row.approvedPayment || row.estimatedPayment || 0,
        totalRate: row.approvedPayment || row.estimatedPayment || 0,
        deduction: row.deduction || 0,
        comments: row.comments || row.serviceNotes || "",
        patientCd: row.patientCd || "",
        paymentType: row.paymentType || "Direct Deposit",
        paymentInfo: row.paymentInfo || "ACH",
        dos: dosDate ? [dosDate] : [],
        duration: row.duration || 0,
        start_period: payday.start_period,
        end_period: payday.end_period,
        companyId: currentUser.companyId,
        createdUser: {
          name: currentUser.name,
          userId: currentUser.id,
          date: new Date(),
        },
        updatedUser: {
          name: currentUser.name,
          userId: currentUser.id,
          date: new Date(),
        },
        isDistributed: false,
        isTransaction: false,
        created_at: new Date(),
      };

      // Only add patientId if we found a valid ID in the lookup
      if (row.patientCd && patientLookup[row.patientCd]) {
        record.patientId = patientLookup[row.patientCd];
      }

      return record;
    });

    // Step 5: Insert records into payrolls table
    const { error: insertError } = yield supabaseClient
      .from("payrolls")
      .insert(payrollRecords);

    if (insertError) {
      console.log(`[submit routesheet to payroll] : ${insertError.toString()}`);
      TOAST.error(`Failed to submit payroll: ${insertError.message}`);
      yield put(
        setSubmitRoutesheetToPayrollFailure(
          `[submit routesheet to payroll] : ${insertError.toString()}`
        )
      );
      throw insertError;
    }

    // Step 6: Update routesheet status to "Payroll Submission"
    const routesheetIds = selectedRoutesheets.map((r) => r.id);
    const updatePromises = routesheetIds.map((id) =>
      supabaseClient
        .from("routesheets")
        .update({
          status: "Payroll Submission",
          updatedUser: {
            name: currentUser.name,
            userId: currentUser.id,
            date: new Date(),
          },
        })
        .eq("id", id)
    );

    const updateResults = yield Promise.all(updatePromises);
    const updateErrors = updateResults.filter((r) => r.error);

    if (updateErrors.length > 0) {
      console.log(
        `[update routesheet status] : ${updateErrors[0].error.toString()}`
      );
      // Don't fail the entire operation, just log the error
      TOAST.warning(
        "Payroll submitted but failed to update some routesheet statuses."
      );
    }

    TOAST.ok(
      `Payroll submitted successfully. ${payrollRecords.length} record(s) created.`
    );
    yield put(
      setSubmitRoutesheetToPayrollSucceed({
        success: true,
        count: payrollRecords.length,
      })
    );
  } catch (error) {
    console.log(`[submit routesheet to payroll] : ${error.toString()}`);
    yield put(
      setSubmitRoutesheetToPayrollFailure(
        `[submit routesheet to payroll] : ${error.toString()}`
      )
    );
  }
}

function* routesheetSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(
    ROUTESHEET_ACTIONS.ATTEMPT_TO_FETCH_ROUTESHEET,
    listRoutesheet
  );
  yield takeLatest(
    ROUTESHEET_ACTIONS.ATTEMPT_TO_CREATE_ROUTESHEET,
    createRoutesheet
  );
  yield takeLatest(
    ROUTESHEET_ACTIONS.ATTEMPT_TO_UPDATE_ROUTESHEET,
    updateRoutesheet
  );
  yield takeLatest(
    ROUTESHEET_ACTIONS.ATTEMPT_TO_DELETE_ROUTESHEET,
    deleteRoutesheet
  );
  yield takeLatest(
    ROUTESHEET_ACTIONS.ATTEMPT_TO_SUBMIT_ROUTESHEET_TO_PAYROLL,
    submitRoutesheetToPayroll
  );
}

export default routesheetSagaWatcher;
