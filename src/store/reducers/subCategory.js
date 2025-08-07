import type { BaseAction } from "../types/Action";
import type { SubCategoryState } from "../types";
import { SUBCATEGORY_ACTIONS } from "../actions/subCategoryAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): SubCategoryState => ({
  subCategoryList: {
    data: {},
    status: null,
    error: null,
  },
  subCategoryUpdate: {
    data: {},
    status: null,
    error: null,
  },
  subCategoryCreate: {
    data: {},
    status: null,
    error: null,
  },
  subCategoryDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_SUBCATEGORY = (state: SubCategoryState) => ({
  ...state,
  subCategoryList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_SUBCATEGORY_SUCCEED = (
  state: SubCategoryState,
  action: BaseAction
) => ({
  ...state,
  subCategoryList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_SUBCATEGORY_FAILURE = (state: SubCategoryState) => ({
  ...state,
  subCategoryList: {
    ...state.subCategoryList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_SUBCATEGORY_STATE = (state: SubCategoryState) => ({
  ...state,
  subCategoryList: initialState().subCategoryList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_SUBCATEGORY = (state: SubCategoryState) => ({
  ...state,
  subCategoryCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_SUBCATEGORY_SUCCEED = (
  state: SubCategoryState,
  action: BaseAction
) => ({
  ...state,
  subCategoryCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_SUBCATEGORY_FAILURE = (state: SubCategoryState) => ({
  ...state,
  subCategoryCreate: {
    ...state.subCategoryCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_SUBCATEGORY_STATE = (state: SubCategoryState) => ({
  ...state,
  subCategoryCreate: initialState().subCategoryCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_SUBCATEGORY = (state: SubCategoryState) => ({
  ...state,
  subCategoryUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_SUBCATEGORY_SUCCEED = (
  state: SubCategoryState,
  action: BaseAction
) => ({
  ...state,
  subCategoryUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_SUBCATEGORY_FAILURE = (state: SubCategoryState) => ({
  ...state,
  subCategoryUpdate: {
    ...state.subCategoryUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_SUBCATEGORY_STATE = (state: SubCategoryState) => ({
  ...state,
  subCategoryUpdate: initialState().subCategoryUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_SUBCATEGORY = (state: SubCategoryState) => ({
  ...state,
  subCategoryDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_SUBCATEGORY_SUCCEED = (
  state: SubCategoryState,
  action: BaseAction
) => ({
  ...state,
  subCategoryDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_SUBCATEGORY_FAILURE = (state: SubCategoryState) => ({
  ...state,
  subCategoryDelete: {
    ...state.subCategoryDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_SUBCATEGORY_STATE = (state: SubCategoryState) => ({
  ...state,
  subCategoryDelete: initialState().subCategoryDelete,
});

const reducer = (
  state: SubCategoryState = initialState(),
  action: BaseAction
) => {
  switch (action.type) {
    case SUBCATEGORY_ACTIONS.ATTEMPT_TO_FETCH_SUBCATEGORY:
      return ATTEMPT_TO_FETCH_SUBCATEGORY(state);
    case SUBCATEGORY_ACTIONS.SET_FETCH_SUBCATEGORY_SUCCEED:
      return SET_FETCH_SUBCATEGORY_SUCCEED(state, action);
    case SUBCATEGORY_ACTIONS.SET_FETCH_SUBCATEGORY_FAILURE:
      return SET_FETCH_SUBCATEGORY_FAILURE(state);
    case SUBCATEGORY_ACTIONS.RESET_FETCH_SUBCATEGORY_STATE:
      return RESET_FETCH_SUBCATEGORY_STATE(state);

    case SUBCATEGORY_ACTIONS.ATTEMPT_TO_CREATE_SUBCATEGORY:
      return ATTEMPT_TO_CREATE_SUBCATEGORY(state);
    case SUBCATEGORY_ACTIONS.SET_CREATE_SUBCATEGORY_SUCCEED:
      return SET_CREATE_SUBCATEGORY_SUCCEED(state, action);
    case SUBCATEGORY_ACTIONS.SET_CREATE_SUBCATEGORY_FAILURE:
      return SET_CREATE_SUBCATEGORY_FAILURE(state);
    case SUBCATEGORY_ACTIONS.RESET_CREATE_SUBCATEGORY_STATE:
      return RESET_CREATE_SUBCATEGORY_STATE(state);

    case SUBCATEGORY_ACTIONS.ATTEMPT_TO_UPDATE_SUBCATEGORY:
      return ATTEMPT_TO_UPDATE_SUBCATEGORY(state);
    case SUBCATEGORY_ACTIONS.SET_UPDATE_SUBCATEGORY_SUCCEED:
      return SET_UPDATE_SUBCATEGORY_SUCCEED(state, action);
    case SUBCATEGORY_ACTIONS.SET_UPDATE_SUBCATEGORY_FAILURE:
      return SET_UPDATE_SUBCATEGORY_FAILURE(state);
    case SUBCATEGORY_ACTIONS.RESET_UPDATE_SUBCATEGORY_STATE:
      return RESET_UPDATE_SUBCATEGORY_STATE(state);

    case SUBCATEGORY_ACTIONS.ATTEMPT_TO_DELETE_SUBCATEGORY:
      return ATTEMPT_TO_DELETE_SUBCATEGORY(state);
    case SUBCATEGORY_ACTIONS.SET_DELETE_SUBCATEGORY_SUCCEED:
      return SET_DELETE_SUBCATEGORY_SUCCEED(state, action);
    case SUBCATEGORY_ACTIONS.SET_DELETE_SUBCATEGORY_FAILURE:
      return SET_DELETE_SUBCATEGORY_FAILURE(state);
    case SUBCATEGORY_ACTIONS.RESET_DELETE_SUBCATEGORY_STATE:
      return RESET_DELETE_SUBCATEGORY_STATE(state);
    default:
      return state;
  }
};

export default reducer;
