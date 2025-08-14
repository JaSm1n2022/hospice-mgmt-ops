import CustomTabs from "components/CustomTabs/CustomTabs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

import PlotIcon from "@material-ui/icons/ViewList";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ChecklistIcon from "@material-ui/icons/PlaylistAddCheck";
import Person from "@material-ui/icons/Person";
import AssignmentMain from "views/Assignment/AssignmentMain";
import PaymentMethod from "./PaymentMethod";
import AdmittanceMain from "views/Admittance/AdmittanceMain";
import ProjectionFunction from "views/Projection/ProjectionFunction";
import PaymentIcon from "@material-ui/icons/Payment";
import KeyIcon from "@material-ui/icons/LockOpenOutlined";
import MoneyIcon from "@material-ui/icons/Money";
import OrderPlot from "./OrderPlot";
import PatientMetrics from "./PatientMetrics";
import PatientDistribution from "./PatientDistribution";
import PatientSupplies from "./PatientSupplies";
import IncidentReport from "./Forms/IncidentReport";

import KeyMain from "./Key/KeyMain";
function Utilities() {
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CustomTabs
            title="Tools :"
            headerColor="haloes"
            noGear={true}
            noFoward={false}
            divide={4}
            tabs={[
              {
                tabName: "Order Plot",
                tabIcon: PlotIcon,
                tabContent: <OrderPlot />,
              },
              {
                tabName: "Client Supplies Metrics",
                tabIcon: Person,
                tabContent: <PatientSupplies />,
              },
              {
                tabName: "Client Full Metrics",
                tabIcon: Person,
                tabContent: <PatientMetrics />,
              },
              {
                tabName: "Client Distribution Category",
                tabIcon: Person,
                tabContent: <PatientDistribution />,
              },
              {
                tabName: "Payment Method Tracking",
                tabIcon: PaymentIcon,
                tabContent: <PaymentMethod />,
              },
              {
                tabName: "IDT Assignment",
                tabIcon: AssignmentIcon,
                tabContent: <AssignmentMain />,
              },
              {
                tabName: "Admittance Checklist",
                tabIcon: ChecklistIcon,
                tabContent: <AdmittanceMain />,
              },
              {
                tabName: "Generate Keys",
                tabIcon: KeyIcon,
                tabContent: <KeyMain />,
              },
              {
                /*
              {
                tabName: "Projection",
                tabIcon: MoneyIcon,
                tabContent: <ProjectionFunction />,
              },
              {
                tabName: "Incident Form",
                tabIcon: MoneyIcon,
                tabContent: <IncidentReport />,
              },
            */
              },
            ]}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default Utilities;
