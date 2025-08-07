import { createSelector } from "reselect";

const getTasksReducer = (state) => state.tasks;

export const tasksListStateSelector = createSelector(
  getTasksReducer,
  (data) => data.tasksList
);
export const tasksCreateStateSelector = createSelector(
  getTasksReducer,
  (data) => data.tasksCreate
);
export const tasksUpdateStateSelector = createSelector(
  getTasksReducer,
  (data) => data.tasksUpdate
);
export const tasksDeleteStateSelector = createSelector(
  getTasksReducer,
  (data) => data.tasksDelete
);
