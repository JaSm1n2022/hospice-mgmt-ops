export const EQUIPMENT_ACTIONS = {
  ATTEMPT_TO_FETCH_EQUIPMENT: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_EQUIPMENT",
  SET_FETCH_EQUIPMENT_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_EQUIPMENT_SUCCEED",
  SET_FETCH_EQUIPMENT_FAILURE: "dashboard/@HOSPICE/SET_FETCH_EQUIPMENT_FAILURE",
  RESET_FETCH_EQUIPMENT_STATE: "dashboard/@HOSPICE/RESET_FETCH_EQUIPMENT_STATE",

  ATTEMPT_TO_CREATE_EQUIPMENT: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_EQUIPMENT",
  SET_CREATE_EQUIPMENT_SUCCEED:
    "dashboard/@HOSPICE/SET_CREATE_EQUIPMENT_SUCCEED",
  SET_CREATE_EQUIPMENT_FAILURE:
    "dashboard/@HOSPICE/SET_CREATE_EQUIPMENT_FAILURE",
  RESET_CREATE_EQUIPMENT_STATE:
    "dashboard/@HOSPICE/RESET_CREATE_EQUIPMENT_STATE",

  ATTEMPT_TO_UPDATE_EQUIPMENT: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_EQUIPMENT",
  SET_UPDATE_EQUIPMENT_SUCCEED:
    "dashboard/@HOSPICE/SET_UPDATE_EQUIPMENT_SUCCEED",
  SET_UPDATE_EQUIPMENT_FAILURE:
    "dashboard/@HOSPICE/SET_UPDATE_EQUIPMENT_FAILURE",
  RESET_UPDATE_EQUIPMENT_STATE:
    "dashboard/@HOSPICE/RESET_UPDATE_EQUIPMENT_STATE",

  ATTEMPT_TO_DELETE_EQUIPMENT: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_EQUIPMENT",
  SET_DELETE_EQUIPMENT_SUCCEED:
    "dashboard/@HOSPICE/SET_DELETE_EQUIPMENT_SUCCEED",
  SET_DELETE_EQUIPMENT_FAILURE:
    "dashboard/@HOSPICE/SET_DELETE_EQUIPMENT_FAILURE",
  RESET_DELETE_EQUIPMENT_STATE:
    "dashboard/@HOSPICE/RESET_DELETE_EQUIPMENT_STATE",
};
//FETCH Equipment
export const attemptToFetchEquipment = (data: Object): BaseAction => ({
  type: EQUIPMENT_ACTIONS.ATTEMPT_TO_FETCH_EQUIPMENT,
  payload: data,
});
export const setFetchEquipmentSucceed = (payload: Object): BaseAction => ({
  type: EQUIPMENT_ACTIONS.SET_FETCH_EQUIPMENT_SUCCEED,
  payload,
});

export const setFetchEquipmentFailure = (payload: Object): BaseAction => ({
  type: EQUIPMENT_ACTIONS.SET_FETCH_EQUIPMENT_FAILURE,
  payload,
});
export const resetFetchEquipmentState = (): BaseAction => ({
  type: EQUIPMENT_ACTIONS.RESET_FETCH_EQUIPMENT_STATE,
});

//CREATE Equipment
export const attemptToCreateEquipment = (data: Object): BaseAction => ({
  type: EQUIPMENT_ACTIONS.ATTEMPT_TO_CREATE_EQUIPMENT,
  payload: data,
});
export const setCreateEquipmentSucceed = (payload: Object): BaseAction => ({
  type: EQUIPMENT_ACTIONS.SET_CREATE_EQUIPMENT_SUCCEED,
  payload,
});

export const setCreateEquipmentFailure = (payload: Object): BaseAction => ({
  type: EQUIPMENT_ACTIONS.SET_CREATE_EQUIPMENT_FAILURE,
  payload,
});
export const resetCreateEquipmentState = (): BaseAction => ({
  type: EQUIPMENT_ACTIONS.RESET_CREATE_EQUIPMENT_STATE,
});

//UPDATE Equipment
export const attemptToUpdateEquipment = (data: Object): BaseAction => ({
  type: EQUIPMENT_ACTIONS.ATTEMPT_TO_UPDATE_EQUIPMENT,
  payload: data,
});
export const setUpdateEquipmentSucceed = (payload: Object): BaseAction => ({
  type: EQUIPMENT_ACTIONS.SET_UPDATE_EQUIPMENT_SUCCEED,
  payload,
});

export const setUpdateEquipmentFailure = (payload: Object): BaseAction => ({
  type: EQUIPMENT_ACTIONS.SET_UPDATE_EQUIPMENT_FAILURE,
  payload,
});
export const resetUpdateEquipmentState = (): BaseAction => ({
  type: EQUIPMENT_ACTIONS.RESET_UPDATE_EQUIPMENT_STATE,
});

//DELETE Equipment
export const attemptToDeleteEquipment = (data: Object): BaseAction => ({
  type: EQUIPMENT_ACTIONS.ATTEMPT_TO_DELETE_EQUIPMENT,
  payload: data,
});
export const setDeleteEquipmentSucceed = (payload: Object): BaseAction => ({
  type: EQUIPMENT_ACTIONS.SET_DELETE_EQUIPMENT_SUCCEED,
  payload,
});

export const setDeleteEquipmentFailure = (payload: Object): BaseAction => ({
  type: EQUIPMENT_ACTIONS.SET_DELETE_EQUIPMENT_FAILURE,
  payload,
});
export const resetDeleteEquipmentState = (): BaseAction => ({
  type: EQUIPMENT_ACTIONS.RESET_DELETE_EQUIPMENT_STATE,
});
