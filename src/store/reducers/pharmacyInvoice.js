import { PHARMACY_INVOICE_ACTIONS } from '../actions/pharmacyInvoiceAction';

const initialState = {
  pharmacyInvoiceList: {
    data: {},
    status: null,
    error: null
  },
  pharmacyInvoiceCreate: {
    data: {},
    status: null,
    error: null
  },
  pharmacyInvoiceDelete: {
    data: {},
    status: null,
    error: null
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    // FETCH Pharmacy Invoice
    case PHARMACY_INVOICE_ACTIONS.ATTEMPT_TO_FETCH_PHARMACY_INVOICE:
      return {
        ...state,
        pharmacyInvoiceList: {
          ...state.pharmacyInvoiceList,
          status: 'Pending',
          error: null
        }
      };
    case PHARMACY_INVOICE_ACTIONS.SET_FETCH_PHARMACY_INVOICE_SUCCEED:
      return {
        ...state,
        pharmacyInvoiceList: {
          data: action.payload,
          status: 'SUCCEED',
          error: null
        }
      };
    case PHARMACY_INVOICE_ACTIONS.SET_FETCH_PHARMACY_INVOICE_FAILURE:
      return {
        ...state,
        pharmacyInvoiceList: {
          ...state.pharmacyInvoiceList,
          status: 'FAILED',
          error: action.payload
        }
      };
    case PHARMACY_INVOICE_ACTIONS.RESET_FETCH_PHARMACY_INVOICE_STATE:
      return {
        ...state,
        pharmacyInvoiceList: initialState.pharmacyInvoiceList
      };

    // CREATE Pharmacy Invoice
    case PHARMACY_INVOICE_ACTIONS.ATTEMPT_TO_CREATE_PHARMACY_INVOICE:
      return {
        ...state,
        pharmacyInvoiceCreate: {
          ...state.pharmacyInvoiceCreate,
          status: 'Pending',
          error: null
        }
      };
    case PHARMACY_INVOICE_ACTIONS.SET_CREATE_PHARMACY_INVOICE_SUCCEED:
      return {
        ...state,
        pharmacyInvoiceCreate: {
          data: action.payload,
          status: 'SUCCEED',
          error: null
        }
      };
    case PHARMACY_INVOICE_ACTIONS.SET_CREATE_PHARMACY_INVOICE_FAILURE:
      return {
        ...state,
        pharmacyInvoiceCreate: {
          ...state.pharmacyInvoiceCreate,
          status: 'FAILED',
          error: action.payload
        }
      };
    case PHARMACY_INVOICE_ACTIONS.RESET_CREATE_PHARMACY_INVOICE_STATE:
      return {
        ...state,
        pharmacyInvoiceCreate: initialState.pharmacyInvoiceCreate
      };

    // DELETE Pharmacy Invoice
    case PHARMACY_INVOICE_ACTIONS.ATTEMPT_TO_DELETE_PHARMACY_INVOICE:
      return {
        ...state,
        pharmacyInvoiceDelete: {
          ...state.pharmacyInvoiceDelete,
          status: 'Pending',
          error: null
        }
      };
    case PHARMACY_INVOICE_ACTIONS.SET_DELETE_PHARMACY_INVOICE_SUCCEED:
      return {
        ...state,
        pharmacyInvoiceDelete: {
          data: action.payload,
          status: 'SUCCEED',
          error: null
        }
      };
    case PHARMACY_INVOICE_ACTIONS.SET_DELETE_PHARMACY_INVOICE_FAILURE:
      return {
        ...state,
        pharmacyInvoiceDelete: {
          ...state.pharmacyInvoiceDelete,
          status: 'FAILED',
          error: action.payload
        }
      };
    case PHARMACY_INVOICE_ACTIONS.RESET_DELETE_PHARMACY_INVOICE_STATE:
      return {
        ...state,
        pharmacyInvoiceDelete: initialState.pharmacyInvoiceDelete
      };

    default:
      return state;
  }
};
