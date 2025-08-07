import { createSelector } from "reselect";

const getOverheadReducer = (state) => state.overhead;

export const overheadListStateSelector = createSelector(
  getOverheadReducer,
  (data) => data.overheadList
);
export const overheadCreateStateSelector = createSelector(
  getOverheadReducer,
  (data) => data.overheadCreate
);
export const overheadUpdateStateSelector = createSelector(
  getOverheadReducer,
  (data) => data.overheadUpdate
);
export const overheadDeleteStateSelector = createSelector(
  getOverheadReducer,
  (data) => data.overheadDelete
);
