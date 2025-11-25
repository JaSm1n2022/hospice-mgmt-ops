import { INCOME_ACTIONS } from "../actions/incomeAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = () => ({
  incomeList: {
    data: {},
    status: null,
    error: null,
  },
  incomeUpdate: {
    data: {},
    status: null,
    error: null,
  },
  incomeCreate: {
    data: {},
    status: null,
    error: null,
  },
  incomeDelete: {
    data: {},
    status: null,
    error: null,
  },
  fileUpload: {
    data: {},
    status: null,
    error: null,
  },
  filesList: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_INCOME = (state) => ({
  ...state,
  incomeList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_INCOME_SUCCEED = (state, action) => ({
  ...state,
  incomeList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_INCOME_FAILURE = (state) => ({
  ...state,
  incomeList: {
    ...state.incomeList,
    status: ACTION_STATUSES.FAILED,
  },
});

const RESET_FETCH_INCOME_STATE = (state) => ({
  ...state,
  incomeList: initialState().incomeList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_INCOME = (state) => ({
  ...state,
  incomeCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_INCOME_SUCCEED = (state, action) => ({
  ...state,
  incomeCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_INCOME_FAILURE = (state) => ({
  ...state,
  incomeCreate: {
    ...state.incomeCreate,
    status: ACTION_STATUSES.FAILED,
  },
});

const RESET_CREATE_INCOME_STATE = (state) => ({
  ...state,
  incomeCreate: initialState().incomeCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_INCOME = (state) => ({
  ...state,
  incomeUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_INCOME_SUCCEED = (state, action) => ({
  ...state,
  incomeUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_INCOME_FAILURE = (state) => ({
  ...state,
  incomeUpdate: {
    ...state.incomeUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});

const RESET_UPDATE_INCOME_STATE = (state) => ({
  ...state,
  incomeUpdate: initialState().incomeUpdate,
});

/*
Delete
 */
const ATTEMPT_TO_DELETE_INCOME = (state) => ({
  ...state,
  incomeDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_INCOME_SUCCEED = (state, action) => ({
  ...state,
  incomeDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_INCOME_FAILURE = (state) => ({
  ...state,
  incomeDelete: {
    ...state.incomeDelete,
    status: ACTION_STATUSES.FAILED,
  },
});

const RESET_DELETE_INCOME_STATE = (state) => ({
  ...state,
  incomeDelete: initialState().incomeDelete,
});

/*
Upload File
 */
const ATTEMPT_TO_UPLOAD_FILE = (state) => ({
  ...state,
  fileUpload: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPLOAD_FILE_SUCCEED = (state, action) => ({
  ...state,
  fileUpload: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPLOAD_FILE_FAILURE = (state) => ({
  ...state,
  fileUpload: {
    ...state.fileUpload,
    status: ACTION_STATUSES.FAILED,
  },
});

const RESET_UPLOAD_FILE_STATE = (state) => ({
  ...state,
  fileUpload: initialState().fileUpload,
});

/*
Fetch Files
 */
const ATTEMPT_TO_FETCH_FILES = (state) => ({
  ...state,
  filesList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_FILES_SUCCEED = (state, action) => ({
  ...state,
  filesList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_FILES_FAILURE = (state) => ({
  ...state,
  filesList: {
    ...state.filesList,
    status: ACTION_STATUSES.FAILED,
  },
});

const RESET_FETCH_FILES_STATE = (state) => ({
  ...state,
  filesList: initialState().filesList,
});

const reducer = (state = initialState(), action) => {
  switch (action.type) {
    case INCOME_ACTIONS.ATTEMPT_TO_FETCH_INCOME:
      return ATTEMPT_TO_FETCH_INCOME(state);
    case INCOME_ACTIONS.SET_FETCH_INCOME_SUCCEED:
      return SET_FETCH_INCOME_SUCCEED(state, action);
    case INCOME_ACTIONS.SET_FETCH_INCOME_FAILURE:
      return SET_FETCH_INCOME_FAILURE(state);
    case INCOME_ACTIONS.RESET_FETCH_INCOME_STATE:
      return RESET_FETCH_INCOME_STATE(state);

    case INCOME_ACTIONS.ATTEMPT_TO_CREATE_INCOME:
      return ATTEMPT_TO_CREATE_INCOME(state);
    case INCOME_ACTIONS.SET_CREATE_INCOME_SUCCEED:
      return SET_CREATE_INCOME_SUCCEED(state, action);
    case INCOME_ACTIONS.SET_CREATE_INCOME_FAILURE:
      return SET_CREATE_INCOME_FAILURE(state);
    case INCOME_ACTIONS.RESET_CREATE_INCOME_STATE:
      return RESET_CREATE_INCOME_STATE(state);

    case INCOME_ACTIONS.ATTEMPT_TO_UPDATE_INCOME:
      return ATTEMPT_TO_UPDATE_INCOME(state);
    case INCOME_ACTIONS.SET_UPDATE_INCOME_SUCCEED:
      return SET_UPDATE_INCOME_SUCCEED(state, action);
    case INCOME_ACTIONS.SET_UPDATE_INCOME_FAILURE:
      return SET_UPDATE_INCOME_FAILURE(state);
    case INCOME_ACTIONS.RESET_UPDATE_INCOME_STATE:
      return RESET_UPDATE_INCOME_STATE(state);

    case INCOME_ACTIONS.ATTEMPT_TO_DELETE_INCOME:
      return ATTEMPT_TO_DELETE_INCOME(state);
    case INCOME_ACTIONS.SET_DELETE_INCOME_SUCCEED:
      return SET_DELETE_INCOME_SUCCEED(state, action);
    case INCOME_ACTIONS.SET_DELETE_INCOME_FAILURE:
      return SET_DELETE_INCOME_FAILURE(state);
    case INCOME_ACTIONS.RESET_DELETE_INCOME_STATE:
      return RESET_DELETE_INCOME_STATE(state);

    case INCOME_ACTIONS.ATTEMPT_TO_UPLOAD_FILE:
      return ATTEMPT_TO_UPLOAD_FILE(state);
    case INCOME_ACTIONS.SET_UPLOAD_FILE_SUCCEED:
      return SET_UPLOAD_FILE_SUCCEED(state, action);
    case INCOME_ACTIONS.SET_UPLOAD_FILE_FAILURE:
      return SET_UPLOAD_FILE_FAILURE(state);
    case INCOME_ACTIONS.RESET_UPLOAD_FILE_STATE:
      return RESET_UPLOAD_FILE_STATE(state);

    case INCOME_ACTIONS.ATTEMPT_TO_FETCH_FILES:
      return ATTEMPT_TO_FETCH_FILES(state);
    case INCOME_ACTIONS.SET_FETCH_FILES_SUCCEED:
      return SET_FETCH_FILES_SUCCEED(state, action);
    case INCOME_ACTIONS.SET_FETCH_FILES_FAILURE:
      return SET_FETCH_FILES_FAILURE(state);
    case INCOME_ACTIONS.RESET_FETCH_FILES_STATE:
      return RESET_FETCH_FILES_STATE(state);
    default:
      return state;
  }
};

export default reducer;
