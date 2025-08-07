import type { BaseAction } from "../types/Action";
import type { CertificationState } from "../types";
import { CERTIFICATION_ACTIONS } from "../actions/certificationAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): CertificationState => ({
  certificationList: {
    data: {},
    status: null,
    error: null,
  },
  certificationUpdate: {
    data: {},
    status: null,
    error: null,
  },
  certificationCreate: {
    data: {},
    status: null,
    error: null,
  },
  certificationDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_CERTIFICATION = (state: CertificationState) => ({
  ...state,
  certificationList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_CERTIFICATION_SUCCEED = (
  state: CertificationState,
  action: BaseAction
) => ({
  ...state,
  certificationList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_CERTIFICATION_FAILURE = (state: CertificationState) => ({
  ...state,
  certificationList: {
    ...state.certificationList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_CERTIFICATION_STATE = (state: CertificationState) => ({
  ...state,
  certificationList: initialState().certificationList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_CERTIFICATION = (state: CertificationState) => ({
  ...state,
  certificationCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_CERTIFICATION_SUCCEED = (
  state: CertificationState,
  action: BaseAction
) => ({
  ...state,
  certificationCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_CERTIFICATION_FAILURE = (state: CertificationState) => ({
  ...state,
  certificationCreate: {
    ...state.certificationCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_CERTIFICATION_STATE = (state: CertificationState) => ({
  ...state,
  certificationCreate: initialState().certificationCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_CERTIFICATION = (state: CertificationState) => ({
  ...state,
  certificationUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_CERTIFICATION_SUCCEED = (
  state: CertificationState,
  action: BaseAction
) => ({
  ...state,
  certificationUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_CERTIFICATION_FAILURE = (state: CertificationState) => ({
  ...state,
  certificationUpdate: {
    ...state.certificationUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_CERTIFICATION_STATE = (state: CertificationState) => ({
  ...state,
  certificationUpdate: initialState().certificationUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_CERTIFICATION = (state: CertificationState) => ({
  ...state,
  certificationDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_CERTIFICATION_SUCCEED = (
  state: CertificationState,
  action: BaseAction
) => ({
  ...state,
  certificationDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_CERTIFICATION_FAILURE = (state: CertificationState) => ({
  ...state,
  certificationDelete: {
    ...state.certificationDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_CERTIFICATION_STATE = (state: CertificationState) => ({
  ...state,
  certificationDelete: initialState().certificationDelete,
});

const reducer = (
  state: CertificationState = initialState(),
  action: BaseAction
) => {
  switch (action.type) {
    case CERTIFICATION_ACTIONS.ATTEMPT_TO_FETCH_CERTIFICATION:
      return ATTEMPT_TO_FETCH_CERTIFICATION(state);
    case CERTIFICATION_ACTIONS.SET_FETCH_CERTIFICATION_SUCCEED:
      return SET_FETCH_CERTIFICATION_SUCCEED(state, action);
    case CERTIFICATION_ACTIONS.SET_FETCH_CERTIFICATION_FAILURE:
      return SET_FETCH_CERTIFICATION_FAILURE(state);
    case CERTIFICATION_ACTIONS.RESET_FETCH_CERTIFICATION_STATE:
      return RESET_FETCH_CERTIFICATION_STATE(state);

    case CERTIFICATION_ACTIONS.ATTEMPT_TO_CREATE_CERTIFICATION:
      return ATTEMPT_TO_CREATE_CERTIFICATION(state);
    case CERTIFICATION_ACTIONS.SET_CREATE_CERTIFICATION_SUCCEED:
      return SET_CREATE_CERTIFICATION_SUCCEED(state, action);
    case CERTIFICATION_ACTIONS.SET_CREATE_CERTIFICATION_FAILURE:
      return SET_CREATE_CERTIFICATION_FAILURE(state);
    case CERTIFICATION_ACTIONS.RESET_CREATE_CERTIFICATION_STATE:
      return RESET_CREATE_CERTIFICATION_STATE(state);

    case CERTIFICATION_ACTIONS.ATTEMPT_TO_UPDATE_CERTIFICATION:
      return ATTEMPT_TO_UPDATE_CERTIFICATION(state);
    case CERTIFICATION_ACTIONS.SET_UPDATE_CERTIFICATION_SUCCEED:
      return SET_UPDATE_CERTIFICATION_SUCCEED(state, action);
    case CERTIFICATION_ACTIONS.SET_UPDATE_CERTIFICATION_FAILURE:
      return SET_UPDATE_CERTIFICATION_FAILURE(state);
    case CERTIFICATION_ACTIONS.RESET_UPDATE_CERTIFICATION_STATE:
      return RESET_UPDATE_CERTIFICATION_STATE(state);

    case CERTIFICATION_ACTIONS.ATTEMPT_TO_DELETE_CERTIFICATION:
      return ATTEMPT_TO_DELETE_CERTIFICATION(state);
    case CERTIFICATION_ACTIONS.SET_DELETE_CERTIFICATION_SUCCEED:
      return SET_DELETE_CERTIFICATION_SUCCEED(state, action);
    case CERTIFICATION_ACTIONS.SET_DELETE_CERTIFICATION_FAILURE:
      return SET_DELETE_CERTIFICATION_FAILURE(state);
    case CERTIFICATION_ACTIONS.RESET_DELETE_CERTIFICATION_STATE:
      return RESET_DELETE_CERTIFICATION_STATE(state);
    default:
      return state;
  }
};

export default reducer;
