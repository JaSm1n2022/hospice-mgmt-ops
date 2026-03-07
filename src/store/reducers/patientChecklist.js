import { PATIENT_CHECKLIST_ACTIONS } from "../actions/patientChecklistAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = () => ({
  patientChecklistList: {
    data: {},
    status: null,
    error: null,
  },
  patientChecklistUpdate: {
    data: {},
    status: null,
    error: null,
  },
  patientChecklistCreate: {
    data: {},
    status: null,
    error: null,
  },
  patientChecklistDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_PATIENT_CHECKLIST = (state) => ({
  ...state,
  patientChecklistList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_PATIENT_CHECKLIST_SUCCEED = (state, action) => ({
  ...state,
  patientChecklistList: {
    data: action.list,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_PATIENT_CHECKLIST_FAILURE = (state) => ({
  ...state,
  patientChecklistList: {
    data: {},
    status: ACTION_STATUSES.FAILED,
    error: null,
  },
});

const RESET_FETCH_PATIENT_CHECKLIST_STATE = (state) => ({
  ...state,
  patientChecklistList: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_CREATE_PATIENT_CHECKLIST = (state) => ({
  ...state,
  patientChecklistCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_PATIENT_CHECKLIST_SUCCEED = (state, action) => ({
  ...state,
  patientChecklistCreate: {
    data: action.item,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_PATIENT_CHECKLIST_FAILURE = (state) => ({
  ...state,
  patientChecklistCreate: {
    data: {},
    status: ACTION_STATUSES.FAILED,
    error: null,
  },
});

const RESET_CREATE_PATIENT_CHECKLIST_STATE = (state) => ({
  ...state,
  patientChecklistCreate: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_UPDATE_PATIENT_CHECKLIST = (state) => ({
  ...state,
  patientChecklistUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_PATIENT_CHECKLIST_SUCCEED = (state, action) => ({
  ...state,
  patientChecklistUpdate: {
    data: action.item,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_PATIENT_CHECKLIST_FAILURE = (state) => ({
  ...state,
  patientChecklistUpdate: {
    data: {},
    status: ACTION_STATUSES.FAILED,
    error: null,
  },
});

const RESET_UPDATE_PATIENT_CHECKLIST_STATE = (state) => ({
  ...state,
  patientChecklistUpdate: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_DELETE_PATIENT_CHECKLIST = (state) => ({
  ...state,
  patientChecklistDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_PATIENT_CHECKLIST_SUCCEED = (state, action) => ({
  ...state,
  patientChecklistDelete: {
    data: action.item,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_PATIENT_CHECKLIST_FAILURE = (state) => ({
  ...state,
  patientChecklistDelete: {
    data: {},
    status: ACTION_STATUSES.FAILED,
    error: null,
  },
});

const RESET_DELETE_PATIENT_CHECKLIST_STATE = (state) => ({
  ...state,
  patientChecklistDelete: {
    data: {},
    status: null,
    error: null,
  },
});

export default function patientChecklistReducer(
  state = initialState(),
  action
) {
  switch (action.type) {
    case PATIENT_CHECKLIST_ACTIONS.ATTEMPT_TO_FETCH_PATIENT_CHECKLIST:
      return ATTEMPT_TO_FETCH_PATIENT_CHECKLIST(state);
    case PATIENT_CHECKLIST_ACTIONS.FETCH_PATIENT_CHECKLIST_SUCCEED:
      return SET_FETCH_PATIENT_CHECKLIST_SUCCEED(state, action);
    case PATIENT_CHECKLIST_ACTIONS.FETCH_PATIENT_CHECKLIST_FAILURE:
      return SET_FETCH_PATIENT_CHECKLIST_FAILURE(state);
    case PATIENT_CHECKLIST_ACTIONS.RESET_FETCH_PATIENT_CHECKLIST_STATE:
      return RESET_FETCH_PATIENT_CHECKLIST_STATE(state);

    case PATIENT_CHECKLIST_ACTIONS.ATTEMPT_TO_CREATE_PATIENT_CHECKLIST:
      return ATTEMPT_TO_CREATE_PATIENT_CHECKLIST(state);
    case PATIENT_CHECKLIST_ACTIONS.CREATE_PATIENT_CHECKLIST_SUCCEED:
      return SET_CREATE_PATIENT_CHECKLIST_SUCCEED(state, action);
    case PATIENT_CHECKLIST_ACTIONS.CREATE_PATIENT_CHECKLIST_FAILURE:
      return SET_CREATE_PATIENT_CHECKLIST_FAILURE(state);
    case PATIENT_CHECKLIST_ACTIONS.RESET_CREATE_PATIENT_CHECKLIST_STATE:
      return RESET_CREATE_PATIENT_CHECKLIST_STATE(state);

    case PATIENT_CHECKLIST_ACTIONS.ATTEMPT_TO_UPDATE_PATIENT_CHECKLIST:
      return ATTEMPT_TO_UPDATE_PATIENT_CHECKLIST(state);
    case PATIENT_CHECKLIST_ACTIONS.UPDATE_PATIENT_CHECKLIST_SUCCEED:
      return SET_UPDATE_PATIENT_CHECKLIST_SUCCEED(state, action);
    case PATIENT_CHECKLIST_ACTIONS.UPDATE_PATIENT_CHECKLIST_FAILURE:
      return SET_UPDATE_PATIENT_CHECKLIST_FAILURE(state);
    case PATIENT_CHECKLIST_ACTIONS.RESET_UPDATE_PATIENT_CHECKLIST_STATE:
      return RESET_UPDATE_PATIENT_CHECKLIST_STATE(state);

    case PATIENT_CHECKLIST_ACTIONS.ATTEMPT_TO_DELETE_PATIENT_CHECKLIST:
      return ATTEMPT_TO_DELETE_PATIENT_CHECKLIST(state);
    case PATIENT_CHECKLIST_ACTIONS.DELETE_PATIENT_CHECKLIST_SUCCEED:
      return SET_DELETE_PATIENT_CHECKLIST_SUCCEED(state, action);
    case PATIENT_CHECKLIST_ACTIONS.DELETE_PATIENT_CHECKLIST_FAILURE:
      return SET_DELETE_PATIENT_CHECKLIST_FAILURE(state);
    case PATIENT_CHECKLIST_ACTIONS.RESET_DELETE_PATIENT_CHECKLIST_STATE:
      return RESET_DELETE_PATIENT_CHECKLIST_STATE(state);

    default:
      return state;
  }
}
