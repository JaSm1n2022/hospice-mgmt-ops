export const PROFILE_ACTIONS = {
  ATTEMPT_TO_FETCH_PROFILE: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_PROFILE",
  SET_FETCH_PROFILE_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_PROFILE_SUCCEED",
  SET_FETCH_PROFILE_FAILURE: "dashboard/@HOSPICE/SET_FETCH_PROFILE_FAILURE",
  RESET_FETCH_PROFILE_STATE: "dashboard/@HOSPICE/RESET_FETCH_PROFILE_STATE",

  ATTEMPT_TO_CREATE_PROFILE: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_PROFILE",
  SET_CREATE_PROFILE_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_PROFILE_SUCCEED",
  SET_CREATE_PROFILE_FAILURE: "dashboard/@HOSPICE/SET_CREATE_PROFILE_FAILURE",
  RESET_CREATE_PROFILE_STATE: "dashboard/@HOSPICE/RESET_CREATE_PROFILE_STATE",

  ATTEMPT_TO_UPDATE_PROFILE: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_PROFILE",
  SET_UPDATE_PROFILE_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_PROFILE_SUCCEED",
  SET_UPDATE_PROFILE_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_PROFILE_FAILURE",
  RESET_UPDATE_PROFILE_STATE: "dashboard/@HOSPICE/RESET_UPDATE_PROFILE_STATE",

  ATTEMPT_TO_DELETE_PROFILE: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_PROFILE",
  SET_DELETE_PROFILE_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_PROFILE_SUCCEED",
  SET_DELETE_PROFILE_FAILURE: "dashboard/@HOSPICE/SET_DELETE_PROFILE_FAILURE",
  RESET_DELETE_PROFILE_STATE: "dashboard/@HOSPICE/RESET_DELETE_PROFILE_STATE",
};
//FETCH PROFILE
export const attemptToFetchProfile = (data: Object): BaseAction => ({
  type: PROFILE_ACTIONS.ATTEMPT_TO_FETCH_PROFILE,
  payload: data,
});
export const setFetchProfileSucceed = (payload: Object): BaseAction => ({
  type: PROFILE_ACTIONS.SET_FETCH_PROFILE_SUCCEED,
  payload,
});

export const setFetchProfileFailure = (payload: Object): BaseAction => ({
  type: PROFILE_ACTIONS.SET_FETCH_PROFILE_FAILURE,
  payload,
});
export const resetFetchProfileState = (): BaseAction => ({
  type: PROFILE_ACTIONS.RESET_FETCH_PROFILE_STATE,
});

//CREATE PROFILE
export const attemptToCreateProfile = (data: Object): BaseAction => ({
  type: PROFILE_ACTIONS.ATTEMPT_TO_CREATE_PROFILE,
  payload: data,
});
export const setCreateProfileSucceed = (payload: Object): BaseAction => ({
  type: PROFILE_ACTIONS.SET_CREATE_PROFILE_SUCCEED,
  payload,
});

export const setCreateProfileFailure = (payload: Object): BaseAction => ({
  type: PROFILE_ACTIONS.SET_CREATE_PROFILE_FAILURE,
  payload,
});
export const resetCreateProfileState = (): BaseAction => ({
  type: PROFILE_ACTIONS.RESET_CREATE_PROFILE_STATE,
});

//UPDATE PROFILE
export const attemptToUpdateProfile = (data: Object): BaseAction => ({
  type: PROFILE_ACTIONS.ATTEMPT_TO_UPDATE_PROFILE,
  payload: data,
});
export const setUpdateProfileSucceed = (payload: Object): BaseAction => ({
  type: PROFILE_ACTIONS.SET_UPDATE_PROFILE_SUCCEED,
  payload,
});

export const setUpdateProfileFailure = (payload: Object): BaseAction => ({
  type: PROFILE_ACTIONS.SET_UPDATE_PROFILE_FAILURE,
  payload,
});
export const resetUpdateProfileState = (): BaseAction => ({
  type: PROFILE_ACTIONS.RESET_UPDATE_PROFILE_STATE,
});

//DELETE PROFILE
export const attemptToDeleteProfile = (data: Object): BaseAction => ({
  type: PROFILE_ACTIONS.ATTEMPT_TO_DELETE_PROFILE,
  payload: data,
});
export const setDeleteProfileSucceed = (payload: Object): BaseAction => ({
  type: PROFILE_ACTIONS.SET_DELETE_PROFILE_SUCCEED,
  payload,
});

export const setDeleteProfileFailure = (payload: Object): BaseAction => ({
  type: PROFILE_ACTIONS.SET_DELETE_PROFILE_FAILURE,
  payload,
});
export const resetDeleteProfileState = (): BaseAction => ({
  type: PROFILE_ACTIONS.RESET_DELETE_PROFILE_STATE,
});
