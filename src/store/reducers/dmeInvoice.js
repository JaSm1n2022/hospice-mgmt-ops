import type { BaseAction } from "../types/Action";
import type { DmeInvoiceState } from "../types";
import { DME_INVOICE_ACTIONS } from "../actions/dmeInvoiceAction";
import { ACTION_STATUSES } from "../../utils/constants";

const initialState = (): DmeInvoiceState => ({
  dmeInvoiceList: {
    data: {},
    status: null,
    error: null,
  },
  dmeInvoiceCreate: {
    data: {},
    status: null,
    error: null,
  },
});

const ATTEMPT_TO_FETCH_DME_INVOICE = (state: DmeInvoiceState) => ({
  ...state,
  dmeInvoiceList: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_FETCH_DME_INVOICE_SUCCEED = (state: DmeInvoiceState, action: BaseAction) => ({
  ...state,
  dmeInvoiceList: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_FETCH_DME_INVOICE_FAILURE = (state: DmeInvoiceState) => ({
  ...state,
  dmeInvoiceList: {
    ...state.dmeInvoiceList,
    status: ACTION_STATUSES.FAILED,
  },
});

/*
Create
 */
const ATTEMPT_TO_CREATE_DME_INVOICE = (state: DmeInvoiceState) => ({
  ...state,
  dmeInvoiceCreate: {
    status: ACTION_STATUSES.PENDING,
    data: {},
    error: null,
  },
});

const SET_CREATE_DME_INVOICE_SUCCEED = (state: DmeInvoiceState, action: BaseAction) => ({
  ...state,
  dmeInvoiceCreate: {
    data: action.payload,
    status: ACTION_STATUSES.SUCCEED,
    error: null,
  },
});

const SET_CREATE_DME_INVOICE_FAILURE = (state: DmeInvoiceState) => ({
  ...state,
  dmeInvoiceCreate: {
    ...state.dmeInvoiceCreate,
    status: ACTION_STATUSES.FAILED,
  },
});

const reducer = (state: DmeInvoiceState = initialState(), action: BaseAction) => {
  switch (action.type) {
    case DME_INVOICE_ACTIONS.ATTEMPT_TO_FETCH_DME_INVOICE:
      return ATTEMPT_TO_FETCH_DME_INVOICE(state);
    case DME_INVOICE_ACTIONS.SET_FETCH_DME_INVOICE_SUCCEED:
      return SET_FETCH_DME_INVOICE_SUCCEED(state, action);
    case DME_INVOICE_ACTIONS.SET_FETCH_DME_INVOICE_FAILURE:
      return SET_FETCH_DME_INVOICE_FAILURE(state);

    case DME_INVOICE_ACTIONS.ATTEMPT_TO_CREATE_DME_INVOICE:
      return ATTEMPT_TO_CREATE_DME_INVOICE(state);
    case DME_INVOICE_ACTIONS.SET_CREATE_DME_INVOICE_SUCCEED:
      return SET_CREATE_DME_INVOICE_SUCCEED(state, action);
    case DME_INVOICE_ACTIONS.SET_CREATE_DME_INVOICE_FAILURE:
      return SET_CREATE_DME_INVOICE_FAILURE(state);
    default:
      return state;
  }
};

export default reducer;
