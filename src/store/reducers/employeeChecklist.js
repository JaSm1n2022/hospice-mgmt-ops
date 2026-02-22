import type { BaseAction } from "../types/Action";
import type { EmployeeChecklistState } from "../types";
import { EMPLOYEE_CHECKLIST_ACTIONS } from "../actions/employeeChecklistAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): EmployeeChecklistState => ({
  employeeChecklistList: {
    data: {},
    status: null,
    error: null,
  },
  employeeChecklistUpdate: {
    data: {},
    status: null,
    error: null,
  },
  employeeChecklistCreate: {
    data: {},
    status: null,
    error: null,
  },
  employeeChecklistDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_EMPLOYEE_CHECKLIST = (state: EmployeeChecklistState) => ({
  ...state,
  employeeChecklistList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_EMPLOYEE_CHECKLIST_SUCCEED = (
  state: EmployeeChecklistState,
  action: BaseAction
) => ({
  ...state,
  employeeChecklistList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_EMPLOYEE_CHECKLIST_FAILURE = (state: EmployeeChecklistState) => ({
  ...state,
  employeeChecklistList: {
    ...state.employeeChecklistList,
    status: ACTION_STATUSES.FAILED,
  },
});

const RESET_FETCH_EMPLOYEE_CHECKLIST_STATE = (state: EmployeeChecklistState) => ({
  ...state,
  employeeChecklistList: initialState().employeeChecklistList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_EMPLOYEE_CHECKLIST = (state: EmployeeChecklistState) => ({
  ...state,
  employeeChecklistCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_EMPLOYEE_CHECKLIST_SUCCEED = (
  state: EmployeeChecklistState,
  action: BaseAction
) => ({
  ...state,
  employeeChecklistCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_EMPLOYEE_CHECKLIST_FAILURE = (state: EmployeeChecklistState) => ({
  ...state,
  employeeChecklistCreate: {
    ...state.employeeChecklistCreate,
    status: ACTION_STATUSES.FAILED,
  },
});

const RESET_CREATE_EMPLOYEE_CHECKLIST_STATE = (state: EmployeeChecklistState) => ({
  ...state,
  employeeChecklistCreate: initialState().employeeChecklistCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_EMPLOYEE_CHECKLIST = (state: EmployeeChecklistState) => ({
  ...state,
  employeeChecklistUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_EMPLOYEE_CHECKLIST_SUCCEED = (
  state: EmployeeChecklistState,
  action: BaseAction
) => ({
  ...state,
  employeeChecklistUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_EMPLOYEE_CHECKLIST_FAILURE = (state: EmployeeChecklistState) => ({
  ...state,
  employeeChecklistUpdate: {
    ...state.employeeChecklistUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});

const RESET_UPDATE_EMPLOYEE_CHECKLIST_STATE = (state: EmployeeChecklistState) => ({
  ...state,
  employeeChecklistUpdate: initialState().employeeChecklistUpdate,
});

/*
Delete
 */
const ATTEMPT_TO_DELETE_EMPLOYEE_CHECKLIST = (state: EmployeeChecklistState) => ({
  ...state,
  employeeChecklistDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_EMPLOYEE_CHECKLIST_SUCCEED = (
  state: EmployeeChecklistState,
  action: BaseAction
) => ({
  ...state,
  employeeChecklistDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_EMPLOYEE_CHECKLIST_FAILURE = (state: EmployeeChecklistState) => ({
  ...state,
  employeeChecklistDelete: {
    ...state.employeeChecklistDelete,
    status: ACTION_STATUSES.FAILED,
  },
});

const RESET_DELETE_EMPLOYEE_CHECKLIST_STATE = (state: EmployeeChecklistState) => ({
  ...state,
  employeeChecklistDelete: initialState().employeeChecklistDelete,
});

const reducer = (state: EmployeeChecklistState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case EMPLOYEE_CHECKLIST_ACTIONS.ATTEMPT_TO_FETCH_EMPLOYEE_CHECKLIST:
      return ATTEMPT_TO_FETCH_EMPLOYEE_CHECKLIST(state);
    case EMPLOYEE_CHECKLIST_ACTIONS.SET_FETCH_EMPLOYEE_CHECKLIST_SUCCEED:
      return SET_FETCH_EMPLOYEE_CHECKLIST_SUCCEED(state, action);
    case EMPLOYEE_CHECKLIST_ACTIONS.SET_FETCH_EMPLOYEE_CHECKLIST_FAILURE:
      return SET_FETCH_EMPLOYEE_CHECKLIST_FAILURE(state);
    case EMPLOYEE_CHECKLIST_ACTIONS.RESET_FETCH_EMPLOYEE_CHECKLIST_STATE:
      return RESET_FETCH_EMPLOYEE_CHECKLIST_STATE(state);

    case EMPLOYEE_CHECKLIST_ACTIONS.ATTEMPT_TO_CREATE_EMPLOYEE_CHECKLIST:
      return ATTEMPT_TO_CREATE_EMPLOYEE_CHECKLIST(state);
    case EMPLOYEE_CHECKLIST_ACTIONS.SET_CREATE_EMPLOYEE_CHECKLIST_SUCCEED:
      return SET_CREATE_EMPLOYEE_CHECKLIST_SUCCEED(state, action);
    case EMPLOYEE_CHECKLIST_ACTIONS.SET_CREATE_EMPLOYEE_CHECKLIST_FAILURE:
      return SET_CREATE_EMPLOYEE_CHECKLIST_FAILURE(state);
    case EMPLOYEE_CHECKLIST_ACTIONS.RESET_CREATE_EMPLOYEE_CHECKLIST_STATE:
      return RESET_CREATE_EMPLOYEE_CHECKLIST_STATE(state);

    case EMPLOYEE_CHECKLIST_ACTIONS.ATTEMPT_TO_UPDATE_EMPLOYEE_CHECKLIST:
      return ATTEMPT_TO_UPDATE_EMPLOYEE_CHECKLIST(state);
    case EMPLOYEE_CHECKLIST_ACTIONS.SET_UPDATE_EMPLOYEE_CHECKLIST_SUCCEED:
      return SET_UPDATE_EMPLOYEE_CHECKLIST_SUCCEED(state, action);
    case EMPLOYEE_CHECKLIST_ACTIONS.SET_UPDATE_EMPLOYEE_CHECKLIST_FAILURE:
      return SET_UPDATE_EMPLOYEE_CHECKLIST_FAILURE(state);
    case EMPLOYEE_CHECKLIST_ACTIONS.RESET_UPDATE_EMPLOYEE_CHECKLIST_STATE:
      return RESET_UPDATE_EMPLOYEE_CHECKLIST_STATE(state);

    case EMPLOYEE_CHECKLIST_ACTIONS.ATTEMPT_TO_DELETE_EMPLOYEE_CHECKLIST:
      return ATTEMPT_TO_DELETE_EMPLOYEE_CHECKLIST(state);
    case EMPLOYEE_CHECKLIST_ACTIONS.SET_DELETE_EMPLOYEE_CHECKLIST_SUCCEED:
      return SET_DELETE_EMPLOYEE_CHECKLIST_SUCCEED(state, action);
    case EMPLOYEE_CHECKLIST_ACTIONS.SET_DELETE_EMPLOYEE_CHECKLIST_FAILURE:
      return SET_DELETE_EMPLOYEE_CHECKLIST_FAILURE(state);
    case EMPLOYEE_CHECKLIST_ACTIONS.RESET_DELETE_EMPLOYEE_CHECKLIST_STATE:
      return RESET_DELETE_EMPLOYEE_CHECKLIST_STATE(state);
    default:
      return state;
  }
};

export default reducer;
