import { createSelector } from 'reselect';

const getDmeInvoiceReducer = (state) => state.dmeInvoice;

export const dmeInvoiceListStateSelector = createSelector(
  getDmeInvoiceReducer, data => data.dmeInvoiceList
);

export const dmeInvoiceCreateStateSelector = createSelector(
  getDmeInvoiceReducer, data => data.dmeInvoiceCreate
);
