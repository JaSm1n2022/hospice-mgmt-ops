export const PHARMACY_INVOICE_ACTIONS = {
  ATTEMPT_TO_FETCH_PHARMACY_INVOICE: 'dashboard/@HOSPICE/ATTEMPT_TO_FETCH_PHARMACY_INVOICE',
  SET_FETCH_PHARMACY_INVOICE_SUCCEED: 'dashboard/@HOSPICE/SET_FETCH_PHARMACY_INVOICE_SUCCEED',
  SET_FETCH_PHARMACY_INVOICE_FAILURE: 'dashboard/@HOSPICE/SET_FETCH_PHARMACY_INVOICE_FAILURE',
  RESET_FETCH_PHARMACY_INVOICE_STATE: 'dashboard/@HOSPICE/RESET_FETCH_PHARMACY_INVOICE_STATE',

  ATTEMPT_TO_CREATE_PHARMACY_INVOICE: 'dashboard/@HOSPICE/ATTEMPT_TO_CREATE_PHARMACY_INVOICE',
  SET_CREATE_PHARMACY_INVOICE_SUCCEED: 'dashboard/@HOSPICE/SET_CREATE_PHARMACY_INVOICE_SUCCEED',
  SET_CREATE_PHARMACY_INVOICE_FAILURE: 'dashboard/@HOSPICE/SET_CREATE_PHARMACY_INVOICE_FAILURE',
  RESET_CREATE_PHARMACY_INVOICE_STATE: 'dashboard/@HOSPICE/RESET_CREATE_PHARMACY_INVOICE_STATE',

  ATTEMPT_TO_DELETE_PHARMACY_INVOICE: 'dashboard/@HOSPICE/ATTEMPT_TO_DELETE_PHARMACY_INVOICE',
  SET_DELETE_PHARMACY_INVOICE_SUCCEED: 'dashboard/@HOSPICE/SET_DELETE_PHARMACY_INVOICE_SUCCEED',
  SET_DELETE_PHARMACY_INVOICE_FAILURE: 'dashboard/@HOSPICE/SET_DELETE_PHARMACY_INVOICE_FAILURE',
  RESET_DELETE_PHARMACY_INVOICE_STATE: 'dashboard/@HOSPICE/RESET_DELETE_PHARMACY_INVOICE_STATE'
};

// FETCH Pharmacy Invoice
export const attemptToFetchPharmacyInvoice = (data: Object): BaseAction => ({
  type: PHARMACY_INVOICE_ACTIONS.ATTEMPT_TO_FETCH_PHARMACY_INVOICE,
  payload: data
});

export const setFetchPharmacyInvoiceSucceed = (payload: Object): BaseAction => ({
  type: PHARMACY_INVOICE_ACTIONS.SET_FETCH_PHARMACY_INVOICE_SUCCEED,
  payload
});

export const setFetchPharmacyInvoiceFailure = (payload: Object): BaseAction => ({
  type: PHARMACY_INVOICE_ACTIONS.SET_FETCH_PHARMACY_INVOICE_FAILURE,
  payload
});

export const resetFetchPharmacyInvoiceState = (): BaseAction => ({
  type: PHARMACY_INVOICE_ACTIONS.RESET_FETCH_PHARMACY_INVOICE_STATE
});

// CREATE Pharmacy Invoice
export const attemptToCreatePharmacyInvoice = (data: Object): BaseAction => ({
  type: PHARMACY_INVOICE_ACTIONS.ATTEMPT_TO_CREATE_PHARMACY_INVOICE,
  payload: data
});

export const setCreatePharmacyInvoiceSucceed = (payload: Object): BaseAction => ({
  type: PHARMACY_INVOICE_ACTIONS.SET_CREATE_PHARMACY_INVOICE_SUCCEED,
  payload
});

export const setCreatePharmacyInvoiceFailure = (payload: Object): BaseAction => ({
  type: PHARMACY_INVOICE_ACTIONS.SET_CREATE_PHARMACY_INVOICE_FAILURE,
  payload
});

export const resetCreatePharmacyInvoiceState = (): BaseAction => ({
  type: PHARMACY_INVOICE_ACTIONS.RESET_CREATE_PHARMACY_INVOICE_STATE
});

// DELETE Pharmacy Invoice
export const attemptToDeletePharmacyInvoice = (data: Object): BaseAction => ({
  type: PHARMACY_INVOICE_ACTIONS.ATTEMPT_TO_DELETE_PHARMACY_INVOICE,
  payload: data
});

export const setDeletePharmacyInvoiceSucceed = (payload: Object): BaseAction => ({
  type: PHARMACY_INVOICE_ACTIONS.SET_DELETE_PHARMACY_INVOICE_SUCCEED,
  payload
});

export const setDeletePharmacyInvoiceFailure = (payload: Object): BaseAction => ({
  type: PHARMACY_INVOICE_ACTIONS.SET_DELETE_PHARMACY_INVOICE_FAILURE,
  payload
});

export const resetDeletePharmacyInvoiceState = (): BaseAction => ({
  type: PHARMACY_INVOICE_ACTIONS.RESET_DELETE_PHARMACY_INVOICE_STATE
});
