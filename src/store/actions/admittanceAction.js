export const ADMITTANCE_ACTIONS = {
  ATTEMPT_TO_FETCH_ADMITTANCE: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_ADMITTANCE",
  SET_FETCH_ADMITTANCE_SUCCEED:
    "dashboard/@HOSPICE/SET_FETCH_ADMITTANCE_SUCCEED",
  SET_FETCH_ADMITTANCE_FAILURE:
    "dashboard/@HOSPICE/SET_FETCH_ADMITTANCE_FAILURE",
  RESET_FETCH_ADMITTANCE_STATE:
    "dashboard/@HOSPICE/RESET_FETCH_ADMITTANCE_STATE",

  ATTEMPT_TO_CREATE_ADMITTANCE:
    "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_ADMITTANCE",
  SET_CREATE_ADMITTANCE_SUCCEED:
    "dashboard/@HOSPICE/SET_CREATE_ADMITTANCE_SUCCEED",
  SET_CREATE_ADMITTANCE_FAILURE:
    "dashboard/@HOSPICE/SET_CREATE_ADMITTANCE_FAILURE",
  RESET_CREATE_ADMITTANCE_STATE:
    "dashboard/@HOSPICE/RESET_CREATE_ADMITTANCE_STATE",

  ATTEMPT_TO_UPDATE_ADMITTANCE:
    "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_ADMITTANCE",
  SET_UPDATE_ADMITTANCE_SUCCEED:
    "dashboard/@HOSPICE/SET_UPDATE_ADMITTANCE_SUCCEED",
  SET_UPDATE_ADMITTANCE_FAILURE:
    "dashboard/@HOSPICE/SET_UPDATE_ADMITTANCE_FAILURE",
  RESET_UPDATE_ADMITTANCE_STATE:
    "dashboard/@HOSPICE/RESET_UPDATE_ADMITTANCE_STATE",

  ATTEMPT_TO_DELETE_ADMITTANCE:
    "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_ADMITTANCE",
  SET_DELETE_ADMITTANCE_SUCCEED:
    "dashboard/@HOSPICE/SET_DELETE_ADMITTANCE_SUCCEED",
  SET_DELETE_ADMITTANCE_FAILURE:
    "dashboard/@HOSPICE/SET_DELETE_ADMITTANCE_FAILURE",
  RESET_DELETE_ADMITTANCE_STATE:
    "dashboard/@HOSPICE/RESET_DELETE_ADMITTANCE_STATE",
};
//FETCH Admittance
export const attemptToFetchAdmittance = (data: Object): BaseAction => ({
  type: ADMITTANCE_ACTIONS.ATTEMPT_TO_FETCH_ADMITTANCE,
  payload: data,
});
export const setFetchAdmittanceSucceed = (payload: Object): BaseAction => ({
  type: ADMITTANCE_ACTIONS.SET_FETCH_ADMITTANCE_SUCCEED,
  payload,
});

export const setFetchAdmittanceFailure = (payload: Object): BaseAction => ({
  type: ADMITTANCE_ACTIONS.SET_FETCH_ADMITTANCE_FAILURE,
  payload,
});
export const resetFetchAdmittanceState = (): BaseAction => ({
  type: ADMITTANCE_ACTIONS.RESET_FETCH_ADMITTANCE_STATE,
});

//CREATE Admittance
export const attemptToCreateAdmittance = (data: Object): BaseAction => ({
  type: ADMITTANCE_ACTIONS.ATTEMPT_TO_CREATE_ADMITTANCE,
  payload: data,
});
export const setCreateAdmittanceSucceed = (payload: Object): BaseAction => ({
  type: ADMITTANCE_ACTIONS.SET_CREATE_ADMITTANCE_SUCCEED,
  payload,
});

export const setCreateAdmittanceFailure = (payload: Object): BaseAction => ({
  type: ADMITTANCE_ACTIONS.SET_CREATE_ADMITTANCE_FAILURE,
  payload,
});
export const resetCreateAdmittanceState = (): BaseAction => ({
  type: ADMITTANCE_ACTIONS.RESET_CREATE_ADMITTANCE_STATE,
});

//UPDATE Admittance
export const attemptToUpdateAdmittance = (data: Object): BaseAction => ({
  type: ADMITTANCE_ACTIONS.ATTEMPT_TO_UPDATE_ADMITTANCE,
  payload: data,
});
export const setUpdateAdmittanceSucceed = (payload: Object): BaseAction => ({
  type: ADMITTANCE_ACTIONS.SET_UPDATE_ADMITTANCE_SUCCEED,
  payload,
});

export const setUpdateAdmittanceFailure = (payload: Object): BaseAction => ({
  type: ADMITTANCE_ACTIONS.SET_UPDATE_ADMITTANCE_FAILURE,
  payload,
});
export const resetUpdateAdmittanceState = (): BaseAction => ({
  type: ADMITTANCE_ACTIONS.RESET_UPDATE_ADMITTANCE_STATE,
});

//DELETE Admittance
export const attemptToDeleteAdmittance = (data: Object): BaseAction => ({
  type: ADMITTANCE_ACTIONS.ATTEMPT_TO_DELETE_ADMITTANCE,
  payload: data,
});
export const setDeleteAdmittanceSucceed = (payload: Object): BaseAction => ({
  type: ADMITTANCE_ACTIONS.SET_DELETE_ADMITTANCE_SUCCEED,
  payload,
});

export const setDeleteAdmittanceFailure = (payload: Object): BaseAction => ({
  type: ADMITTANCE_ACTIONS.SET_DELETE_ADMITTANCE_FAILURE,
  payload,
});
export const resetDeleteAdmittanceState = (): BaseAction => ({
  type: ADMITTANCE_ACTIONS.RESET_DELETE_ADMITTANCE_STATE,
});
