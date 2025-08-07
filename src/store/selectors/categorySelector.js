import { createSelector } from "reselect";

const getCategoryReducer = (state) => state.category;

export const categoryListStateSelector = createSelector(
  getCategoryReducer,
  (data) => data.categoryList
);
export const categoryCreateStateSelector = createSelector(
  getCategoryReducer,
  (data) => data.categoryCreate
);
export const categoryUpdateStateSelector = createSelector(
  getCategoryReducer,
  (data) => data.categoryUpdate
);
export const categoryDeleteStateSelector = createSelector(
  getCategoryReducer,
  (data) => data.categoryDelete
);
