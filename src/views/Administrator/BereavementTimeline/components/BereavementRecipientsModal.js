import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Box,
} from "@material-ui/core";
import { Print as PrintIcon, CloudUpload as CloudUploadIcon } from "@material-ui/icons";
import { pdf } from "@react-pdf/renderer";
import moment from "moment";
import BereavementRecipientsDocument from "./BereavementRecipientsDocument";
import UploadBereavementAdditionalInfoModal from "./UploadBereavementAdditionalInfoModal";

const formatDate = (date) => (date ? moment(date).format("MM/DD/YYYY") : "N/A");

function BereavementRecipientsModal({ isOpen, onClose, recipients, startDate, endDate }) {
  const [ccn, setCcn] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [additionalInfoMap, setAdditionalInfoMap] = useState({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const rows = recipients || [];
  const mergedRows = rows.map((row) => ({
    ...row,
    ...(additionalInfoMap[row.id] || {}),
  }));

  const handleImportAdditionalInfo = (importedRows) => {
    setAdditionalInfoMap((prev) => {
      const next = { ...prev };
      (importedRows || []).forEach((info) => {
        next[info.patientId] = {
          ...(next[info.patientId] || {}),
          bereavementRecipientName: info.bereavementRecipientName,
          bereavementRecipientRelationship: info.bereavementRecipientRelationship,
        };
      });
      return next;
    });
    setIsUploadModalOpen(false);
  };

  const handlePrint = async () => {
    try {
      const doc = (
        <BereavementRecipientsDocument
          recipients={mergedRows}
          startDate={startDate}
          endDate={endDate}
          ccn={ccn}
          preparedBy={preparedBy}
        />
      );
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>Bereavement Recipients</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Patients who received a bereavement letter (Month 0 - Month 12)
              between {formatDate(startDate)} and {formatDate(endDate)}.
            </Typography>
          </Box>

          <Box display="flex" style={{ gap: 15 }} mb={2}>
            <TextField
              label="Medicare Provider No. (CCN)"
              placeholder="e.g. 29XXXX"
              value={ccn}
              onChange={(e) => setCcn(e.target.value)}
              fullWidth
            />
            <TextField
              label="Prepared By"
              placeholder="Preparer name"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              fullWidth
            />
          </Box>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Patient Code</TableCell>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Bereavement Recipient</TableCell>
                  <TableCell>Relationship</TableCell>
                  <TableCell>Last Letter Date</TableCell>
                  <TableCell>Date of Death</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mergedRows.length > 0 ? (
                  mergedRows.map((row, idx) => (
                    <TableRow key={row.id || idx} hover>
                      <TableCell>{row.patientCd}</TableCell>
                      <TableCell>{row.patientName}</TableCell>
                      <TableCell>{row.bereavementRecipientName || "-"}</TableCell>
                      <TableCell>
                        {row.bereavementRecipientRelationship || "-"}
                      </TableCell>
                      <TableCell>{formatDate(row.lastLetterDate)}</TableCell>
                      <TableCell>{formatDate(row.dateOfDeath)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No bereavement recipients found for the selected date
                      range.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="default">
            Close
          </Button>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            color="default"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Add Additional Information
          </Button>
          <Button
            onClick={handlePrint}
            color="primary"
            variant="contained"
            startIcon={<PrintIcon />}
            disabled={mergedRows.length === 0}
          >
            Print PDF
          </Button>
        </DialogActions>
      </Dialog>

      <UploadBereavementAdditionalInfoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        patientOptions={rows}
        onImport={handleImportAdditionalInfo}
      />
    </>
  );
}

export default BereavementRecipientsModal;
