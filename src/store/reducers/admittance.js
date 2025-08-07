import type { BaseAction } from "../types/Action";
import type { AdmittanceState } from "../types";
import { ADMITTANCE_ACTIONS } from "../actions/admittanceAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): AdmittanceState => ({
  admittanceList: {
    data: {},
    status: null,
    error: null,
  },
  admittanceUpdate: {
    data: {},
    status: null,
    error: null,
  },
  admittanceCreate: {
    data: {},
    status: null,
    error: null,
  },
  admittanceDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_ADMITTANCE = (state: AdmittanceState) => ({
  ...state,
  admittanceList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_ADMITTANCE_SUCCEED = (
  state: AdmittanceState,
  action: BaseAction
) => ({
  ...state,
  admittanceList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_ADMITTANCE_FAILURE = (state: AdmittanceState) => ({
  ...state,
  admittanceList: {
    ...state.admittanceList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_ADMITTANCE_STATE = (state: AdmittanceState) => ({
  ...state,
  admittanceList: initialState().admittanceList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_ADMITTANCE = (state: AdmittanceState) => ({
  ...state,
  admittanceCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_ADMITTANCE_SUCCEED = (
  state: AdmittanceState,
  action: BaseAction
) => ({
  ...state,
  admittanceCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_ADMITTANCE_FAILURE = (state: AdmittanceState) => ({
  ...state,
  admittanceCreate: {
    ...state.admittanceCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_ADMITTANCE_STATE = (state: AdmittanceState) => ({
  ...state,
  admittanceCreate: initialState().admittanceCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_ADMITTANCE = (state: AdmittanceState) => ({
  ...state,
  admittanceUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_ADMITTANCE_SUCCEED = (
  state: AdmittanceState,
  action: BaseAction
) => ({
  ...state,
  admittanceUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_ADMITTANCE_FAILURE = (state: AdmittanceState) => ({
  ...state,
  admittanceUpdate: {
    ...state.admittanceUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_ADMITTANCE_STATE = (state: AdmittanceState) => ({
  ...state,
  admittanceUpdate: initialState().admittanceUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_ADMITTANCE = (state: AdmittanceState) => ({
  ...state,
  admittanceDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_ADMITTANCE_SUCCEED = (
  state: AdmittanceState,
  action: BaseAction
) => ({
  ...state,
  admittanceDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_ADMITTANCE_FAILURE = (state: AdmittanceState) => ({
  ...state,
  admittanceDelete: {
    ...state.admittanceDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_ADMITTANCE_STATE = (state: AdmittanceState) => ({
  ...state,
  admittanceDelete: initialState().admittanceDelete,
});

const reducer = (
  state: AdmittanceState = initialState(),
  action: BaseAction
) => {
  switch (action.type) {
    case ADMITTANCE_ACTIONS.ATTEMPT_TO_FETCH_ADMITTANCE:
      return ATTEMPT_TO_FETCH_ADMITTANCE(state);
    case ADMITTANCE_ACTIONS.SET_FETCH_ADMITTANCE_SUCCEED:
      return SET_FETCH_ADMITTANCE_SUCCEED(state, action);
    case ADMITTANCE_ACTIONS.SET_FETCH_ADMITTANCE_FAILURE:
      return SET_FETCH_ADMITTANCE_FAILURE(state);
    case ADMITTANCE_ACTIONS.RESET_FETCH_ADMITTANCE_STATE:
      return RESET_FETCH_ADMITTANCE_STATE(state);

    case ADMITTANCE_ACTIONS.ATTEMPT_TO_CREATE_ADMITTANCE:
      return ATTEMPT_TO_CREATE_ADMITTANCE(state);
    case ADMITTANCE_ACTIONS.SET_CREATE_ADMITTANCE_SUCCEED:
      return SET_CREATE_ADMITTANCE_SUCCEED(state, action);
    case ADMITTANCE_ACTIONS.SET_CREATE_ADMITTANCE_FAILURE:
      return SET_CREATE_ADMITTANCE_FAILURE(state);
    case ADMITTANCE_ACTIONS.RESET_CREATE_ADMITTANCE_STATE:
      return RESET_CREATE_ADMITTANCE_STATE(state);

    case ADMITTANCE_ACTIONS.ATTEMPT_TO_UPDATE_ADMITTANCE:
      return ATTEMPT_TO_UPDATE_ADMITTANCE(state);
    case ADMITTANCE_ACTIONS.SET_UPDATE_ADMITTANCE_SUCCEED:
      return SET_UPDATE_ADMITTANCE_SUCCEED(state, action);
    case ADMITTANCE_ACTIONS.SET_UPDATE_ADMITTANCE_FAILURE:
      return SET_UPDATE_ADMITTANCE_FAILURE(state);
    case ADMITTANCE_ACTIONS.RESET_UPDATE_ADMITTANCE_STATE:
      return RESET_UPDATE_ADMITTANCE_STATE(state);

    case ADMITTANCE_ACTIONS.ATTEMPT_TO_DELETE_ADMITTANCE:
      return ATTEMPT_TO_DELETE_ADMITTANCE(state);
    case ADMITTANCE_ACTIONS.SET_DELETE_ADMITTANCE_SUCCEED:
      return SET_DELETE_ADMITTANCE_SUCCEED(state, action);
    case ADMITTANCE_ACTIONS.SET_DELETE_ADMITTANCE_FAILURE:
      return SET_DELETE_ADMITTANCE_FAILURE(state);
    case ADMITTANCE_ACTIONS.RESET_DELETE_ADMITTANCE_STATE:
      return RESET_DELETE_ADMITTANCE_STATE(state);
    default:
      return state;
  }
};

export default reducer;
