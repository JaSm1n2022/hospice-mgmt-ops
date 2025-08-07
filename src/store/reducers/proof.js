import type { BaseAction } from "../types/Action";
import type { ProofState } from "../types";
import { PROOF_ACTIONS } from "../actions/proofAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): ProofState => ({
  proofList: {
    data: {},
    status: null,
    error: null,
  },
  proofUpdate: {
    data: {},
    status: null,
    error: null,
  },
  proofCreate: {
    data: {},
    status: null,
    error: null,
  },
  proofDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_PROOF = (state: ProofState) => ({
  ...state,
  proofList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_PROOF_SUCCEED = (state: ProofState, action: BaseAction) => ({
  ...state,
  proofList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_PROOF_FAILURE = (state: ProofState) => ({
  ...state,
  proofList: {
    ...state.proofList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_PROOF_STATE = (state: ProofState) => ({
  ...state,
  proofList: initialState().proofList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_PROOF = (state: ProofState) => ({
  ...state,
  proofCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_PROOF_SUCCEED = (state: ProofState, action: BaseAction) => ({
  ...state,
  proofCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_PROOF_FAILURE = (state: ProofState) => ({
  ...state,
  proofCreate: {
    ...state.proofCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_PROOF_STATE = (state: ProofState) => ({
  ...state,
  proofCreate: initialState().proofCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_PROOF = (state: ProofState) => ({
  ...state,
  proofUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_PROOF_SUCCEED = (state: ProofState, action: BaseAction) => ({
  ...state,
  proofUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_PROOF_FAILURE = (state: ProofState) => ({
  ...state,
  proofUpdate: {
    ...state.proofUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_PROOF_STATE = (state: ProofState) => ({
  ...state,
  proofUpdate: initialState().proofUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_PROOF = (state: ProofState) => ({
  ...state,
  proofDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_PROOF_SUCCEED = (state: ProofState, action: BaseAction) => ({
  ...state,
  proofDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_PROOF_FAILURE = (state: ProofState) => ({
  ...state,
  proofDelete: {
    ...state.proofDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_PROOF_STATE = (state: ProofState) => ({
  ...state,
  proofDelete: initialState().proofDelete,
});

const reducer = (state: ProofState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case PROOF_ACTIONS.ATTEMPT_TO_FETCH_PROOF:
      return ATTEMPT_TO_FETCH_PROOF(state);
    case PROOF_ACTIONS.SET_FETCH_PROOF_SUCCEED:
      return SET_FETCH_PROOF_SUCCEED(state, action);
    case PROOF_ACTIONS.SET_FETCH_PROOF_FAILURE:
      return SET_FETCH_PROOF_FAILURE(state);
    case PROOF_ACTIONS.RESET_FETCH_PROOF_STATE:
      return RESET_FETCH_PROOF_STATE(state);

    case PROOF_ACTIONS.ATTEMPT_TO_CREATE_PROOF:
      return ATTEMPT_TO_CREATE_PROOF(state);
    case PROOF_ACTIONS.SET_CREATE_PROOF_SUCCEED:
      return SET_CREATE_PROOF_SUCCEED(state, action);
    case PROOF_ACTIONS.SET_CREATE_PROOF_FAILURE:
      return SET_CREATE_PROOF_FAILURE(state);
    case PROOF_ACTIONS.RESET_CREATE_PROOF_STATE:
      return RESET_CREATE_PROOF_STATE(state);

    case PROOF_ACTIONS.ATTEMPT_TO_UPDATE_PROOF:
      return ATTEMPT_TO_UPDATE_PROOF(state);
    case PROOF_ACTIONS.SET_UPDATE_PROOF_SUCCEED:
      return SET_UPDATE_PROOF_SUCCEED(state, action);
    case PROOF_ACTIONS.SET_UPDATE_PROOF_FAILURE:
      return SET_UPDATE_PROOF_FAILURE(state);
    case PROOF_ACTIONS.RESET_UPDATE_PROOF_STATE:
      return RESET_UPDATE_PROOF_STATE(state);

    case PROOF_ACTIONS.ATTEMPT_TO_DELETE_PROOF:
      return ATTEMPT_TO_DELETE_PROOF(state);
    case PROOF_ACTIONS.SET_DELETE_PROOF_SUCCEED:
      return SET_DELETE_PROOF_SUCCEED(state, action);
    case PROOF_ACTIONS.SET_DELETE_PROOF_FAILURE:
      return SET_DELETE_PROOF_FAILURE(state);
    case PROOF_ACTIONS.RESET_DELETE_PROOF_STATE:
      return RESET_DELETE_PROOF_STATE(state);
    default:
      return state;
  }
};

export default reducer;
