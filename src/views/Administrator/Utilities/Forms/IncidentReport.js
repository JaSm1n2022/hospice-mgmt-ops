import { Divider, Grid, Typography } from "@material-ui/core";
import CustomCheckbox from "components/Checkbox/CustomCheckbox";

const IncidentReport = () => {
  return (
    <div style={{ width: 800 }}>
      <Grid item xs={4}>
        <div style={{ display: "inline-flex", gap: 20 }}>
          <CustomCheckbox label="Client" />
          <CustomCheckbox label="Staff" />
        </div>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <div style={{ display: "inline-flex", gap: 2 }}>
            <Typography variant="h6">
              Name:_____________________________________________
            </Typography>
            <Typography variant="h6">MR #:_________________________</Typography>
          </div>
        </Grid>

        <Grid item xs={12}>
          <div style={{ display: "inline-flex", gap: 2 }}>
            <Typography variant="h6">
              Date of Birth:____________________________________
            </Typography>
            <Typography variant="h6">Sex:__________________________</Typography>
          </div>
        </Grid>
      </Grid>

      <Grid container direction="row">
        <Grid item xs={6}>
          <div>
            <CustomCheckbox label="Property Loss/Breakage/Missing/Damaged" />
          </div>

          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Patient Employee" />
          </div>

          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Employee" />
          </div>

          <div>
            <CustomCheckbox label="Endangerment" />
          </div>

          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Building Security" />
          </div>

          <div>
            <CustomCheckbox label="Refusal Treatment" />
          </div>

          <div>
            <CustomCheckbox label="Problem" />
          </div>

          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Procedure of protocol error" />
          </div>

          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Untoward Reaction to treatment/procedure" />
          </div>

          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Untanticipated Outcome" />
          </div>

          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Suspected Infection/Surgical Complications" />
          </div>

          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Consent not obtained" />
          </div>

          <div style={{ paddingLeft: 0 }}>
            <CustomCheckbox label="Hospital Admission" />
          </div>

          <div style={{ paddingLeft: 0 }}>
            <CustomCheckbox label="Falls" />
          </div>
          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Attended" />
          </div>
          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Unattended" />
          </div>
          <div style={{ paddingLeft: 0 }}>
            <CustomCheckbox label="Cardiopulomary Arrest" />
          </div>
          <div style={{ paddingLeft: 0 }}>
            <CustomCheckbox label="Pharmacy Error" />
          </div>
          <div style={{ paddingLeft: 0 }}>
            <CustomCheckbox label="Other:_____________________________________" />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <CustomCheckbox label="Physician Unresponsiveness" />
          </div>
          <div style={{ paddingLeft: 0 }}>
            <CustomCheckbox label="Neglect" />
          </div>
          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Self" />
          </div>
          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Others:____________________" />
          </div>
          <div style={{ paddingLeft: 0 }}>
            <CustomCheckbox label="Abuse" />
          </div>
          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="By Staff to patient" />
          </div>
          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="By Patient to Employee" />
          </div>
          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Others:___________________" />
          </div>
          <div style={{ paddingLeft: 0 }}>
            <CustomCheckbox label="Medication Error" />
          </div>
          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="By Patient/Caregiver/Family" />
          </div>
          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="By Staff" />
          </div>
          <div style={{ paddingLeft: 30 }}>
            <CustomCheckbox label="Staffing Difficulties for IM/IV" />
          </div>
          <div style={{ paddingLeft: 0 }}>
            <div style={{ display: "inline-flex", gap: 2 }}>
              <CustomCheckbox label="Improper Hospital Discharge/AMA" />
              <CustomCheckbox />
            </div>
          </div>
          <div style={{ paddingLeft: 0 }}>
            <CustomCheckbox label="Medical Device/Equipment Error" />
            <div style={{ paddingLeft: 0 }}>
              <CustomCheckbox label="Injury" />
            </div>
            <div style={{ paddingLeft: 30 }}>
              <CustomCheckbox label="Client" />
            </div>
            <div style={{ paddingLeft: 30 }}>
              <CustomCheckbox label="Staff" />
            </div>
            <div style={{ paddingLeft: 0 }}>
              <CustomCheckbox label="Laboratory Error" />
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Typography style={{ fontSize: 11 }}>
            Describe the event, effects, outcome and any potential risk issue,
            and interventions performed
          </Typography>
          <div>
            <Typography style={{ fontSize: 11 }}>
              ______________________________________________________________________________________________________________________________________
            </Typography>
          </div>
          <div>
            <Typography style={{ fontSize: 11 }}>
              ______________________________________________________________________________________________________________________________________
            </Typography>
          </div>
          <div>
            <Typography style={{ fontSize: 11 }}>
              ______________________________________________________________________________________________________________________________________
            </Typography>
          </div>
          <div>
            <Typography style={{ fontSize: 11 }}>
              ______________________________________________________________________________________________________________________________________
            </Typography>
          </div>
          <div>
            <Typography style={{ fontSize: 11 }}>
              ______________________________________________________________________________________________________________________________________
            </Typography>
          </div>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <div style={{ display: "inline-flex", gap: 20 }}>
            <CustomCheckbox />{" "}
            <Typography style={{ fontSize: "11pt" }}>
              No Apparent injury report
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ fontSize: "11pt" }}>
            For Falls Drugs taken by patient within eight(8) hours before the
            incident:_______________________________________
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <div style={{ display: "inline-flex", gap: 8 }}>
            <Typography style={{ fontSize: "11pt" }}>
              Witnesses:_______________________________
            </Typography>
            <CustomCheckbox label="Family/Caregiver" />
            <CustomCheckbox label="Staff" />
            <CustomCheckbox label="Others:___________________" />
          </div>
        </Grid>
      </Grid>
      <Grid container>
        <Divider
          variant="fullWidth"
          style={{
            height: ".03em",
            border: "solid 1px rgba(0, 0, 0, 0.12)",
          }}
          orientation="horizontal"
          flexItem
        />
      </Grid>
      <Grid container direction="row" spacing={0}>
        <div style={{ display: "inline-flex", gap: 0 }}>
          <div style={{ width: "100px" }}>
            <Typography style={{ fontSize: 11 }}>Date of Incident:</Typography>
          </div>
          <div style={{ width: "300px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>
          <div style={{ width: "40px" }}>
            <Typography style={{ fontSize: 11 }}>Time:</Typography>
          </div>
          <div style={{ width: "100px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>
        </div>
        <div style={{ display: "inline-flex", gap: 0 }}>
          <div style={{ width: "140px" }}>
            <Typography style={{ fontSize: 11 }}>
              Incident Reported on Date:
            </Typography>
          </div>
          <div style={{ width: "260px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>
          <div style={{ width: "40px" }}>
            <Typography style={{ fontSize: 11 }}>Time:</Typography>
          </div>
          <div style={{ width: "100px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>
        </div>
        <div style={{ display: "inline-flex", gap: 0 }}>
          <div style={{ width: "240px" }}>
            <Typography style={{ fontSize: 11 }}>
              Incident Reported to Responsible Party (name):
            </Typography>
          </div>
          <div style={{ width: "160px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>

          <div style={{ width: "40px" }}>
            <Typography style={{ fontSize: 11 }}>Date:</Typography>
          </div>

          <div style={{ width: "100px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>

          <div style={{ width: "40px" }}>
            <Typography style={{ fontSize: 11 }}>Time:</Typography>
          </div>

          <div style={{ width: "60px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>
        </div>
        <div style={{ display: "inline-flex", gap: 0 }}>
          <div style={{ width: "180px" }}>
            <Typography style={{ fontSize: 11 }}>
              Reported to Physician (MD name):
            </Typography>
          </div>
          <div style={{ width: "220px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>

          <div style={{ width: "40px" }}>
            <Typography style={{ fontSize: 11 }}>Date:</Typography>
          </div>

          <div style={{ width: "100px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>

          <div style={{ width: "40px" }}>
            <Typography style={{ fontSize: 11 }}>Time:</Typography>
          </div>

          <div style={{ width: "60px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>
        </div>
      </Grid>
      <Grid container>
        <div style={{ paddingTop: 24 }} />
      </Grid>
      <Grid container direction="row" spacing={0}>
        <div style={{ display: "inline-flex", gap: 0 }}>
          <div style={{ width: "140px" }}>
            <Typography style={{ fontSize: 11 }}>
              Corrective Plan of Action
            </Typography>
          </div>
          <div style={{ width: "600px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>
        </div>
      </Grid>
      <Grid container>
        <div style={{ paddingTop: 24 }} />
      </Grid>
      <Grid container direction="row" spacing={0}>
        <div style={{ display: "inline-flex", gap: 0 }}>
          <div style={{ width: "740px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>
        </div>
      </Grid>
      <Grid container>
        <div style={{ paddingTop: 24 }} />
      </Grid>
      <Grid container direction="row" spacing={0}>
        <div style={{ display: "inline-flex", gap: 0 }}>
          <div style={{ width: "740px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>
        </div>
      </Grid>
      <Grid container>
        <div style={{ paddingTop: 24 }} />
      </Grid>
      <Grid container direction="row" spacing={0}>
        <div style={{ display: "inline-flex", gap: 0 }}>
          <div style={{ width: "740px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>
        </div>
      </Grid>
      <Grid container>
        <div style={{ paddingTop: 24 }} />
      </Grid>
      <Grid container>
        <div style={{ display: "inline-flex", gap: 0 }}>
          <div style={{ width: "140px" }}>
            <Typography style={{ fontSize: 11 }}>
              Incident Reported by (name)
            </Typography>
          </div>
          <div style={{ width: "280px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>

          <div style={{ width: "60px" }}>
            <Typography style={{ fontSize: 11 }}>Signature:</Typography>
          </div>

          <div style={{ width: "140px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>

          <div style={{ width: "40px" }}>
            <Typography style={{ fontSize: 11 }}>Date:</Typography>
          </div>

          <div style={{ width: "80px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>
        </div>
        <div style={{ display: "inline-flex", gap: 0 }}>
          <div style={{ width: "140px" }}>
            <Typography style={{ fontSize: 11 }}>
              Reviewed By Administrator
            </Typography>
          </div>
          <div style={{ width: "280px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>

          <div style={{ width: "60px" }}>
            <Typography style={{ fontSize: 11 }}>Signature:</Typography>
          </div>

          <div style={{ width: "140px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>

          <div style={{ width: "40px" }}>
            <Typography style={{ fontSize: 11 }}>Date:</Typography>
          </div>

          <div style={{ width: "80px", borderBottom: "solid 1px black" }}>
            <Typography style={{ fontSize: 11 }}></Typography>
          </div>
        </div>
      </Grid>
    </div>
  );
};
export default IncidentReport;
