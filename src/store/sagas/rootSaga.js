import { all } from "redux-saga/effects";
import authSaga from "./authSaga";
import invoiceSaga from "./invoiceSaga";
import productSaga from "./productSaga";
import stockSaga from "./stockSaga";
import transactionSaga from "./transactionSaga";
import distributionSaga from "./distributionSaga";
import employeeSaga from "./employeeSaga";
import patientSaga from "./patientSaga";
import vendorSaga from "./vendorSaga";
import templateSaga from "./templateSaga";
import thresholdSaga from "./thresholdSaga";
import orderSaga from "./orderSaga";
import locationSaga from "./locationSaga";
import assignmentSaga from "./assignmentSaga";
import admittanceSaga from "./admittanceSaga";
import equipmentSaga from "./equipmentSaga";
import transportationSaga from "./transportationSaga";
import callsSaga from "./callsSaga";
import tasksSaga from "./tasksSaga";
import profileSaga from "./profileSaga";
import proofSaga from "./proofSaga";
import overheadSaga from "./overheadSaga";
import dmeSaga from "./dmeSaga";
import contractSaga from "./contractSaga";
import payrollSaga from "./payrollSaga";
import categorySaga from "./categorySaga";
import subCategorySaga from "./subCategorySaga";
import keySaga from "./keySaga";
import routesheetSaga from "./routesheetSaga";
import paydaySaga from "./paydaySaga";
import trainingSaga from "./trainingSaga";
import certificationSaga from "./certificationSaga";
export function* rootSaga() {
  yield all([
    authSaga(),
    invoiceSaga(),
    productSaga(),
    stockSaga(),
    transactionSaga(),
    distributionSaga(),
    employeeSaga(),
    patientSaga(),
    assignmentSaga(),
    admittanceSaga(),
    vendorSaga(),
    locationSaga(),
    templateSaga(),
    thresholdSaga(),
    orderSaga(),
    equipmentSaga(),
    transportationSaga(),
    callsSaga(),
    tasksSaga(),
    profileSaga(),
    proofSaga(),
    overheadSaga(),
    dmeSaga(),
    contractSaga(),
    payrollSaga(),
    categorySaga(),
    subCategorySaga(),
    keySaga(),
    routesheetSaga(),
    paydaySaga(),
    trainingSaga(),
    certificationSaga(),
  ]);
}
