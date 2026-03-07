import { PATIENT_CHECKLIST_ACTIONS } from "../actions/patientChecklistAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialListState = {
  data: [],
  status: ACTION_STATUSES.IDLE,
  error: null,
};

const initialCreateState = {
  data: null,
  status: ACTION_STATUSES.IDLE,
  error: null,
};

const initialUpdateState = {
  data: null,
  status: ACTION_STATUSES.IDLE,
  error: null,
};

const initialDeleteState = {
  data: null,
  status: ACTION_STATUSES.IDLE,
  error: null,
};

export const patientChecklistListState = (
  state = initialListState,
  action
) => {
  switch (action.type) {
    case PATIENT_CHECKLIST_ACTIONS.ATTEMPT_TO_FETCH_PATIENT_CHECKLIST:
      return { ...state, status: ACTION_STATUSES.PENDING };
    case PATIENT_CHECKLIST_ACTIONS.FETCH_PATIENT_CHECKLIST_SUCCEED:
      return {
        ...state,
        data: action.list,
        status: ACTION_STATUSES.SUCCEED,
        error: null,
      };
    case PATIENT_CHECKLIST_ACTIONS.FETCH_PATIENT_CHECKLIST_FAILURE:
      return {
        ...state,
        status: ACTION_STATUSES.FAILED,
        error: action.error,
      };
    case PATIENT_CHECKLIST_ACTIONS.RESET_FETCH_PATIENT_CHECKLIST_STATE:
      return initialListState;
    default:
      return state;
  }
};

export const patientChecklistCreateState = (
  state = initialCreateState,
  action
) => {
  switch (action.type) {
    case PATIENT_CHECKLIST_ACTIONS.ATTEMPT_TO_CREATE_PATIENT_CHECKLIST:
      return { ...state, status: ACTION_STATUSES.PENDING };
    case PATIENT_CHECKLIST_ACTIONS.CREATE_PATIENT_CHECKLIST_SUCCEED:
      return {
        ...state,
        data: action.item,
        status: ACTION_STATUSES.SUCCEED,
        error: null,
      };
    case PATIENT_CHECKLIST_ACTIONS.CREATE_PATIENT_CHECKLIST_FAILURE:
      return {
        ...state,
        status: ACTION_STATUSES.FAILED,
        error: action.error,
      };
    case PATIENT_CHECKLIST_ACTIONS.RESET_CREATE_PATIENT_CHECKLIST_STATE:
      return initialCreateState;
    default:
      return state;
  }
};

export const patientChecklistUpdateState = (
  state = initialUpdateState,
  action
) => {
  switch (action.type) {
    case PATIENT_CHECKLIST_ACTIONS.ATTEMPT_TO_UPDATE_PATIENT_CHECKLIST:
      return { ...state, status: ACTION_STATUSES.PENDING };
    case PATIENT_CHECKLIST_ACTIONS.UPDATE_PATIENT_CHECKLIST_SUCCEED:
      return {
        ...state,
        data: action.item,
        status: ACTION_STATUSES.SUCCEED,
        error: null,
      };
    case PATIENT_CHECKLIST_ACTIONS.UPDATE_PATIENT_CHECKLIST_FAILURE:
      return {
        ...state,
        status: ACTION_STATUSES.FAILED,
        error: action.error,
      };
    case PATIENT_CHECKLIST_ACTIONS.RESET_UPDATE_PATIENT_CHECKLIST_STATE:
      return initialUpdateState;
    default:
      return state;
  }
};

export const patientChecklistDeleteState = (
  state = initialDeleteState,
  action
) => {
  switch (action.type) {
    case PATIENT_CHECKLIST_ACTIONS.ATTEMPT_TO_DELETE_PATIENT_CHECKLIST:
      return { ...state, status: ACTION_STATUSES.PENDING };
    case PATIENT_CHECKLIST_ACTIONS.DELETE_PATIENT_CHECKLIST_SUCCEED:
      return {
        ...state,
        data: action.item,
        status: ACTION_STATUSES.SUCCEED,
        error: null,
      };
    case PATIENT_CHECKLIST_ACTIONS.DELETE_PATIENT_CHECKLIST_FAILURE:
      return {
        ...state,
        status: ACTION_STATUSES.FAILED,
        error: action.error,
      };
    case PATIENT_CHECKLIST_ACTIONS.RESET_DELETE_PATIENT_CHECKLIST_STATE:
      return initialDeleteState;
    default:
      return state;
  }
};
