import type { BaseAction } from '../types/Action';
import type { QAState } from '../types';
import { QA_ACTIONS } from '../actions/qaAction';
import { ACTION_STATUSES } from '../../utils/constants';

const initialState = (): QAState => ({

  qaList: {
    data: {},
    status: null,
    error: null
  },
  qaUpdate: {
    data: {},
    status: null,
    error: null

  },
  qaCreate: {
    data: {},
    status: null,
    error: null

  },
  qaDelete: {
    data: {},
    status: null,
    error: null

  }
});


/*
 */
const ATTEMPT_TO_FETCH_QA = (state: QAState) => ({
  ...state,
  qaList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null
  }
});

const SET_FETCH_QA_SUCCEED = (state: QAState, action: BaseAction) => ({
  ...state,
  qaList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null
  }
});

const SET_FETCH_QA_FAILURE = (state: QAState) => ({
  ...state,
  qaList: {
    ...state.qaList,
    status: ACTION_STATUSES.FAILED
  }
});
const RESET_FETCH_QA_STATE = (state: QAState) => ({
  ...state,
  qaList: initialState().qaList
});


/*
Create
 */
const ATTEMPT_TO_CREATE_QA = (state: QAState) => ({
  ...state,
  qaCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null
  }
});

const SET_CREATE_QA_SUCCEED = (state: QAState, action: BaseAction) => ({
  ...state,
  qaCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null
  }
});

const SET_CREATE_QA_FAILURE = (state: QAState) => ({
  ...state,
  qaCreate: {
    ...state.qaCreate,
    status: ACTION_STATUSES.FAILED
  }
});
const RESET_CREATE_QA_STATE = (state: QAState) => ({
  ...state,
  qaCreate: initialState().qaCreate
});


/*
Update
 */
const ATTEMPT_TO_UPDATE_QA = (state: QAState) => ({
  ...state,
  qaUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null
  }
});

const SET_UPDATE_QA_SUCCEED = (state: QAState, action: BaseAction) => ({
  ...state,
  qaUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null
  }
});

const SET_UPDATE_QA_FAILURE = (state: QAState) => ({
  ...state,
  qaUpdate: {
    ...state.qaUpdate,
    status: ACTION_STATUSES.FAILED
  }
});
const RESET_UPDATE_QA_STATE = (state: QAState) => ({
  ...state,
  qaUpdate: initialState().qaUpdate
});

/*
Delete
 */
const ATTEMPT_TO_DELETE_QA = (state: QAState) => ({
  ...state,
  qaDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null
  }
});

const SET_DELETE_QA_SUCCEED = (state: QAState, action: BaseAction) => ({
  ...state,
  qaDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null
  }
});

const SET_DELETE_QA_FAILURE = (state: QAState) => ({
  ...state,
  qaDelete: {
    ...state.qaDelete,
    status: ACTION_STATUSES.FAILED
  }
});
const RESET_DELETE_QA_STATE = (state: QAState) => ({
  ...state,
  qaDelete: initialState().qaDelete
});


const reducer = (state: QAState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case QA_ACTIONS.ATTEMPT_TO_FETCH_QA:
      return ATTEMPT_TO_FETCH_QA(state);
    case QA_ACTIONS.SET_FETCH_QA_SUCCEED:
      return SET_FETCH_QA_SUCCEED(state, action);
    case QA_ACTIONS.SET_FETCH_QA_FAILURE:
      return SET_FETCH_QA_FAILURE(state);
    case QA_ACTIONS.RESET_FETCH_QA_STATE:
      return RESET_FETCH_QA_STATE(state);

    case QA_ACTIONS.ATTEMPT_TO_CREATE_QA:
      return ATTEMPT_TO_CREATE_QA(state);
    case QA_ACTIONS.SET_CREATE_QA_SUCCEED:
      return SET_CREATE_QA_SUCCEED(state, action);
    case QA_ACTIONS.SET_CREATE_QA_FAILURE:
      return SET_CREATE_QA_FAILURE(state);
    case QA_ACTIONS.RESET_CREATE_QA_STATE:
      return RESET_CREATE_QA_STATE(state);

    case QA_ACTIONS.ATTEMPT_TO_UPDATE_QA:
      return ATTEMPT_TO_UPDATE_QA(state);
    case QA_ACTIONS.SET_UPDATE_QA_SUCCEED:
      return SET_UPDATE_QA_SUCCEED(state, action);
    case QA_ACTIONS.SET_UPDATE_QA_FAILURE:
      return SET_UPDATE_QA_FAILURE(state);
    case QA_ACTIONS.RESET_UPDATE_QA_STATE:
      return RESET_UPDATE_QA_STATE(state);

    case QA_ACTIONS.ATTEMPT_TO_DELETE_QA:
      return ATTEMPT_TO_DELETE_QA(state);
    case QA_ACTIONS.SET_DELETE_QA_SUCCEED:
      return SET_DELETE_QA_SUCCEED(state, action);
    case QA_ACTIONS.SET_DELETE_QA_FAILURE:
      return SET_DELETE_QA_FAILURE(state);
    case QA_ACTIONS.RESET_DELETE_QA_STATE:
      return RESET_DELETE_QA_STATE(state);
    default:
      return state;
  }
};

export default reducer;
