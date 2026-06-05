export const QA_ACTIONS = {
ATTEMPT_TO_FETCH_QA: 'dashboard/@HOSPICE/ATTEMPT_TO_FETCH_QA',
SET_FETCH_QA_SUCCEED: 'dashboard/@HOSPICE/SET_FETCH_QA_SUCCEED',
SET_FETCH_QA_FAILURE: 'dashboard/@HOSPICE/SET_FETCH_QA_FAILURE',
RESET_FETCH_QA_STATE: 'dashboard/@HOSPICE/RESET_FETCH_QA_STATE',

ATTEMPT_TO_CREATE_QA: 'dashboard/@HOSPICE/ATTEMPT_TO_CREATE_QA',
SET_CREATE_QA_SUCCEED: 'dashboard/@HOSPICE/SET_CREATE_QA_SUCCEED',
SET_CREATE_QA_FAILURE: 'dashboard/@HOSPICE/SET_CREATE_QA_FAILURE',
RESET_CREATE_QA_STATE: 'dashboard/@HOSPICE/RESET_CREATE_QA_STATE',

ATTEMPT_TO_UPDATE_QA: 'dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_QA',
SET_UPDATE_QA_SUCCEED: 'dashboard/@HOSPICE/SET_UPDATE_QA_SUCCEED',
SET_UPDATE_QA_FAILURE: 'dashboard/@HOSPICE/SET_UPDATE_QA_FAILURE',
RESET_UPDATE_QA_STATE: 'dashboard/@HOSPICE/RESET_UPDATE_QA_STATE',

ATTEMPT_TO_DELETE_QA: 'dashboard/@HOSPICE/ATTEMPT_TO_DELETE_QA',
SET_DELETE_QA_SUCCEED: 'dashboard/@HOSPICE/SET_DELETE_QA_SUCCEED',
SET_DELETE_QA_FAILURE: 'dashboard/@HOSPICE/SET_DELETE_QA_FAILURE',
RESET_DELETE_QA_STATE: 'dashboard/@HOSPICE/RESET_DELETE_QA_STATE'

}
//FETCH QA
export const attemptToFetchQA =  (data: Object): BaseAction  => ({
    type: QA_ACTIONS.ATTEMPT_TO_FETCH_QA,
    payload: data
  });
  export const setFetchQASucceed = (payload: Object): BaseAction => ({
    type: QA_ACTIONS.SET_FETCH_QA_SUCCEED,
    payload
  });

  export const setFetchQAFailure = (payload: Object): BaseAction => ({
    type: QA_ACTIONS.SET_FETCH_QA_FAILURE,
    payload
  });
  export const resetFetchQAState = (): BaseAction => ({
    type: QA_ACTIONS.RESET_FETCH_QA_STATE
  });

//CREATE QA
export const attemptToCreateQA =  (data: Object): BaseAction  => ({
  type: QA_ACTIONS.ATTEMPT_TO_CREATE_QA,
  payload: data
});
export const setCreateQASucceed = (payload: Object): BaseAction => ({
  type: QA_ACTIONS.SET_CREATE_QA_SUCCEED,
  payload
});

export const setCreateQAFailure = (payload: Object): BaseAction => ({
  type: QA_ACTIONS.SET_CREATE_QA_FAILURE,
  payload
});
export const resetCreateQAState = (): BaseAction => ({
  type: QA_ACTIONS.RESET_CREATE_QA_STATE
});

//UPDATE QA
export const attemptToUpdateQA =  (data: Object): BaseAction  => ({
  type: QA_ACTIONS.ATTEMPT_TO_UPDATE_QA,
  payload: data
});
export const setUpdateQASucceed = (payload: Object): BaseAction => ({
  type: QA_ACTIONS.SET_UPDATE_QA_SUCCEED,
  payload
});

export const setUpdateQAFailure = (payload: Object): BaseAction => ({
  type: QA_ACTIONS.SET_UPDATE_QA_FAILURE,
  payload
});
export const resetUpdateQAState = (): BaseAction => ({
  type: QA_ACTIONS.RESET_UPDATE_QA_STATE
});

//DELETE QA
export const attemptToDeleteQA =  (data: Object): BaseAction  => ({
  type: QA_ACTIONS.ATTEMPT_TO_DELETE_QA,
  payload: data
});
export const setDeleteQASucceed = (payload: Object): BaseAction => ({
  type: QA_ACTIONS.SET_DELETE_QA_SUCCEED,
  payload
});

export const setDeleteQAFailure = (payload: Object): BaseAction => ({
  type: QA_ACTIONS.SET_DELETE_QA_FAILURE,
  payload
});
export const resetDeleteQAState = (): BaseAction => ({
  type: QA_ACTIONS.RESET_DELETE_QA_STATE
});
