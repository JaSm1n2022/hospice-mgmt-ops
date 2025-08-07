import type { BaseAction } from "../types/Action";
import type { EquipmentState } from "../types";
import { EQUIPMENT_ACTIONS } from "../actions/equipmentAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): EquipmentState => ({
  equipmentList: {
    data: {},
    status: null,
    error: null,
  },
  equipmentUpdate: {
    data: {},
    status: null,
    error: null,
  },
  equipmentCreate: {
    data: {},
    status: null,
    error: null,
  },
  equipmentDelete: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_EQUIPMENT = (state: EquipmentState) => ({
  ...state,
  equipmentList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_EQUIPMENT_SUCCEED = (
  state: EquipmentState,
  action: BaseAction
) => ({
  ...state,
  equipmentList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_EQUIPMENT_FAILURE = (state: EquipmentState) => ({
  ...state,
  equipmentList: {
    ...state.equipmentList,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_FETCH_EQUIPMENT_STATE = (state: EquipmentState) => ({
  ...state,
  equipmentList: initialState().equipmentList,
});

/*
Create
 */
const ATTEMPT_TO_CREATE_EQUIPMENT = (state: EquipmentState) => ({
  ...state,
  equipmentCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_EQUIPMENT_SUCCEED = (
  state: EquipmentState,
  action: BaseAction
) => ({
  ...state,
  equipmentCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_EQUIPMENT_FAILURE = (state: EquipmentState) => ({
  ...state,
  equipmentCreate: {
    ...state.equipmentCreate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_CREATE_EQUIPMENT_STATE = (state: EquipmentState) => ({
  ...state,
  equipmentCreate: initialState().equipmentCreate,
});

/*
Update
 */
const ATTEMPT_TO_UPDATE_EQUIPMENT = (state: EquipmentState) => ({
  ...state,
  equipmentUpdate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_UPDATE_EQUIPMENT_SUCCEED = (
  state: EquipmentState,
  action: BaseAction
) => ({
  ...state,
  equipmentUpdate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_UPDATE_EQUIPMENT_FAILURE = (state: EquipmentState) => ({
  ...state,
  equipmentUpdate: {
    ...state.equipmentUpdate,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_UPDATE_EQUIPMENT_STATE = (state: EquipmentState) => ({
  ...state,
  equipmentUpdate: initialState().equipmentUpdate,
});

/*
Update
 */
const ATTEMPT_TO_DELETE_EQUIPMENT = (state: EquipmentState) => ({
  ...state,
  equipmentDelete: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_DELETE_EQUIPMENT_SUCCEED = (
  state: EquipmentState,
  action: BaseAction
) => ({
  ...state,
  equipmentDelete: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_DELETE_EQUIPMENT_FAILURE = (state: EquipmentState) => ({
  ...state,
  equipmentDelete: {
    ...state.equipmentDelete,
    status: ACTION_STATUSES.FAILED,
  },
});
const RESET_DELETE_EQUIPMENT_STATE = (state: EquipmentState) => ({
  ...state,
  equipmentDelete: initialState().equipmentDelete,
});

const reducer = (
  state: EquipmentState = initialState(),
  action: BaseAction
) => {
  switch (action.type) {
    case EQUIPMENT_ACTIONS.ATTEMPT_TO_FETCH_EQUIPMENT:
      return ATTEMPT_TO_FETCH_EQUIPMENT(state);
    case EQUIPMENT_ACTIONS.SET_FETCH_EQUIPMENT_SUCCEED:
      return SET_FETCH_EQUIPMENT_SUCCEED(state, action);
    case EQUIPMENT_ACTIONS.SET_FETCH_EQUIPMENT_FAILURE:
      return SET_FETCH_EQUIPMENT_FAILURE(state);
    case EQUIPMENT_ACTIONS.RESET_FETCH_EQUIPMENT_STATE:
      return RESET_FETCH_EQUIPMENT_STATE(state);

    case EQUIPMENT_ACTIONS.ATTEMPT_TO_CREATE_EQUIPMENT:
      return ATTEMPT_TO_CREATE_EQUIPMENT(state);
    case EQUIPMENT_ACTIONS.SET_CREATE_EQUIPMENT_SUCCEED:
      return SET_CREATE_EQUIPMENT_SUCCEED(state, action);
    case EQUIPMENT_ACTIONS.SET_CREATE_EQUIPMENT_FAILURE:
      return SET_CREATE_EQUIPMENT_FAILURE(state);
    case EQUIPMENT_ACTIONS.RESET_CREATE_EQUIPMENT_STATE:
      return RESET_CREATE_EQUIPMENT_STATE(state);

    case EQUIPMENT_ACTIONS.ATTEMPT_TO_UPDATE_EQUIPMENT:
      return ATTEMPT_TO_UPDATE_EQUIPMENT(state);
    case EQUIPMENT_ACTIONS.SET_UPDATE_EQUIPMENT_SUCCEED:
      return SET_UPDATE_EQUIPMENT_SUCCEED(state, action);
    case EQUIPMENT_ACTIONS.SET_UPDATE_EQUIPMENT_FAILURE:
      return SET_UPDATE_EQUIPMENT_FAILURE(state);
    case EQUIPMENT_ACTIONS.RESET_UPDATE_EQUIPMENT_STATE:
      return RESET_UPDATE_EQUIPMENT_STATE(state);

    case EQUIPMENT_ACTIONS.ATTEMPT_TO_DELETE_EQUIPMENT:
      return ATTEMPT_TO_DELETE_EQUIPMENT(state);
    case EQUIPMENT_ACTIONS.SET_DELETE_EQUIPMENT_SUCCEED:
      return SET_DELETE_EQUIPMENT_SUCCEED(state, action);
    case EQUIPMENT_ACTIONS.SET_DELETE_EQUIPMENT_FAILURE:
      return SET_DELETE_EQUIPMENT_FAILURE(state);
    case EQUIPMENT_ACTIONS.RESET_DELETE_EQUIPMENT_STATE:
      return RESET_DELETE_EQUIPMENT_STATE(state);
    default:
      return state;
  }
};

export default reducer;
