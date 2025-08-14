import CustomTabs from "components/CustomTabs/CustomTabs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

import Person from "@material-ui/icons/Person";

import PaymentIcon from "@material-ui/icons/Payment";
import Contract from "./Contract";
import PayCheck from "./Paycheck";
import PayPeriod from "./Payday";

function PayrollManagement() {
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CustomTabs
            title="Payroll:"
            headerColor="haloes"
            noGear={true}
            tabs={[
              {
                tabName: "Pay Check",
                tabIcon: PaymentIcon,
                tabContent: <PayCheck />,
              },
              {
                tabName: "Contract",
                tabIcon: Person,
                tabContent: <Contract />,
              },
              {
                tabName: "Pay Period",
                tabIcon: PaymentIcon,
                tabContent: <PayPeriod />,
              },
            ]}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default PayrollManagement;
