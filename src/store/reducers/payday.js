import type { BaseAction } from "../types/Action";
import type { PaydayState } from "../types";
import { PAYDAY_ACTIONS } from "../actions/paydayAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): PaydayState => ({
  paydayList: {
    data: {},
    status: null,
    error: null,
  },
  paydayUpdate: {
    data: {},
    status: null,
    error: null,
  },
  paydayCreate: {
    data: {},
    status: null,
    error: null,
  },
  paydayDelete: {
    data: {},
    status: null,
    error: null,
  },
});

/*
 */
const ATTEMPT_TO_FETCH_PAYDAY = (state: PaydayState) => ({
  ...state,
  paydayList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_PAYDAY_SUCCEED = (state: PaydayState, action: BaseAction) => ({
  ...state,
  paydayList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_PAYDAY_FAILURE = (state: PaydayState) => ({
  ...state,
  paydayList: {
    ...state.paydayList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_PAYDAY_STATE = (state: PaydayState) => ({
  ...state,
  paydayList: initialState().paydayList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_PAYDAY = (state: PaydayState) => ({
  ...state,
  paydayCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_PAYDAY_SUCCEED = (state: PaydayState, action: BaseAction) => ({
  ...state,
  paydayCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_PAYDAY_FAILURE = (state: PaydayState) => ({
  ...state,
  paydayCreate: {
    ...state.paydayCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_PAYDAY_STATE = (state: PaydayState) => ({
  ...state,
  paydayCreate: initialState().paydayCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_PAYDAY = (state: PaydayState) => ({
  ...state,
  paydayUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_PAYDAY_SUCCEED = (state: PaydayState, action: BaseAction) => ({
  ...state,
  paydayUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_PAYDAY_FAILURE = (state: PaydayState) => ({
  ...state,
  paydayUpdate: {
    ...state.paydayUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_PAYDAY_STATE = (state: PaydayState) => ({
  ...state,
  paydayUpdate: initialState().paydayUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_PAYDAY = (state: PaydayState) => ({
  ...state,
  paydayDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_PAYDAY_SUCCEED = (state: PaydayState, action: BaseAction) => ({
  ...state,
  paydayDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_PAYDAY_FAILURE = (state: PaydayState) => ({
  ...state,
  paydayDelete: {
    ...state.paydayDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_PAYDAY_STATE = (state: PaydayState) => ({
  ...state,
  paydayDelete: initialState().paydayDelete,
});

const reducer = (state: PaydayState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case PAYDAY_ACTIONS.ATTEMPT_TO_FETCH_PAYDAY:
      return ATTEMPT_TO_FETCH_PAYDAY(state);
    case PAYDAY_ACTIONS.SET_FETCH_PAYDAY_SUCCEED:
      return SET_FETCH_PAYDAY_SUCCEED(state, action);
    case PAYDAY_ACTIONS.SET_FETCH_PAYDAY_FAILURE:
      return SET_FETCH_PAYDAY_FAILURE(state);
    case PAYDAY_ACTIONS.RESET_FETCH_PAYDAY_STATE:
      return RESET_FETCH_PAYDAY_STATE(state);

    case PAYDAY_ACTIONS.ATTEMPT_TO_CREATE_PAYDAY:
      return ATTEMPT_TO_CREATE_PAYDAY(state);
    case PAYDAY_ACTIONS.SET_CREATE_PAYDAY_SUCCEED:
      return SET_CREATE_PAYDAY_SUCCEED(state, action);
    case PAYDAY_ACTIONS.SET_CREATE_PAYDAY_FAILURE:
      return SET_CREATE_PAYDAY_FAILURE(state);
    case PAYDAY_ACTIONS.RESET_CREATE_PAYDAY_STATE:
      return RESET_CREATE_PAYDAY_STATE(state);

    case PAYDAY_ACTIONS.ATTEMPT_TO_UPDATE_PAYDAY:
      return ATTEMPT_TO_UPDATE_PAYDAY(state);
    case PAYDAY_ACTIONS.SET_UPDATE_PAYDAY_SUCCEED:
      return SET_UPDATE_PAYDAY_SUCCEED(state, action);
    case PAYDAY_ACTIONS.SET_UPDATE_PAYDAY_FAILURE:
      return SET_UPDATE_PAYDAY_FAILURE(state);
    case PAYDAY_ACTIONS.RESET_UPDATE_PAYDAY_STATE:
      return RESET_UPDATE_PAYDAY_STATE(state);

    case PAYDAY_ACTIONS.ATTEMPT_TO_DELETE_PAYDAY:
      return ATTEMPT_TO_DELETE_PAYDAY(state);
    case PAYDAY_ACTIONS.SET_DELETE_PAYDAY_SUCCEED:
      return SET_DELETE_PAYDAY_SUCCEED(state, action);
    case PAYDAY_ACTIONS.SET_DELETE_PAYDAY_FAILURE:
      return SET_DELETE_PAYDAY_FAILURE(state);
    case PAYDAY_ACTIONS.RESET_DELETE_PAYDAY_STATE:
      return RESET_DELETE_PAYDAY_STATE(state);
    default:
      return state;
  }
};

export default reducer;
