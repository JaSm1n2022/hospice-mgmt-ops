import { ACTION_STATUSES } from "utils/constants";
import {
  FETCH_SCHEDULER_REQUESTING,
  FETCH_SCHEDULER_SUCCESS,
  FETCH_SCHEDULER_ERROR,
  RESET_FETCH_SCHEDULER_STATE,
  CREATE_SCHEDULER_REQUESTING,
  CREATE_SCHEDULER_SUCCESS,
  CREATE_SCHEDULER_ERROR,
  RESET_CREATE_SCHEDULER_STATE,
  UPDATE_SCHEDULER_REQUESTING,
  UPDATE_SCHEDULER_SUCCESS,
  UPDATE_SCHEDULER_ERROR,
  RESET_UPDATE_SCHEDULER_STATE,
  DELETE_SCHEDULER_REQUESTING,
  DELETE_SCHEDULER_SUCCESS,
  DELETE_SCHEDULER_ERROR,
  RESET_DELETE_SCHEDULER_STATE,
} from "../actions/schedulerAction";

const initialState = {
  list: {
    status: ACTION_STATUSES.IDLE,
    data: [],
    error: null,
  },
  create: {
    status: ACTION_STATUSES.IDLE,
    data: null,
    error: null,
  },
  update: {
    status: ACTION_STATUSES.IDLE,
    data: null,
    error: null,
  },
  delete: {
    status: ACTION_STATUSES.IDLE,
    data: null,
    error: null,
  },
};

const schedulerReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Scheduler
    case FETCH_SCHEDULER_REQUESTING:
      return {
        ...state,
        list: {
          status: ACTION_STATUSES.PENDING,
          data: [],
          error: null,
        },
      };
    case FETCH_SCHEDULER_SUCCESS:
      return {
        ...state,
        list: {
          status: ACTION_STATUSES.SUCCEED,
          data: action.data,
          error: null,
        },
      };
    case FETCH_SCHEDULER_ERROR:
      return {
        ...state,
        list: {
          status: ACTION_STATUSES.FAILED,
          data: [],
          error: action.error,
        },
      };
    case RESET_FETCH_SCHEDULER_STATE:
      return {
        ...state,
        list: {
          status: ACTION_STATUSES.IDLE,
          data: [],
          error: null,
        },
      };

    // Create Scheduler
    case CREATE_SCHEDULER_REQUESTING:
      return {
        ...state,
        create: {
          status: ACTION_STATUSES.PENDING,
          data: null,
          error: null,
        },
      };
    case CREATE_SCHEDULER_SUCCESS:
      return {
        ...state,
        create: {
          status: ACTION_STATUSES.SUCCEED,
          data: action.data,
          error: null,
        },
      };
    case CREATE_SCHEDULER_ERROR:
      return {
        ...state,
        create: {
          status: ACTION_STATUSES.FAILED,
          data: null,
          error: action.error,
        },
      };
    case RESET_CREATE_SCHEDULER_STATE:
      return {
        ...state,
        create: {
          status: ACTION_STATUSES.IDLE,
          data: null,
          error: null,
        },
      };

    // Update Scheduler
    case UPDATE_SCHEDULER_REQUESTING:
      return {
        ...state,
        update: {
          status: ACTION_STATUSES.PENDING,
          data: null,
          error: null,
        },
      };
    case UPDATE_SCHEDULER_SUCCESS:
      return {
        ...state,
        update: {
          status: ACTION_STATUSES.SUCCEED,
          data: action.data,
          error: null,
        },
      };
    case UPDATE_SCHEDULER_ERROR:
      return {
        ...state,
        update: {
          status: ACTION_STATUSES.FAILED,
          data: null,
          error: action.error,
        },
      };
    case RESET_UPDATE_SCHEDULER_STATE:
      return {
        ...state,
        update: {
          status: ACTION_STATUSES.IDLE,
          data: null,
          error: null,
        },
      };

    // Delete Scheduler
    case DELETE_SCHEDULER_REQUESTING:
      return {
        ...state,
        delete: {
          status: ACTION_STATUSES.PENDING,
          data: null,
          error: null,
        },
      };
    case DELETE_SCHEDULER_SUCCESS:
      return {
        ...state,
        delete: {
          status: ACTION_STATUSES.SUCCEED,
          data: action.data,
          error: null,
        },
      };
    case DELETE_SCHEDULER_ERROR:
      return {
        ...state,
        delete: {
          status: ACTION_STATUSES.FAILED,
          data: null,
          error: action.error,
        },
      };
    case RESET_DELETE_SCHEDULER_STATE:
      return {
        ...state,
        delete: {
          status: ACTION_STATUSES.IDLE,
          data: null,
          error: null,
        },
      };

    default:
      return state;
  }
};

export default schedulerReducer;
