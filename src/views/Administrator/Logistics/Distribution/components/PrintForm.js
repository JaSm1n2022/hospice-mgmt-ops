import HeaderModal from "components/Modal/HeaderModal";

import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import PrintComponent from "views/Administrator/Document/PrintComponent";
import { pdf } from "@react-pdf/renderer";
import PrintOrdersPdfDocument from "./PrintOrdersPdfDocument";
import Helper from "utils/helper";
import Button from "components/CustomButtons/Button";
import PrintIcon from "@material-ui/icons/Print";
import moment from "moment";

import styles from "./distribution.module.css";
function PrintForm(props) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const onClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    props.closePrintForm();
  };

  const generatePdf = async () => {
    setIsGenerating(true);
    try {
      // Prepare data for PDF
      const general = props.generalForm || {};
      const details = props.detailForm || [];

      // Map details to the format expected by PrintOrdersPdfDocument
      const selectedData = details.map((item, index) => ({
        productId: item.productId || item.product?.id,
        order_qty: item.orderQty || item.order_qty,
        comments: item.comments || "",
        unit_uom: item.unitUom || item.unit_uom,
        requestor: general.requestorName || general.requestor?.name || "",
        requestor_id: general.requestorId || general.requestor?.id,
        delivery_location: general.facility || "",
        patient_id: general.patientId || general.patient?.id,
      }));

      // Load logo
      let logoBase64 = null;
      try {
        const logoUrl =
          "https://acwocotrngkeaxtzdzfz.supabase.co/storage/v1/object/public/images/headerdoc.png";
        logoBase64 = await Helper.getImageBase64(logoUrl);
      } catch (logoError) {
        console.error("Failed to load logo:", logoError);
      }

      // Generate PDF
      const doc = (
        <PrintOrdersPdfDocument
          patientName={general.patientCd || general.patientName || ""}
          selectedData={selectedData}
          productList={props.productList || []}
          location={general.facility || ""}
          datePickup={moment().format("YYYY-MM-DD")}
          logoBase64={logoBase64}
          employeeList={props.employeeList || []}
        />
      );

      const asPdf = pdf(doc);
      const pdfBlob = await asPdf.toBlob();
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");

      onClose(); // Close modal after generating PDF
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ReactModal
      style={{
        overlay: {
          zIndex: 9999,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
        },
        content: {
          position: "absolute",
          top: "0",
          bottom: "0",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          right: "0",
          left: "0",
          overflow: "none",
          WebkitOverflowScrolling: "touch",
          border: "none",
          padding: "0px",
          background: "none",
        },
      }}
      isOpen={props.isOpen}
      ariaHideApp={false}
    >
      <div className={styles.printForm}>
        <HeaderModal
          title={"Print Supplies Delivery Record Form"}
          onClose={onClose}
        />
        <div className={styles.content}>
          <div style={{ paddingTop: 4, textAlign: "center" }}>
            <PrintComponent
              multiPatients={props.multiPatients}
              details={props.detailForm}
              general={props.generalForm}
            />

            {/* New PDF Generation Button */}
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <Button
                onClick={generatePdf}
                color="primary"
                variant="contained"
                startIcon={<PrintIcon />}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating PDF..." : "Generate PDF with Logo"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}

export default PrintForm;
