import type { BaseAction } from '../types/Action';
import type { PotentialAdmissionState } from '../types';
import { POTENTIAL_ADMISSION_ACTIONS } from '../actions/potentialAdmissionAction';
import { ACTION_STATUSES } from '../../utils/constants';

const initialState = (): PotentialAdmissionState => ({
  potentialAdmissionList: {
    data: {},
    status: null,
    error: null
  },
  potentialAdmissionUpdate: {
    data: {},
    status: null,
    error: null
  },
  potentialAdmissionCreate: {
    data: {},
    status: null,
    error: null
  },
  potentialAdmissionDelete: {
    data: {},
    status: null,
    error: null
  }
});

// Fetch handlers
const ATTEMPT_TO_FETCH_POTENTIAL_ADMISSION = (state: PotentialAdmissionState) => ({
  ...state,
  potentialAdmissionList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null
  }
});

const SET_FETCH_POTENTIAL_ADMISSION_SUCCEED = (state: PotentialAdmissionState, action: BaseAction) => ({
  ...state,
  potentialAdmissionList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null
  }
});

const SET_FETCH_POTENTIAL_ADMISSION_FAILURE = (state: PotentialAdmissionState) => ({
  ...state,
  potentialAdmissionList: {
    ...state.potentialAdmissionList,
    status: ACTION_STATUSES.FAILED
  }
});

const RESET_FETCH_POTENTIAL_ADMISSION_STATE = (state: PotentialAdmissionState) => ({
  ...state,
  potentialAdmissionList: initialState().potentialAdmissionList
});

// Create handlers
const ATTEMPT_TO_CREATE_POTENTIAL_ADMISSION = (state: PotentialAdmissionState) => ({
  ...state,
  potentialAdmissionCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null
  }
});

const SET_CREATE_POTENTIAL_ADMISSION_SUCCEED = (state: PotentialAdmissionState, action: BaseAction) => ({
  ...state,
  potentialAdmissionCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null
  }
});

const SET_CREATE_POTENTIAL_ADMISSION_FAILURE = (state: PotentialAdmissionState) => ({
  ...state,
  potentialAdmissionCreate: {
    ...state.potentialAdmissionCreate,
    status: ACTION_STATUSES.FAILED
  }
});

const RESET_CREATE_POTENTIAL_ADMISSION_STATE = (state: PotentialAdmissionState) => ({
  ...state,
  potentialAdmissionCreate: initialState().potentialAdmissionCreate
});

// Update handlers
const ATTEMPT_TO_UPDATE_POTENTIAL_ADMISSION = (state: PotentialAdmissionState) => ({
  ...state,
  potentialAdmissionUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null
  }
});

const SET_UPDATE_POTENTIAL_ADMISSION_SUCCEED = (state: PotentialAdmissionState, action: BaseAction) => ({
  ...state,
  potentialAdmissionUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null
  }
});

const SET_UPDATE_POTENTIAL_ADMISSION_FAILURE = (state: PotentialAdmissionState) => ({
  ...state,
  potentialAdmissionUpdate: {
    ...state.potentialAdmissionUpdate,
    status: ACTION_STATUSES.FAILED
  }
});

const RESET_UPDATE_POTENTIAL_ADMISSION_STATE = (state: PotentialAdmissionState) => ({
  ...state,
  potentialAdmissionUpdate: initialState().potentialAdmissionUpdate
});

// Delete handlers
const ATTEMPT_TO_DELETE_POTENTIAL_ADMISSION = (state: PotentialAdmissionState) => ({
  ...state,
  potentialAdmissionDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null
  }
});

const SET_DELETE_POTENTIAL_ADMISSION_SUCCEED = (state: PotentialAdmissionState, action: BaseAction) => ({
  ...state,
  potentialAdmissionDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null
  }
});

const SET_DELETE_POTENTIAL_ADMISSION_FAILURE = (state: PotentialAdmissionState) => ({
  ...state,
  potentialAdmissionDelete: {
    ...state.potentialAdmissionDelete,
    status: ACTION_STATUSES.FAILED
  }
});

const RESET_DELETE_POTENTIAL_ADMISSION_STATE = (state: PotentialAdmissionState) => ({
  ...state,
  potentialAdmissionDelete: initialState().potentialAdmissionDelete
});

const reducer = (state: PotentialAdmissionState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case POTENTIAL_ADMISSION_ACTIONS.ATTEMPT_TO_FETCH_POTENTIAL_ADMISSION:
      return ATTEMPT_TO_FETCH_POTENTIAL_ADMISSION(state);
    case POTENTIAL_ADMISSION_ACTIONS.SET_FETCH_POTENTIAL_ADMISSION_SUCCEED:
      return SET_FETCH_POTENTIAL_ADMISSION_SUCCEED(state, action);
    case POTENTIAL_ADMISSION_ACTIONS.SET_FETCH_POTENTIAL_ADMISSION_FAILURE:
      return SET_FETCH_POTENTIAL_ADMISSION_FAILURE(state);
    case POTENTIAL_ADMISSION_ACTIONS.RESET_FETCH_POTENTIAL_ADMISSION_STATE:
      return RESET_FETCH_POTENTIAL_ADMISSION_STATE(state);

    case POTENTIAL_ADMISSION_ACTIONS.ATTEMPT_TO_CREATE_POTENTIAL_ADMISSION:
      return ATTEMPT_TO_CREATE_POTENTIAL_ADMISSION(state);
    case POTENTIAL_ADMISSION_ACTIONS.SET_CREATE_POTENTIAL_ADMISSION_SUCCEED:
      return SET_CREATE_POTENTIAL_ADMISSION_SUCCEED(state, action);
    case POTENTIAL_ADMISSION_ACTIONS.SET_CREATE_POTENTIAL_ADMISSION_FAILURE:
      return SET_CREATE_POTENTIAL_ADMISSION_FAILURE(state);
    case POTENTIAL_ADMISSION_ACTIONS.RESET_CREATE_POTENTIAL_ADMISSION_STATE:
      return RESET_CREATE_POTENTIAL_ADMISSION_STATE(state);

    case POTENTIAL_ADMISSION_ACTIONS.ATTEMPT_TO_UPDATE_POTENTIAL_ADMISSION:
      return ATTEMPT_TO_UPDATE_POTENTIAL_ADMISSION(state);
    case POTENTIAL_ADMISSION_ACTIONS.SET_UPDATE_POTENTIAL_ADMISSION_SUCCEED:
      return SET_UPDATE_POTENTIAL_ADMISSION_SUCCEED(state, action);
    case POTENTIAL_ADMISSION_ACTIONS.SET_UPDATE_POTENTIAL_ADMISSION_FAILURE:
      return SET_UPDATE_POTENTIAL_ADMISSION_FAILURE(state);
    case POTENTIAL_ADMISSION_ACTIONS.RESET_UPDATE_POTENTIAL_ADMISSION_STATE:
      return RESET_UPDATE_POTENTIAL_ADMISSION_STATE(state);

    case POTENTIAL_ADMISSION_ACTIONS.ATTEMPT_TO_DELETE_POTENTIAL_ADMISSION:
      return ATTEMPT_TO_DELETE_POTENTIAL_ADMISSION(state);
    case POTENTIAL_ADMISSION_ACTIONS.SET_DELETE_POTENTIAL_ADMISSION_SUCCEED:
      return SET_DELETE_POTENTIAL_ADMISSION_SUCCEED(state, action);
    case POTENTIAL_ADMISSION_ACTIONS.SET_DELETE_POTENTIAL_ADMISSION_FAILURE:
      return SET_DELETE_POTENTIAL_ADMISSION_FAILURE(state);
    case POTENTIAL_ADMISSION_ACTIONS.RESET_DELETE_POTENTIAL_ADMISSION_STATE:
      return RESET_DELETE_POTENTIAL_ADMISSION_STATE(state);
    default:
      return state;
  }
};

export default reducer;
