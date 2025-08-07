export const CERTIFICATION_ACTIONS = {
  ATTEMPT_TO_FETCH_CERTIFICATION:
    "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_CERTIFICATION",
  SET_FETCH_CERTIFICATION_SUCCEED:
    "dashboard/@HOSPICE/SET_FETCH_CERTIFICATION_SUCCEED",
  SET_FETCH_CERTIFICATION_FAILURE:
    "dashboard/@HOSPICE/SET_FETCH_CERTIFICATION_FAILURE",
  RESET_FETCH_CERTIFICATION_STATE:
    "dashboard/@HOSPICE/RESET_FETCH_CERTIFICATION_STATE",

  ATTEMPT_TO_CREATE_CERTIFICATION:
    "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_CERTIFICATION",
  SET_CREATE_CERTIFICATION_SUCCEED:
    "dashboard/@HOSPICE/SET_CREATE_CERTIFICATION_SUCCEED",
  SET_CREATE_CERTIFICATION_FAILURE:
    "dashboard/@HOSPICE/SET_CREATE_CERTIFICATION_FAILURE",
  RESET_CREATE_CERTIFICATION_STATE:
    "dashboard/@HOSPICE/RESET_CREATE_CERTIFICATION_STATE",

  ATTEMPT_TO_UPDATE_CERTIFICATION:
    "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_CERTIFICATION",
  SET_UPDATE_CERTIFICATION_SUCCEED:
    "dashboard/@HOSPICE/SET_UPDATE_CERTIFICATION_SUCCEED",
  SET_UPDATE_CERTIFICATION_FAILURE:
    "dashboard/@HOSPICE/SET_UPDATE_CERTIFICATION_FAILURE",
  RESET_UPDATE_CERTIFICATION_STATE:
    "dashboard/@HOSPICE/RESET_UPDATE_CERTIFICATION_STATE",

  ATTEMPT_TO_DELETE_CERTIFICATION:
    "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_CERTIFICATION",
  SET_DELETE_CERTIFICATION_SUCCEED:
    "dashboard/@HOSPICE/SET_DELETE_CERTIFICATION_SUCCEED",
  SET_DELETE_CERTIFICATION_FAILURE:
    "dashboard/@HOSPICE/SET_DELETE_CERTIFICATION_FAILURE",
  RESET_DELETE_CERTIFICATION_STATE:
    "dashboard/@HOSPICE/RESET_DELETE_CERTIFICATION_STATE",
};
//FETCH CERTIFICATION
export const attemptToFetchCertification = (data: Object): BaseAction => ({
  type: CERTIFICATION_ACTIONS.ATTEMPT_TO_FETCH_CERTIFICATION,
  payload: data,
});
export const setFetchCertificationSucceed = (payload: Object): BaseAction => ({
  type: CERTIFICATION_ACTIONS.SET_FETCH_CERTIFICATION_SUCCEED,
  payload,
});

export const setFetchCertificationFailure = (payload: Object): BaseAction => ({
  type: CERTIFICATION_ACTIONS.SET_FETCH_CERTIFICATION_FAILURE,
  payload,
});
export const resetFetchCertificationState = (): BaseAction => ({
  type: CERTIFICATION_ACTIONS.RESET_FETCH_CERTIFICATION_STATE,
});

//CREATE CERTIFICATION
export const attemptToCreateCertification = (data: Object): BaseAction => ({
  type: CERTIFICATION_ACTIONS.ATTEMPT_TO_CREATE_CERTIFICATION,
  payload: data,
});
export const setCreateCertificationSucceed = (payload: Object): BaseAction => ({
  type: CERTIFICATION_ACTIONS.SET_CREATE_CERTIFICATION_SUCCEED,
  payload,
});

export const setCreateCertificationFailure = (payload: Object): BaseAction => ({
  type: CERTIFICATION_ACTIONS.SET_CREATE_CERTIFICATION_FAILURE,
  payload,
});
export const resetCreateCertificationState = (): BaseAction => ({
  type: CERTIFICATION_ACTIONS.RESET_CREATE_CERTIFICATION_STATE,
});

//UPDATE CERTIFICATION
export const attemptToUpdateCertification = (data: Object): BaseAction => ({
  type: CERTIFICATION_ACTIONS.ATTEMPT_TO_UPDATE_CERTIFICATION,
  payload: data,
});
export const setUpdateCertificationSucceed = (payload: Object): BaseAction => ({
  type: CERTIFICATION_ACTIONS.SET_UPDATE_CERTIFICATION_SUCCEED,
  payload,
});

export const setUpdateCertificationFailure = (payload: Object): BaseAction => ({
  type: CERTIFICATION_ACTIONS.SET_UPDATE_CERTIFICATION_FAILURE,
  payload,
});
export const resetUpdateCertificationState = (): BaseAction => ({
  type: CERTIFICATION_ACTIONS.RESET_UPDATE_CERTIFICATION_STATE,
});

//DELETE CERTIFICATION
export const attemptToDeleteCertification = (data: Object): BaseAction => ({
  type: CERTIFICATION_ACTIONS.ATTEMPT_TO_DELETE_CERTIFICATION,
  payload: data,
});
export const setDeleteCertificationSucceed = (payload: Object): BaseAction => ({
  type: CERTIFICATION_ACTIONS.SET_DELETE_CERTIFICATION_SUCCEED,
  payload,
});

export const setDeleteCertificationFailure = (payload: Object): BaseAction => ({
  type: CERTIFICATION_ACTIONS.SET_DELETE_CERTIFICATION_FAILURE,
  payload,
});
export const resetDeleteCertificationState = (): BaseAction => ({
  type: CERTIFICATION_ACTIONS.RESET_DELETE_CERTIFICATION_STATE,
});
