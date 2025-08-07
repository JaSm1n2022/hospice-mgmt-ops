import { createSelector } from "reselect";

const getPayrollReducer = (state) => state.payroll;

export const payrollListStateSelector = createSelector(
  getPayrollReducer,
  (data) => data.payrollList
);
export const payrollCreateStateSelector = createSelector(
  getPayrollReducer,
  (data) => data.payrollCreate
);
export const payrollUpdateStateSelector = createSelector(
  getPayrollReducer,
  (data) => data.payrollUpdate
);
export const payrollDeleteStateSelector = createSelector(
  getPayrollReducer,
  (data) => data.payrollDelete
);
