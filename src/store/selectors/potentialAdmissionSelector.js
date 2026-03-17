import { createSelector } from 'reselect';

const getPotentialAdmissionReducer = (state) => state.potentialAdmission;

export const potentialAdmissionListStateSelector = createSelector(
  getPotentialAdmissionReducer, data => data.potentialAdmissionList
);
export const potentialAdmissionCreateStateSelector = createSelector(
  getPotentialAdmissionReducer, data => data.potentialAdmissionCreate
);
export const potentialAdmissionUpdateStateSelector = createSelector(
  getPotentialAdmissionReducer, data => data.potentialAdmissionUpdate
);
export const potentialAdmissionDeleteStateSelector = createSelector(
  getPotentialAdmissionReducer, data => data.potentialAdmissionDelete
);
