import { createSelector } from "reselect";

const getPaydayReducer = (state) => state.payday;

export const paydayListStateSelector = createSelector(
  getPaydayReducer,
  (data) => data.paydayList
);
export const paydayCreateStateSelector = createSelector(
  getPaydayReducer,
  (data) => data.paydayCreate
);
export const paydayUpdateStateSelector = createSelector(
  getPaydayReducer,
  (data) => data.paydayUpdate
);
export const paydayDeleteStateSelector = createSelector(
  getPaydayReducer,
  (data) => data.paydayDelete
);
