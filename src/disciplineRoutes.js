import Dashboard from "views/Discipline/Dashboard/Dashboard.js";
import Routesheet from "views/Discipline/Routesheet/Routesheet.js";
// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssignmentIcon from "@material-ui/icons/Assignment";

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
];
export default dashRoutes;
