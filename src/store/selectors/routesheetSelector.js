import { createSelector } from "reselect";

const getRoutesheetReducer = (state) => state.routesheet;

export const routesheetListStateSelector = createSelector(
  getRoutesheetReducer,
  (data) => data.routesheetList
);
export const routesheetCreateStateSelector = createSelector(
  getRoutesheetReducer,
  (data) => data.routesheetCreate
);
export const routesheetUpdateStateSelector = createSelector(
  getRoutesheetReducer,
  (data) => data.routesheetUpdate
);
export const routesheetDeleteStateSelector = createSelector(
  getRoutesheetReducer,
  (data) => data.routesheetDelete
);
