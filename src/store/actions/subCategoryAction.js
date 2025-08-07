export const SUBCATEGORY_ACTIONS = {
  ATTEMPT_TO_FETCH_SUBCATEGORY:
    "dashboard/@HOSPICE/ATTEMPT_TO_FETCH_SUBCATEGORY",
  SET_FETCH_SUBCATEGORY_SUCCEED:
    "dashboard/@HOSPICE/SET_FETCH_SUBCATEGORY_SUCCEED",
  SET_FETCH_SUBCATEGORY_FAILURE:
    "dashboard/@HOSPICE/SET_FETCH_SUBCATEGORY_FAILURE",
  RESET_FETCH_SUBCATEGORY_STATE:
    "dashboard/@HOSPICE/RESET_FETCH_SUBCATEGORY_STATE",

  ATTEMPT_TO_CREATE_SUBCATEGORY:
    "dashboard/@HOSPICE/ATTEMPT_TO_CREATE_SUBCATEGORY",
  SET_CREATE_SUBCATEGORY_SUCCEED:
    "dashboard/@HOSPICE/SET_CREATE_SUBCATEGORY_SUCCEED",
  SET_CREATE_SUBCATEGORY_FAILURE:
    "dashboard/@HOSPICE/SET_CREATE_SUBCATEGORY_FAILURE",
  RESET_CREATE_SUBCATEGORY_STATE:
    "dashboard/@HOSPICE/RESET_CREATE_SUBCATEGORY_STATE",

  ATTEMPT_TO_UPDATE_SUBCATEGORY:
    "dashboard/@HOSPICE/ATTEMPT_TO_UPDATE_SUBCATEGORY",
  SET_UPDATE_SUBCATEGORY_SUCCEED:
    "dashboard/@HOSPICE/SET_UPDATE_SUBCATEGORY_SUCCEED",
  SET_UPDATE_SUBCATEGORY_FAILURE:
    "dashboard/@HOSPICE/SET_UPDATE_SUBCATEGORY_FAILURE",
  RESET_UPDATE_SUBCATEGORY_STATE:
    "dashboard/@HOSPICE/RESET_UPDATE_SUBCATEGORY_STATE",

  ATTEMPT_TO_DELETE_SUBCATEGORY:
    "dashboard/@HOSPICE/ATTEMPT_TO_DELETE_SUBCATEGORY",
  SET_DELETE_SUBCATEGORY_SUCCEED:
    "dashboard/@HOSPICE/SET_DELETE_SUBCATEGORY_SUCCEED",
  SET_DELETE_SUBCATEGORY_FAILURE:
    "dashboard/@HOSPICE/SET_DELETE_SUBCATEGORY_FAILURE",
  RESET_DELETE_SUBCATEGORY_STATE:
    "dashboard/@HOSPICE/RESET_DELETE_SUBCATEGORY_STATE",
};
//FETCH SUBCATEGORY
export const attemptToFetchSubCategory = (data: Object): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.ATTEMPT_TO_FETCH_SUBCATEGORY,
  payload: data,
});
export const setFetchSubCategorySucceed = (payload: Object): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.SET_FETCH_SUBCATEGORY_SUCCEED,
  payload,
});

export const setFetchSubCategoryFailure = (payload: Object): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.SET_FETCH_SUBCATEGORY_FAILURE,
  payload,
});
export const resetFetchSubCategoryState = (): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.RESET_FETCH_SUBCATEGORY_STATE,
});

//CREATE SUBCATEGORY
export const attemptToCreateSubCategory = (data: Object): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.ATTEMPT_TO_CREATE_SUBCATEGORY,
  payload: data,
});
export const setCreateSubCategorySucceed = (payload: Object): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.SET_CREATE_SUBCATEGORY_SUCCEED,
  payload,
});

export const setCreateSubCategoryFailure = (payload: Object): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.SET_CREATE_SUBCATEGORY_FAILURE,
  payload,
});
export const resetCreateSubCategoryState = (): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.RESET_CREATE_SUBCATEGORY_STATE,
});

//UPDATE SUBCATEGORY
export const attemptToUpdateSubCategory = (data: Object): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.ATTEMPT_TO_UPDATE_SUBCATEGORY,
  payload: data,
});
export const setUpdateSubCategorySucceed = (payload: Object): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.SET_UPDATE_SUBCATEGORY_SUCCEED,
  payload,
});

export const setUpdateSubCategoryFailure = (payload: Object): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.SET_UPDATE_SUBCATEGORY_FAILURE,
  payload,
});
export const resetUpdateSubCategoryState = (): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.RESET_UPDATE_SUBCATEGORY_STATE,
});

//DELETE SUBCATEGORY
export const attemptToDeleteSubCategory = (data: Object): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.ATTEMPT_TO_DELETE_SUBCATEGORY,
  payload: data,
});
export const setDeleteSubCategorySucceed = (payload: Object): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.SET_DELETE_SUBCATEGORY_SUCCEED,
  payload,
});

export const setDeleteSubCategoryFailure = (payload: Object): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.SET_DELETE_SUBCATEGORY_FAILURE,
  payload,
});
export const resetDeleteSubCategoryState = (): BaseAction => ({
  type: SUBCATEGORY_ACTIONS.RESET_DELETE_SUBCATEGORY_STATE,
});
