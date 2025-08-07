import { createSelector } from "reselect";

const getContractReducer = (state) => state.contract;

export const contractListStateSelector = createSelector(
  getContractReducer,
  (data) => data.contractList
);
export const contractCreateStateSelector = createSelector(
  getContractReducer,
  (data) => data.contractCreate
);
export const contractUpdateStateSelector = createSelector(
  getContractReducer,
  (data) => data.contractUpdate
);
export const contractDeleteStateSelector = createSelector(
  getContractReducer,
  (data) => data.contractDelete
);
