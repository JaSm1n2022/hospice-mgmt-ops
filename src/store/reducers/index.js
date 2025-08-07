import { combineReducers } from "redux";
import invoiceReducer from "./invoice";
import productReducer from "./product";
import stockReducer from "./stock";
import transactionReducer from "./transaction";
import distributionReducer from "./distribution";
import orderReducer from "./order";
import employeeReducer from "./employee";
import patientReducer from "./patient";
import thresholdReducer from "./threshold";
import vendorReducer from "./vendor";
import templateReducer from "./template";
import locationReducer from "./location";
import assignmentReducer from "./assignment";
import admittanceReducer from "./admittance";
import equipmentReducer from "./equipment";
import transportationReducer from "./transportation";
import callsReducer from "./calls";
import tasksReducer from "./tasks";
import profileReducer from "./profile";
import proofReducer from "./proof";
import overheadReducer from "./overhead";
import contractReducer from "./contract";
import payrollReducer from "./payroll";
import categoryReducer from "./category";
import subCategoryReducer from "./subCategory";
import keyReducer from "./key";
import routesheetReducer from "./routesheet";
import paydayReducer from "./payday";
import trainingReducer from "./training";
import certificationReducer from "./certification";
export default combineReducers({
  invoice: invoiceReducer,
  product: productReducer,
  stock: stockReducer,
  transaction: transactionReducer,
  distribution: distributionReducer,
  employee: employeeReducer,
  category: categoryReducer,
  subCategory: subCategoryReducer,
  patient: patientReducer,
  assignment: assignmentReducer,
  vendor: vendorReducer,
  template: templateReducer,
  threshold: thresholdReducer,
  order: orderReducer,
  location: locationReducer,
  admittance: admittanceReducer,
  equipment: equipmentReducer,
  transportation: transportationReducer,
  calls: callsReducer,
  tasks: tasksReducer,
  profile: profileReducer,
  proof: proofReducer,
  overhead: overheadReducer,
  contract: contractReducer,
  payroll: payrollReducer,
  key: keyReducer,
  routesheet: routesheetReducer,
  payday: paydayReducer,
  training: trainingReducer,
  certification: certificationReducer,
});
