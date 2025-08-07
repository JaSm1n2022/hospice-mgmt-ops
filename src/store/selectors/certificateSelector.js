import { createSelector } from "reselect";

const getCertificationReducer = (state) => state.certification;

export const certificationListStateSelector = createSelector(
  getCertificationReducer,
  (data) => data.certificationList
);
export const certificationCreateStateSelector = createSelector(
  getCertificationReducer,
  (data) => data.certificationCreate
);
export const certificationUpdateStateSelector = createSelector(
  getCertificationReducer,
  (data) => data.certificationUpdate
);
export const certificationDeleteStateSelector = createSelector(
  getCertificationReducer,
  (data) => data.certificationDelete
);
