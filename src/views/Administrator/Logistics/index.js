import CustomTabs from "components/CustomTabs/CustomTabs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import StockIcon from "@material-ui/icons/MeetingRoom";
import DmeIcon from "@material-ui/icons/AirportShuttle";
import SupplyIcon from "@material-ui/icons/ListAlt";
import TransportationIcon from "@material-ui/icons/AirportShuttle";
import PickupIcon from "@material-ui/icons/AirportShuttle";
import DeliveryIcon from "@material-ui/icons/AirportShuttle";
import StockRoomMain from "./StockRoom/StockRoomMain";
import DmeManagement from "./Dme/Equipment/EquipmentMain";
import DistributionManagement from "./Distribution";
import DeliveryManagement from "./Delivery";
import PickupManagement from "./Pickup";
import TransactionManagement from "./Transportation/TransportationMain";
function Logistics() {
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CustomTabs
            title="Logistics:"
            headerColor="haloes"
            noGear={true}
            noFoward={false}
            divide={4}
            tabs={[
              {
                tabName: "Distribution",
                tabIcon: SupplyIcon,
                tabContent: <DistributionManagement />,
              },
              {
                tabName: "DME",
                tabIcon: DmeIcon,
                tabContent: <DmeManagement />,
              },
              {
                tabName: "Client Transportation",
                tabIcon: TransportationIcon,
                tabContent: <TransactionManagement />,
              },
              {
                tabName: "Stock Room",
                tabIcon: StockIcon,
                tabContent: <StockRoomMain />,
              },
              {
                tabName: "Pickup",
                tabIcon: PickupIcon,
                tabContent: <PickupManagement />,
              },
              {
                tabName: "Delivery",
                tabIcon: DeliveryIcon,
                tabContent: <DeliveryManagement />,
              },
            ]}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default Logistics;
