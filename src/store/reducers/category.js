import type { BaseAction } from "../types/Action";
import type { CategoryState } from "../types";
import { CATEGORY_ACTIONS } from "../actions/categoryAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): CategoryState => ({
  categoryList: {
    data: {},
    status: null,
    error: null,
  },
  categoryUpdate: {
    data: {},
    status: null,
    error: null,
  },
  categoryCreate: {
    data: {},
    status: null,
    error: null,
  },
  categoryDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_CATEGORY = (state: CategoryState) => ({
  ...state,
  categoryList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_CATEGORY_SUCCEED = (
  state: CategoryState,
  action: BaseAction
) => ({
  ...state,
  categoryList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_CATEGORY_FAILURE = (state: CategoryState) => ({
  ...state,
  categoryList: {
    ...state.categoryList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_CATEGORY_STATE = (state: CategoryState) => ({
  ...state,
  categoryList: initialState().categoryList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_CATEGORY = (state: CategoryState) => ({
  ...state,
  categoryCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_CATEGORY_SUCCEED = (
  state: CategoryState,
  action: BaseAction
) => ({
  ...state,
  categoryCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_CATEGORY_FAILURE = (state: CategoryState) => ({
  ...state,
  categoryCreate: {
    ...state.categoryCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_CATEGORY_STATE = (state: CategoryState) => ({
  ...state,
  categoryCreate: initialState().categoryCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_CATEGORY = (state: CategoryState) => ({
  ...state,
  categoryUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_CATEGORY_SUCCEED = (
  state: CategoryState,
  action: BaseAction
) => ({
  ...state,
  categoryUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_CATEGORY_FAILURE = (state: CategoryState) => ({
  ...state,
  categoryUpdate: {
    ...state.categoryUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_CATEGORY_STATE = (state: CategoryState) => ({
  ...state,
  categoryUpdate: initialState().categoryUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_CATEGORY = (state: CategoryState) => ({
  ...state,
  categoryDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_CATEGORY_SUCCEED = (
  state: CategoryState,
  action: BaseAction
) => ({
  ...state,
  categoryDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_CATEGORY_FAILURE = (state: CategoryState) => ({
  ...state,
  categoryDelete: {
    ...state.categoryDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_CATEGORY_STATE = (state: CategoryState) => ({
  ...state,
  categoryDelete: initialState().categoryDelete,
});

const reducer = (state: CategoryState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case CATEGORY_ACTIONS.ATTEMPT_TO_FETCH_CATEGORY:
      return ATTEMPT_TO_FETCH_CATEGORY(state);
    case CATEGORY_ACTIONS.SET_FETCH_CATEGORY_SUCCEED:
      return SET_FETCH_CATEGORY_SUCCEED(state, action);
    case CATEGORY_ACTIONS.SET_FETCH_CATEGORY_FAILURE:
      return SET_FETCH_CATEGORY_FAILURE(state);
    case CATEGORY_ACTIONS.RESET_FETCH_CATEGORY_STATE:
      return RESET_FETCH_CATEGORY_STATE(state);

    case CATEGORY_ACTIONS.ATTEMPT_TO_CREATE_CATEGORY:
      return ATTEMPT_TO_CREATE_CATEGORY(state);
    case CATEGORY_ACTIONS.SET_CREATE_CATEGORY_SUCCEED:
      return SET_CREATE_CATEGORY_SUCCEED(state, action);
    case CATEGORY_ACTIONS.SET_CREATE_CATEGORY_FAILURE:
      return SET_CREATE_CATEGORY_FAILURE(state);
    case CATEGORY_ACTIONS.RESET_CREATE_CATEGORY_STATE:
      return RESET_CREATE_CATEGORY_STATE(state);

    case CATEGORY_ACTIONS.ATTEMPT_TO_UPDATE_CATEGORY:
      return ATTEMPT_TO_UPDATE_CATEGORY(state);
    case CATEGORY_ACTIONS.SET_UPDATE_CATEGORY_SUCCEED:
      return SET_UPDATE_CATEGORY_SUCCEED(state, action);
    case CATEGORY_ACTIONS.SET_UPDATE_CATEGORY_FAILURE:
      return SET_UPDATE_CATEGORY_FAILURE(state);
    case CATEGORY_ACTIONS.RESET_UPDATE_CATEGORY_STATE:
      return RESET_UPDATE_CATEGORY_STATE(state);

    case CATEGORY_ACTIONS.ATTEMPT_TO_DELETE_CATEGORY:
      return ATTEMPT_TO_DELETE_CATEGORY(state);
    case CATEGORY_ACTIONS.SET_DELETE_CATEGORY_SUCCEED:
      return SET_DELETE_CATEGORY_SUCCEED(state, action);
    case CATEGORY_ACTIONS.SET_DELETE_CATEGORY_FAILURE:
      return SET_DELETE_CATEGORY_FAILURE(state);
    case CATEGORY_ACTIONS.RESET_DELETE_CATEGORY_STATE:
      return RESET_DELETE_CATEGORY_STATE(state);
    default:
      return state;
  }
};

export default reducer;
