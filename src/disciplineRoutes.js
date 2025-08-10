import Dashboard from "views/Discipline/Dashboard/Dashboard.js";
import Routesheet from "views/Discipline/Routesheet/Routesheet.js";
import Pickup from "views/Discipline/Pickup/Pickup.js";
import Delivery from "views/Discipline/Delivery/Delivery.js";
// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PickupIcon from "@material-ui/icons/LocalShippingOutlined";
import DeliveryIcon from "@material-ui/icons/LocalShippingRounded";
import HandbookIcon from "@material-ui/icons/LibraryBooksOutlined";
import CalendarIcon from "@material-ui/icons/CalendarTodayOutlined";
var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/discipline",
  },
  {
    path: "/routesheet",
    name: "Routesheet",
    rtlName: "ورقة الطريق",
    icon: AssignmentIcon,
    component: Routesheet,
    layout: "/discipline",
  },

  {
    path: "/pickup",
    name: "Pickup",
    rtlName: "ورقة الطريق",
    icon: PickupIcon,
    component: Pickup,
    layout: "/discipline",
  },

  {
    path: "/delivery",
    name: "Delivery",
    rtlName: "ورقة الطريق",
    icon: DeliveryIcon,
    component: Delivery,
    layout: "/discipline",
  },
  /*
  {
    path: "/routesheet",
    name: "Employee Handbook",
    rtlName: "ورقة الطريق",
    icon: HandbookIcon,
    component: Routesheet,
    layout: "/discipline",
  },
  {
    path: "/routesheet",
    name: "Calendar",
    rtlName: "ورقة الطريق",
    icon: CalendarIcon,
    component: Routesheet,
    layout: "/discipline",
  },
  */
];
export default dashRoutes;
