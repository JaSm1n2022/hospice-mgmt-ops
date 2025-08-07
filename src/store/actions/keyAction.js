export const KEY_ACTIONS = {
  ATTEMPT_TO_FETCH_KEY: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_KEY",
  SET_FETCH_KEY_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_KEY_SUCCEED",
  SET_FETCH_KEY_FAILURE: "dashboard/@HOSPICE/SET_FETCH_KEY_FAILURE",
  RESET_FETCH_KEY_STATE: "dashboard/@HOSPICE/RESET_FETCH_KEY_STATE",

  ATTEMPT_TO_CREATE_KEY: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_KEY",
  SET_CREATE_KEY_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_KEY_SUCCEED",
  SET_CREATE_KEY_FAILURE: "dashboard/@HOSPICE/SET_CREATE_KEY_FAILURE",
  RESET_CREATE_KEY_STATE: "dashboard/@HOSPICE/RESET_CREATE_KEY_STATE",

  ATTEMPT_TO_UPDATE_KEY: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_KEY",
  SET_UPDATE_KEY_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_KEY_SUCCEED",
  SET_UPDATE_KEY_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_KEY_FAILURE",
  RESET_UPDATE_KEY_STATE: "dashboard/@HOSPICE/RESET_UPDATE_KEY_STATE",

  ATTEMPT_TO_DELETE_KEY: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_KEY",
  SET_DELETE_KEY_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_KEY_SUCCEED",
  SET_DELETE_KEY_FAILURE: "dashboard/@HOSPICE/SET_DELETE_KEY_FAILURE",
  RESET_DELETE_KEY_STATE: "dashboard/@HOSPICE/RESET_DELETE_KEY_STATE",
};
//FETCH Key
export const attemptToFetchKey = (data: Object): BaseAction => ({
  type: KEY_ACTIONS.ATTEMPT_TO_FETCH_KEY,
  payload: data,
});
export const setFetchKeySucceed = (payload: Object): BaseAction => ({
  type: KEY_ACTIONS.SET_FETCH_KEY_SUCCEED,
  payload,
});

export const setFetchKeyFailure = (payload: Object): BaseAction => ({
  type: KEY_ACTIONS.SET_FETCH_KEY_FAILURE,
  payload,
});
export const resetFetchKeyState = (): BaseAction => ({
  type: KEY_ACTIONS.RESET_FETCH_KEY_STATE,
});

//CREATE Key
export const attemptToCreateKey = (data: Object): BaseAction => ({
  type: KEY_ACTIONS.ATTEMPT_TO_CREATE_KEY,
  payload: data,
});
export const setCreateKeySucceed = (payload: Object): BaseAction => ({
  type: KEY_ACTIONS.SET_CREATE_KEY_SUCCEED,
  payload,
});

export const setCreateKeyFailure = (payload: Object): BaseAction => ({
  type: KEY_ACTIONS.SET_CREATE_KEY_FAILURE,
  payload,
});
export const resetCreateKeyState = (): BaseAction => ({
  type: KEY_ACTIONS.RESET_CREATE_KEY_STATE,
});

//UPDATE Key
export const attemptToUpdateKey = (data: Object): BaseAction => ({
  type: KEY_ACTIONS.ATTEMPT_TO_UPDATE_KEY,
  payload: data,
});
export const setUpdateKeySucceed = (payload: Object): BaseAction => ({
  type: KEY_ACTIONS.SET_UPDATE_KEY_SUCCEED,
  payload,
});

export const setUpdateKeyFailure = (payload: Object): BaseAction => ({
  type: KEY_ACTIONS.SET_UPDATE_KEY_FAILURE,
  payload,
});
export const resetUpdateKeyState = (): BaseAction => ({
  type: KEY_ACTIONS.RESET_UPDATE_KEY_STATE,
});

//DELETE Key
export const attemptToDeleteKey = (data: Object): BaseAction => ({
  type: KEY_ACTIONS.ATTEMPT_TO_DELETE_KEY,
  payload: data,
});
export const setDeleteKeySucceed = (payload: Object): BaseAction => ({
  type: KEY_ACTIONS.SET_DELETE_KEY_SUCCEED,
  payload,
});

export const setDeleteKeyFailure = (payload: Object): BaseAction => ({
  type: KEY_ACTIONS.SET_DELETE_KEY_FAILURE,
  payload,
});
export const resetDeleteKeyState = (): BaseAction => ({
  type: KEY_ACTIONS.RESET_DELETE_KEY_STATE,
});
