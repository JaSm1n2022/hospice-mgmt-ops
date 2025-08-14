import CustomTabs from "components/CustomTabs/CustomTabs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

import OfficeIcon from "@material-ui/icons/HomeWork";
import CallLogMain from "./Calls/CallsMain";
import OfficeTaskMain from "./Tasks/TasksMain";
import PhoneIcon from "@material-ui/icons/Phone";
import RoutesheetIcon from "@material-ui/icons/GridOn";
import TrainingFunction from "./Training/TrainingFunction";
import RoutesheetFunction from "./Routesheet/RoutesheetFunction";
function Administrative() {
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CustomTabs
            title="Administrative Tasks:"
            headerColor="haloes"
            noGear={true}
            noFoward={false}
            divide={4}
            tabs={[
              {
                tabName: "Office Tasks",
                tabIcon: OfficeIcon,
                tabContent: <OfficeTaskMain />,
              },
              {
                tabName: "Call logs",
                tabIcon: PhoneIcon,
                tabContent: <CallLogMain />,
              },
              {
                tabName: "Routesheet",
                tabIcon: RoutesheetIcon,
                tabContent: <RoutesheetFunction main={true} />,
              },
              {
                tabName: "Training",
                tabIcon: RoutesheetIcon,
                tabContent: <TrainingFunction main={true} />,
              },
            ]}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default Administrative;
