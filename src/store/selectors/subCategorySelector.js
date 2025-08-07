import { createSelector } from "reselect";

const getSubCategoryReducer = (state) => state.subCategory;

export const subCategoryListStateSelector = createSelector(
  getSubCategoryReducer,
  (data) => data.subCategoryList
);
export const subCategoryCreateStateSelector = createSelector(
  getSubCategoryReducer,
  (data) => data.subCategoryCreate
);
export const subCategoryUpdateStateSelector = createSelector(
  getSubCategoryReducer,
  (data) => data.subCategoryUpdate
);
export const subCategoryDeleteStateSelector = createSelector(
  getSubCategoryReducer,
  (data) => data.subCategoryDelete
);
