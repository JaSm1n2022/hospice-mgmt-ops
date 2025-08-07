import { createSelector } from "reselect";

const getKeyReducer = (state) => state.key;

export const keyListStateSelector = createSelector(
  getKeyReducer,
  (data) => data.keyList
);
export const keyCreateStateSelector = createSelector(
  getKeyReducer,
  (data) => data.keyCreate
);
export const keyUpdateStateSelector = createSelector(
  getKeyReducer,
  (data) => data.keyUpdate
);
export const keyDeleteStateSelector = createSelector(
  getKeyReducer,
  (data) => data.keyDelete
);
