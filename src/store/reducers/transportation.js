import type { BaseAction } from "../types/Action";
import type { TransportationState } from "../types";
import { TRANSPORTATION_ACTIONS } from "../actions/transportationAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): TransportationState => ({
  transportationList: {
    data: {},
    status: null,
    error: null,
  },
  transportationUpdate: {
    data: {},
    status: null,
    error: null,
  },
  transportationCreate: {
    data: {},
    status: null,
    error: null,
  },
  transportationDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_TRANSPORTATION = (state: TransportationState) => ({
  ...state,
  transportationList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_TRANSPORTATION_SUCCEED = (
  state: TransportationState,
  action: BaseAction
) => ({
  ...state,
  transportationList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_TRANSPORTATION_FAILURE = (state: TransportationState) => ({
  ...state,
  transportationList: {
    ...state.transportationList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_TRANSPORTATION_STATE = (state: TransportationState) => ({
  ...state,
  transportationList: initialState().transportationList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_TRANSPORTATION = (state: TransportationState) => ({
  ...state,
  transportationCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_TRANSPORTATION_SUCCEED = (
  state: TransportationState,
  action: BaseAction
) => ({
  ...state,
  transportationCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_TRANSPORTATION_FAILURE = (state: TransportationState) => ({
  ...state,
  transportationCreate: {
    ...state.transportationCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_TRANSPORTATION_STATE = (state: TransportationState) => ({
  ...state,
  transportationCreate: initialState().transportationCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_TRANSPORTATION = (state: TransportationState) => ({
  ...state,
  transportationUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_TRANSPORTATION_SUCCEED = (
  state: TransportationState,
  action: BaseAction
) => ({
  ...state,
  transportationUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_TRANSPORTATION_FAILURE = (state: TransportationState) => ({
  ...state,
  transportationUpdate: {
    ...state.transportationUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_TRANSPORTATION_STATE = (state: TransportationState) => ({
  ...state,
  transportationUpdate: initialState().transportationUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_TRANSPORTATION = (state: TransportationState) => ({
  ...state,
  transportationDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_TRANSPORTATION_SUCCEED = (
  state: TransportationState,
  action: BaseAction
) => ({
  ...state,
  transportationDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_TRANSPORTATION_FAILURE = (state: TransportationState) => ({
  ...state,
  transportationDelete: {
    ...state.transportationDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_TRANSPORTATION_STATE = (state: TransportationState) => ({
  ...state,
  transportationDelete: initialState().transportationDelete,
});

const reducer = (
  state: TransportationState = initialState(),
  action: BaseAction
) => {
  switch (action.type) {
    case TRANSPORTATION_ACTIONS.ATTEMPT_TO_FETCH_TRANSPORTATION:
      return ATTEMPT_TO_FETCH_TRANSPORTATION(state);
    case TRANSPORTATION_ACTIONS.SET_FETCH_TRANSPORTATION_SUCCEED:
      return SET_FETCH_TRANSPORTATION_SUCCEED(state, action);
    case TRANSPORTATION_ACTIONS.SET_FETCH_TRANSPORTATION_FAILURE:
      return SET_FETCH_TRANSPORTATION_FAILURE(state);
    case TRANSPORTATION_ACTIONS.RESET_FETCH_TRANSPORTATION_STATE:
      return RESET_FETCH_TRANSPORTATION_STATE(state);

    case TRANSPORTATION_ACTIONS.ATTEMPT_TO_CREATE_TRANSPORTATION:
      return ATTEMPT_TO_CREATE_TRANSPORTATION(state);
    case TRANSPORTATION_ACTIONS.SET_CREATE_TRANSPORTATION_SUCCEED:
      return SET_CREATE_TRANSPORTATION_SUCCEED(state, action);
    case TRANSPORTATION_ACTIONS.SET_CREATE_TRANSPORTATION_FAILURE:
      return SET_CREATE_TRANSPORTATION_FAILURE(state);
    case TRANSPORTATION_ACTIONS.RESET_CREATE_TRANSPORTATION_STATE:
      return RESET_CREATE_TRANSPORTATION_STATE(state);

    case TRANSPORTATION_ACTIONS.ATTEMPT_TO_UPDATE_TRANSPORTATION:
      return ATTEMPT_TO_UPDATE_TRANSPORTATION(state);
    case TRANSPORTATION_ACTIONS.SET_UPDATE_TRANSPORTATION_SUCCEED:
      return SET_UPDATE_TRANSPORTATION_SUCCEED(state, action);
    case TRANSPORTATION_ACTIONS.SET_UPDATE_TRANSPORTATION_FAILURE:
      return SET_UPDATE_TRANSPORTATION_FAILURE(state);
    case TRANSPORTATION_ACTIONS.RESET_UPDATE_TRANSPORTATION_STATE:
      return RESET_UPDATE_TRANSPORTATION_STATE(state);

    case TRANSPORTATION_ACTIONS.ATTEMPT_TO_DELETE_TRANSPORTATION:
      return ATTEMPT_TO_DELETE_TRANSPORTATION(state);
    case TRANSPORTATION_ACTIONS.SET_DELETE_TRANSPORTATION_SUCCEED:
      return SET_DELETE_TRANSPORTATION_SUCCEED(state, action);
    case TRANSPORTATION_ACTIONS.SET_DELETE_TRANSPORTATION_FAILURE:
      return SET_DELETE_TRANSPORTATION_FAILURE(state);
    case TRANSPORTATION_ACTIONS.RESET_DELETE_TRANSPORTATION_STATE:
      return RESET_DELETE_TRANSPORTATION_STATE(state);
    default:
      return state;
  }
};

export default reducer;
