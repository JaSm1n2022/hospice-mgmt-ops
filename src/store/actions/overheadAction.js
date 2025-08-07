export const OVERHEAD_ACTIONS = {
  ATTEMPT_TO_FETCH_OVERHEAD: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_OVERHEAD",
  SET_FETCH_OVERHEAD_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_OVERHEAD_SUCCEED",
  SET_FETCH_OVERHEAD_FAILURE: "dashboard/@HOSPICE/SET_FETCH_OVERHEAD_FAILURE",
  RESET_FETCH_OVERHEAD_STATE: "dashboard/@HOSPICE/RESET_FETCH_OVERHEAD_STATE",

  ATTEMPT_TO_CREATE_OVERHEAD: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_OVERHEAD",
  SET_CREATE_OVERHEAD_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_OVERHEAD_SUCCEED",
  SET_CREATE_OVERHEAD_FAILURE: "dashboard/@HOSPICE/SET_CREATE_OVERHEAD_FAILURE",
  RESET_CREATE_OVERHEAD_STATE: "dashboard/@HOSPICE/RESET_CREATE_OVERHEAD_STATE",

  ATTEMPT_TO_UPDATE_OVERHEAD: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_OVERHEAD",
  SET_UPDATE_OVERHEAD_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_OVERHEAD_SUCCEED",
  SET_UPDATE_OVERHEAD_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_OVERHEAD_FAILURE",
  RESET_UPDATE_OVERHEAD_STATE: "dashboard/@HOSPICE/RESET_UPDATE_OVERHEAD_STATE",

  ATTEMPT_TO_DELETE_OVERHEAD: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_OVERHEAD",
  SET_DELETE_OVERHEAD_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_OVERHEAD_SUCCEED",
  SET_DELETE_OVERHEAD_FAILURE: "dashboard/@HOSPICE/SET_DELETE_OVERHEAD_FAILURE",
  RESET_DELETE_OVERHEAD_STATE: "dashboard/@HOSPICE/RESET_DELETE_OVERHEAD_STATE",
};
//FETCH Overhead
export const attemptToFetchOverhead = (data: Object): BaseAction => ({
  type: OVERHEAD_ACTIONS.ATTEMPT_TO_FETCH_OVERHEAD,
  payload: data,
});
export const setFetchOverheadSucceed = (payload: Object): BaseAction => ({
  type: OVERHEAD_ACTIONS.SET_FETCH_OVERHEAD_SUCCEED,
  payload,
});

export const setFetchOverheadFailure = (payload: Object): BaseAction => ({
  type: OVERHEAD_ACTIONS.SET_FETCH_OVERHEAD_FAILURE,
  payload,
});
export const resetFetchOverheadState = (): BaseAction => ({
  type: OVERHEAD_ACTIONS.RESET_FETCH_OVERHEAD_STATE,
});

//CREATE Overhead
export const attemptToCreateOverhead = (data: Object): BaseAction => ({
  type: OVERHEAD_ACTIONS.ATTEMPT_TO_CREATE_OVERHEAD,
  payload: data,
});
export const setCreateOverheadSucceed = (payload: Object): BaseAction => ({
  type: OVERHEAD_ACTIONS.SET_CREATE_OVERHEAD_SUCCEED,
  payload,
});

export const setCreateOverheadFailure = (payload: Object): BaseAction => ({
  type: OVERHEAD_ACTIONS.SET_CREATE_OVERHEAD_FAILURE,
  payload,
});
export const resetCreateOverheadState = (): BaseAction => ({
  type: OVERHEAD_ACTIONS.RESET_CREATE_OVERHEAD_STATE,
});

//UPDATE Overhead
export const attemptToUpdateOverhead = (data: Object): BaseAction => ({
  type: OVERHEAD_ACTIONS.ATTEMPT_TO_UPDATE_OVERHEAD,
  payload: data,
});
export const setUpdateOverheadSucceed = (payload: Object): BaseAction => ({
  type: OVERHEAD_ACTIONS.SET_UPDATE_OVERHEAD_SUCCEED,
  payload,
});

export const setUpdateOverheadFailure = (payload: Object): BaseAction => ({
  type: OVERHEAD_ACTIONS.SET_UPDATE_OVERHEAD_FAILURE,
  payload,
});
export const resetUpdateOverheadState = (): BaseAction => ({
  type: OVERHEAD_ACTIONS.RESET_UPDATE_OVERHEAD_STATE,
});

//DELETE Overhead
export const attemptToDeleteOverhead = (data: Object): BaseAction => ({
  type: OVERHEAD_ACTIONS.ATTEMPT_TO_DELETE_OVERHEAD,
  payload: data,
});
export const setDeleteOverheadSucceed = (payload: Object): BaseAction => ({
  type: OVERHEAD_ACTIONS.SET_DELETE_OVERHEAD_SUCCEED,
  payload,
});

export const setDeleteOverheadFailure = (payload: Object): BaseAction => ({
  type: OVERHEAD_ACTIONS.SET_DELETE_OVERHEAD_FAILURE,
  payload,
});
export const resetDeleteOverheadState = (): BaseAction => ({
  type: OVERHEAD_ACTIONS.RESET_DELETE_OVERHEAD_STATE,
});
