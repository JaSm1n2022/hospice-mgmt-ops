import { createSelector } from "reselect";

const getAssignmentReducer = (state) => state.assignment;

export const assignmentListStateSelector = createSelector(
  getAssignmentReducer,
  (data) => data.assignmentList
);
export const assignmentCreateStateSelector = createSelector(
  getAssignmentReducer,
  (data) => data.assignmentCreate
);
export const assignmentUpdateStateSelector = createSelector(
  getAssignmentReducer,
  (data) => data.assignmentUpdate
);
export const assignmentDeleteStateSelector = createSelector(
  getAssignmentReducer,
  (data) => data.assignmentDelete
);
