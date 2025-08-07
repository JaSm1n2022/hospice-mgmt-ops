export const PAYROLL_ACTIONS = {
  ATTEMPT_TO_FETCH_PAYROLL: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_PAYROLL",
  SET_FETCH_PAYROLL_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_PAYROLL_SUCCEED",
  SET_FETCH_PAYROLL_FAILURE: "dashboard/@HOSPICE/SET_FETCH_PAYROLL_FAILURE",
  RESET_FETCH_PAYROLL_STATE: "dashboard/@HOSPICE/RESET_FETCH_PAYROLL_STATE",

  ATTEMPT_TO_CREATE_PAYROLL: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_PAYROLL",
  SET_CREATE_PAYROLL_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_PAYROLL_SUCCEED",
  SET_CREATE_PAYROLL_FAILURE: "dashboard/@HOSPICE/SET_CREATE_PAYROLL_FAILURE",
  RESET_CREATE_PAYROLL_STATE: "dashboard/@HOSPICE/RESET_CREATE_PAYROLL_STATE",

  ATTEMPT_TO_UPDATE_PAYROLL: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_PAYROLL",
  SET_UPDATE_PAYROLL_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_PAYROLL_SUCCEED",
  SET_UPDATE_PAYROLL_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_PAYROLL_FAILURE",
  RESET_UPDATE_PAYROLL_STATE: "dashboard/@HOSPICE/RESET_UPDATE_PAYROLL_STATE",

  ATTEMPT_TO_DELETE_PAYROLL: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_PAYROLL",
  SET_DELETE_PAYROLL_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_PAYROLL_SUCCEED",
  SET_DELETE_PAYROLL_FAILURE: "dashboard/@HOSPICE/SET_DELETE_PAYROLL_FAILURE",
  RESET_DELETE_PAYROLL_STATE: "dashboard/@HOSPICE/RESET_DELETE_PAYROLL_STATE",
};
//FETCH Payroll
export const attemptToFetchPayroll = (data: Object): BaseAction => ({
  type: PAYROLL_ACTIONS.ATTEMPT_TO_FETCH_PAYROLL,
  payload: data,
});
export const setFetchPayrollSucceed = (payload: Object): BaseAction => ({
  type: PAYROLL_ACTIONS.SET_FETCH_PAYROLL_SUCCEED,
  payload,
});

export const setFetchPayrollFailure = (payload: Object): BaseAction => ({
  type: PAYROLL_ACTIONS.SET_FETCH_PAYROLL_FAILURE,
  payload,
});
export const resetFetchPayrollState = (): BaseAction => ({
  type: PAYROLL_ACTIONS.RESET_FETCH_PAYROLL_STATE,
});

//CREATE Payroll
export const attemptToCreatePayroll = (data: Object): BaseAction => ({
  type: PAYROLL_ACTIONS.ATTEMPT_TO_CREATE_PAYROLL,
  payload: data,
});
export const setCreatePayrollSucceed = (payload: Object): BaseAction => ({
  type: PAYROLL_ACTIONS.SET_CREATE_PAYROLL_SUCCEED,
  payload,
});

export const setCreatePayrollFailure = (payload: Object): BaseAction => ({
  type: PAYROLL_ACTIONS.SET_CREATE_PAYROLL_FAILURE,
  payload,
});
export const resetCreatePayrollState = (): BaseAction => ({
  type: PAYROLL_ACTIONS.RESET_CREATE_PAYROLL_STATE,
});

//UPDATE Payroll
export const attemptToUpdatePayroll = (data: Object): BaseAction => ({
  type: PAYROLL_ACTIONS.ATTEMPT_TO_UPDATE_PAYROLL,
  payload: data,
});
export const setUpdatePayrollSucceed = (payload: Object): BaseAction => ({
  type: PAYROLL_ACTIONS.SET_UPDATE_PAYROLL_SUCCEED,
  payload,
});

export const setUpdatePayrollFailure = (payload: Object): BaseAction => ({
  type: PAYROLL_ACTIONS.SET_UPDATE_PAYROLL_FAILURE,
  payload,
});
export const resetUpdatePayrollState = (): BaseAction => ({
  type: PAYROLL_ACTIONS.RESET_UPDATE_PAYROLL_STATE,
});

//DELETE Payroll
export const attemptToDeletePayroll = (data: Object): BaseAction => ({
  type: PAYROLL_ACTIONS.ATTEMPT_TO_DELETE_PAYROLL,
  payload: data,
});
export const setDeletePayrollSucceed = (payload: Object): BaseAction => ({
  type: PAYROLL_ACTIONS.SET_DELETE_PAYROLL_SUCCEED,
  payload,
});

export const setDeletePayrollFailure = (payload: Object): BaseAction => ({
  type: PAYROLL_ACTIONS.SET_DELETE_PAYROLL_FAILURE,
  payload,
});
export const resetDeletePayrollState = (): BaseAction => ({
  type: PAYROLL_ACTIONS.RESET_DELETE_PAYROLL_STATE,
});
