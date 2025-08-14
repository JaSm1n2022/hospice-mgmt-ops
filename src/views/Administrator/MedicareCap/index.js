import CustomTabs from "components/CustomTabs/CustomTabs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

import SettingIcon from "@material-ui/icons/Settings";

import AssessmentIcon from "@material-ui/icons/Assessment";
import Available from "./Available/AvailableFunction";
function MedicareCap() {
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CustomTabs
            title="Medicare Cap:"
            headerColor="haloes"
            noGear={true}
            noFoward={false}
            divide={4}
            tabs={[
              {
                tabName: "Available",
                tabIcon: AssessmentIcon,
                tabContent: <Available />,
              },
              /*
              {
                tabName: "Setup",
                tabIcon: SettingIcon,
                tabContent: <CallLogMain />,
              },
              */
            ]}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default MedicareCap;
