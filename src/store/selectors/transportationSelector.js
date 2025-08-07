import { createSelector } from "reselect";

const getTransportationReducer = (state) => state.transportation;

export const transportationListStateSelector = createSelector(
  getTransportationReducer,
  (data) => data.transportationList
);
export const transportationCreateStateSelector = createSelector(
  getTransportationReducer,
  (data) => data.transportationCreate
);
export const transportationUpdateStateSelector = createSelector(
  getTransportationReducer,
  (data) => data.transportationUpdate
);
export const transportationDeleteStateSelector = createSelector(
  getTransportationReducer,
  (data) => data.transportationDelete
);
