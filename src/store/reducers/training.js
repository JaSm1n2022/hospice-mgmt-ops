import type { BaseAction } from "../types/Action";
import type { TrainingState } from "../types";
import { TRAINING_ACTIONS } from "../actions/trainingAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): TrainingState => ({
  trainingList: {
    data: {},
    status: null,
    error: null,
  },
  trainingUpdate: {
    data: {},
    status: null,
    error: null,
  },
  trainingCreate: {
    data: {},
    status: null,
    error: null,
  },
  trainingDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_TRAINING = (state: TrainingState) => ({
  ...state,
  trainingList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_TRAINING_SUCCEED = (
  state: TrainingState,
  action: BaseAction
) => ({
  ...state,
  trainingList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_TRAINING_FAILURE = (state: TrainingState) => ({
  ...state,
  trainingList: {
    ...state.trainingList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_TRAINING_STATE = (state: TrainingState) => ({
  ...state,
  trainingList: initialState().trainingList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_TRAINING = (state: TrainingState) => ({
  ...state,
  trainingCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_TRAINING_SUCCEED = (
  state: TrainingState,
  action: BaseAction
) => ({
  ...state,
  trainingCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_TRAINING_FAILURE = (state: TrainingState) => ({
  ...state,
  trainingCreate: {
    ...state.trainingCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_TRAINING_STATE = (state: TrainingState) => ({
  ...state,
  trainingCreate: initialState().trainingCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_TRAINING = (state: TrainingState) => ({
  ...state,
  trainingUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_TRAINING_SUCCEED = (
  state: TrainingState,
  action: BaseAction
) => ({
  ...state,
  trainingUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_TRAINING_FAILURE = (state: TrainingState) => ({
  ...state,
  trainingUpdate: {
    ...state.trainingUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_TRAINING_STATE = (state: TrainingState) => ({
  ...state,
  trainingUpdate: initialState().trainingUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_TRAINING = (state: TrainingState) => ({
  ...state,
  trainingDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_TRAINING_SUCCEED = (
  state: TrainingState,
  action: BaseAction
) => ({
  ...state,
  trainingDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_TRAINING_FAILURE = (state: TrainingState) => ({
  ...state,
  trainingDelete: {
    ...state.trainingDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_TRAINING_STATE = (state: TrainingState) => ({
  ...state,
  trainingDelete: initialState().trainingDelete,
});

const reducer = (state: TrainingState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case TRAINING_ACTIONS.ATTEMPT_TO_FETCH_TRAINING:
      return ATTEMPT_TO_FETCH_TRAINING(state);
    case TRAINING_ACTIONS.SET_FETCH_TRAINING_SUCCEED:
      return SET_FETCH_TRAINING_SUCCEED(state, action);
    case TRAINING_ACTIONS.SET_FETCH_TRAINING_FAILURE:
      return SET_FETCH_TRAINING_FAILURE(state);
    case TRAINING_ACTIONS.RESET_FETCH_TRAINING_STATE:
      return RESET_FETCH_TRAINING_STATE(state);

    case TRAINING_ACTIONS.ATTEMPT_TO_CREATE_TRAINING:
      return ATTEMPT_TO_CREATE_TRAINING(state);
    case TRAINING_ACTIONS.SET_CREATE_TRAINING_SUCCEED:
      return SET_CREATE_TRAINING_SUCCEED(state, action);
    case TRAINING_ACTIONS.SET_CREATE_TRAINING_FAILURE:
      return SET_CREATE_TRAINING_FAILURE(state);
    case TRAINING_ACTIONS.RESET_CREATE_TRAINING_STATE:
      return RESET_CREATE_TRAINING_STATE(state);

    case TRAINING_ACTIONS.ATTEMPT_TO_UPDATE_TRAINING:
      return ATTEMPT_TO_UPDATE_TRAINING(state);
    case TRAINING_ACTIONS.SET_UPDATE_TRAINING_SUCCEED:
      return SET_UPDATE_TRAINING_SUCCEED(state, action);
    case TRAINING_ACTIONS.SET_UPDATE_TRAINING_FAILURE:
      return SET_UPDATE_TRAINING_FAILURE(state);
    case TRAINING_ACTIONS.RESET_UPDATE_TRAINING_STATE:
      return RESET_UPDATE_TRAINING_STATE(state);

    case TRAINING_ACTIONS.ATTEMPT_TO_DELETE_TRAINING:
      return ATTEMPT_TO_DELETE_TRAINING(state);
    case TRAINING_ACTIONS.SET_DELETE_TRAINING_SUCCEED:
      return SET_DELETE_TRAINING_SUCCEED(state, action);
    case TRAINING_ACTIONS.SET_DELETE_TRAINING_FAILURE:
      return SET_DELETE_TRAINING_FAILURE(state);
    case TRAINING_ACTIONS.RESET_DELETE_TRAINING_STATE:
      return RESET_DELETE_TRAINING_STATE(state);
    default:
      return state;
  }
};

export default reducer;
