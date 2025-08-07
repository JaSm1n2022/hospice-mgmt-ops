import type { BaseAction } from "../types/Action";
import type { TasksState } from "../types";
import { TASKS_ACTIONS } from "../actions/tasksAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): TasksState => ({
  tasksList: {
    data: {},
    status: null,
    error: null,
  },
  tasksUpdate: {
    data: {},
    status: null,
    error: null,
  },
  tasksCreate: {
    data: {},
    status: null,
    error: null,
  },
  tasksDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_TASKS = (state: TasksState) => ({
  ...state,
  tasksList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_TASKS_SUCCEED = (state: TasksState, action: BaseAction) => ({
  ...state,
  tasksList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_TASKS_FAILURE = (state: TasksState) => ({
  ...state,
  tasksList: {
    ...state.tasksList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_TASKS_STATE = (state: TasksState) => ({
  ...state,
  tasksList: initialState().tasksList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_TASKS = (state: TasksState) => ({
  ...state,
  tasksCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_TASKS_SUCCEED = (state: TasksState, action: BaseAction) => ({
  ...state,
  tasksCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_TASKS_FAILURE = (state: TasksState) => ({
  ...state,
  tasksCreate: {
    ...state.tasksCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_TASKS_STATE = (state: TasksState) => ({
  ...state,
  tasksCreate: initialState().tasksCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_TASKS = (state: TasksState) => ({
  ...state,
  tasksUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_TASKS_SUCCEED = (state: TasksState, action: BaseAction) => ({
  ...state,
  tasksUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_TASKS_FAILURE = (state: TasksState) => ({
  ...state,
  tasksUpdate: {
    ...state.tasksUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_TASKS_STATE = (state: TasksState) => ({
  ...state,
  tasksUpdate: initialState().tasksUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_TASKS = (state: TasksState) => ({
  ...state,
  tasksDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_TASKS_SUCCEED = (state: TasksState, action: BaseAction) => ({
  ...state,
  tasksDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_TASKS_FAILURE = (state: TasksState) => ({
  ...state,
  tasksDelete: {
    ...state.tasksDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_TASKS_STATE = (state: TasksState) => ({
  ...state,
  tasksDelete: initialState().tasksDelete,
});

const reducer = (state: TasksState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case TASKS_ACTIONS.ATTEMPT_TO_FETCH_TASKS:
      return ATTEMPT_TO_FETCH_TASKS(state);
    case TASKS_ACTIONS.SET_FETCH_TASKS_SUCCEED:
      return SET_FETCH_TASKS_SUCCEED(state, action);
    case TASKS_ACTIONS.SET_FETCH_TASKS_FAILURE:
      return SET_FETCH_TASKS_FAILURE(state);
    case TASKS_ACTIONS.RESET_FETCH_TASKS_STATE:
      return RESET_FETCH_TASKS_STATE(state);

    case TASKS_ACTIONS.ATTEMPT_TO_CREATE_TASKS:
      return ATTEMPT_TO_CREATE_TASKS(state);
    case TASKS_ACTIONS.SET_CREATE_TASKS_SUCCEED:
      return SET_CREATE_TASKS_SUCCEED(state, action);
    case TASKS_ACTIONS.SET_CREATE_TASKS_FAILURE:
      return SET_CREATE_TASKS_FAILURE(state);
    case TASKS_ACTIONS.RESET_CREATE_TASKS_STATE:
      return RESET_CREATE_TASKS_STATE(state);

    case TASKS_ACTIONS.ATTEMPT_TO_UPDATE_TASKS:
      return ATTEMPT_TO_UPDATE_TASKS(state);
    case TASKS_ACTIONS.SET_UPDATE_TASKS_SUCCEED:
      return SET_UPDATE_TASKS_SUCCEED(state, action);
    case TASKS_ACTIONS.SET_UPDATE_TASKS_FAILURE:
      return SET_UPDATE_TASKS_FAILURE(state);
    case TASKS_ACTIONS.RESET_UPDATE_TASKS_STATE:
      return RESET_UPDATE_TASKS_STATE(state);

    case TASKS_ACTIONS.ATTEMPT_TO_DELETE_TASKS:
      return ATTEMPT_TO_DELETE_TASKS(state);
    case TASKS_ACTIONS.SET_DELETE_TASKS_SUCCEED:
      return SET_DELETE_TASKS_SUCCEED(state, action);
    case TASKS_ACTIONS.SET_DELETE_TASKS_FAILURE:
      return SET_DELETE_TASKS_FAILURE(state);
    case TASKS_ACTIONS.RESET_DELETE_TASKS_STATE:
      return RESET_DELETE_TASKS_STATE(state);
    default:
      return state;
  }
};

export default reducer;
