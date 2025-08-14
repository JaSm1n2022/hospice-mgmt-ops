import { Button } from "@material-ui/core";
import React, { useRef } from "react";

import ReactToPrint from "react-to-print";
import CardHistoryReport from "./CardContainer/CardHistoryReport";
import CardMarketingTransaction from "./CardContainer/CardMarketingTransaction";
import CardMedicalTransaction from "./CardContainer/CardMedicalTransaction";
import CardOfficeTransaction from "./CardContainer/CardOfficeTransaction";
import CardPayrollTransaction from "./CardContainer/CardPayrollTransaction";
import CardServicesTransaction from "./CardContainer/CardServicesTransaction";
import CardUtilitiesTransaction from "./CardContainer/CardUtilitiesTransaction";
import ClientExpensesReport from "./ClientContainer/ClientExpensesReport";
import ClientFullExpensesReport from "./ClientContainer/ClientFullExpensesReport";

//import ClientExpensesReport from "./ClientExpensesReport";
//import SupplyExpensesReport from "./SupplyExpensesReport";

export default function PrintReport(props) {
  let componentRef = useRef();
  console.log("[PRINT REPORT]", props);
  return (
    <>
      <div style={{ paddingTop: 10 }}>
        {/* button to trigger printing of target component */}

        <ReactToPrint
          trigger={() => (
            <Button
              variant="contained"
              color="primary"
              style={{
                display:
                  props.patientDashboard && props.patientDashboard.length
                    ? ""
                    : "none",
              }}
            >
              Print/Download Report
            </Button>
          )}
          content={() => componentRef}
        />

        {/* component to be printed */}
        {props.source === "clientExpensesReport" ? (
          <div style={{ paddingTop: 80, overflow: "auto", width: "1000px" }}>
            <ClientExpensesReport
              ref={(el) => (componentRef = el)}
              clientExpensesAmt={props.clientExpensesAmt}
              patientDashboard={props.patientDashboard}
              numberActive={props.numberActive}
              numberInactive={props.numberInactive}
              dateFrom={props.dateFrom}
              dateTo={props.dateTo}
            />
          </div>
        ) : props.source === "clientFullExpensesReport" ? (
          <div style={{ paddingTop: 80 }}>
            <ClientFullExpensesReport
              style={{ paddingTop: 80, overflow: "auto", width: "1000px" }}
              ref={(el) => (componentRef = el)}
              clientExpensesAmt={props.clientExpensesAmt}
              patientDashboard={props.patientDashboard}
              numberActive={props.numberActive}
              numberInactive={props.numberInactive}
              dateFrom={props.dateFrom}
              dateTo={props.dateTo}
            />
          </div>
        ) : props.source === "cardHistoryReport" ? (
          <CardHistoryReport
            ref={(el) => (componentRef = el)}
            details={props.details}
            grandTotal={props.grandTotal}
            dateFrom={props.dateFrom}
            dateTo={props.dateTo}
          />
        ) : props.source === "payrollHistoryReport" ? (
          <CardPayrollTransaction
            ref={(el) => (componentRef = el)}
            details={props.details}
            grandTotal={props.grandTotal}
            dateFrom={props.dateFrom}
            dateTo={props.dateTo}
          />
        ) : props.source === "utilitiesHistoryReport" ? (
          <CardUtilitiesTransaction
            ref={(el) => (componentRef = el)}
            details={props.details}
            grandTotal={props.grandTotal}
            dateFrom={props.dateFrom}
            dateTo={props.dateTo}
          />
        ) : props.source === "servicesHistoryReport" ? (
          <CardServicesTransaction
            ref={(el) => (componentRef = el)}
            details={props.details}
            grandTotal={props.grandTotal}
            dateFrom={props.dateFrom}
            dateTo={props.dateTo}
          />
        ) : props.source === "officeHistoryReport" ? (
          <CardOfficeTransaction
            ref={(el) => (componentRef = el)}
            details={props.details}
            grandTotal={props.grandTotal}
            dateFrom={props.dateFrom}
            dateTo={props.dateTo}
          />
        ) : props.source === "marketingHistoryReport" ? (
          <CardMarketingTransaction
            ref={(el) => (componentRef = el)}
            details={props.details}
            grandTotal={props.grandTotal}
            dateFrom={props.dateFrom}
            dateTo={props.dateTo}
          />
        ) : props.source === "medicalHistoryReport" ? (
          <CardMedicalTransaction
            ref={(el) => (componentRef = el)}
            details={props.details}
            grandTotal={props.grandTotal}
            dateFrom={props.dateFrom}
            dateTo={props.dateTo}
          />
        ) : null}
      </div>
    </>
  );
}
