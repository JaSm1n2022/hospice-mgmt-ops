import type { BaseAction } from "../types/Action";
import type { ProfileState } from "../types";
import { PROFILE_ACTIONS } from "../actions/profileAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): ProfileState => ({
  profileList: {
    data: {},
    status: null,
    error: null,
  },
  profileUpdate: {
    data: {},
    status: null,
    error: null,
  },
  profileCreate: {
    data: {},
    status: null,
    error: null,
  },
  profileDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_PROFILE = (state: ProfileState) => ({
  ...state,
  profileList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_PROFILE_SUCCEED = (
  state: ProfileState,
  action: BaseAction
) => ({
  ...state,
  profileList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_PROFILE_FAILURE = (state: ProfileState) => ({
  ...state,
  profileList: {
    ...state.profileList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_PROFILE_STATE = (state: ProfileState) => ({
  ...state,
  profileList: initialState().profileList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_PROFILE = (state: ProfileState) => ({
  ...state,
  profileCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_PROFILE_SUCCEED = (
  state: ProfileState,
  action: BaseAction
) => ({
  ...state,
  profileCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_PROFILE_FAILURE = (state: ProfileState) => ({
  ...state,
  profileCreate: {
    ...state.profileCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_PROFILE_STATE = (state: ProfileState) => ({
  ...state,
  profileCreate: initialState().profileCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_PROFILE = (state: ProfileState) => ({
  ...state,
  profileUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_PROFILE_SUCCEED = (
  state: ProfileState,
  action: BaseAction
) => ({
  ...state,
  profileUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_PROFILE_FAILURE = (state: ProfileState) => ({
  ...state,
  profileUpdate: {
    ...state.profileUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_PROFILE_STATE = (state: ProfileState) => ({
  ...state,
  profileUpdate: initialState().profileUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_PROFILE = (state: ProfileState) => ({
  ...state,
  profileDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_PROFILE_SUCCEED = (
  state: ProfileState,
  action: BaseAction
) => ({
  ...state,
  profileDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_PROFILE_FAILURE = (state: ProfileState) => ({
  ...state,
  profileDelete: {
    ...state.profileDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_PROFILE_STATE = (state: ProfileState) => ({
  ...state,
  profileDelete: initialState().profileDelete,
});

const reducer = (state: ProfileState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case PROFILE_ACTIONS.ATTEMPT_TO_FETCH_PROFILE:
      return ATTEMPT_TO_FETCH_PROFILE(state);
    case PROFILE_ACTIONS.SET_FETCH_PROFILE_SUCCEED:
      return SET_FETCH_PROFILE_SUCCEED(state, action);
    case PROFILE_ACTIONS.SET_FETCH_PROFILE_FAILURE:
      return SET_FETCH_PROFILE_FAILURE(state);
    case PROFILE_ACTIONS.RESET_FETCH_PROFILE_STATE:
      return RESET_FETCH_PROFILE_STATE(state);

    case PROFILE_ACTIONS.ATTEMPT_TO_CREATE_PROFILE:
      return ATTEMPT_TO_CREATE_PROFILE(state);
    case PROFILE_ACTIONS.SET_CREATE_PROFILE_SUCCEED:
      return SET_CREATE_PROFILE_SUCCEED(state, action);
    case PROFILE_ACTIONS.SET_CREATE_PROFILE_FAILURE:
      return SET_CREATE_PROFILE_FAILURE(state);
    case PROFILE_ACTIONS.RESET_CREATE_PROFILE_STATE:
      return RESET_CREATE_PROFILE_STATE(state);

    case PROFILE_ACTIONS.ATTEMPT_TO_UPDATE_PROFILE:
      return ATTEMPT_TO_UPDATE_PROFILE(state);
    case PROFILE_ACTIONS.SET_UPDATE_PROFILE_SUCCEED:
      return SET_UPDATE_PROFILE_SUCCEED(state, action);
    case PROFILE_ACTIONS.SET_UPDATE_PROFILE_FAILURE:
      return SET_UPDATE_PROFILE_FAILURE(state);
    case PROFILE_ACTIONS.RESET_UPDATE_PROFILE_STATE:
      return RESET_UPDATE_PROFILE_STATE(state);

    case PROFILE_ACTIONS.ATTEMPT_TO_DELETE_PROFILE:
      return ATTEMPT_TO_DELETE_PROFILE(state);
    case PROFILE_ACTIONS.SET_DELETE_PROFILE_SUCCEED:
      return SET_DELETE_PROFILE_SUCCEED(state, action);
    case PROFILE_ACTIONS.SET_DELETE_PROFILE_FAILURE:
      return SET_DELETE_PROFILE_FAILURE(state);
    case PROFILE_ACTIONS.RESET_DELETE_PROFILE_STATE:
      return RESET_DELETE_PROFILE_STATE(state);
    default:
      return state;
  }
};

export default reducer;
