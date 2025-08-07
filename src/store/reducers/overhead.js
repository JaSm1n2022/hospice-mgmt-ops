import type { BaseAction } from "../types/Action";
import type { OverheadState } from "../types";
import { OVERHEAD_ACTIONS } from "../actions/overheadAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): OverheadState => ({
  overheadList: {
    data: {},
    status: null,
    error: null,
  },
  overheadUpdate: {
    data: {},
    status: null,
    error: null,
  },
  overheadCreate: {
    data: {},
    status: null,
    error: null,
  },
  overheadDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_OVERHEAD = (state: OverheadState) => ({
  ...state,
  overheadList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_OVERHEAD_SUCCEED = (
  state: OverheadState,
  action: BaseAction
) => ({
  ...state,
  overheadList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_OVERHEAD_FAILURE = (state: OverheadState) => ({
  ...state,
  overheadList: {
    ...state.overheadList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_OVERHEAD_STATE = (state: OverheadState) => ({
  ...state,
  overheadList: initialState().overheadList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_OVERHEAD = (state: OverheadState) => ({
  ...state,
  overheadCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_OVERHEAD_SUCCEED = (
  state: OverheadState,
  action: BaseAction
) => ({
  ...state,
  overheadCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_OVERHEAD_FAILURE = (state: OverheadState) => ({
  ...state,
  overheadCreate: {
    ...state.overheadCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_OVERHEAD_STATE = (state: OverheadState) => ({
  ...state,
  overheadCreate: initialState().overheadCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_OVERHEAD = (state: OverheadState) => ({
  ...state,
  overheadUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_OVERHEAD_SUCCEED = (
  state: OverheadState,
  action: BaseAction
) => ({
  ...state,
  overheadUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_OVERHEAD_FAILURE = (state: OverheadState) => ({
  ...state,
  overheadUpdate: {
    ...state.overheadUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_OVERHEAD_STATE = (state: OverheadState) => ({
  ...state,
  overheadUpdate: initialState().overheadUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_OVERHEAD = (state: OverheadState) => ({
  ...state,
  overheadDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_OVERHEAD_SUCCEED = (
  state: OverheadState,
  action: BaseAction
) => ({
  ...state,
  overheadDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_OVERHEAD_FAILURE = (state: OverheadState) => ({
  ...state,
  overheadDelete: {
    ...state.overheadDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_OVERHEAD_STATE = (state: OverheadState) => ({
  ...state,
  overheadDelete: initialState().overheadDelete,
});

const reducer = (state: OverheadState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case OVERHEAD_ACTIONS.ATTEMPT_TO_FETCH_OVERHEAD:
      return ATTEMPT_TO_FETCH_OVERHEAD(state);
    case OVERHEAD_ACTIONS.SET_FETCH_OVERHEAD_SUCCEED:
      return SET_FETCH_OVERHEAD_SUCCEED(state, action);
    case OVERHEAD_ACTIONS.SET_FETCH_OVERHEAD_FAILURE:
      return SET_FETCH_OVERHEAD_FAILURE(state);
    case OVERHEAD_ACTIONS.RESET_FETCH_OVERHEAD_STATE:
      return RESET_FETCH_OVERHEAD_STATE(state);

    case OVERHEAD_ACTIONS.ATTEMPT_TO_CREATE_OVERHEAD:
      return ATTEMPT_TO_CREATE_OVERHEAD(state);
    case OVERHEAD_ACTIONS.SET_CREATE_OVERHEAD_SUCCEED:
      return SET_CREATE_OVERHEAD_SUCCEED(state, action);
    case OVERHEAD_ACTIONS.SET_CREATE_OVERHEAD_FAILURE:
      return SET_CREATE_OVERHEAD_FAILURE(state);
    case OVERHEAD_ACTIONS.RESET_CREATE_OVERHEAD_STATE:
      return RESET_CREATE_OVERHEAD_STATE(state);

    case OVERHEAD_ACTIONS.ATTEMPT_TO_UPDATE_OVERHEAD:
      return ATTEMPT_TO_UPDATE_OVERHEAD(state);
    case OVERHEAD_ACTIONS.SET_UPDATE_OVERHEAD_SUCCEED:
      return SET_UPDATE_OVERHEAD_SUCCEED(state, action);
    case OVERHEAD_ACTIONS.SET_UPDATE_OVERHEAD_FAILURE:
      return SET_UPDATE_OVERHEAD_FAILURE(state);
    case OVERHEAD_ACTIONS.RESET_UPDATE_OVERHEAD_STATE:
      return RESET_UPDATE_OVERHEAD_STATE(state);

    case OVERHEAD_ACTIONS.ATTEMPT_TO_DELETE_OVERHEAD:
      return ATTEMPT_TO_DELETE_OVERHEAD(state);
    case OVERHEAD_ACTIONS.SET_DELETE_OVERHEAD_SUCCEED:
      return SET_DELETE_OVERHEAD_SUCCEED(state, action);
    case OVERHEAD_ACTIONS.SET_DELETE_OVERHEAD_FAILURE:
      return SET_DELETE_OVERHEAD_FAILURE(state);
    case OVERHEAD_ACTIONS.RESET_DELETE_OVERHEAD_STATE:
      return RESET_DELETE_OVERHEAD_STATE(state);
    default:
      return state;
  }
};

export default reducer;
