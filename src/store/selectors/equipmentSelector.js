import { createSelector } from "reselect";

const getEquipmentReducer = (state) => state.equipment;

export const equipmentListStateSelector = createSelector(
  getEquipmentReducer,
  (data) => data.equipmentList
);
export const equipmentCreateStateSelector = createSelector(
  getEquipmentReducer,
  (data) => data.equipmentCreate
);
export const equipmentUpdateStateSelector = createSelector(
  getEquipmentReducer,
  (data) => data.equipmentUpdate
);
export const equipmentDeleteStateSelector = createSelector(
  getEquipmentReducer,
  (data) => data.equipmentDelete
);
