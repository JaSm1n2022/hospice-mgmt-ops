import type { BaseAction } from "../types/Action";
import type { RoutesheetState } from "../types";
import { ROUTESHEET_ACTIONS } from "../actions/routesheetAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): RoutesheetState => ({
  routesheetList: {
    data: {},
    status: null,
    error: null,
  },
  routesheetUpdate: {
    data: {},
    status: null,
    error: null,
  },
  routesheetCreate: {
    data: {},
    status: null,
    error: null,
  },
  routesheetDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_ROUTESHEET = (state: RoutesheetState) => ({
  ...state,
  routesheetList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_ROUTESHEET_SUCCEED = (
  state: RoutesheetState,
  action: BaseAction
) => ({
  ...state,
  routesheetList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_ROUTESHEET_FAILURE = (state: RoutesheetState) => ({
  ...state,
  routesheetList: {
    ...state.routesheetList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_ROUTESHEET_STATE = (state: RoutesheetState) => ({
  ...state,
  routesheetList: initialState().routesheetList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_ROUTESHEET = (state: RoutesheetState) => ({
  ...state,
  routesheetCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_ROUTESHEET_SUCCEED = (
  state: RoutesheetState,
  action: BaseAction
) => ({
  ...state,
  routesheetCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_ROUTESHEET_FAILURE = (state: RoutesheetState) => ({
  ...state,
  routesheetCreate: {
    ...state.routesheetCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_ROUTESHEET_STATE = (state: RoutesheetState) => ({
  ...state,
  routesheetCreate: initialState().routesheetCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_ROUTESHEET = (state: RoutesheetState) => ({
  ...state,
  routesheetUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_ROUTESHEET_SUCCEED = (
  state: RoutesheetState,
  action: BaseAction
) => ({
  ...state,
  routesheetUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_ROUTESHEET_FAILURE = (state: RoutesheetState) => ({
  ...state,
  routesheetUpdate: {
    ...state.routesheetUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_ROUTESHEET_STATE = (state: RoutesheetState) => ({
  ...state,
  routesheetUpdate: initialState().routesheetUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_ROUTESHEET = (state: RoutesheetState) => ({
  ...state,
  routesheetDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_ROUTESHEET_SUCCEED = (
  state: RoutesheetState,
  action: BaseAction
) => ({
  ...state,
  routesheetDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_ROUTESHEET_FAILURE = (state: RoutesheetState) => ({
  ...state,
  routesheetDelete: {
    ...state.routesheetDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_ROUTESHEET_STATE = (state: RoutesheetState) => ({
  ...state,
  routesheetDelete: initialState().routesheetDelete,
});

const reducer = (
  state: RoutesheetState = initialState(),
  action: BaseAction
) => {
  switch (action.type) {
    case ROUTESHEET_ACTIONS.ATTEMPT_TO_FETCH_ROUTESHEET:
      return ATTEMPT_TO_FETCH_ROUTESHEET(state);
    case ROUTESHEET_ACTIONS.SET_FETCH_ROUTESHEET_SUCCEED:
      return SET_FETCH_ROUTESHEET_SUCCEED(state, action);
    case ROUTESHEET_ACTIONS.SET_FETCH_ROUTESHEET_FAILURE:
      return SET_FETCH_ROUTESHEET_FAILURE(state);
    case ROUTESHEET_ACTIONS.RESET_FETCH_ROUTESHEET_STATE:
      return RESET_FETCH_ROUTESHEET_STATE(state);

    case ROUTESHEET_ACTIONS.ATTEMPT_TO_CREATE_ROUTESHEET:
      return ATTEMPT_TO_CREATE_ROUTESHEET(state);
    case ROUTESHEET_ACTIONS.SET_CREATE_ROUTESHEET_SUCCEED:
      return SET_CREATE_ROUTESHEET_SUCCEED(state, action);
    case ROUTESHEET_ACTIONS.SET_CREATE_ROUTESHEET_FAILURE:
      return SET_CREATE_ROUTESHEET_FAILURE(state);
    case ROUTESHEET_ACTIONS.RESET_CREATE_ROUTESHEET_STATE:
      return RESET_CREATE_ROUTESHEET_STATE(state);

    case ROUTESHEET_ACTIONS.ATTEMPT_TO_UPDATE_ROUTESHEET:
      return ATTEMPT_TO_UPDATE_ROUTESHEET(state);
    case ROUTESHEET_ACTIONS.SET_UPDATE_ROUTESHEET_SUCCEED:
      return SET_UPDATE_ROUTESHEET_SUCCEED(state, action);
    case ROUTESHEET_ACTIONS.SET_UPDATE_ROUTESHEET_FAILURE:
      return SET_UPDATE_ROUTESHEET_FAILURE(state);
    case ROUTESHEET_ACTIONS.RESET_UPDATE_ROUTESHEET_STATE:
      return RESET_UPDATE_ROUTESHEET_STATE(state);

    case ROUTESHEET_ACTIONS.ATTEMPT_TO_DELETE_ROUTESHEET:
      return ATTEMPT_TO_DELETE_ROUTESHEET(state);
    case ROUTESHEET_ACTIONS.SET_DELETE_ROUTESHEET_SUCCEED:
      return SET_DELETE_ROUTESHEET_SUCCEED(state, action);
    case ROUTESHEET_ACTIONS.SET_DELETE_ROUTESHEET_FAILURE:
      return SET_DELETE_ROUTESHEET_FAILURE(state);
    case ROUTESHEET_ACTIONS.RESET_DELETE_ROUTESHEET_STATE:
      return RESET_DELETE_ROUTESHEET_STATE(state);
    default:
      return state;
  }
};

export default reducer;
