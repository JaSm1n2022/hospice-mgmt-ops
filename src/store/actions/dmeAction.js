export const DME_ACTIONS = {
  ATTEMPT_TO_FETCH_DME: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_DME",
  SET_FETCH_DME_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_DME_SUCCEED",
  SET_FETCH_DME_FAILURE: "dashboard/@HOSPICE/SET_FETCH_DME_FAILURE",
  RESET_FETCH_DME_STATE: "dashboard/@HOSPICE/RESET_FETCH_DME_STATE",

  ATTEMPT_TO_CREATE_DME: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_DME",
  SET_CREATE_DME_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_DME_SUCCEED",
  SET_CREATE_DME_FAILURE: "dashboard/@HOSPICE/SET_CREATE_DME_FAILURE",
  RESET_CREATE_DME_STATE: "dashboard/@HOSPICE/RESET_CREATE_DME_STATE",

  ATTEMPT_TO_UPDATE_DME: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_DME",
  SET_UPDATE_DME_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_DME_SUCCEED",
  SET_UPDATE_DME_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_DME_FAILURE",
  RESET_UPDATE_DME_STATE: "dashboard/@HOSPICE/RESET_UPDATE_DME_STATE",

  ATTEMPT_TO_DELETE_DME: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_DME",
  SET_DELETE_DME_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_DME_SUCCEED",
  SET_DELETE_DME_FAILURE: "dashboard/@HOSPICE/SET_DELETE_DME_FAILURE",
  RESET_DELETE_DME_STATE: "dashboard/@HOSPICE/RESET_DELETE_DME_STATE",
};
//FETCH Dme
export const attemptToFetchDme = (data: Object): BaseAction => ({
  type: DME_ACTIONS.ATTEMPT_TO_FETCH_DME,
  payload: data,
});
export const setFetchDmeSucceed = (payload: Object): BaseAction => ({
  type: DME_ACTIONS.SET_FETCH_DME_SUCCEED,
  payload,
});

export const setFetchDmeFailure = (payload: Object): BaseAction => ({
  type: DME_ACTIONS.SET_FETCH_DME_FAILURE,
  payload,
});
export const resetFetchDmeState = (): BaseAction => ({
  type: DME_ACTIONS.RESET_FETCH_DME_STATE,
});

//CREATE Dme
export const attemptToCreateDme = (data: Object): BaseAction => ({
  type: DME_ACTIONS.ATTEMPT_TO_CREATE_DME,
  payload: data,
});
export const setCreateDmeSucceed = (payload: Object): BaseAction => ({
  type: DME_ACTIONS.SET_CREATE_DME_SUCCEED,
  payload,
});

export const setCreateDmeFailure = (payload: Object): BaseAction => ({
  type: DME_ACTIONS.SET_CREATE_DME_FAILURE,
  payload,
});
export const resetCreateDmeState = (): BaseAction => ({
  type: DME_ACTIONS.RESET_CREATE_DME_STATE,
});

//UPDATE Dme
export const attemptToUpdateDme = (data: Object): BaseAction => ({
  type: DME_ACTIONS.ATTEMPT_TO_UPDATE_DME,
  payload: data,
});
export const setUpdateDmeSucceed = (payload: Object): BaseAction => ({
  type: DME_ACTIONS.SET_UPDATE_DME_SUCCEED,
  payload,
});

export const setUpdateDmeFailure = (payload: Object): BaseAction => ({
  type: DME_ACTIONS.SET_UPDATE_DME_FAILURE,
  payload,
});
export const resetUpdateDmeState = (): BaseAction => ({
  type: DME_ACTIONS.RESET_UPDATE_DME_STATE,
});

//DELETE Dme
export const attemptToDeleteDme = (data: Object): BaseAction => ({
  type: DME_ACTIONS.ATTEMPT_TO_DELETE_DME,
  payload: data,
});
export const setDeleteDmeSucceed = (payload: Object): BaseAction => ({
  type: DME_ACTIONS.SET_DELETE_DME_SUCCEED,
  payload,
});

export const setDeleteDmeFailure = (payload: Object): BaseAction => ({
  type: DME_ACTIONS.SET_DELETE_DME_FAILURE,
  payload,
});
export const resetDeleteDmeState = (): BaseAction => ({
  type: DME_ACTIONS.RESET_DELETE_DME_STATE,
});
