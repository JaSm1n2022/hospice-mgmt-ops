import type { BaseAction } from "../types/Action";
import type { AssignmentState } from "../types";
import { ASSIGNMENT_ACTIONS } from "../actions/assignmentAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): AssignmentState => ({
  assignmentList: {
    data: {},
    status: null,
    error: null,
  },
  assignmentUpdate: {
    data: {},
    status: null,
    error: null,
  },
  assignmentCreate: {
    data: {},
    status: null,
    error: null,
  },
  assignmentDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_ASSIGNMENT = (state: AssignmentState) => ({
  ...state,
  assignmentList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_ASSIGNMENT_SUCCEED = (
  state: AssignmentState,
  action: BaseAction
) => ({
  ...state,
  assignmentList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_ASSIGNMENT_FAILURE = (state: AssignmentState) => ({
  ...state,
  assignmentList: {
    ...state.assignmentList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_ASSIGNMENT_STATE = (state: AssignmentState) => ({
  ...state,
  assignmentList: initialState().assignmentList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_ASSIGNMENT = (state: AssignmentState) => ({
  ...state,
  assignmentCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_ASSIGNMENT_SUCCEED = (
  state: AssignmentState,
  action: BaseAction
) => ({
  ...state,
  assignmentCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_ASSIGNMENT_FAILURE = (state: AssignmentState) => ({
  ...state,
  assignmentCreate: {
    ...state.assignmentCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_ASSIGNMENT_STATE = (state: AssignmentState) => ({
  ...state,
  assignmentCreate: initialState().assignmentCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_ASSIGNMENT = (state: AssignmentState) => ({
  ...state,
  assignmentUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_ASSIGNMENT_SUCCEED = (
  state: AssignmentState,
  action: BaseAction
) => ({
  ...state,
  assignmentUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_ASSIGNMENT_FAILURE = (state: AssignmentState) => ({
  ...state,
  assignmentUpdate: {
    ...state.assignmentUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_ASSIGNMENT_STATE = (state: AssignmentState) => ({
  ...state,
  assignmentUpdate: initialState().assignmentUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_ASSIGNMENT = (state: AssignmentState) => ({
  ...state,
  assignmentDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_ASSIGNMENT_SUCCEED = (
  state: AssignmentState,
  action: BaseAction
) => ({
  ...state,
  assignmentDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_ASSIGNMENT_FAILURE = (state: AssignmentState) => ({
  ...state,
  assignmentDelete: {
    ...state.assignmentDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_ASSIGNMENT_STATE = (state: AssignmentState) => ({
  ...state,
  assignmentDelete: initialState().assignmentDelete,
});

const reducer = (
  state: AssignmentState = initialState(),
  action: BaseAction
) => {
  switch (action.type) {
    case ASSIGNMENT_ACTIONS.ATTEMPT_TO_FETCH_ASSIGNMENT:
      return ATTEMPT_TO_FETCH_ASSIGNMENT(state);
    case ASSIGNMENT_ACTIONS.SET_FETCH_ASSIGNMENT_SUCCEED:
      return SET_FETCH_ASSIGNMENT_SUCCEED(state, action);
    case ASSIGNMENT_ACTIONS.SET_FETCH_ASSIGNMENT_FAILURE:
      return SET_FETCH_ASSIGNMENT_FAILURE(state);
    case ASSIGNMENT_ACTIONS.RESET_FETCH_ASSIGNMENT_STATE:
      return RESET_FETCH_ASSIGNMENT_STATE(state);

    case ASSIGNMENT_ACTIONS.ATTEMPT_TO_CREATE_ASSIGNMENT:
      return ATTEMPT_TO_CREATE_ASSIGNMENT(state);
    case ASSIGNMENT_ACTIONS.SET_CREATE_ASSIGNMENT_SUCCEED:
      return SET_CREATE_ASSIGNMENT_SUCCEED(state, action);
    case ASSIGNMENT_ACTIONS.SET_CREATE_ASSIGNMENT_FAILURE:
      return SET_CREATE_ASSIGNMENT_FAILURE(state);
    case ASSIGNMENT_ACTIONS.RESET_CREATE_ASSIGNMENT_STATE:
      return RESET_CREATE_ASSIGNMENT_STATE(state);

    case ASSIGNMENT_ACTIONS.ATTEMPT_TO_UPDATE_ASSIGNMENT:
      return ATTEMPT_TO_UPDATE_ASSIGNMENT(state);
    case ASSIGNMENT_ACTIONS.SET_UPDATE_ASSIGNMENT_SUCCEED:
      return SET_UPDATE_ASSIGNMENT_SUCCEED(state, action);
    case ASSIGNMENT_ACTIONS.SET_UPDATE_ASSIGNMENT_FAILURE:
      return SET_UPDATE_ASSIGNMENT_FAILURE(state);
    case ASSIGNMENT_ACTIONS.RESET_UPDATE_ASSIGNMENT_STATE:
      return RESET_UPDATE_ASSIGNMENT_STATE(state);

    case ASSIGNMENT_ACTIONS.ATTEMPT_TO_DELETE_ASSIGNMENT:
      return ATTEMPT_TO_DELETE_ASSIGNMENT(state);
    case ASSIGNMENT_ACTIONS.SET_DELETE_ASSIGNMENT_SUCCEED:
      return SET_DELETE_ASSIGNMENT_SUCCEED(state, action);
    case ASSIGNMENT_ACTIONS.SET_DELETE_ASSIGNMENT_FAILURE:
      return SET_DELETE_ASSIGNMENT_FAILURE(state);
    case ASSIGNMENT_ACTIONS.RESET_DELETE_ASSIGNMENT_STATE:
      return RESET_DELETE_ASSIGNMENT_STATE(state);
    default:
      return state;
  }
};

export default reducer;
