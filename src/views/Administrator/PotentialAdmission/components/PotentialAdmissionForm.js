import React, { useEffect, useState } from "react";
import CustomTextField from "components/TextField/CustomTextField";
import { Button, Card, CardContent, Grid, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CustomDatePicker from "components/Date/CustomDatePicker";
import CustomCheckbox from "components/Checkbox/CustomCheckbox";
import CustomSelect from "components/Select/CustomSelect";
import HeaderModal from "components/Modal/HeaderModal";
import moment from "moment";
import { connect } from "react-redux";
import { employeeListStateSelector } from "store/selectors/employeeSelector";
import { attemptToFetchEmployee } from "store/actions/employeeAction";
import { ACTION_STATUSES } from "utils/constants";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "60%",
    maxHeight: "90vh",
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[0],
    padding: theme.spacing(2, 4, 3),
  },
}));

function PotentialAdmissionForm(props) {
  console.log("=== PotentialAdmissionForm mounted ===");
  console.log("Props:", props);

  const classes = useStyles();
  const [generalForm, setGeneralForm] = useState({});
  const [modalStyle] = React.useState(getModalStyle);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [components, setComponents] = useState([]);
  const [nursePractitioners, setNursePractitioners] = useState([]);
  const [admissionNurses, setAdmissionNurses] = useState([]);
  const [medicalDirectors, setMedicalDirectors] = useState([]);
  const { isOpen } = props;

  // Generate patientCd from lastName, firstName, and current date/time
  // Format: lastname-{first}.{date}
  // NOTE: Does NOT use received_hp_dt - always uses current timestamp
  const generatePatientCd = (fName, lName) => {
    // Both first name and last name are required
    if (!fName || !lName) {
      return "";
    }

    // Convert to uppercase and always trim last 2 chars from lastName
    const lastNamePart = lName.toUpperCase().slice(0, -2);
    // Convert to uppercase and always trim last 2 chars from firstName
    const firstNamePart = fName.toUpperCase().slice(0, -2);

    // ALWAYS use current date/time with YYYYMMDDHHmm format
    const datePart = moment().format("YYYYMMDDHHmm");

    return `${lastNamePart}-${firstNamePart}.${datePart}`;
  };

  useEffect(() => {
    const fm = {};
    fm.current_hospice_benefits = 0;
    setGeneralForm(fm);
    initializeComponents();
  }, []);

  // Helper function to parse date strings correctly (avoid timezone shift)
  const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    // If it's a YYYY-MM-DD string, parse it in local timezone
    if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
      return new Date(year, month - 1, day);
    }
    return dateStr;
  };

  useEffect(() => {
    if (props.item) {
      const generalFm = { ...props.item };

      // Parse all date fields to avoid timezone shift
      const dateFields = [
        'eligibility_dt',
        'received_hp_dt',
        'emailed_hp_to_pre_admission_dt',
        'received_pre_admission_dt',
        'forwarded_pre_admission_dt',
        'eval_dt',
        'admission_dt'
      ];

      dateFields.forEach(field => {
        if (generalFm[field]) {
          generalFm[field] = parseDateString(generalFm[field]);
        }
      });

      setGeneralForm(generalFm);

      // Set firstName and lastName from patientCd when editing
      // PatientCd format: lastNameFirstName + timestamp
      // We need to extract the names if they exist in the item
      if (generalFm.patientCd) {
        // For edit mode, just use the patientCd as is
        // Users can manually edit if needed
      }

      // Initialize components first
      initializeComponents();

      // Then check if we need to disable current_hospice_benefits
      if (generalFm.hospice_status === "no_prior_hospice") {
        setComponents((prevComponents) => {
          const tempList = [...prevComponents];
          const benefitsField = tempList.find(
            (s) => s.name === "current_hospice_benefits"
          );
          if (benefitsField) {
            benefitsField.disabled = true;
          }
          return tempList;
        });
      }
    }
  }, [props.item]);

  // Fetch employees on mount
  useEffect(() => {
    console.log("=== Fetch Employee Check ===");
    console.log("Has props.context?", !!props.context);
    console.log("Has userProfile?", !!props.context?.userProfile);
    console.log("CompanyId value:", props.context?.userProfile?.companyId);
    console.log("Has fetchEmployees function?", typeof props.fetchEmployees);

    if (props.context?.userProfile?.companyId) {
      console.log(
        "YES - Fetching employees for companyId:",
        props.context.userProfile.companyId
      );
      props.fetchEmployees({ companyId: props.context.userProfile.companyId });
    } else {
      console.log("NO - Cannot fetch employees. Missing companyId or context");
    }
    console.log("=== End Fetch Employee Check ===");
  }, [props.context?.userProfile?.companyId]);

  // Filter employees when employee list changes
  useEffect(() => {
    console.log("=== Employee Filter Debug ===");
    console.log("props.employees:", props.employees);

    if (
      props.employees &&
      props.employees.status === ACTION_STATUSES.SUCCEED &&
      props.employees.data
    ) {
      const employeeList = props.employees.data;
      console.log("Total employees:", employeeList.length);
      console.log("=== FIRST EMPLOYEE - FULL OBJECT ===");

      if (employeeList && employeeList.length > 0) {
        const firstEmp = employeeList[0];
        console.log(
          "Keys in first employee:",
          Object.keys(firstEmp).join(", ")
        );

        // Log each property individually
        Object.keys(firstEmp).forEach((key) => {
          console.log(`  ${key}: ${firstEmp[key]}`);
        });

        console.log("=== SAMPLE EMPLOYEES ===");
        for (let i = 0; i < Math.min(3, employeeList.length); i++) {
          console.log(`--- Employee ${i + 1} ---`);
          const emp = employeeList[i];
          Object.keys(emp).forEach((key) => {
            console.log(`  ${key}: ${emp[key]}`);
          });
        }
      } else {
        console.log("ERROR: employeeList is empty or undefined");
      }
      console.log("=== END EMPLOYEE DETAILS ===");

      // Filter Nurse Practitioners (check both position and title for "NP" or "Nurse Practitioner")
      const npList = employeeList
        .filter((emp) => {
          const position = emp.position || "";
          const title = emp.title || "";
          const isMatch =
            (position === "Nurse Practitioner" ||
              position === "NP" ||
              title === "Nurse Practitioner" ||
              title === "NP") &&
            emp.status === "Active";

          if (
            position.includes("Nurse") ||
            position.includes("NP") ||
            title.includes("Nurse") ||
            title.includes("NP")
          ) {
            console.log(
              "NP Check - Employee:",
              emp.name,
              "Position:",
              position,
              "Title:",
              title,
              "Status:",
              emp.status,
              "Match:",
              isMatch
            );
          }

          return isMatch;
        })
        .map((emp) => ({
          value: emp.name,
          name: emp.name,
        }));
      console.log("Filtered Nurse Practitioners:", npList.length, npList);

      // Filter Admission Nurses (check both position and title for Registered Nurse, Case Manager, DON)
      const nurseList = employeeList
        .filter((emp) => {
          const position = emp.position || "";
          const title = emp.title || "";
          const isMatch =
            (position === "Registered Nurse" ||
              position === "Case Manager" ||
              position === "DON" ||
              title === "Registered Nurse" ||
              title === "Case Manager" ||
              title === "DON") &&
            emp.status === "Active";

          if (
            position.includes("Nurse") ||
            position.includes("DON") ||
            position.includes("Case") ||
            title.includes("Nurse") ||
            title.includes("DON") ||
            title.includes("Case")
          ) {
            console.log(
              "Admission Nurse Check - Employee:",
              emp.name,
              "Position:",
              position,
              "Title:",
              title,
              "Status:",
              emp.status,
              "Match:",
              isMatch
            );
          }

          return isMatch;
        })
        .map((emp) => ({
          value: emp.name,
          name: emp.name,
        }));
      console.log("Filtered Admission Nurses:", nurseList.length, nurseList);

      // Filter Medical Directors (check both position and title for "Medical Director")
      const mdList = employeeList
        .filter((emp) => {
          const position = emp.position || "";
          const title = emp.title || "";
          const isMatch =
            (position === "Medical Director" ||
              title === "Medical Director") &&
            emp.status === "Active";

          if (
            position.includes("Medical") ||
            position.includes("Director") ||
            title.includes("Medical") ||
            title.includes("Director")
          ) {
            console.log(
              "Medical Director Check - Employee:",
              emp.name,
              "Position:",
              position,
              "Title:",
              title,
              "Status:",
              emp.status,
              "Match:",
              isMatch
            );
          }

          return isMatch;
        })
        .map((emp) => ({
          value: emp.name,
          name: emp.name,
        }));
      console.log("Filtered Medical Directors:", mdList.length, mdList);

      // Update state
      setNursePractitioners(npList);
      setAdmissionNurses(nurseList);
      setMedicalDirectors(mdList);

      // Update components directly with the new options
      setComponents((prevComponents) => {
        const updatedComponents = prevComponents.map((comp) => {
          if (comp.name === "eval_staff") {
            return { ...comp, options: npList };
          }
          if (comp.name === "admission_nurse") {
            return { ...comp, options: nurseList };
          }
          if (comp.name === "medical_director") {
            return { ...comp, options: mdList };
          }
          return comp;
        });
        return updatedComponents;
      });
    } else {
      console.log("Employee data not available or not successful");
      console.log("Status:", props.employees?.status);
    }
    console.log("=== End Employee Filter Debug ===");
  }, [props.employees]);

  // Update patientCd whenever firstName or lastName changes (auto-generate)
  // NOTE: Does NOT depend on received_hp_dt - always uses current timestamp
  // Auto-generates whenever both firstName and lastName are provided
  useEffect(() => {
    if (firstName && lastName) {
      const src = { ...generalForm };
      const autoGeneratedCode = generatePatientCd(firstName, lastName);
      src.patientCd = autoGeneratedCode;
      setGeneralForm(src);
    }
  }, [firstName, lastName]);

  const initializeComponents = () => {
    const formFields = [
      {
        id: "firstName",
        component: "textfield",
        placeholder: "First Name (for auto-generation)",
        label: "First Name (for auto-generation)",
        name: "firstName",
        cols: 4,
        isFormOnly: true,
      },
      {
        id: "lastName",
        component: "textfield",
        placeholder: "Last Name (for auto-generation)",
        label: "Last Name (for auto-generation)",
        name: "lastName",
        cols: 4,
        isFormOnly: true,
      },
      {
        id: "patientCd",
        component: "textfield",
        placeholder: "Patient Code *",
        label: "Patient Code *",
        name: "patientCd",
        cols: 4,
      },
      {
        id: "referral",
        component: "textfield",
        placeholder: "Referral",
        label: "Referral",
        name: "referral",
        cols: 4,
      },
      {
        id: "eligibility_dt",
        component: "datepicker",
        placeholder: "Eligibility Date",
        label: "Eligibility Date",
        name: "eligibility_dt",
        cols: 4,
        noDefault: true,
      },
      {
        id: "age",
        component: "textfield",
        placeholder: "Age",
        label: "Age",
        name: "age",
        type: "number",
        cols: 4,
      },
      {
        id: "current_location",
        component: "select",
        placeholder: "Select Current Location",
        name: "current_location",
        cols: 4,
        options: [
          { value: "Hospital", name: "Hospital" },
          { value: "Home", name: "Home" },
          { value: "Facility", name: "Facility" },
          { value: "Rehab", name: "Rehab" },
          { value: "Group Home", name: "Group Home" },
        ],
      },
      {
        id: "hospice_status",
        component: "select",
        placeholder: "Select Hospice Status",
        name: "hospice_status",
        cols: 4,
        options: [
          { value: "revoked", name: "Revoked" },
          { value: "discharge", name: "Discharge" },
          { value: "no_prior_hospice", name: "No Prior Hospice" },
        ],
      },
      {
        id: "current_hospice_benefits",
        component: "textfield",
        placeholder: "Current Hospice Benefits",
        label: "Current Hospice Benefits",
        name: "current_hospice_benefits",
        type: "number",
        cols: 4,
      },
      {
        id: "received_hp_dt",
        component: "datepicker",
        placeholder: "Received HP Date *",
        label: "Received HP Date *",
        name: "received_hp_dt",
        cols: 4,
        noDefault: true,
      },
      {
        id: "emailed_hp_to_pre_admission_dt",
        component: "datepicker",
        placeholder: "Emailed HP to Pre-Admission Date",
        label: "Emailed HP to Pre-Admission Date",
        name: "emailed_hp_to_pre_admission_dt",
        cols: 4,
        noDefault: true,
      },
      {
        id: "received_pre_admission_dt",
        component: "datepicker",
        placeholder: "Received Pre-Admission Date",
        label: "Received Pre-Admission Date",
        name: "received_pre_admission_dt",
        cols: 4,
        noDefault: true,
      },
      {
        id: "forwarded_pre_admission_dt",
        component: "datepicker",
        placeholder: "Forwarded Pre-Admission Date",
        label: "Forwarded Pre-Admission Date",
        name: "forwarded_pre_admission_dt",
        cols: 4,
        noDefault: true,
      },
      {
        id: "eval_dt",
        component: "datepicker",
        placeholder: "Evaluation Date",
        label: "Evaluation Date",
        name: "eval_dt",
        cols: 4,
        noDefault: true,
      },
      {
        id: "eval_staff",
        component: "select",
        placeholder: "Select Assigned NP",
        name: "eval_staff",
        cols: 4,
        options: nursePractitioners,
      },
      {
        id: "pre_admission_prognosis",
        component: "textarea",
        placeholder: "Pre-Admission Prognosis",
        label: "Pre-Admission Prognosis",
        name: "pre_admission_prognosis",
        cols: 12,
        multiline: true,
        rows: 3,
      },
      {
        id: "hp_prognosis",
        component: "textarea",
        placeholder: "HP Prognosis",
        label: "HP Prognosis",
        name: "hp_prognosis",
        cols: 12,
        multiline: true,
        rows: 3,
      },
      {
        id: "md_prognosis",
        component: "textarea",
        placeholder: "MD Prognosis",
        label: "MD Prognosis",
        name: "md_prognosis",
        cols: 12,
        multiline: true,
        rows: 3,
      },
      {
        id: "admission_cost",
        component: "textfield",
        placeholder: "Admission Cost",
        label: "Admission Cost",
        name: "admission_cost",
        type: "number",
        cols: 4,
      },
      {
        id: "admission_decision",
        component: "select",
        placeholder: "Select Admission Decision",
        name: "admission_decision",
        cols: 4,
        options: [
          { value: "Admit to Hospice", name: "Admit to Hospice" },
          { value: "Non-Admit", name: "Non-Admit" },
          {
            value: "Pending / Further Evaluation",
            name: "Pending / Further Evaluation",
          },
        ],
      },
      {
        id: "admission_dt",
        component: "datepicker",
        placeholder: "Admission Date (Required if Admit to Hospice)",
        label: "Admission Date (Required if Admit to Hospice)",
        name: "admission_dt",
        cols: 4,
        noDefault: true,
      },
      {
        id: "admission_nurse",
        component: "select",
        placeholder: "Select Admission Nurse",
        name: "admission_nurse",
        cols: 4,
        options: admissionNurses,
      },
      {
        id: "medical_director",
        component: "select",
        placeholder: "Select Medical Director",
        name: "medical_director",
        cols: 4,
        options: medicalDirectors,
      },
      {
        id: "comments",
        component: "textarea",
        placeholder: "Comments",
        label: "Comments",
        name: "comments",
        cols: 12,
        multiline: true,
        rows: 3,
      },
    ];
    setComponents(formFields);
  };

  const validateFormHandler = () => {
    const tempList = [...components];
    let isValid = true;

    // Validate required fields
    // In edit mode, firstName/lastName are optional if patientCd exists
    // In create mode, require either firstName/lastName OR patientCd
    if (props.mode !== "edit") {
      if (!firstName && !generalForm.patientCd) {
        isValid = false;
        const fnField = tempList.find((t) => t.name === "firstName");
        if (fnField) {
          fnField.isError = true;
          fnField.errorMsg = "First Name or Patient Code is required.";
        }
      }

      if (!lastName && !generalForm.patientCd) {
        isValid = false;
        const lnField = tempList.find((t) => t.name === "lastName");
        if (lnField) {
          lnField.isError = true;
          lnField.errorMsg = "Last Name or Patient Code is required.";
        }
      }
    }

    if (!generalForm.patientCd) {
      isValid = false;
      const patientCdField = tempList.find((t) => t.name === "patientCd");
      if (patientCdField) {
        patientCdField.isError = true;
        patientCdField.errorMsg = "Patient Code is required.";
      }
    }

    // If admission_decision is "Admit to Hospice", admission_dt is required
    if (
      generalForm.admission_decision === "Admit to Hospice" &&
      !generalForm.admission_dt
    ) {
      isValid = false;
      const admissionDtField = tempList.find((t) => t.name === "admission_dt");
      if (admissionDtField) {
        admissionDtField.isError = true;
        admissionDtField.errorMsg =
          "Admission Date is required when admitting to hospice.";
      }
    }

    if (!isValid) {
      setComponents(tempList);
    } else {
      props.createPotentialAdmissionHandler(generalForm, props.mode);
    }
  };

  const inputGeneralHandler = ({ target }, src) => {
    const source = { ...generalForm };
    source[target.name] = target.value;

    const tempList = [...components];
    const currentItem = tempList.find((s) => s.name === target.name);
    if (currentItem) {
      currentItem.isError = false;
      currentItem.errorMsg = "";
    }

    setGeneralForm(source);
    setComponents(tempList);
  };

  const inputFormOnlyHandler = ({ target }) => {
    const tempList = [...components];
    const currentItem = tempList.find((s) => s.name === target.name);
    if (currentItem) {
      currentItem.isError = false;
      currentItem.errorMsg = "";
    }

    if (target.name === "firstName") {
      setFirstName(target.value);
    } else if (target.name === "lastName") {
      setLastName(target.value);
    }

    setComponents(tempList);
  };

  const dateInputHandler = (value, name) => {
    const src = { ...generalForm };
    src[name] = value;
    setGeneralForm(src);

    const tempList = [...components];
    const currentItem = tempList.find((s) => s.name === name);
    if (currentItem) {
      currentItem.isError = false;
      currentItem.errorMsg = "";
    }
    setComponents(tempList);
  };

  const checkboxInputHandler = (event) => {
    const src = { ...generalForm };
    src[event.target.name] = event.target.checked;
    setGeneralForm(src);
  };

  const selectInputHandler = (event, source) => {
    const src = { ...generalForm };
    src[event.target.name] = event.target.value;

    const tempList = [...components];

    // Auto-set current_hospice_benefits to 0 when hospice_status is "no_prior_hospice"
    if (event.target.name === "hospice_status") {
      if (event.target.value === "no_prior_hospice") {
        src.current_hospice_benefits = 0;
        // Disable the current_hospice_benefits field
        const benefitsField = tempList.find(
          (s) => s.name === "current_hospice_benefits"
        );
        if (benefitsField) {
          benefitsField.disabled = true;
        }
      } else {
        // Enable the current_hospice_benefits field for other statuses
        const benefitsField = tempList.find(
          (s) => s.name === "current_hospice_benefits"
        );
        if (benefitsField) {
          benefitsField.disabled = false;
        }
      }
    }

    // Clear admission_dt error if admission_decision changes away from "Admit to Hospice"
    if (
      event.target.name === "admission_decision" &&
      event.target.value !== "Admit to Hospice"
    ) {
      const admissionDtField = tempList.find((s) => s.name === "admission_dt");
      if (admissionDtField) {
        admissionDtField.isError = false;
        admissionDtField.errorMsg = "";
      }
    }

    setGeneralForm(src);

    const currentItem = tempList.find((s) => s.name === event.target.name);
    if (currentItem) {
      currentItem.isError = false;
      currentItem.errorMsg = "";
    }
    setComponents(tempList);
  };

  const titleHandler = () => {
    if (props.mode === "view") {
      return "View Potential Admission";
    } else if (props.mode === "edit") {
      return "Edit Potential Admission";
    } else {
      return "Create Potential Admission";
    }
  };

  const clearModalHandler = () => {
    props.closeFormModalHandler();
  };

  const isSubmitButtonDisabled = () => {
    // Enable submit button if patient code is not empty
    return !generalForm.patientCd;
  };

  return (
    <Modal
      open={isOpen}
      onClose={clearModalHandler}
      aria-labelledby="potential-admission"
      aria-describedby="potential-admission-modal"
    >
      <div style={modalStyle} className={classes.paper}>
        <Card>
          <HeaderModal title={titleHandler()} onClose={clearModalHandler} />

          <CardContent>
            <Grid container spacing={2} direction="row">
              {components.map((item) => {
                return (
                  <Grid
                    item
                    key={item.id}
                    xs={item.cols ? item.cols : 3}
                    style={{ paddingBottom: 2 }}
                  >
                    {item.component === "textfield" ||
                    item.component === "textarea" ? (
                      <React.Fragment>
                        <CustomTextField
                          {...item}
                          value={
                            item.isFormOnly
                              ? item.name === "firstName"
                                ? firstName
                                : lastName
                              : item.name === "current_hospice_benefits"
                              ? generalForm[item.name] !== undefined &&
                                generalForm[item.name] !== null &&
                                generalForm[item.name] !== ""
                                ? generalForm[item.name]
                                : ""
                              : generalForm[item.name] || ""
                          }
                          onChange={
                            item.isFormOnly
                              ? inputFormOnlyHandler
                              : inputGeneralHandler
                          }
                          isError={item.isError}
                          errorMsg={item.errorMsg}
                        />
                        {item.isError && <br />}
                      </React.Fragment>
                    ) : item.component === "datepicker" ? (
                      <React.Fragment>
                        <CustomDatePicker
                          {...item}
                          value={generalForm[item.name] || null}
                          onChange={dateInputHandler}
                        />
                      </React.Fragment>
                    ) : item.component === "select" ? (
                      <React.Fragment>
                        <CustomSelect
                          {...item}
                          value={generalForm[item.name] || ""}
                          onChange={selectInputHandler}
                        />
                      </React.Fragment>
                    ) : item.component === "checkbox" ? (
                      <React.Fragment>
                        <CustomCheckbox
                          {...item}
                          isChecked={generalForm[item.name] || false}
                          onChange={checkboxInputHandler}
                        />
                      </React.Fragment>
                    ) : null}
                  </Grid>
                );
              })}
            </Grid>
            <div style={{ paddingTop: 10 }}>
              <Button
                disabled={isSubmitButtonDisabled()}
                variant="contained"
                color={isSubmitButtonDisabled() ? "default" : "primary"}
                onClick={() => validateFormHandler()}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
}

const mapStateToProps = (store) => ({
  employees: employeeListStateSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
  fetchEmployees: (data) => dispatch(attemptToFetchEmployee(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PotentialAdmissionForm);
