export const TRAINING_ACTIONS = {
  ATTEMPT_TO_FETCH_TRAINING: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_TRAINING",
  SET_FETCH_TRAINING_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_TRAINING_SUCCEED",
  SET_FETCH_TRAINING_FAILURE: "dashboard/@HOSPICE/SET_FETCH_TRAINING_FAILURE",
  RESET_FETCH_TRAINING_STATE: "dashboard/@HOSPICE/RESET_FETCH_TRAINING_STATE",

  ATTEMPT_TO_CREATE_TRAINING: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_TRAINING",
  SET_CREATE_TRAINING_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_TRAINING_SUCCEED",
  SET_CREATE_TRAINING_FAILURE: "dashboard/@HOSPICE/SET_CREATE_TRAINING_FAILURE",
  RESET_CREATE_TRAINING_STATE: "dashboard/@HOSPICE/RESET_CREATE_TRAINING_STATE",

  ATTEMPT_TO_UPDATE_TRAINING: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_TRAINING",
  SET_UPDATE_TRAINING_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_TRAINING_SUCCEED",
  SET_UPDATE_TRAINING_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_TRAINING_FAILURE",
  RESET_UPDATE_TRAINING_STATE: "dashboard/@HOSPICE/RESET_UPDATE_TRAINING_STATE",

  ATTEMPT_TO_DELETE_TRAINING: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_TRAINING",
  SET_DELETE_TRAINING_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_TRAINING_SUCCEED",
  SET_DELETE_TRAINING_FAILURE: "dashboard/@HOSPICE/SET_DELETE_TRAINING_FAILURE",
  RESET_DELETE_TRAINING_STATE: "dashboard/@HOSPICE/RESET_DELETE_TRAINING_STATE",
};
//FETCH TRAINING
export const attemptToFetchTraining = (data: Object): BaseAction => ({
  type: TRAINING_ACTIONS.ATTEMPT_TO_FETCH_TRAINING,
  payload: data,
});
export const setFetchTrainingSucceed = (payload: Object): BaseAction => ({
  type: TRAINING_ACTIONS.SET_FETCH_TRAINING_SUCCEED,
  payload,
});

export const setFetchTrainingFailure = (payload: Object): BaseAction => ({
  type: TRAINING_ACTIONS.SET_FETCH_TRAINING_FAILURE,
  payload,
});
export const resetFetchTrainingState = (): BaseAction => ({
  type: TRAINING_ACTIONS.RESET_FETCH_TRAINING_STATE,
});

//CREATE TRAINING
export const attemptToCreateTraining = (data: Object): BaseAction => ({
  type: TRAINING_ACTIONS.ATTEMPT_TO_CREATE_TRAINING,
  payload: data,
});
export const setCreateTrainingSucceed = (payload: Object): BaseAction => ({
  type: TRAINING_ACTIONS.SET_CREATE_TRAINING_SUCCEED,
  payload,
});

export const setCreateTrainingFailure = (payload: Object): BaseAction => ({
  type: TRAINING_ACTIONS.SET_CREATE_TRAINING_FAILURE,
  payload,
});
export const resetCreateTrainingState = (): BaseAction => ({
  type: TRAINING_ACTIONS.RESET_CREATE_TRAINING_STATE,
});

//UPDATE TRAINING
export const attemptToUpdateTraining = (data: Object): BaseAction => ({
  type: TRAINING_ACTIONS.ATTEMPT_TO_UPDATE_TRAINING,
  payload: data,
});
export const setUpdateTrainingSucceed = (payload: Object): BaseAction => ({
  type: TRAINING_ACTIONS.SET_UPDATE_TRAINING_SUCCEED,
  payload,
});

export const setUpdateTrainingFailure = (payload: Object): BaseAction => ({
  type: TRAINING_ACTIONS.SET_UPDATE_TRAINING_FAILURE,
  payload,
});
export const resetUpdateTrainingState = (): BaseAction => ({
  type: TRAINING_ACTIONS.RESET_UPDATE_TRAINING_STATE,
});

//DELETE TRAINING
export const attemptToDeleteTraining = (data: Object): BaseAction => ({
  type: TRAINING_ACTIONS.ATTEMPT_TO_DELETE_TRAINING,
  payload: data,
});
export const setDeleteTrainingSucceed = (payload: Object): BaseAction => ({
  type: TRAINING_ACTIONS.SET_DELETE_TRAINING_SUCCEED,
  payload,
});

export const setDeleteTrainingFailure = (payload: Object): BaseAction => ({
  type: TRAINING_ACTIONS.SET_DELETE_TRAINING_FAILURE,
  payload,
});
export const resetDeleteTrainingState = (): BaseAction => ({
  type: TRAINING_ACTIONS.RESET_DELETE_TRAINING_STATE,
});
