import { createSelector } from "reselect";

const getIncomeReducer = (state) => state.income;

export const incomeListStateSelector = createSelector(
  getIncomeReducer,
  (data) => data.incomeList
);

export const incomeCreateStateSelector = createSelector(
  getIncomeReducer,
  (data) => data.incomeCreate
);

export const incomeUpdateStateSelector = createSelector(
  getIncomeReducer,
  (data) => data.incomeUpdate
);

export const incomeDeleteStateSelector = createSelector(
  getIncomeReducer,
  (data) => data.incomeDelete
);

export const fileUploadStateSelector = createSelector(
  getIncomeReducer,
  (data) => data.fileUpload
);

export const filesListStateSelector = createSelector(
  getIncomeReducer,
  (data) => data.filesList
);
