import { createSelector } from "reselect";

const getDmeReducer = (state) => state.dme;

export const dmeListStateSelector = createSelector(
  getDmeReducer,
  (data) => data.dmeList
);
export const dmeCreateStateSelector = createSelector(
  getDmeReducer,
  (data) => data.dmeCreate
);
export const dmeUpdateStateSelector = createSelector(
  getDmeReducer,
  (data) => data.dmeUpdate
);
export const dmeDeleteStateSelector = createSelector(
  getDmeReducer,
  (data) => data.dmeDelete
);
