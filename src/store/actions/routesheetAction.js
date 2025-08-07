export const ROUTESHEET_ACTIONS = {
  ATTEMPT_TO_FETCH_ROUTESHEET: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_ROUTESHEET",
  SET_FETCH_ROUTESHEET_SUCCEED:
    "dashboard/@HOSPICE/SET_FETCH_ROUTESHEET_SUCCEED",
  SET_FETCH_ROUTESHEET_FAILURE:
    "dashboard/@HOSPICE/SET_FETCH_ROUTESHEET_FAILURE",
  RESET_FETCH_ROUTESHEET_STATE:
    "dashboard/@HOSPICE/RESET_FETCH_ROUTESHEET_STATE",

  ATTEMPT_TO_CREATE_ROUTESHEET:
    "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_ROUTESHEET",
  SET_CREATE_ROUTESHEET_SUCCEED:
    "dashboard/@HOSPICE/SET_CREATE_ROUTESHEET_SUCCEED",
  SET_CREATE_ROUTESHEET_FAILURE:
    "dashboard/@HOSPICE/SET_CREATE_ROUTESHEET_FAILURE",
  RESET_CREATE_ROUTESHEET_STATE:
    "dashboard/@HOSPICE/RESET_CREATE_ROUTESHEET_STATE",

  ATTEMPT_TO_UPDATE_ROUTESHEET:
    "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_ROUTESHEET",
  SET_UPDATE_ROUTESHEET_SUCCEED:
    "dashboard/@HOSPICE/SET_UPDATE_ROUTESHEET_SUCCEED",
  SET_UPDATE_ROUTESHEET_FAILURE:
    "dashboard/@HOSPICE/SET_UPDATE_ROUTESHEET_FAILURE",
  RESET_UPDATE_ROUTESHEET_STATE:
    "dashboard/@HOSPICE/RESET_UPDATE_ROUTESHEET_STATE",

  ATTEMPT_TO_DELETE_ROUTESHEET:
    "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_ROUTESHEET",
  SET_DELETE_ROUTESHEET_SUCCEED:
    "dashboard/@HOSPICE/SET_DELETE_ROUTESHEET_SUCCEED",
  SET_DELETE_ROUTESHEET_FAILURE:
    "dashboard/@HOSPICE/SET_DELETE_ROUTESHEET_FAILURE",
  RESET_DELETE_ROUTESHEET_STATE:
    "dashboard/@HOSPICE/RESET_DELETE_ROUTESHEET_STATE",
};
//FETCH ROUTESHEET
export const attemptToFetchRoutesheet = (data: Object): BaseAction => ({
  type: ROUTESHEET_ACTIONS.ATTEMPT_TO_FETCH_ROUTESHEET,
  payload: data,
});
export const setFetchRoutesheetSucceed = (payload: Object): BaseAction => ({
  type: ROUTESHEET_ACTIONS.SET_FETCH_ROUTESHEET_SUCCEED,
  payload,
});

export const setFetchRoutesheetFailure = (payload: Object): BaseAction => ({
  type: ROUTESHEET_ACTIONS.SET_FETCH_ROUTESHEET_FAILURE,
  payload,
});
export const resetFetchRoutesheetState = (): BaseAction => ({
  type: ROUTESHEET_ACTIONS.RESET_FETCH_ROUTESHEET_STATE,
});

//CREATE ROUTESHEET
export const attemptToCreateRoutesheet = (data: Object): BaseAction => ({
  type: ROUTESHEET_ACTIONS.ATTEMPT_TO_CREATE_ROUTESHEET,
  payload: data,
});
export const setCreateRoutesheetSucceed = (payload: Object): BaseAction => ({
  type: ROUTESHEET_ACTIONS.SET_CREATE_ROUTESHEET_SUCCEED,
  payload,
});

export const setCreateRoutesheetFailure = (payload: Object): BaseAction => ({
  type: ROUTESHEET_ACTIONS.SET_CREATE_ROUTESHEET_FAILURE,
  payload,
});
export const resetCreateRoutesheetState = (): BaseAction => ({
  type: ROUTESHEET_ACTIONS.RESET_CREATE_ROUTESHEET_STATE,
});

//UPDATE ROUTESHEET
export const attemptToUpdateRoutesheet = (data: Object): BaseAction => ({
  type: ROUTESHEET_ACTIONS.ATTEMPT_TO_UPDATE_ROUTESHEET,
  payload: data,
});
export const setUpdateRoutesheetSucceed = (payload: Object): BaseAction => ({
  type: ROUTESHEET_ACTIONS.SET_UPDATE_ROUTESHEET_SUCCEED,
  payload,
});

export const setUpdateRoutesheetFailure = (payload: Object): BaseAction => ({
  type: ROUTESHEET_ACTIONS.SET_UPDATE_ROUTESHEET_FAILURE,
  payload,
});
export const resetUpdateRoutesheetState = (): BaseAction => ({
  type: ROUTESHEET_ACTIONS.RESET_UPDATE_ROUTESHEET_STATE,
});

//DELETE ROUTESHEET
export const attemptToDeleteRoutesheet = (data: Object): BaseAction => ({
  type: ROUTESHEET_ACTIONS.ATTEMPT_TO_DELETE_ROUTESHEET,
  payload: data,
});
export const setDeleteRoutesheetSucceed = (payload: Object): BaseAction => ({
  type: ROUTESHEET_ACTIONS.SET_DELETE_ROUTESHEET_SUCCEED,
  payload,
});

export const setDeleteRoutesheetFailure = (payload: Object): BaseAction => ({
  type: ROUTESHEET_ACTIONS.SET_DELETE_ROUTESHEET_FAILURE,
  payload,
});
export const resetDeleteRoutesheetState = (): BaseAction => ({
  type: ROUTESHEET_ACTIONS.RESET_DELETE_ROUTESHEET_STATE,
});
