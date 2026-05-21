import { createSelector } from 'reselect';

const getPharmacyInvoiceReducer = (state) => state.pharmacyInvoice;

export const pharmacyInvoiceListStateSelector = createSelector(
  getPharmacyInvoiceReducer, data => data.pharmacyInvoiceList
);

export const pharmacyInvoiceCreateStateSelector = createSelector(
  getPharmacyInvoiceReducer, data => data.pharmacyInvoiceCreate
);

export const pharmacyInvoiceDeleteStateSelector = createSelector(
  getPharmacyInvoiceReducer, data => data.pharmacyInvoiceDelete
);
