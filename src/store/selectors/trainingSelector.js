import { createSelector } from "reselect";

const getTrainingReducer = (state) => state.training;

export const trainingListStateSelector = createSelector(
  getTrainingReducer,
  (data) => data.trainingList
);
export const trainingCreateStateSelector = createSelector(
  getTrainingReducer,
  (data) => data.trainingCreate
);
export const trainingUpdateStateSelector = createSelector(
  getTrainingReducer,
  (data) => data.trainingUpdate
);
export const trainingDeleteStateSelector = createSelector(
  getTrainingReducer,
  (data) => data.trainingDelete
);
