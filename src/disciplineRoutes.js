import Dashboard from "views/Discipline/Dashboard/Dashboard.js";
import Routesheet from "views/Discipline/Routesheet/Routesheet.js";
import Pickup from "views/Discipline/Pickup/Pickup.js";
import Delivery from "views/Discipline/Delivery/Delivery.js";
import Earning from "views/Discipline/Earning/Earning.js";
// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PickupIcon from "@material-ui/icons/LocalShippingOutlined";
import DeliveryIcon from "@material-ui/icons/LocalShippingRounded";
import MoneyIcon from "@material-ui/icons/AttachMoneyOutlined";

import Buttons from "views/Components/Buttons.js";

import ErrorPage from "views/Pages/ErrorPage.js";
import ExtendedForms from "views/Forms/ExtendedForms.js";
import ExtendedTables from "views/Tables/ExtendedTables.js";
import FullScreenMap from "views/Maps/FullScreenMap.js";
import GoogleMaps from "views/Maps/GoogleMaps.js";
import GridSystem from "views/Components/GridSystem.js";
import Icons from "views/Components/Icons.js";
import LockScreenPage from "views/Pages/LockScreenPage.js";
import LoginPage from "views/Pages/LoginPage.js";
import Notifications from "views/Components/Notifications.js";
import Panels from "views/Components/Panels.js";
import PricingPage from "views/Pages/PricingPage.js";
import RTLSupport from "views/Pages/RTLSupport.js";
import ReactTables from "views/Tables/ReactTables.js";
import RegisterPage from "views/Pages/RegisterPage.js";
import AboutPage from "views/Pages/AboutPage.js";
import RegularForms from "views/Forms/RegularForms.js";
import RegularTables from "views/Tables/RegularTables.js";
import SweetAlert from "views/Components/SweetAlert.js";
import TimelinePage from "views/Pages/Timeline.js";
import Typography from "views/Components/Typography.js";
import UserProfile from "views/Pages/UserProfile.js";
import ValidationForms from "views/Forms/ValidationForms.js";
import VectorMap from "views/Maps/VectorMap.js";
import Widgets from "views/Widgets/Widgets.js";
import Wizard from "views/Forms/Wizard.js";

// @material-ui/icons

import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
import Place from "@material-ui/icons/Place";
import Timeline from "@material-ui/icons/Timeline";
import WidgetsIcon from "@material-ui/icons/Widgets";

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
  {
    path: "/earnings",
    name: "Services & Earnings",
    rtlName: "ورقة الطريق",
    icon: MoneyIcon,
    component: Earning,
    layout: "/discipline",
  },
  /*
  {
    collapse: true,
    name: "Tables",
    rtlName: "الجداول",
    icon: GridOn,
    state: "tablesCollapse",
    views: [
      {
        path: "/regular-tables",
        name: "Regular Tables",
        rtlName: "طاولات عادية",
        mini: "RT",
        rtlMini: "صر",
        component: RegularTables,
        layout: "/discipline",
      },
      {
        path: "/extended-tables",
        name: "Extended Tables",
        rtlName: "جداول ممتدة",
        mini: "ET",
        rtlMini: "هور",
        component: ExtendedTables,
        layout: "/discipline",
      },
      {
        path: "/react-tables",
        name: "React Tables",
        rtlName: "رد فعل الطاولة",
        mini: "RT",
        rtlMini: "در",
        component: ReactTables,
        layout: "/discipline",
      },
    ],
  },
  */
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
