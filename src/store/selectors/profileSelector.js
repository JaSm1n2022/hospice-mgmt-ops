import { createSelector } from "reselect";

const getProfileReducer = (state) => state.profile;

export const profileListStateSelector = createSelector(
  getProfileReducer,
  (data) => data.profileList
);
export const profileCreateStateSelector = createSelector(
  getProfileReducer,
  (data) => data.profileCreate
);
export const profileUpdateStateSelector = createSelector(
  getProfileReducer,
  (data) => data.profileUpdate
);
export const profileDeleteStateSelector = createSelector(
  getProfileReducer,
  (data) => data.profileDelete
);
