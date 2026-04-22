// @flow
export const DME_INVOICE_ACTIONS = {
  ATTEMPT_TO_CREATE_DME_INVOICE: "dmeInvoice/@HOSPICE/ATTEMPT_TO_CREATE_DME_INVOICE",
  SET_CREATE_DME_INVOICE_SUCCEED: "dmeInvoice/@HOSPICE/SET_CREATE_DME_INVOICE_SUCCEED",
  SET_CREATE_DME_INVOICE_FAILURE: "dmeInvoice/@HOSPICE/SET_CREATE_DME_INVOICE_FAILURE",

  ATTEMPT_TO_FETCH_DME_INVOICE: "dmeInvoice/@HOSPICE/ATTEMPT_TO_FETCH_DME_INVOICE",
  SET_FETCH_DME_INVOICE_SUCCEED: "dmeInvoice/@HOSPICE/SET_FETCH_DME_INVOICE_SUCCEED",
  SET_FETCH_DME_INVOICE_FAILURE: "dmeInvoice/@HOSPICE/SET_FETCH_DME_INVOICE_FAILURE",
};

export const attemptToCreateDmeInvoice = (payload: any) => ({
  type: DME_INVOICE_ACTIONS.ATTEMPT_TO_CREATE_DME_INVOICE,
  payload,
});

export const setCreateDmeInvoiceSucceed = (payload: any) => ({
  type: DME_INVOICE_ACTIONS.SET_CREATE_DME_INVOICE_SUCCEED,
  payload,
});

export const setCreateDmeInvoiceFailure = (payload: any) => ({
  type: DME_INVOICE_ACTIONS.SET_CREATE_DME_INVOICE_FAILURE,
  payload,
});

export const attemptToFetchDmeInvoice = (payload: any) => ({
  type: DME_INVOICE_ACTIONS.ATTEMPT_TO_FETCH_DME_INVOICE,
  payload,
});

export const setFetchDmeInvoiceSucceed = (payload: any) => ({
  type: DME_INVOICE_ACTIONS.SET_FETCH_DME_INVOICE_SUCCEED,
  payload,
});

export const setFetchDmeInvoiceFailure = (payload: any) => ({
  type: DME_INVOICE_ACTIONS.SET_FETCH_DME_INVOICE_FAILURE,
  payload,
});
