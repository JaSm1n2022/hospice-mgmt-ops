import type { BaseAction } from "../types/Action";
import type { ContractState } from "../types";
import { CONTRACT_ACTIONS } from "../actions/contractAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): ContractState => ({
  contractList: {
    data: {},
    status: null,
    error: null,
  },
  contractUpdate: {
    data: {},
    status: null,
    error: null,
  },
  contractCreate: {
    data: {},
    status: null,
    error: null,
  },
  contractDelete: {
    data: {},
    status: null,
    error: null,
  },
});

/*
 */
const ATTEMPT_TO_FETCH_CONTRACT = (state: ContractState) => ({
  ...state,
  contractList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_CONTRACT_SUCCEED = (
  state: ContractState,
  action: BaseAction
) => ({
  ...state,
  contractList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_CONTRACT_FAILURE = (state: ContractState) => ({
  ...state,
  contractList: {
    ...state.contractList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_CONTRACT_STATE = (state: ContractState) => ({
  ...state,
  contractList: initialState().contractList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_CONTRACT = (state: ContractState) => ({
  ...state,
  contractCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_CONTRACT_SUCCEED = (
  state: ContractState,
  action: BaseAction
) => ({
  ...state,
  contractCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_CONTRACT_FAILURE = (state: ContractState) => ({
  ...state,
  contractCreate: {
    ...state.contractCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_CONTRACT_STATE = (state: ContractState) => ({
  ...state,
  contractCreate: initialState().contractCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_CONTRACT = (state: ContractState) => ({
  ...state,
  contractUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_CONTRACT_SUCCEED = (
  state: ContractState,
  action: BaseAction
) => ({
  ...state,
  contractUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_CONTRACT_FAILURE = (state: ContractState) => ({
  ...state,
  contractUpdate: {
    ...state.contractUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_CONTRACT_STATE = (state: ContractState) => ({
  ...state,
  contractUpdate: initialState().contractUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_CONTRACT = (state: ContractState) => ({
  ...state,
  contractDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_CONTRACT_SUCCEED = (
  state: ContractState,
  action: BaseAction
) => ({
  ...state,
  contractDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_CONTRACT_FAILURE = (state: ContractState) => ({
  ...state,
  contractDelete: {
    ...state.contractDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_CONTRACT_STATE = (state: ContractState) => ({
  ...state,
  contractDelete: initialState().contractDelete,
});

const reducer = (state: ContractState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case CONTRACT_ACTIONS.ATTEMPT_TO_FETCH_CONTRACT:
      return ATTEMPT_TO_FETCH_CONTRACT(state);
    case CONTRACT_ACTIONS.SET_FETCH_CONTRACT_SUCCEED:
      return SET_FETCH_CONTRACT_SUCCEED(state, action);
    case CONTRACT_ACTIONS.SET_FETCH_CONTRACT_FAILURE:
      return SET_FETCH_CONTRACT_FAILURE(state);
    case CONTRACT_ACTIONS.RESET_FETCH_CONTRACT_STATE:
      return RESET_FETCH_CONTRACT_STATE(state);

    case CONTRACT_ACTIONS.ATTEMPT_TO_CREATE_CONTRACT:
      return ATTEMPT_TO_CREATE_CONTRACT(state);
    case CONTRACT_ACTIONS.SET_CREATE_CONTRACT_SUCCEED:
      return SET_CREATE_CONTRACT_SUCCEED(state, action);
    case CONTRACT_ACTIONS.SET_CREATE_CONTRACT_FAILURE:
      return SET_CREATE_CONTRACT_FAILURE(state);
    case CONTRACT_ACTIONS.RESET_CREATE_CONTRACT_STATE:
      return RESET_CREATE_CONTRACT_STATE(state);

    case CONTRACT_ACTIONS.ATTEMPT_TO_UPDATE_CONTRACT:
      return ATTEMPT_TO_UPDATE_CONTRACT(state);
    case CONTRACT_ACTIONS.SET_UPDATE_CONTRACT_SUCCEED:
      return SET_UPDATE_CONTRACT_SUCCEED(state, action);
    case CONTRACT_ACTIONS.SET_UPDATE_CONTRACT_FAILURE:
      return SET_UPDATE_CONTRACT_FAILURE(state);
    case CONTRACT_ACTIONS.RESET_UPDATE_CONTRACT_STATE:
      return RESET_UPDATE_CONTRACT_STATE(state);

    case CONTRACT_ACTIONS.ATTEMPT_TO_DELETE_CONTRACT:
      return ATTEMPT_TO_DELETE_CONTRACT(state);
    case CONTRACT_ACTIONS.SET_DELETE_CONTRACT_SUCCEED:
      return SET_DELETE_CONTRACT_SUCCEED(state, action);
    case CONTRACT_ACTIONS.SET_DELETE_CONTRACT_FAILURE:
      return SET_DELETE_CONTRACT_FAILURE(state);
    case CONTRACT_ACTIONS.RESET_DELETE_CONTRACT_STATE:
      return RESET_DELETE_CONTRACT_STATE(state);
    default:
      return state;
  }
};

export default reducer;
