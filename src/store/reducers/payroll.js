import type { BaseAction } from "../types/Action";
import type { PayrollState } from "../types";
import { PAYROLL_ACTIONS } from "../actions/payrollAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): PayrollState => ({
  payrollList: {
    data: {},
    status: null,
    error: null,
  },
  payrollUpdate: {
    data: {},
    status: null,
    error: null,
  },
  payrollCreate: {
    data: {},
    status: null,
    error: null,
  },
  payrollDelete: {
    data: {},
    status: null,
    error: null,
  },
});

/*
 */
const ATTEMPT_TO_FETCH_PAYROLL = (state: PayrollState) => ({
  ...state,
  payrollList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_PAYROLL_SUCCEED = (
  state: PayrollState,
  action: BaseAction
) => ({
  ...state,
  payrollList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_PAYROLL_FAILURE = (state: PayrollState) => ({
  ...state,
  payrollList: {
    ...state.payrollList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_PAYROLL_STATE = (state: PayrollState) => ({
  ...state,
  payrollList: initialState().payrollList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_PAYROLL = (state: PayrollState) => ({
  ...state,
  payrollCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_PAYROLL_SUCCEED = (
  state: PayrollState,
  action: BaseAction
) => ({
  ...state,
  payrollCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_PAYROLL_FAILURE = (state: PayrollState) => ({
  ...state,
  payrollCreate: {
    ...state.payrollCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_PAYROLL_STATE = (state: PayrollState) => ({
  ...state,
  payrollCreate: initialState().payrollCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_PAYROLL = (state: PayrollState) => ({
  ...state,
  payrollUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_PAYROLL_SUCCEED = (
  state: PayrollState,
  action: BaseAction
) => ({
  ...state,
  payrollUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_PAYROLL_FAILURE = (state: PayrollState) => ({
  ...state,
  payrollUpdate: {
    ...state.payrollUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_PAYROLL_STATE = (state: PayrollState) => ({
  ...state,
  payrollUpdate: initialState().payrollUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_PAYROLL = (state: PayrollState) => ({
  ...state,
  payrollDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_PAYROLL_SUCCEED = (
  state: PayrollState,
  action: BaseAction
) => ({
  ...state,
  payrollDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_PAYROLL_FAILURE = (state: PayrollState) => ({
  ...state,
  payrollDelete: {
    ...state.payrollDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_PAYROLL_STATE = (state: PayrollState) => ({
  ...state,
  payrollDelete: initialState().payrollDelete,
});

const reducer = (state: PayrollState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case PAYROLL_ACTIONS.ATTEMPT_TO_FETCH_PAYROLL:
      return ATTEMPT_TO_FETCH_PAYROLL(state);
    case PAYROLL_ACTIONS.SET_FETCH_PAYROLL_SUCCEED:
      return SET_FETCH_PAYROLL_SUCCEED(state, action);
    case PAYROLL_ACTIONS.SET_FETCH_PAYROLL_FAILURE:
      return SET_FETCH_PAYROLL_FAILURE(state);
    case PAYROLL_ACTIONS.RESET_FETCH_PAYROLL_STATE:
      return RESET_FETCH_PAYROLL_STATE(state);

    case PAYROLL_ACTIONS.ATTEMPT_TO_CREATE_PAYROLL:
      return ATTEMPT_TO_CREATE_PAYROLL(state);
    case PAYROLL_ACTIONS.SET_CREATE_PAYROLL_SUCCEED:
      return SET_CREATE_PAYROLL_SUCCEED(state, action);
    case PAYROLL_ACTIONS.SET_CREATE_PAYROLL_FAILURE:
      return SET_CREATE_PAYROLL_FAILURE(state);
    case PAYROLL_ACTIONS.RESET_CREATE_PAYROLL_STATE:
      return RESET_CREATE_PAYROLL_STATE(state);

    case PAYROLL_ACTIONS.ATTEMPT_TO_UPDATE_PAYROLL:
      return ATTEMPT_TO_UPDATE_PAYROLL(state);
    case PAYROLL_ACTIONS.SET_UPDATE_PAYROLL_SUCCEED:
      return SET_UPDATE_PAYROLL_SUCCEED(state, action);
    case PAYROLL_ACTIONS.SET_UPDATE_PAYROLL_FAILURE:
      return SET_UPDATE_PAYROLL_FAILURE(state);
    case PAYROLL_ACTIONS.RESET_UPDATE_PAYROLL_STATE:
      return RESET_UPDATE_PAYROLL_STATE(state);

    case PAYROLL_ACTIONS.ATTEMPT_TO_DELETE_PAYROLL:
      return ATTEMPT_TO_DELETE_PAYROLL(state);
    case PAYROLL_ACTIONS.SET_DELETE_PAYROLL_SUCCEED:
      return SET_DELETE_PAYROLL_SUCCEED(state, action);
    case PAYROLL_ACTIONS.SET_DELETE_PAYROLL_FAILURE:
      return SET_DELETE_PAYROLL_FAILURE(state);
    case PAYROLL_ACTIONS.RESET_DELETE_PAYROLL_STATE:
      return RESET_DELETE_PAYROLL_STATE(state);
    default:
      return state;
  }
};

export default reducer;
