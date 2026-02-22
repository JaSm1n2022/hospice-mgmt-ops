import { createSelector } from "reselect";

const getEmployeeChecklistReducer = (state) => state.employeeChecklist;

export const employeeChecklistListStateSelector = createSelector(
  getEmployeeChecklistReducer,
  (data) => data.employeeChecklistList
);

export const employeeChecklistCreateStateSelector = createSelector(
  getEmployeeChecklistReducer,
  (data) => data.employeeChecklistCreate
);

export const employeeChecklistUpdateStateSelector = createSelector(
  getEmployeeChecklistReducer,
  (data) => data.employeeChecklistUpdate
);

export const employeeChecklistDeleteStateSelector = createSelector(
  getEmployeeChecklistReducer,
  (data) => data.employeeChecklistDelete
);
