export const PAYDAY_ACTIONS = {
  ATTEMPT_TO_FETCH_PAYDAY: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_PAYDAY",
  SET_FETCH_PAYDAY_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_PAYDAY_SUCCEED",
  SET_FETCH_PAYDAY_FAILURE: "dashboard/@HOSPICE/SET_FETCH_PAYDAY_FAILURE",
  RESET_FETCH_PAYDAY_STATE: "dashboard/@HOSPICE/RESET_FETCH_PAYDAY_STATE",

  ATTEMPT_TO_CREATE_PAYDAY: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_PAYDAY",
  SET_CREATE_PAYDAY_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_PAYDAY_SUCCEED",
  SET_CREATE_PAYDAY_FAILURE: "dashboard/@HOSPICE/SET_CREATE_PAYDAY_FAILURE",
  RESET_CREATE_PAYDAY_STATE: "dashboard/@HOSPICE/RESET_CREATE_PAYDAY_STATE",

  ATTEMPT_TO_UPDATE_PAYDAY: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_PAYDAY",
  SET_UPDATE_PAYDAY_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_PAYDAY_SUCCEED",
  SET_UPDATE_PAYDAY_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_PAYDAY_FAILURE",
  RESET_UPDATE_PAYDAY_STATE: "dashboard/@HOSPICE/RESET_UPDATE_PAYDAY_STATE",

  ATTEMPT_TO_DELETE_PAYDAY: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_PAYDAY",
  SET_DELETE_PAYDAY_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_PAYDAY_SUCCEED",
  SET_DELETE_PAYDAY_FAILURE: "dashboard/@HOSPICE/SET_DELETE_PAYDAY_FAILURE",
  RESET_DELETE_PAYDAY_STATE: "dashboard/@HOSPICE/RESET_DELETE_PAYDAY_STATE",
};
//FETCH Payday
export const attemptToFetchPayday = (data: Object): BaseAction => ({
  type: PAYDAY_ACTIONS.ATTEMPT_TO_FETCH_PAYDAY,
  payload: data,
});
export const setFetchPaydaySucceed = (payload: Object): BaseAction => ({
  type: PAYDAY_ACTIONS.SET_FETCH_PAYDAY_SUCCEED,
  payload,
});

export const setFetchPaydayFailure = (payload: Object): BaseAction => ({
  type: PAYDAY_ACTIONS.SET_FETCH_PAYDAY_FAILURE,
  payload,
});
export const resetFetchPaydayState = (): BaseAction => ({
  type: PAYDAY_ACTIONS.RESET_FETCH_PAYDAY_STATE,
});

//CREATE Payday
export const attemptToCreatePayday = (data: Object): BaseAction => ({
  type: PAYDAY_ACTIONS.ATTEMPT_TO_CREATE_PAYDAY,
  payload: data,
});
export const setCreatePaydaySucceed = (payload: Object): BaseAction => ({
  type: PAYDAY_ACTIONS.SET_CREATE_PAYDAY_SUCCEED,
  payload,
});

export const setCreatePaydayFailure = (payload: Object): BaseAction => ({
  type: PAYDAY_ACTIONS.SET_CREATE_PAYDAY_FAILURE,
  payload,
});
export const resetCreatePaydayState = (): BaseAction => ({
  type: PAYDAY_ACTIONS.RESET_CREATE_PAYDAY_STATE,
});

//UPDATE Payday
export const attemptToUpdatePayday = (data: Object): BaseAction => ({
  type: PAYDAY_ACTIONS.ATTEMPT_TO_UPDATE_PAYDAY,
  payload: data,
});
export const setUpdatePaydaySucceed = (payload: Object): BaseAction => ({
  type: PAYDAY_ACTIONS.SET_UPDATE_PAYDAY_SUCCEED,
  payload,
});

export const setUpdatePaydayFailure = (payload: Object): BaseAction => ({
  type: PAYDAY_ACTIONS.SET_UPDATE_PAYDAY_FAILURE,
  payload,
});
export const resetUpdatePaydayState = (): BaseAction => ({
  type: PAYDAY_ACTIONS.RESET_UPDATE_PAYDAY_STATE,
});

//DELETE Payday
export const attemptToDeletePayday = (data: Object): BaseAction => ({
  type: PAYDAY_ACTIONS.ATTEMPT_TO_DELETE_PAYDAY,
  payload: data,
});
export const setDeletePaydaySucceed = (payload: Object): BaseAction => ({
  type: PAYDAY_ACTIONS.SET_DELETE_PAYDAY_SUCCEED,
  payload,
});

export const setDeletePaydayFailure = (payload: Object): BaseAction => ({
  type: PAYDAY_ACTIONS.SET_DELETE_PAYDAY_FAILURE,
  payload,
});
export const resetDeletePaydayState = (): BaseAction => ({
  type: PAYDAY_ACTIONS.RESET_DELETE_PAYDAY_STATE,
});
