import { createSelector } from "reselect";

const getCallsReducer = (state) => state.calls;

export const callsListStateSelector = createSelector(
  getCallsReducer,
  (data) => data.callsList
);
export const callsCreateStateSelector = createSelector(
  getCallsReducer,
  (data) => data.callsCreate
);
export const callsUpdateStateSelector = createSelector(
  getCallsReducer,
  (data) => data.callsUpdate
);
export const callsDeleteStateSelector = createSelector(
  getCallsReducer,
  (data) => data.callsDelete
);
