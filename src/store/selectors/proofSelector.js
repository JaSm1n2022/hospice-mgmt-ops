import { createSelector } from "reselect";

const getProofReducer = (state) => state.proof;

export const proofListStateSelector = createSelector(
  getProofReducer,
  (data) => data.proofList
);
export const proofCreateStateSelector = createSelector(
  getProofReducer,
  (data) => data.proofCreate
);
export const proofUpdateStateSelector = createSelector(
  getProofReducer,
  (data) => data.proofUpdate
);
export const proofDeleteStateSelector = createSelector(
  getProofReducer,
  (data) => data.proofDelete
);
