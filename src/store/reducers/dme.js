import type { BaseAction } from "../types/Action";
import type { DmeState } from "../types";
import { DME_ACTIONS } from "../actions/keyAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): DmeState => ({
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

const ATTEMPT_TO_FETCH_DME = (state: DmeState) => ({
  ...state,
  keyList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_DME_SUCCEED = (state: DmeState, action: BaseAction) => ({
  ...state,
  keyList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_DME_FAILURE = (state: DmeState) => ({
  ...state,
  keyList: {
    ...state.keyList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_DME_STATE = (state: DmeState) => ({
  ...state,
  keyList: initialState().keyList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_DME = (state: DmeState) => ({
  ...state,
  keyCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_DME_SUCCEED = (state: DmeState, action: BaseAction) => ({
  ...state,
  keyCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_DME_FAILURE = (state: DmeState) => ({
  ...state,
  keyCreate: {
    ...state.keyCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_DME_STATE = (state: DmeState) => ({
  ...state,
  keyCreate: initialState().keyCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_DME = (state: DmeState) => ({
  ...state,
  keyUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_DME_SUCCEED = (state: DmeState, action: BaseAction) => ({
  ...state,
  keyUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_DME_FAILURE = (state: DmeState) => ({
  ...state,
  keyUpdate: {
    ...state.keyUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_DME_STATE = (state: DmeState) => ({
  ...state,
  keyUpdate: initialState().keyUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_DME = (state: DmeState) => ({
  ...state,
  keyDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_DME_SUCCEED = (state: DmeState, action: BaseAction) => ({
  ...state,
  keyDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_DME_FAILURE = (state: DmeState) => ({
  ...state,
  keyDelete: {
    ...state.keyDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_DME_STATE = (state: DmeState) => ({
  ...state,
  keyDelete: initialState().keyDelete,
});

const reducer = (state: DmeState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case DME_ACTIONS.ATTEMPT_TO_FETCH_DME:
      return ATTEMPT_TO_FETCH_DME(state);
    case DME_ACTIONS.SET_FETCH_DME_SUCCEED:
      return SET_FETCH_DME_SUCCEED(state, action);
    case DME_ACTIONS.SET_FETCH_DME_FAILURE:
      return SET_FETCH_DME_FAILURE(state);
    case DME_ACTIONS.RESET_FETCH_DME_STATE:
      return RESET_FETCH_DME_STATE(state);

    case DME_ACTIONS.ATTEMPT_TO_CREATE_DME:
      return ATTEMPT_TO_CREATE_DME(state);
    case DME_ACTIONS.SET_CREATE_DME_SUCCEED:
      return SET_CREATE_DME_SUCCEED(state, action);
    case DME_ACTIONS.SET_CREATE_DME_FAILURE:
      return SET_CREATE_DME_FAILURE(state);
    case DME_ACTIONS.RESET_CREATE_DME_STATE:
      return RESET_CREATE_DME_STATE(state);

    case DME_ACTIONS.ATTEMPT_TO_UPDATE_DME:
      return ATTEMPT_TO_UPDATE_DME(state);
    case DME_ACTIONS.SET_UPDATE_DME_SUCCEED:
      return SET_UPDATE_DME_SUCCEED(state, action);
    case DME_ACTIONS.SET_UPDATE_DME_FAILURE:
      return SET_UPDATE_DME_FAILURE(state);
    case DME_ACTIONS.RESET_UPDATE_DME_STATE:
      return RESET_UPDATE_DME_STATE(state);

    case DME_ACTIONS.ATTEMPT_TO_DELETE_DME:
      return ATTEMPT_TO_DELETE_DME(state);
    case DME_ACTIONS.SET_DELETE_DME_SUCCEED:
      return SET_DELETE_DME_SUCCEED(state, action);
    case DME_ACTIONS.SET_DELETE_DME_FAILURE:
      return SET_DELETE_DME_FAILURE(state);
    case DME_ACTIONS.RESET_DELETE_DME_STATE:
      return RESET_DELETE_DME_STATE(state);
    default:
      return state;
  }
};

export default reducer;
