// @flow
import { takeLatest, put, takeEvery } from "redux-saga/effects";
import TOAST from "../../modules/toastManager";
import {
  EQUIPMENT_ACTIONS,
  setCreateEquipmentFailure,
  setCreateEquipmentSucceed,
  setDeleteEquipmentFailure,
  setDeleteEquipmentSucceed,
  setFetchEquipmentFailure,
  setFetchEquipmentSucceed,
  setUpdateEquipmentFailure,
  setUpdateEquipmentSucceed,
} from "../actions/equipmentAction";
import { supabaseClient } from "../../config/SupabaseClient";

function* listEquipment(filter) {
  try {
    console.log("[Filter]", filter.payload);
    let { data, error, status } = yield supabaseClient
      .from("equipments")
      .select()
      .eq("companyId", filter.payload.companyId);

    if (error && status !== 406) {
      console.log(error.toString());
      throw error;
    }

    if (data) {
      console.log("[got me]", data);
      yield put(setFetchEquipmentSucceed(data));
    }
  } catch (error) {
    yield put(setFetchEquipmentFailure(error));
    TOAST.error(`Equipment Failed:${error.toString()}`);
  }
}

function* createEquipment(rqst) {
  try {
    console.log("[CreateEquipments]", rqst.payload);
    let { error } = yield supabaseClient
      .from("equipments")
      .insert([rqst.payload], {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[create Equipment] : ${error.toString()}`);
      yield put(
        setCreateEquipmentFailure(`[create Equipment] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setCreateEquipmentSucceed({ success: true }));
  } catch (error) {
    console.log(`[create Equipment] : ${error.toString()}`);
    yield put(
      setCreateEquipmentFailure(`[create equipment] : ${error.toString()}`)
    );
  }
}

function* updateEquipment(rqst) {
  try {
    console.log("[UpdateEquipments]", rqst.payload);
    let { error } = yield supabaseClient
      .from("equipments")
      .upsert(rqst.payload, {
        returning: "minimal", // Don't return the value after inserting
      });

    if (error) {
      console.log(`[update Equipment] : ${error.toString()}`);
      yield put(
        setUpdateEquipmentFailure(`[update Equipment] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setUpdateEquipmentSucceed({ success: true }));
  } catch (error) {
    console.log(`[update Equipment] : ${error.toString()}`);
    yield put(
      setUpdateEquipmentFailure(`[update Equipment] : ${error.toString()}`)
    );
  }
}

function* deleteEquipment(rqst) {
  try {
    console.log("[UpdateEquipments]", rqst.payload);
    let { error } = yield supabaseClient
      .from("equipments")
      .delete()
      .match({ id: rqst.payload });

    if (error) {
      console.log(`[delete Equipment] : ${error.toString()}`);
      yield put(
        setDeleteEquipmentFailure(`[delete Equipment] : ${error.toString()}`)
      );
      throw error;
    }
    yield put(setDeleteEquipmentSucceed({ success: true }));
  } catch (error) {
    console.log(`[delete Equipment] : ${error.toString()}`);
    yield put(
      setDeleteEquipmentFailure(`[delete Equipment] : ${error.toString()}`)
    );
  }
}

function* equipmentSagaWatcher<T>(): Iterable<T> {
  yield takeEvery(EQUIPMENT_ACTIONS.ATTEMPT_TO_FETCH_EQUIPMENT, listEquipment);
  yield takeLatest(
    EQUIPMENT_ACTIONS.ATTEMPT_TO_CREATE_EQUIPMENT,
    createEquipment
  );
  yield takeLatest(
    EQUIPMENT_ACTIONS.ATTEMPT_TO_UPDATE_EQUIPMENT,
    updateEquipment
  );
  yield takeLatest(
    EQUIPMENT_ACTIONS.ATTEMPT_TO_DELETE_EQUIPMENT,
    deleteEquipment
  );
}

export default equipmentSagaWatcher;
