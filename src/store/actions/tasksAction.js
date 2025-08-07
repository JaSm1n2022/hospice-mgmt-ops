export const TASKS_ACTIONS = {
  ATTEMPT_TO_FETCH_TASKS: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_TASKS",
  SET_FETCH_TASKS_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_TASKS_SUCCEED",
  SET_FETCH_TASKS_FAILURE: "dashboard/@HOSPICE/SET_FETCH_TASKS_FAILURE",
  RESET_FETCH_TASKS_STATE: "dashboard/@HOSPICE/RESET_FETCH_TASKS_STATE",

  ATTEMPT_TO_CREATE_TASKS: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_TASKS",
  SET_CREATE_TASKS_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_TASKS_SUCCEED",
  SET_CREATE_TASKS_FAILURE: "dashboard/@HOSPICE/SET_CREATE_TASKS_FAILURE",
  RESET_CREATE_TASKS_STATE: "dashboard/@HOSPICE/RESET_CREATE_TASKS_STATE",

  ATTEMPT_TO_UPDATE_TASKS: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_TASKS",
  SET_UPDATE_TASKS_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_TASKS_SUCCEED",
  SET_UPDATE_TASKS_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_TASKS_FAILURE",
  RESET_UPDATE_TASKS_STATE: "dashboard/@HOSPICE/RESET_UPDATE_TASKS_STATE",

  ATTEMPT_TO_DELETE_TASKS: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_TASKS",
  SET_DELETE_TASKS_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_TASKS_SUCCEED",
  SET_DELETE_TASKS_FAILURE: "dashboard/@HOSPICE/SET_DELETE_TASKS_FAILURE",
  RESET_DELETE_TASKS_STATE: "dashboard/@HOSPICE/RESET_DELETE_TASKS_STATE",
};
//FETCH Tasks
export const attemptToFetchTasks = (data: Object): BaseAction => ({
  type: TASKS_ACTIONS.ATTEMPT_TO_FETCH_TASKS,
  payload: data,
});
export const setFetchTasksSucceed = (payload: Object): BaseAction => ({
  type: TASKS_ACTIONS.SET_FETCH_TASKS_SUCCEED,
  payload,
});

export const setFetchTasksFailure = (payload: Object): BaseAction => ({
  type: TASKS_ACTIONS.SET_FETCH_TASKS_FAILURE,
  payload,
});
export const resetFetchTasksState = (): BaseAction => ({
  type: TASKS_ACTIONS.RESET_FETCH_TASKS_STATE,
});

//CREATE Tasks
export const attemptToCreateTasks = (data: Object): BaseAction => ({
  type: TASKS_ACTIONS.ATTEMPT_TO_CREATE_TASKS,
  payload: data,
});
export const setCreateTasksSucceed = (payload: Object): BaseAction => ({
  type: TASKS_ACTIONS.SET_CREATE_TASKS_SUCCEED,
  payload,
});

export const setCreateTasksFailure = (payload: Object): BaseAction => ({
  type: TASKS_ACTIONS.SET_CREATE_TASKS_FAILURE,
  payload,
});
export const resetCreateTasksState = (): BaseAction => ({
  type: TASKS_ACTIONS.RESET_CREATE_TASKS_STATE,
});

//UPDATE Tasks
export const attemptToUpdateTasks = (data: Object): BaseAction => ({
  type: TASKS_ACTIONS.ATTEMPT_TO_UPDATE_TASKS,
  payload: data,
});
export const setUpdateTasksSucceed = (payload: Object): BaseAction => ({
  type: TASKS_ACTIONS.SET_UPDATE_TASKS_SUCCEED,
  payload,
});

export const setUpdateTasksFailure = (payload: Object): BaseAction => ({
  type: TASKS_ACTIONS.SET_UPDATE_TASKS_FAILURE,
  payload,
});
export const resetUpdateTasksState = (): BaseAction => ({
  type: TASKS_ACTIONS.RESET_UPDATE_TASKS_STATE,
});

//DELETE Tasks
export const attemptToDeleteTasks = (data: Object): BaseAction => ({
  type: TASKS_ACTIONS.ATTEMPT_TO_DELETE_TASKS,
  payload: data,
});
export const setDeleteTasksSucceed = (payload: Object): BaseAction => ({
  type: TASKS_ACTIONS.SET_DELETE_TASKS_SUCCEED,
  payload,
});

export const setDeleteTasksFailure = (payload: Object): BaseAction => ({
  type: TASKS_ACTIONS.SET_DELETE_TASKS_FAILURE,
  payload,
});
export const resetDeleteTasksState = (): BaseAction => ({
  type: TASKS_ACTIONS.RESET_DELETE_TASKS_STATE,
});
