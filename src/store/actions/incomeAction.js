export const INCOME_ACTIONS = {
  ATTEMPT_TO_FETCH_INCOME: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_INCOME",
  SET_FETCH_INCOME_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_INCOME_SUCCEED",
  SET_FETCH_INCOME_FAILURE: "dashboard/@HOSPICE/SET_FETCH_INCOME_FAILURE",
  RESET_FETCH_INCOME_STATE: "dashboard/@HOSPICE/RESET_FETCH_INCOME_STATE",

  ATTEMPT_TO_CREATE_INCOME: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_INCOME",
  SET_CREATE_INCOME_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_INCOME_SUCCEED",
  SET_CREATE_INCOME_FAILURE: "dashboard/@HOSPICE/SET_CREATE_INCOME_FAILURE",
  RESET_CREATE_INCOME_STATE: "dashboard/@HOSPICE/RESET_CREATE_INCOME_STATE",

  ATTEMPT_TO_UPDATE_INCOME: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_INCOME",
  SET_UPDATE_INCOME_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_INCOME_SUCCEED",
  SET_UPDATE_INCOME_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_INCOME_FAILURE",
  RESET_UPDATE_INCOME_STATE: "dashboard/@HOSPICE/RESET_UPDATE_INCOME_STATE",

  ATTEMPT_TO_DELETE_INCOME: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_INCOME",
  SET_DELETE_INCOME_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_INCOME_SUCCEED",
  SET_DELETE_INCOME_FAILURE: "dashboard/@HOSPICE/SET_DELETE_INCOME_FAILURE",
  RESET_DELETE_INCOME_STATE: "dashboard/@HOSPICE/RESET_DELETE_INCOME_STATE",

  ATTEMPT_TO_UPLOAD_FILE: "dashboard/@HOSPICE/ATTEMPT_TO_UPLOAD_FILE",
  SET_UPLOAD_FILE_SUCCEED: "dashboard/@HOSPICE/SET_UPLOAD_FILE_SUCCEED",
  SET_UPLOAD_FILE_FAILURE: "dashboard/@HOSPICE/SET_UPLOAD_FILE_FAILURE",
  RESET_UPLOAD_FILE_STATE: "dashboard/@HOSPICE/RESET_UPLOAD_FILE_STATE",

  ATTEMPT_TO_FETCH_FILES: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_FILES",
  SET_FETCH_FILES_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_FILES_SUCCEED",
  SET_FETCH_FILES_FAILURE: "dashboard/@HOSPICE/SET_FETCH_FILES_FAILURE",
  RESET_FETCH_FILES_STATE: "dashboard/@HOSPICE/RESET_FETCH_FILES_STATE",
};

// FETCH Income
export const attemptToFetchIncome = (data) => ({
  type: INCOME_ACTIONS.ATTEMPT_TO_FETCH_INCOME,
  payload: data,
});

export const setFetchIncomeSucceed = (payload) => ({
  type: INCOME_ACTIONS.SET_FETCH_INCOME_SUCCEED,
  payload,
});

export const setFetchIncomeFailure = (payload) => ({
  type: INCOME_ACTIONS.SET_FETCH_INCOME_FAILURE,
  payload,
});

export const resetFetchIncomeState = () => ({
  type: INCOME_ACTIONS.RESET_FETCH_INCOME_STATE,
});

// CREATE Income
export const attemptToCreateIncome = (data) => ({
  type: INCOME_ACTIONS.ATTEMPT_TO_CREATE_INCOME,
  payload: data,
});

export const setCreateIncomeSucceed = (payload) => ({
  type: INCOME_ACTIONS.SET_CREATE_INCOME_SUCCEED,
  payload,
});

export const setCreateIncomeFailure = (payload) => ({
  type: INCOME_ACTIONS.SET_CREATE_INCOME_FAILURE,
  payload,
});

export const resetCreateIncomeState = () => ({
  type: INCOME_ACTIONS.RESET_CREATE_INCOME_STATE,
});

// UPDATE Income
export const attemptToUpdateIncome = (data) => ({
  type: INCOME_ACTIONS.ATTEMPT_TO_UPDATE_INCOME,
  payload: data,
});

export const setUpdateIncomeSucceed = (payload) => ({
  type: INCOME_ACTIONS.SET_UPDATE_INCOME_SUCCEED,
  payload,
});

export const setUpdateIncomeFailure = (payload) => ({
  type: INCOME_ACTIONS.SET_UPDATE_INCOME_FAILURE,
  payload,
});

export const resetUpdateIncomeState = () => ({
  type: INCOME_ACTIONS.RESET_UPDATE_INCOME_STATE,
});

// DELETE Income
export const attemptToDeleteIncome = (data) => ({
  type: INCOME_ACTIONS.ATTEMPT_TO_DELETE_INCOME,
  payload: data,
});

export const setDeleteIncomeSucceed = (payload) => ({
  type: INCOME_ACTIONS.SET_DELETE_INCOME_SUCCEED,
  payload,
});

export const setDeleteIncomeFailure = (payload) => ({
  type: INCOME_ACTIONS.SET_DELETE_INCOME_FAILURE,
  payload,
});

export const resetDeleteIncomeState = () => ({
  type: INCOME_ACTIONS.RESET_DELETE_INCOME_STATE,
});

// UPLOAD File
export const attemptToUploadFile = (data) => ({
  type: INCOME_ACTIONS.ATTEMPT_TO_UPLOAD_FILE,
  payload: data,
});

export const setUploadFileSucceed = (payload) => ({
  type: INCOME_ACTIONS.SET_UPLOAD_FILE_SUCCEED,
  payload,
});

export const setUploadFileFailure = (payload) => ({
  type: INCOME_ACTIONS.SET_UPLOAD_FILE_FAILURE,
  payload,
});

export const resetUploadFileState = () => ({
  type: INCOME_ACTIONS.RESET_UPLOAD_FILE_STATE,
});

// FETCH Files
export const attemptToFetchFiles = (data) => ({
  type: INCOME_ACTIONS.ATTEMPT_TO_FETCH_FILES,
  payload: data,
});

export const setFetchFilesSucceed = (payload) => ({
  type: INCOME_ACTIONS.SET_FETCH_FILES_SUCCEED,
  payload,
});

export const setFetchFilesFailure = (payload) => ({
  type: INCOME_ACTIONS.SET_FETCH_FILES_FAILURE,
  payload,
});

export const resetFetchFilesState = () => ({
  type: INCOME_ACTIONS.RESET_FETCH_FILES_STATE,
});
