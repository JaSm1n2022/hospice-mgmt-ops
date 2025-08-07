export const ASSIGNMENT_ACTIONS = {
  ATTEMPT_TO_FETCH_ASSIGNMENT: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_ASSIGNMENT",
  SET_FETCH_ASSIGNMENT_SUCCEED:
    "dashboard/@HOSPICE/SET_FETCH_ASSIGNMENT_SUCCEED",
  SET_FETCH_ASSIGNMENT_FAILURE:
    "dashboard/@HOSPICE/SET_FETCH_ASSIGNMENT_FAILURE",
  RESET_FETCH_ASSIGNMENT_STATE:
    "dashboard/@HOSPICE/RESET_FETCH_ASSIGNMENT_STATE",

  ATTEMPT_TO_CREATE_ASSIGNMENT:
    "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_ASSIGNMENT",
  SET_CREATE_ASSIGNMENT_SUCCEED:
    "dashboard/@HOSPICE/SET_CREATE_ASSIGNMENT_SUCCEED",
  SET_CREATE_ASSIGNMENT_FAILURE:
    "dashboard/@HOSPICE/SET_CREATE_ASSIGNMENT_FAILURE",
  RESET_CREATE_ASSIGNMENT_STATE:
    "dashboard/@HOSPICE/RESET_CREATE_ASSIGNMENT_STATE",

  ATTEMPT_TO_UPDATE_ASSIGNMENT:
    "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_ASSIGNMENT",
  SET_UPDATE_ASSIGNMENT_SUCCEED:
    "dashboard/@HOSPICE/SET_UPDATE_ASSIGNMENT_SUCCEED",
  SET_UPDATE_ASSIGNMENT_FAILURE:
    "dashboard/@HOSPICE/SET_UPDATE_ASSIGNMENT_FAILURE",
  RESET_UPDATE_ASSIGNMENT_STATE:
    "dashboard/@HOSPICE/RESET_UPDATE_ASSIGNMENT_STATE",

  ATTEMPT_TO_DELETE_ASSIGNMENT:
    "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_ASSIGNMENT",
  SET_DELETE_ASSIGNMENT_SUCCEED:
    "dashboard/@HOSPICE/SET_DELETE_ASSIGNMENT_SUCCEED",
  SET_DELETE_ASSIGNMENT_FAILURE:
    "dashboard/@HOSPICE/SET_DELETE_ASSIGNMENT_FAILURE",
  RESET_DELETE_ASSIGNMENT_STATE:
    "dashboard/@HOSPICE/RESET_DELETE_ASSIGNMENT_STATE",
};
//FETCH Assignment
export const attemptToFetchAssignment = (data: Object): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.ATTEMPT_TO_FETCH_ASSIGNMENT,
  payload: data,
});
export const setFetchAssignmentSucceed = (payload: Object): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.SET_FETCH_ASSIGNMENT_SUCCEED,
  payload,
});

export const setFetchAssignmentFailure = (payload: Object): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.SET_FETCH_ASSIGNMENT_FAILURE,
  payload,
});
export const resetFetchAssignmentState = (): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.RESET_FETCH_ASSIGNMENT_STATE,
});

//CREATE Assignment
export const attemptToCreateAssignment = (data: Object): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.ATTEMPT_TO_CREATE_ASSIGNMENT,
  payload: data,
});
export const setCreateAssignmentSucceed = (payload: Object): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.SET_CREATE_ASSIGNMENT_SUCCEED,
  payload,
});

export const setCreateAssignmentFailure = (payload: Object): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.SET_CREATE_ASSIGNMENT_FAILURE,
  payload,
});
export const resetCreateAssignmentState = (): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.RESET_CREATE_ASSIGNMENT_STATE,
});

//UPDATE Assignment
export const attemptToUpdateAssignment = (data: Object): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.ATTEMPT_TO_UPDATE_ASSIGNMENT,
  payload: data,
});
export const setUpdateAssignmentSucceed = (payload: Object): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.SET_UPDATE_ASSIGNMENT_SUCCEED,
  payload,
});

export const setUpdateAssignmentFailure = (payload: Object): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.SET_UPDATE_ASSIGNMENT_FAILURE,
  payload,
});
export const resetUpdateAssignmentState = (): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.RESET_UPDATE_ASSIGNMENT_STATE,
});

//DELETE Assignment
export const attemptToDeleteAssignment = (data: Object): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.ATTEMPT_TO_DELETE_ASSIGNMENT,
  payload: data,
});
export const setDeleteAssignmentSucceed = (payload: Object): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.SET_DELETE_ASSIGNMENT_SUCCEED,
  payload,
});

export const setDeleteAssignmentFailure = (payload: Object): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.SET_DELETE_ASSIGNMENT_FAILURE,
  payload,
});
export const resetDeleteAssignmentState = (): BaseAction => ({
  type: ASSIGNMENT_ACTIONS.RESET_DELETE_ASSIGNMENT_STATE,
});
