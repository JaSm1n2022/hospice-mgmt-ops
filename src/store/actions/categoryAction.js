export const CATEGORY_ACTIONS = {
  ATTEMPT_TO_FETCH_CATEGORY: "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_CATEGORY",
  SET_FETCH_CATEGORY_SUCCEED: "dashboard/@HOSPICE/SET_FETCH_CATEGORY_SUCCEED",
  SET_FETCH_CATEGORY_FAILURE: "dashboard/@HOSPICE/SET_FETCH_CATEGORY_FAILURE",
  RESET_FETCH_CATEGORY_STATE: "dashboard/@HOSPICE/RESET_FETCH_CATEGORY_STATE",

  ATTEMPT_TO_CREATE_CATEGORY: "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_CATEGORY",
  SET_CREATE_CATEGORY_SUCCEED: "dashboard/@HOSPICE/SET_CREATE_CATEGORY_SUCCEED",
  SET_CREATE_CATEGORY_FAILURE: "dashboard/@HOSPICE/SET_CREATE_CATEGORY_FAILURE",
  RESET_CREATE_CATEGORY_STATE: "dashboard/@HOSPICE/RESET_CREATE_CATEGORY_STATE",

  ATTEMPT_TO_UPDATE_CATEGORY: "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_CATEGORY",
  SET_UPDATE_CATEGORY_SUCCEED: "dashboard/@HOSPICE/SET_UPDATE_CATEGORY_SUCCEED",
  SET_UPDATE_CATEGORY_FAILURE: "dashboard/@HOSPICE/SET_UPDATE_CATEGORY_FAILURE",
  RESET_UPDATE_CATEGORY_STATE: "dashboard/@HOSPICE/RESET_UPDATE_CATEGORY_STATE",

  ATTEMPT_TO_DELETE_CATEGORY: "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_CATEGORY",
  SET_DELETE_CATEGORY_SUCCEED: "dashboard/@HOSPICE/SET_DELETE_CATEGORY_SUCCEED",
  SET_DELETE_CATEGORY_FAILURE: "dashboard/@HOSPICE/SET_DELETE_CATEGORY_FAILURE",
  RESET_DELETE_CATEGORY_STATE: "dashboard/@HOSPICE/RESET_DELETE_CATEGORY_STATE",
};
//FETCH CATEGORY
export const attemptToFetchCategory = (data: Object): BaseAction => ({
  type: CATEGORY_ACTIONS.ATTEMPT_TO_FETCH_CATEGORY,
  payload: data,
});
export const setFetchCategorySucceed = (payload: Object): BaseAction => ({
  type: CATEGORY_ACTIONS.SET_FETCH_CATEGORY_SUCCEED,
  payload,
});

export const setFetchCategoryFailure = (payload: Object): BaseAction => ({
  type: CATEGORY_ACTIONS.SET_FETCH_CATEGORY_FAILURE,
  payload,
});
export const resetFetchCategoryState = (): BaseAction => ({
  type: CATEGORY_ACTIONS.RESET_FETCH_CATEGORY_STATE,
});

//CREATE CATEGORY
export const attemptToCreateCategory = (data: Object): BaseAction => ({
  type: CATEGORY_ACTIONS.ATTEMPT_TO_CREATE_CATEGORY,
  payload: data,
});
export const setCreateCategorySucceed = (payload: Object): BaseAction => ({
  type: CATEGORY_ACTIONS.SET_CREATE_CATEGORY_SUCCEED,
  payload,
});

export const setCreateCategoryFailure = (payload: Object): BaseAction => ({
  type: CATEGORY_ACTIONS.SET_CREATE_CATEGORY_FAILURE,
  payload,
});
export const resetCreateCategoryState = (): BaseAction => ({
  type: CATEGORY_ACTIONS.RESET_CREATE_CATEGORY_STATE,
});

//UPDATE CATEGORY
export const attemptToUpdateCategory = (data: Object): BaseAction => ({
  type: CATEGORY_ACTIONS.ATTEMPT_TO_UPDATE_CATEGORY,
  payload: data,
});
export const setUpdateCategorySucceed = (payload: Object): BaseAction => ({
  type: CATEGORY_ACTIONS.SET_UPDATE_CATEGORY_SUCCEED,
  payload,
});

export const setUpdateCategoryFailure = (payload: Object): BaseAction => ({
  type: CATEGORY_ACTIONS.SET_UPDATE_CATEGORY_FAILURE,
  payload,
});
export const resetUpdateCategoryState = (): BaseAction => ({
  type: CATEGORY_ACTIONS.RESET_UPDATE_CATEGORY_STATE,
});

//DELETE CATEGORY
export const attemptToDeleteCategory = (data: Object): BaseAction => ({
  type: CATEGORY_ACTIONS.ATTEMPT_TO_DELETE_CATEGORY,
  payload: data,
});
export const setDeleteCategorySucceed = (payload: Object): BaseAction => ({
  type: CATEGORY_ACTIONS.SET_DELETE_CATEGORY_SUCCEED,
  payload,
});

export const setDeleteCategoryFailure = (payload: Object): BaseAction => ({
  type: CATEGORY_ACTIONS.SET_DELETE_CATEGORY_FAILURE,
  payload,
});
export const resetDeleteCategoryState = (): BaseAction => ({
  type: CATEGORY_ACTIONS.RESET_DELETE_CATEGORY_STATE,
});
