export const TRANSPORTATION_ACTIONS = {
  ATTEMPT_TO_FETCH_TRANSPORTATION:
    "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_TRANSPORTATION",
  SET_FETCH_TRANSPORTATION_SUCCEED:
    "dashboard/@HOSPICE/SET_FETCH_TRANSPORTATION_SUCCEED",
  SET_FETCH_TRANSPORTATION_FAILURE:
    "dashboard/@HOSPICE/SET_FETCH_TRANSPORTATION_FAILURE",
  RESET_FETCH_TRANSPORTATION_STATE:
    "dashboard/@HOSPICE/RESET_FETCH_TRANSPORTATION_STATE",

  ATTEMPT_TO_CREATE_TRANSPORTATION:
    "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_TRANSPORTATION",
  SET_CREATE_TRANSPORTATION_SUCCEED:
    "dashboard/@HOSPICE/SET_CREATE_TRANSPORTATION_SUCCEED",
  SET_CREATE_TRANSPORTATION_FAILURE:
    "dashboard/@HOSPICE/SET_CREATE_TRANSPORTATION_FAILURE",
  RESET_CREATE_TRANSPORTATION_STATE:
    "dashboard/@HOSPICE/RESET_CREATE_TRANSPORTATION_STATE",

  ATTEMPT_TO_UPDATE_TRANSPORTATION:
    "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_TRANSPORTATION",
  SET_UPDATE_TRANSPORTATION_SUCCEED:
    "dashboard/@HOSPICE/SET_UPDATE_TRANSPORTATION_SUCCEED",
  SET_UPDATE_TRANSPORTATION_FAILURE:
    "dashboard/@HOSPICE/SET_UPDATE_TRANSPORTATION_FAILURE",
  RESET_UPDATE_TRANSPORTATION_STATE:
    "dashboard/@HOSPICE/RESET_UPDATE_TRANSPORTATION_STATE",

  ATTEMPT_TO_DELETE_TRANSPORTATION:
    "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_TRANSPORTATION",
  SET_DELETE_TRANSPORTATION_SUCCEED:
    "dashboard/@HOSPICE/SET_DELETE_TRANSPORTATION_SUCCEED",
  SET_DELETE_TRANSPORTATION_FAILURE:
    "dashboard/@HOSPICE/SET_DELETE_TRANSPORTATION_FAILURE",
  RESET_DELETE_TRANSPORTATION_STATE:
    "dashboard/@HOSPICE/RESET_DELETE_TRANSPORTATION_STATE",
};
//FETCH Transportation
export const attemptToFetchTransportation = (data: Object): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.ATTEMPT_TO_FETCH_TRANSPORTATION,
  payload: data,
});
export const setFetchTransportationSucceed = (payload: Object): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.SET_FETCH_TRANSPORTATION_SUCCEED,
  payload,
});

export const setFetchTransportationFailure = (payload: Object): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.SET_FETCH_TRANSPORTATION_FAILURE,
  payload,
});
export const resetFetchTransportationState = (): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.RESET_FETCH_TRANSPORTATION_STATE,
});

//CREATE Transportation
export const attemptToCreateTransportation = (data: Object): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.ATTEMPT_TO_CREATE_TRANSPORTATION,
  payload: data,
});
export const setCreateTransportationSucceed = (
  payload: Object
): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.SET_CREATE_TRANSPORTATION_SUCCEED,
  payload,
});

export const setCreateTransportationFailure = (
  payload: Object
): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.SET_CREATE_TRANSPORTATION_FAILURE,
  payload,
});
export const resetCreateTransportationState = (): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.RESET_CREATE_TRANSPORTATION_STATE,
});

//UPDATE Transportation
export const attemptToUpdateTransportation = (data: Object): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.ATTEMPT_TO_UPDATE_TRANSPORTATION,
  payload: data,
});
export const setUpdateTransportationSucceed = (
  payload: Object
): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.SET_UPDATE_TRANSPORTATION_SUCCEED,
  payload,
});

export const setUpdateTransportationFailure = (
  payload: Object
): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.SET_UPDATE_TRANSPORTATION_FAILURE,
  payload,
});
export const resetUpdateTransportationState = (): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.RESET_UPDATE_TRANSPORTATION_STATE,
});

//DELETE Transportation
export const attemptToDeleteTransportation = (data: Object): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.ATTEMPT_TO_DELETE_TRANSPORTATION,
  payload: data,
});
export const setDeleteTransportationSucceed = (
  payload: Object
): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.SET_DELETE_TRANSPORTATION_SUCCEED,
  payload,
});

export const setDeleteTransportationFailure = (
  payload: Object
): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.SET_DELETE_TRANSPORTATION_FAILURE,
  payload,
});
export const resetDeleteTransportationState = (): BaseAction => ({
  type: TRANSPORTATION_ACTIONS.RESET_DELETE_TRANSPORTATION_STATE,
});
