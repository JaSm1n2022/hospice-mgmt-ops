import type { BaseAction } from "../types/Action";
import type { KeyState } from "../types";
import { KEY_ACTIONS } from "../actions/keyAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): KeyState => ({
  keyList: {
    data: {},
    status: null,
    error: null,
  },
  keyUpdate: {
    data: {},
    status: null,
    error: null,
  },
  keyCreate: {
    data: {},
    status: null,
    error: null,
  },
  keyDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_KEY = (state: KeyState) => ({
  ...state,
  keyList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_KEY_SUCCEED = (state: KeyState, action: BaseAction) => ({
  ...state,
  keyList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_KEY_FAILURE = (state: KeyState) => ({
  ...state,
  keyList: {
    ...state.keyList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_KEY_STATE = (state: KeyState) => ({
  ...state,
  keyList: initialState().keyList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_KEY = (state: KeyState) => ({
  ...state,
  keyCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_KEY_SUCCEED = (state: KeyState, action: BaseAction) => ({
  ...state,
  keyCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_KEY_FAILURE = (state: KeyState) => ({
  ...state,
  keyCreate: {
    ...state.keyCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_KEY_STATE = (state: KeyState) => ({
  ...state,
  keyCreate: initialState().keyCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_KEY = (state: KeyState) => ({
  ...state,
  keyUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_KEY_SUCCEED = (state: KeyState, action: BaseAction) => ({
  ...state,
  keyUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_KEY_FAILURE = (state: KeyState) => ({
  ...state,
  keyUpdate: {
    ...state.keyUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_KEY_STATE = (state: KeyState) => ({
  ...state,
  keyUpdate: initialState().keyUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_KEY = (state: KeyState) => ({
  ...state,
  keyDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_KEY_SUCCEED = (state: KeyState, action: BaseAction) => ({
  ...state,
  keyDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_KEY_FAILURE = (state: KeyState) => ({
  ...state,
  keyDelete: {
    ...state.keyDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_KEY_STATE = (state: KeyState) => ({
  ...state,
  keyDelete: initialState().keyDelete,
});

const reducer = (state: KeyState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case KEY_ACTIONS.ATTEMPT_TO_FETCH_KEY:
      return ATTEMPT_TO_FETCH_KEY(state);
    case KEY_ACTIONS.SET_FETCH_KEY_SUCCEED:
      return SET_FETCH_KEY_SUCCEED(state, action);
    case KEY_ACTIONS.SET_FETCH_KEY_FAILURE:
      return SET_FETCH_KEY_FAILURE(state);
    case KEY_ACTIONS.RESET_FETCH_KEY_STATE:
      return RESET_FETCH_KEY_STATE(state);

    case KEY_ACTIONS.ATTEMPT_TO_CREATE_KEY:
      return ATTEMPT_TO_CREATE_KEY(state);
    case KEY_ACTIONS.SET_CREATE_KEY_SUCCEED:
      return SET_CREATE_KEY_SUCCEED(state, action);
    case KEY_ACTIONS.SET_CREATE_KEY_FAILURE:
      return SET_CREATE_KEY_FAILURE(state);
    case KEY_ACTIONS.RESET_CREATE_KEY_STATE:
      return RESET_CREATE_KEY_STATE(state);

    case KEY_ACTIONS.ATTEMPT_TO_UPDATE_KEY:
      return ATTEMPT_TO_UPDATE_KEY(state);
    case KEY_ACTIONS.SET_UPDATE_KEY_SUCCEED:
      return SET_UPDATE_KEY_SUCCEED(state, action);
    case KEY_ACTIONS.SET_UPDATE_KEY_FAILURE:
      return SET_UPDATE_KEY_FAILURE(state);
    case KEY_ACTIONS.RESET_UPDATE_KEY_STATE:
      return RESET_UPDATE_KEY_STATE(state);

    case KEY_ACTIONS.ATTEMPT_TO_DELETE_KEY:
      return ATTEMPT_TO_DELETE_KEY(state);
    case KEY_ACTIONS.SET_DELETE_KEY_SUCCEED:
      return SET_DELETE_KEY_SUCCEED(state, action);
    case KEY_ACTIONS.SET_DELETE_KEY_FAILURE:
      return SET_DELETE_KEY_FAILURE(state);
    case KEY_ACTIONS.RESET_DELETE_KEY_STATE:
      return RESET_DELETE_KEY_STATE(state);
    default:
      return state;
  }
};

export default reducer;
