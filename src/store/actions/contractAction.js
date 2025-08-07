export const CONTRACT_ACTIONS = {
  ATTEMPT_TO_FETCH_CONTRACT: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_CONTRACT",
  SET_FETCH_CONTRACT_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_CONTRACT_SUCCEED",
  SET_FETCH_CONTRACT_FAILURE: "dashboard/@HOSPICE/SET_FETCH_CONTRACT_FAILURE",
  RESET_FETCH_CONTRACT_STATE: "dashboard/@HOSPICE/RESET_FETCH_CONTRACT_STATE",

  ATTEMPT_TO_CREATE_CONTRACT: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_CONTRACT",
  SET_CREATE_CONTRACT_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_CONTRACT_SUCCEED",
  SET_CREATE_CONTRACT_FAILURE: "dashboard/@HOSPICE/SET_CREATE_CONTRACT_FAILURE",
  RESET_CREATE_CONTRACT_STATE: "dashboard/@HOSPICE/RESET_CREATE_CONTRACT_STATE",

  ATTEMPT_TO_UPDATE_CONTRACT: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_CONTRACT",
  SET_UPDATE_CONTRACT_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_CONTRACT_SUCCEED",
  SET_UPDATE_CONTRACT_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_CONTRACT_FAILURE",
  RESET_UPDATE_CONTRACT_STATE: "dashboard/@HOSPICE/RESET_UPDATE_CONTRACT_STATE",

  ATTEMPT_TO_DELETE_CONTRACT: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_CONTRACT",
  SET_DELETE_CONTRACT_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_CONTRACT_SUCCEED",
  SET_DELETE_CONTRACT_FAILURE: "dashboard/@HOSPICE/SET_DELETE_CONTRACT_FAILURE",
  RESET_DELETE_CONTRACT_STATE: "dashboard/@HOSPICE/RESET_DELETE_CONTRACT_STATE",
};
//FETCH Contract
export const attemptToFetchContract = (data: Object): BaseAction => ({
  type: CONTRACT_ACTIONS.ATTEMPT_TO_FETCH_CONTRACT,
  payload: data,
});
export const setFetchContractSucceed = (payload: Object): BaseAction => ({
  type: CONTRACT_ACTIONS.SET_FETCH_CONTRACT_SUCCEED,
  payload,
});

export const setFetchContractFailure = (payload: Object): BaseAction => ({
  type: CONTRACT_ACTIONS.SET_FETCH_CONTRACT_FAILURE,
  payload,
});
export const resetFetchContractState = (): BaseAction => ({
  type: CONTRACT_ACTIONS.RESET_FETCH_CONTRACT_STATE,
});

//CREATE Contract
export const attemptToCreateContract = (data: Object): BaseAction => ({
  type: CONTRACT_ACTIONS.ATTEMPT_TO_CREATE_CONTRACT,
  payload: data,
});
export const setCreateContractSucceed = (payload: Object): BaseAction => ({
  type: CONTRACT_ACTIONS.SET_CREATE_CONTRACT_SUCCEED,
  payload,
});

export const setCreateContractFailure = (payload: Object): BaseAction => ({
  type: CONTRACT_ACTIONS.SET_CREATE_CONTRACT_FAILURE,
  payload,
});
export const resetCreateContractState = (): BaseAction => ({
  type: CONTRACT_ACTIONS.RESET_CREATE_CONTRACT_STATE,
});

//UPDATE Contract
export const attemptToUpdateContract = (data: Object): BaseAction => ({
  type: CONTRACT_ACTIONS.ATTEMPT_TO_UPDATE_CONTRACT,
  payload: data,
});
export const setUpdateContractSucceed = (payload: Object): BaseAction => ({
  type: CONTRACT_ACTIONS.SET_UPDATE_CONTRACT_SUCCEED,
  payload,
});

export const setUpdateContractFailure = (payload: Object): BaseAction => ({
  type: CONTRACT_ACTIONS.SET_UPDATE_CONTRACT_FAILURE,
  payload,
});
export const resetUpdateContractState = (): BaseAction => ({
  type: CONTRACT_ACTIONS.RESET_UPDATE_CONTRACT_STATE,
});

//DELETE Contract
export const attemptToDeleteContract = (data: Object): BaseAction => ({
  type: CONTRACT_ACTIONS.ATTEMPT_TO_DELETE_CONTRACT,
  payload: data,
});
export const setDeleteContractSucceed = (payload: Object): BaseAction => ({
  type: CONTRACT_ACTIONS.SET_DELETE_CONTRACT_SUCCEED,
  payload,
});

export const setDeleteContractFailure = (payload: Object): BaseAction => ({
  type: CONTRACT_ACTIONS.SET_DELETE_CONTRACT_FAILURE,
  payload,
});
export const resetDeleteContractState = (): BaseAction => ({
  type: CONTRACT_ACTIONS.RESET_DELETE_CONTRACT_STATE,
});
