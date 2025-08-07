// @flow

export type BaseAction = {
  type: string,
  payload: ?any,
};
export type LocationState = {
  locationList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  locationUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  locationDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  locationCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type InvoiceState = {
  invoiceList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  invoiceUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  invoiceDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  invoiceCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};
export type ProductState = {
  productList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  productUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  productDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  productCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type EmployeeState = {
  employeeList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  employeeUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  employeeDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  employeeCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type CategoryState = {
  categoryList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  categoryUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  categoryDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  categoryCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};
export type SubCategoryState = {
  subCategoryList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  subCategoryUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  subCategoryDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  subCategoryCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};
export type VendorState = {
  vendorList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  vendorUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  vendorDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  vendorCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type TemplateState = {
  templateList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  templateUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  templateDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  templateCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type PatientState = {
  patientList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  patientUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  patientDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  patientCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type AssignmentState = {
  assignmentList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  assignmentUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  assignmentDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  assignmentCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type AdmittanceState = {
  admittanceList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  admittanceUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  admittanceDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  admittanceCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type EquipmentState = {
  equipmentList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  equipmentUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  equipmentDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  equipmentCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type DmeState = {
  dmeList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  dmeUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  dmeDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  dmeCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};
export type RoutesheetState = {
  routesheetList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  routesheetUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  routesheetDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  routesheetCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};
export type KeyState = {
  keyList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  keyUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  keyDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  keyCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type TransportationState = {
  transportationList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  transportationUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  transportationDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  transportationCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type CallsState = {
  callsList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  callsUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  callsDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  callsCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type TasksState = {
  tasksList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  tasksUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  tasksDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  tasksCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type ThresholdState = {
  thresholdList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  thresholdUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  thresholdDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  thresholdCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};
export type StockState = {
  stockList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  stockUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  stockDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  stockCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type TransactionState = {
  transactionList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  transactionUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  transactionDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  transactionCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type DistributionState = {
  distributionList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  distributionUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  distributionDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  distributionCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type ContractState = {
  contractList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  contractUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  contractDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  contractCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type PayrollState = {
  payrollList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  payrollUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  payrollDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  payrollCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};
export type TrainingState = {
  trainingList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  trainingUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  trainingDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  trainingCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type CertificateState = {
  certificateList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  certificateUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  certificateDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  certificateCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type PaydayState = {
  paydayList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  paydayUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  paydayDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  paydayCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type OrderState = {
  orderList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  orderUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  orderDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  orderCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type MediaUploadState = {
  error: ?string,
  status: ?string,
  s3_url: ?string,
};
export type MediaUserPhotoState = {
  error: ?string,
  status: ?string,
  userPhoto_url: ?string,
};

export type MediaExcelState = {
  excel: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};
export type MediaPdfState = {
  pdf: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type ProofState = {
  proofList: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  proofUpdate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },

  proofDelete: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
  proofCreate: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};

export type OverheadState = {
  overhead: {
    data: ?Object,
    error: ?string,
    status: ?string,
  },
};
