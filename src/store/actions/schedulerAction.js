export const FETCH_SCHEDULER_REQUESTING = "FETCH_SCHEDULER_REQUESTING";
export const FETCH_SCHEDULER_SUCCESS = "FETCH_SCHEDULER_SUCCESS";
export const FETCH_SCHEDULER_ERROR = "FETCH_SCHEDULER_ERROR";
export const RESET_FETCH_SCHEDULER_STATE = "RESET_FETCH_SCHEDULER_STATE";

export const CREATE_SCHEDULER_REQUESTING = "CREATE_SCHEDULER_REQUESTING";
export const CREATE_SCHEDULER_SUCCESS = "CREATE_SCHEDULER_SUCCESS";
export const CREATE_SCHEDULER_ERROR = "CREATE_SCHEDULER_ERROR";
export const RESET_CREATE_SCHEDULER_STATE = "RESET_CREATE_SCHEDULER_STATE";

export const UPDATE_SCHEDULER_REQUESTING = "UPDATE_SCHEDULER_REQUESTING";
export const UPDATE_SCHEDULER_SUCCESS = "UPDATE_SCHEDULER_SUCCESS";
export const UPDATE_SCHEDULER_ERROR = "UPDATE_SCHEDULER_ERROR";
export const RESET_UPDATE_SCHEDULER_STATE = "RESET_UPDATE_SCHEDULER_STATE";

export const DELETE_SCHEDULER_REQUESTING = "DELETE_SCHEDULER_REQUESTING";
export const DELETE_SCHEDULER_SUCCESS = "DELETE_SCHEDULER_SUCCESS";
export const DELETE_SCHEDULER_ERROR = "DELETE_SCHEDULER_ERROR";
export const RESET_DELETE_SCHEDULER_STATE = "RESET_DELETE_SCHEDULER_STATE";

// Fetch Scheduler
export const attemptToFetchScheduler = (data) => ({
  type: FETCH_SCHEDULER_REQUESTING,
  data,
});

export const fetchSchedulerSuccess = (data) => ({
  type: FETCH_SCHEDULER_SUCCESS,
  data,
});

export const fetchSchedulerError = (error) => ({
  type: FETCH_SCHEDULER_ERROR,
  error,
});

export const resetFetchSchedulerState = () => ({
  type: RESET_FETCH_SCHEDULER_STATE,
});

// Create Scheduler
export const attemptToCreateScheduler = (data) => ({
  type: CREATE_SCHEDULER_REQUESTING,
  data,
});

export const createSchedulerSuccess = (data) => ({
  type: CREATE_SCHEDULER_SUCCESS,
  data,
});

export const createSchedulerError = (error) => ({
  type: CREATE_SCHEDULER_ERROR,
  error,
});

export const resetCreateSchedulerState = () => ({
  type: RESET_CREATE_SCHEDULER_STATE,
});

// Update Scheduler
export const attemptToUpdateScheduler = (data) => ({
  type: UPDATE_SCHEDULER_REQUESTING,
  data,
});

export const updateSchedulerSuccess = (data) => ({
  type: UPDATE_SCHEDULER_SUCCESS,
  data,
});

export const updateSchedulerError = (error) => ({
  type: UPDATE_SCHEDULER_ERROR,
  error,
});

export const resetUpdateSchedulerState = () => ({
  type: RESET_UPDATE_SCHEDULER_STATE,
});

// Delete Scheduler
export const attemptToDeleteScheduler = (data) => ({
  type: DELETE_SCHEDULER_REQUESTING,
  data,
});

export const deleteSchedulerSuccess = (data) => ({
  type: DELETE_SCHEDULER_SUCCESS,
  data,
});

export const deleteSchedulerError = (error) => ({
  type: DELETE_SCHEDULER_ERROR,
  error,
});

export const resetDeleteSchedulerState = () => ({
  type: RESET_DELETE_SCHEDULER_STATE,
});
