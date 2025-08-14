import CustomTabs from "components/CustomTabs/CustomTabs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import DistributionIcon from "@material-ui/icons/ListAlt";
import LocalHospital from "@material-ui/icons/LocalHospital";
import OfficeIcon from "@material-ui/icons/HomeWork";
import PayrollIcon from "@material-ui/icons/Money";
import MarketingIcon from "@material-ui/icons/PeopleAlt";
import UtilityIcon from "@material-ui/icons/AcUnitOutlined";
import TransportationIcon from "@material-ui/icons/Commute";
import LocalPharmacyIcon from "@material-ui/icons/LocalPharmacy";
import DmeIcon from "@material-ui/icons/EmojiTransportation";
import Shop from "@material-ui/icons/Shop";

import Supply from "./Supply";
import Order from "./Order";
import Office from "./Office";
import Medical from "./Medical";
import Services from "./Services";
import Utilities from "./Utilities";
import OfficeRent from "./OfficeRent";
import Marketing from "./Marketing";
import Payroll from "./Payroll";
import Pharmacy from "./Pharmacy";
import Dme from "./Dme";
import Transportation from "./Transportation";
function Reports() {
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CustomTabs
            title="YTD Expenses Report"
            headerColor="haloes"
            noGear={true}
            noFoward={false}
            divide={6}
            tabs={[
              {
                tabName: "Distribution",
                tabIcon: DistributionIcon,
                tabContent: <Supply />,
              },
              {
                tabName: "Transaction",
                tabIcon: Shop,
                tabContent: <Order />,
              },
              {
                tabName: "Office",
                tabIcon: OfficeIcon,
                tabContent: <Office />,
              },
              {
                tabName: "Medical/Incontinence",
                tabIcon: LocalHospital,
                tabContent: <Medical />,
              },
              {
                tabName: "Pharmacy",
                tabIcon: LocalPharmacyIcon,
                tabContent: <Pharmacy />,
              },
              {
                tabName: "DME",
                tabIcon: DmeIcon,
                tabContent: <Dme />,
              },
              {
                tabName: "Transportation",
                tabIcon: TransportationIcon,
                tabContent: <Transportation />,
              },
              {
                tabName: "Services",
                tabIcon: OfficeIcon,
                tabContent: <Services />,
              },

              {
                tabName: "Utilities",
                tabIcon: UtilityIcon,
                tabContent: <Utilities />,
              },
              /*
              {
                tabName: "Office Rent",
                tabIcon: OfficeIcon,
                tabContent: <OfficeRent />,
              },
              */
              {
                tabName: "Payroll",
                tabIcon: PayrollIcon,
                tabContent: <Payroll />,
              },
              {
                tabName: "Marketing",
                tabIcon: MarketingIcon,
                tabContent: <Marketing />,
              },
            ]}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default Reports;
