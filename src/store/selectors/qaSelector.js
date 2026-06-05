import { createSelector } from 'reselect';

const getQAReducer = (state) => state.qa;

export const qaListStateSelector = createSelector(
  getQAReducer, data => data.qaList
);
export const qaCreateStateSelector = createSelector(
  getQAReducer, data => data.qaCreate
);
export const qaUpdateStateSelector = createSelector(
  getQAReducer, data => data.qaUpdate
);
export const qaDeleteStateSelector = createSelector(
  getQAReducer, data => data.qaDelete
);
