export const patientChecklistListStateSelector = (store) =>
  store.patientChecklist.patientChecklistList;

export const patientChecklistCreateStateSelector = (store) =>
  store.patientChecklist.patientChecklistCreate;

export const patientChecklistUpdateStateSelector = (store) =>
  store.patientChecklist.patientChecklistUpdate;

export const patientChecklistDeleteStateSelector = (store) =>
  store.patientChecklist.patientChecklistDelete;
