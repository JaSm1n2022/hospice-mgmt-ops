export const CALLS_ACTIONS = {
  ATTEMPT_TO_FETCH_CALLS: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_CALLS",
  SET_FETCH_CALLS_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_CALLS_SUCCEED",
  SET_FETCH_CALLS_FAILURE: "dashboard/@HOSPICE/SET_FETCH_CALLS_FAILURE",
  RESET_FETCH_CALLS_STATE: "dashboard/@HOSPICE/RESET_FETCH_CALLS_STATE",

  ATTEMPT_TO_CREATE_CALLS: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_CALLS",
  SET_CREATE_CALLS_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_CALLS_SUCCEED",
  SET_CREATE_CALLS_FAILURE: "dashboard/@HOSPICE/SET_CREATE_CALLS_FAILURE",
  RESET_CREATE_CALLS_STATE: "dashboard/@HOSPICE/RESET_CREATE_CALLS_STATE",

  ATTEMPT_TO_UPDATE_CALLS: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_CALLS",
  SET_UPDATE_CALLS_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_CALLS_SUCCEED",
  SET_UPDATE_CALLS_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_CALLS_FAILURE",
  RESET_UPDATE_CALLS_STATE: "dashboard/@HOSPICE/RESET_UPDATE_CALLS_STATE",

  ATTEMPT_TO_DELETE_CALLS: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_CALLS",
  SET_DELETE_CALLS_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_CALLS_SUCCEED",
  SET_DELETE_CALLS_FAILURE: "dashboard/@HOSPICE/SET_DELETE_CALLS_FAILURE",
  RESET_DELETE_CALLS_STATE: "dashboard/@HOSPICE/RESET_DELETE_CALLS_STATE",
};
//FETCH Calls
export const attemptToFetchCalls = (data: Object): BaseAction => ({
  type: CALLS_ACTIONS.ATTEMPT_TO_FETCH_CALLS,
  payload: data,
});
export const setFetchCallsSucceed = (payload: Object): BaseAction => ({
  type: CALLS_ACTIONS.SET_FETCH_CALLS_SUCCEED,
  payload,
});

export const setFetchCallsFailure = (payload: Object): BaseAction => ({
  type: CALLS_ACTIONS.SET_FETCH_CALLS_FAILURE,
  payload,
});
export const resetFetchCallsState = (): BaseAction => ({
  type: CALLS_ACTIONS.RESET_FETCH_CALLS_STATE,
});

//CREATE Calls
export const attemptToCreateCalls = (data: Object): BaseAction => ({
  type: CALLS_ACTIONS.ATTEMPT_TO_CREATE_CALLS,
  payload: data,
});
export const setCreateCallsSucceed = (payload: Object): BaseAction => ({
  type: CALLS_ACTIONS.SET_CREATE_CALLS_SUCCEED,
  payload,
});

export const setCreateCallsFailure = (payload: Object): BaseAction => ({
  type: CALLS_ACTIONS.SET_CREATE_CALLS_FAILURE,
  payload,
});
export const resetCreateCallsState = (): BaseAction => ({
  type: CALLS_ACTIONS.RESET_CREATE_CALLS_STATE,
});

//UPDATE Calls
export const attemptToUpdateCalls = (data: Object): BaseAction => ({
  type: CALLS_ACTIONS.ATTEMPT_TO_UPDATE_CALLS,
  payload: data,
});
export const setUpdateCallsSucceed = (payload: Object): BaseAction => ({
  type: CALLS_ACTIONS.SET_UPDATE_CALLS_SUCCEED,
  payload,
});

export const setUpdateCallsFailure = (payload: Object): BaseAction => ({
  type: CALLS_ACTIONS.SET_UPDATE_CALLS_FAILURE,
  payload,
});
export const resetUpdateCallsState = (): BaseAction => ({
  type: CALLS_ACTIONS.RESET_UPDATE_CALLS_STATE,
});

//DELETE Calls
export const attemptToDeleteCalls = (data: Object): BaseAction => ({
  type: CALLS_ACTIONS.ATTEMPT_TO_DELETE_CALLS,
  payload: data,
});
export const setDeleteCallsSucceed = (payload: Object): BaseAction => ({
  type: CALLS_ACTIONS.SET_DELETE_CALLS_SUCCEED,
  payload,
});

export const setDeleteCallsFailure = (payload: Object): BaseAction => ({
  type: CALLS_ACTIONS.SET_DELETE_CALLS_FAILURE,
  payload,
});
export const resetDeleteCallsState = (): BaseAction => ({
  type: CALLS_ACTIONS.RESET_DELETE_CALLS_STATE,
});
