import type { BaseAction } from "../types/Action";
import type { CallsState } from "../types";
import { CALLS_ACTIONS } from "../actions/callsAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): CallsState => ({
  callsList: {
    data: {},
    status: null,
    error: null,
  },
  callsUpdate: {
    data: {},
    status: null,
    error: null,
  },
  callsCreate: {
    data: {},
    status: null,
    error: null,
  },
  callsDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_CALLS = (state: CallsState) => ({
  ...state,
  callsList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_CALLS_SUCCEED = (state: CallsState, action: BaseAction) => ({
  ...state,
  callsList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_CALLS_FAILURE = (state: CallsState) => ({
  ...state,
  callsList: {
    ...state.callsList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_CALLS_STATE = (state: CallsState) => ({
  ...state,
  callsList: initialState().callsList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_CALLS = (state: CallsState) => ({
  ...state,
  callsCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_CALLS_SUCCEED = (state: CallsState, action: BaseAction) => ({
  ...state,
  callsCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_CALLS_FAILURE = (state: CallsState) => ({
  ...state,
  callsCreate: {
    ...state.callsCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_CALLS_STATE = (state: CallsState) => ({
  ...state,
  callsCreate: initialState().callsCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_CALLS = (state: CallsState) => ({
  ...state,
  callsUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_CALLS_SUCCEED = (state: CallsState, action: BaseAction) => ({
  ...state,
  callsUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_CALLS_FAILURE = (state: CallsState) => ({
  ...state,
  callsUpdate: {
    ...state.callsUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_CALLS_STATE = (state: CallsState) => ({
  ...state,
  callsUpdate: initialState().callsUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_CALLS = (state: CallsState) => ({
  ...state,
  callsDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_CALLS_SUCCEED = (state: CallsState, action: BaseAction) => ({
  ...state,
  callsDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_CALLS_FAILURE = (state: CallsState) => ({
  ...state,
  callsDelete: {
    ...state.callsDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_CALLS_STATE = (state: CallsState) => ({
  ...state,
  callsDelete: initialState().callsDelete,
});

const reducer = (state: CallsState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case CALLS_ACTIONS.ATTEMPT_TO_FETCH_CALLS:
      return ATTEMPT_TO_FETCH_CALLS(state);
    case CALLS_ACTIONS.SET_FETCH_CALLS_SUCCEED:
      return SET_FETCH_CALLS_SUCCEED(state, action);
    case CALLS_ACTIONS.SET_FETCH_CALLS_FAILURE:
      return SET_FETCH_CALLS_FAILURE(state);
    case CALLS_ACTIONS.RESET_FETCH_CALLS_STATE:
      return RESET_FETCH_CALLS_STATE(state);

    case CALLS_ACTIONS.ATTEMPT_TO_CREATE_CALLS:
      return ATTEMPT_TO_CREATE_CALLS(state);
    case CALLS_ACTIONS.SET_CREATE_CALLS_SUCCEED:
      return SET_CREATE_CALLS_SUCCEED(state, action);
    case CALLS_ACTIONS.SET_CREATE_CALLS_FAILURE:
      return SET_CREATE_CALLS_FAILURE(state);
    case CALLS_ACTIONS.RESET_CREATE_CALLS_STATE:
      return RESET_CREATE_CALLS_STATE(state);

    case CALLS_ACTIONS.ATTEMPT_TO_UPDATE_CALLS:
      return ATTEMPT_TO_UPDATE_CALLS(state);
    case CALLS_ACTIONS.SET_UPDATE_CALLS_SUCCEED:
      return SET_UPDATE_CALLS_SUCCEED(state, action);
    case CALLS_ACTIONS.SET_UPDATE_CALLS_FAILURE:
      return SET_UPDATE_CALLS_FAILURE(state);
    case CALLS_ACTIONS.RESET_UPDATE_CALLS_STATE:
      return RESET_UPDATE_CALLS_STATE(state);

    case CALLS_ACTIONS.ATTEMPT_TO_DELETE_CALLS:
      return ATTEMPT_TO_DELETE_CALLS(state);
    case CALLS_ACTIONS.SET_DELETE_CALLS_SUCCEED:
      return SET_DELETE_CALLS_SUCCEED(state, action);
    case CALLS_ACTIONS.SET_DELETE_CALLS_FAILURE:
      return SET_DELETE_CALLS_FAILURE(state);
    case CALLS_ACTIONS.RESET_DELETE_CALLS_STATE:
      return RESET_DELETE_CALLS_STATE(state);
    default:
      return state;
  }
};

export default reducer;
