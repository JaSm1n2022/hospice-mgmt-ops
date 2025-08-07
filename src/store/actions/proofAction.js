export const PROOF_ACTIONS = {
  ATTEMPT_TO_FETCH_PROOF: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_PROOF",
  SET_FETCH_PROOF_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_PROOF_SUCCEED",
  SET_FETCH_PROOF_FAILURE: "dashboard/@HOSPICE/SET_FETCH_PROOF_FAILURE",
  RESET_FETCH_PROOF_STATE: "dashboard/@HOSPICE/RESET_FETCH_PROOF_STATE",

  ATTEMPT_TO_CREATE_PROOF: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_PROOF",
  SET_CREATE_PROOF_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_PROOF_SUCCEED",
  SET_CREATE_PROOF_FAILURE: "dashboard/@HOSPICE/SET_CREATE_PROOF_FAILURE",
  RESET_CREATE_PROOF_STATE: "dashboard/@HOSPICE/RESET_CREATE_PROOF_STATE",

  ATTEMPT_TO_UPDATE_PROOF: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_PROOF",
  SET_UPDATE_PROOF_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_PROOF_SUCCEED",
  SET_UPDATE_PROOF_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_PROOF_FAILURE",
  RESET_UPDATE_PROOF_STATE: "dashboard/@HOSPICE/RESET_UPDATE_PROOF_STATE",

  ATTEMPT_TO_DELETE_PROOF: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_PROOF",
  SET_DELETE_PROOF_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_PROOF_SUCCEED",
  SET_DELETE_PROOF_FAILURE: "dashboard/@HOSPICE/SET_DELETE_PROOF_FAILURE",
  RESET_DELETE_PROOF_STATE: "dashboard/@HOSPICE/RESET_DELETE_PROOF_STATE",
};
//FETCH Proof
export const attemptToFetchProof = (data: Object): BaseAction => ({
  type: PROOF_ACTIONS.ATTEMPT_TO_FETCH_PROOF,
  payload: data,
});
export const setFetchProofSucceed = (payload: Object): BaseAction => ({
  type: PROOF_ACTIONS.SET_FETCH_PROOF_SUCCEED,
  payload,
});

export const setFetchProofFailure = (payload: Object): BaseAction => ({
  type: PROOF_ACTIONS.SET_FETCH_PROOF_FAILURE,
  payload,
});
export const resetFetchProofState = (): BaseAction => ({
  type: PROOF_ACTIONS.RESET_FETCH_PROOF_STATE,
});

//CREATE Proof
export const attemptToCreateProof = (data: Object): BaseAction => ({
  type: PROOF_ACTIONS.ATTEMPT_TO_CREATE_PROOF,
  payload: data,
});
export const setCreateProofSucceed = (payload: Object): BaseAction => ({
  type: PROOF_ACTIONS.SET_CREATE_PROOF_SUCCEED,
  payload,
});

export const setCreateProofFailure = (payload: Object): BaseAction => ({
  type: PROOF_ACTIONS.SET_CREATE_PROOF_FAILURE,
  payload,
});
export const resetCreateProofState = (): BaseAction => ({
  type: PROOF_ACTIONS.RESET_CREATE_PROOF_STATE,
});

//UPDATE Proof
export const attemptToUpdateProof = (data: Object): BaseAction => ({
  type: PROOF_ACTIONS.ATTEMPT_TO_UPDATE_PROOF,
  payload: data,
});
export const setUpdateProofSucceed = (payload: Object): BaseAction => ({
  type: PROOF_ACTIONS.SET_UPDATE_PROOF_SUCCEED,
  payload,
});

export const setUpdateProofFailure = (payload: Object): BaseAction => ({
  type: PROOF_ACTIONS.SET_UPDATE_PROOF_FAILURE,
  payload,
});
export const resetUpdateProofState = (): BaseAction => ({
  type: PROOF_ACTIONS.RESET_UPDATE_PROOF_STATE,
});

//DELETE Proof
export const attemptToDeleteProof = (data: Object): BaseAction => ({
  type: PROOF_ACTIONS.ATTEMPT_TO_DELETE_PROOF,
  payload: data,
});
export const setDeleteProofSucceed = (payload: Object): BaseAction => ({
  type: PROOF_ACTIONS.SET_DELETE_PROOF_SUCCEED,
  payload,
});

export const setDeleteProofFailure = (payload: Object): BaseAction => ({
  type: PROOF_ACTIONS.SET_DELETE_PROOF_FAILURE,
  payload,
});
export const resetDeleteProofState = (): BaseAction => ({
  type: PROOF_ACTIONS.RESET_DELETE_PROOF_STATE,
});
