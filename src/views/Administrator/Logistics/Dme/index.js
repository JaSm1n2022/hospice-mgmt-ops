import CustomTabs from "components/CustomTabs/CustomTabs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import ChecklistIcon from "@material-ui/icons/PlaylistAddCheck";
import MoneyIcon from "@material-ui/icons/Money";
import EquipmentMain from "views/Logistics/Dme/Equipment/EquipmentMain";
import DmeContractFunction from "./Contracts/DmeContractFunction";

function DmeManagement() {
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CustomTabs
            title="DME Management :"
            headerColor="success"
            noGear={true}
            tabs={[
              {
                tabName: "Order",
                tabIcon: ChecklistIcon,
                tabContent: <EquipmentMain />,
              },
              {
                tabName: "Contract",
                tabIcon: MoneyIcon,
                tabContent: <DmeContractFunction />,
              },
            ]}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default DmeManagement;
