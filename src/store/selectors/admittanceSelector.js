import { createSelector } from "reselect";

const getAdmittanceReducer = (state) => state.admittance;

export const admittanceListStateSelector = createSelector(
  getAdmittanceReducer,
  (data) => data.admittanceList
);
export const admittanceCreateStateSelector = createSelector(
  getAdmittanceReducer,
  (data) => data.admittanceCreate
);
export const admittanceUpdateStateSelector = createSelector(
  getAdmittanceReducer,
  (data) => data.admittanceUpdate
);
export const admittanceDeleteStateSelector = createSelector(
  getAdmittanceReducer,
  (data) => data.admittanceDelete
);
