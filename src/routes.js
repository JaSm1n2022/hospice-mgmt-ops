import Buttons from "views/Components/Buttons.js";
import Calendar from "views/Calendar/Calendar.js";
import Charts from "views/Charts/Charts.js";
import Dashboard from "views/Administrator/Dashboard/Dashboard.js";
import Contract from "views/Administrator/PayrollManagement/Contract/index.js";
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
import IdtAssignment from "views/Administrator/Assignment/AssignmentMain.js";
import Distribution from "views/Administrator/Logistics/Distribution/Distribution.js";
// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
import Place from "@material-ui/icons/Place";
import Timeline from "@material-ui/icons/Timeline";
import WidgetsIcon from "@material-ui/icons/Widgets";
import GearIcon from "@material-ui/icons/Settings";
import SettingsIcon from "@material-ui/icons/Settings";
import PaymentIcon from "@material-ui/icons/PaymentOutlined";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import StockRoom from "views/Administrator/Logistics/StockRoom/StockRoomMain";
import Dme from "views/Administrator/Logistics/Dme/Equipment/EquipmentMain";
import Transportation from "views/Administrator/Logistics/Transportation/TransportationMain";
import Vendor from "views/Administrator/Settings/Vendor/VendorFunction";
import Product from "views/Administrator/Settings/Product/ProductFunction";
import Patient from "views/Administrator/Settings/Patient/PatientFunction";
import Category from "views/Administrator/Settings/Category/CategoryFunction";
import SubCategory from "views/Administrator/Settings/SubCategory/SubCategoryFunction";
import Employee from "views/Administrator/Settings/Employee/EmployeeFunction";
import Location from "views/Administrator/Settings/Location/LocationFunction";
import Transaction from "views/Administrator/Transaction";
import Supply from "views/Administrator/Reports/Supply";
import Order from "views/Administrator/Reports/Order";
import Office from "views/Administrator/Reports/Office";
import Medical from "views/Administrator/Reports/Medical";
import Pharmacy from "views/Administrator/Reports/Pharmacy";
import DmeReport from "views/Administrator/Reports/Dme";
import TransportationReport from "views/Administrator/Reports/Transportation";
import Services from "views/Administrator/Reports/Services";
import Utilities from "views/Administrator/Reports/Utilities";
import Payroll from "views/Administrator/Reports/Payroll";
import Marketing from "views/Administrator/Reports/Marketing";
import Paycheck from "views/Administrator/PayrollManagement/Paycheck";
import Payday from "views/Administrator/PayrollManagement/Payday";
import OrderPlot from "views/Administrator/Utilities/OrderPlot";
import PatientSupplies from "views/Administrator/Utilities/PatientSupplies";
import PatientMetrics from "views/Administrator/Utilities/PatientMetrics";
import PatientDistribution from "views/Administrator/Utilities/PatientDistribution";
import PaymentMethod from "views/Administrator/Utilities/PaymentMethod";
import Admittance from "views/Administrator/Admittance/AdmittanceMain";
import Medicare from "views/Administrator/MedicareCap/Available/AvailableFunction";
import MedicareV2 from "views/Administrator/MedicareV2/MedicareV2Function";
import Routesheet from "views/Administrator/Administrative/Routesheet/RoutesheetFunction";
import RevenueForecast from "views/Administrator/MedicareV2/RevenueForecast";
import ExpensesClientForecast from "views/Administrator/MedicareV2/ExpensesClientForecast";
import EmployeePayrollForecast from "views/Administrator/MedicareV2/EmployeePayrollForecast";
import OverheadForecast from "views/Administrator/MedicareV2/OverheadForecast";
import HospiceIncome from "views/Administrator/HospiceIncome/HospiceIncomeFunction";
import Hope from "views/Administrator/Hope/HopeFunction";
import RecertificationTimeline from "views/Administrator/RecertificationTimeline/RecertificationTimelineFunction";
import BereavementTimeline from "views/Administrator/BereavementTimeline/BereavementTimelineFunction";
import UpdateBenefits from "views/Administrator/Utilities/UpdateBenefits";
var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin",
  },
  {
    collapse: true,
    name: "Settings",
    rtlName: "إدارة الرواتب",
    icon: SettingsIcon,
    state: "settingsCollapse",
    views: [
      {
        path: "/vendor",
        name: "Vendor",
        rtlName: "عالتسعير",
        mini: "S",
        rtlMini: "ع",
        component: Vendor,
        layout: "/admin",
      },
      {
        path: "/product",
        name: "Product",
        rtlName: "عالتسعير",
        mini: "S",
        rtlMini: "ع",
        component: Product,
        layout: "/admin",
      },
      {
        path: "/patient",
        name: "Patient",
        rtlName: "عالتسعير",
        mini: "S",
        rtlMini: "ع",
        component: Patient,
        layout: "/admin",
      },
      {
        path: "/employee",
        name: "Employee",
        rtlName: "عالتسعير",
        mini: "S",
        rtlMini: "ع",
        component: Employee,
        layout: "/admin",
      },
      {
        path: "/category",
        name: "Category",
        rtlName: "عالتسعير",
        mini: "S",
        rtlMini: "ع",
        component: Category,
        layout: "/admin",
      },
      {
        path: "/subcategory",
        name: "SubCategory",
        rtlName: "عالتسعير",
        mini: "S",
        rtlMini: "ع",
        component: SubCategory,
        layout: "/admin",
      },
      {
        path: "/location",
        name: "Location",
        rtlName: "عالتسعير",
        mini: "S",
        rtlMini: "ع",
        component: Location,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/transaction",
    name: "Transaction",
    rtlName: "لوحة القيادة",
    icon: PaymentIcon,
    component: Transaction,
    layout: "/admin",
  },
  {
    collapse: true,
    name: "Operations Mgmt.",
    rtlName: "إدارة الرواتب",
    icon: WidgetsIcon,
    state: "opsCollapse",
    views: [
      {
        path: "/idt",
        name: "IDT Assignment",
        rtlName: "عالتسعير",
        mini: "OM",
        rtlMini: "ع",
        component: IdtAssignment,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Inventory & Logistics",
    rtlName: "إدارة الرواتب",
    icon: WidgetsIcon,
    state: "inventoryCollapse",
    views: [
      {
        path: "/distribution",
        name: "Distribution",
        rtlName: "عالتسعير",
        mini: "IL",
        rtlMini: "ع",
        component: Distribution,
        layout: "/admin",
      },
      {
        path: "/stockroom",
        name: "Stockroom",
        rtlName: "عالتسعير",
        mini: "IL",
        rtlMini: "ع",
        component: StockRoom,
        layout: "/admin",
      },
      {
        path: "/dme",
        name: "DME",
        rtlName: "عالتسعير",
        mini: "IL",
        rtlMini: "ع",
        component: Dme,
        layout: "/admin",
      },
      {
        path: "/transportation",
        name: "Transportation",
        rtlName: "عالتسعير",
        mini: "IL",
        rtlMini: "ع",
        component: Transportation,
        layout: "/admin",
      },
    ],
  },

  {
    collapse: true,
    name: "Payroll Management",
    rtlName: "إدارة الرواتب",
    icon: PaymentIcon,
    state: "payrollCollapse",
    views: [
      {
        path: "/contract",
        name: "Contract",
        rtlName: "عالتسعير",
        mini: "PM",
        rtlMini: "ع",
        component: Contract,
        layout: "/admin",
      },
      {
        path: "/pacheck",
        name: "Paycheck",
        rtlName: "عالتسعير",
        mini: "PM",
        rtlMini: "ع",
        component: Paycheck,
        layout: "/admin",
      },
      {
        path: "/payday",
        name: "Payday",
        rtlName: "عالتسعير",
        mini: "PM",
        rtlMini: "ع",
        component: Payday,
        layout: "/admin",
      },
      {
        path: "/routesheet",
        name: "Routesheet",
        rtlName: "عالتسعير",
        mini: "PM",
        rtlMini: "ع",
        component: Routesheet,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Utilities",
    rtlName: "إدارة الرواتب",
    icon: GearIcon,
    state: "utilitiesCollapse",
    views: [
      {
        path: "/orderPlot",
        name: "Order Plot",
        rtlName: "عالتسعير",
        mini: "PM",
        rtlMini: "ع",
        component: OrderPlot,
        layout: "/admin",
      },
      {
        path: "/patientSupplies",
        name: "Client Supplies Metrics",
        rtlName: "عالتسعير",
        mini: "PM",
        rtlMini: "ع",
        component: PatientSupplies,
        layout: "/admin",
      },
      {
        path: "/patientMetrics",
        name: "Client Full Metrics",
        rtlName: "عالتسعير",
        mini: "PM",
        rtlMini: "ع",
        component: PatientMetrics,
        layout: "/admin",
      },
      {
        path: "/patientDistribution",
        name: "Client Distribution Category",
        rtlName: "عالتسعير",
        mini: "PM",
        rtlMini: "ع",
        component: PatientDistribution,
        layout: "/admin",
      },
      {
        path: "/paymentMethod",
        name: "Payment Method Tracking",
        rtlName: "عالتسعير",
        mini: "PM",
        rtlMini: "ع",
        component: PaymentMethod,
        layout: "/admin",
      },
      {
        path: "/admittance",
        name: "Admittance Checklist",
        rtlName: "عالتسعير",
        mini: "PM",
        rtlMini: "ع",
        component: Admittance,
        layout: "/admin",
      },
      {
        path: "/updateBenefits",
        name: "Update Benefits Period",
        rtlName: "عالتسعير",
        mini: "PM",
        rtlMini: "ع",
        component: UpdateBenefits,
        layout: "/admin",
      },
    ],
  },

  {
    collapse: true,
    name: "YTD Expenses Report",
    rtlName: "إدارة الرواتب",
    icon: Timeline,
    state: "expensesCollapse",
    views: [
      {
        path: "/distributionReport",
        name: "Distribution",
        rtlName: "عالتسعير",
        mini: "YTD",
        rtlMini: "ع",
        component: Supply,
        layout: "/admin",
      },
      {
        path: "/orderReport",
        name: "Transaction",
        rtlName: "عالتسعير",
        mini: "YTD",
        rtlMini: "ع",
        component: Order,
        layout: "/admin",
      },
      {
        path: "/officeReport",
        name: "Office",
        rtlName: "عالتسعير",
        mini: "YTD",
        rtlMini: "ع",
        component: Office,
        layout: "/admin",
      },
      {
        path: "/medicalReport",
        name: "Medical/Incontinence",
        rtlName: "عالتسعير",
        mini: "YTD",
        rtlMini: "ع",
        component: Medical,
        layout: "/admin",
      },
      {
        path: "/pharmacyReport",
        name: "Pharmacy",
        rtlName: "عالتسعير",
        mini: "YTD",
        rtlMini: "ع",
        component: Pharmacy,
        layout: "/admin",
      },
      {
        path: "/dmeReport",
        name: "DME",
        rtlName: "عالتسعير",
        mini: "YTD",
        rtlMini: "ع",
        component: DmeReport,
        layout: "/admin",
      },
      {
        path: "/transportationReport",
        name: "Transportation",
        rtlName: "عالتسعير",
        mini: "YTD",
        rtlMini: "ع",
        component: TransportationReport,
        layout: "/admin",
      },
      {
        path: "/servicesReport",
        name: "Services",
        rtlName: "عالتسعير",
        mini: "YTD",
        rtlMini: "ع",
        component: Services,
        layout: "/admin",
      },
      {
        path: "/utilitiesReport",
        name: "Utilities",
        rtlName: "عالتسعير",
        mini: "YTD",
        rtlMini: "ع",
        component: Utilities,
        layout: "/admin",
      },
      {
        path: "/payrollReport",
        name: "Payroll",
        rtlName: "عالتسعير",
        mini: "YTD",
        rtlMini: "ع",
        component: Payroll,
        layout: "/admin",
      },
      {
        path: "/marketingReport",
        name: "Marketing",
        rtlName: "عالتسعير",
        mini: "YTD",
        rtlMini: "ع",
        component: Marketing,
        layout: "/admin",
      },
    ],
  },
  /*
  {
    path: "/medicare",
    name: "Medicare Cap",
    rtlName: "الرسوم البيانية",
    icon: PaymentIcon,
    component: Medicare,
    layout: "/admin",
  },
  */
  {
    path: "/medicarev2",
    name: "Medicare Cap",
    rtlName: "الرسوم البيانية",
    icon: PaymentIcon,
    component: MedicareV2,
    layout: "/admin",
  },
  {
    collapse: true,
    name: "Forecast",
    rtlName: "الرسوم البيانية",
    icon: TrendingUpIcon,
    state: "forecastCollapse",
    views: [
      {
        path: "/revenue-forecast",
        name: "Revenue Forecast",
        rtlName: "الرسوم البيانية",
        icon: MonetizationOnIcon,
        component: RevenueForecast,
        layout: "/admin",
      },
      {
        path: "/expenses-client-forecast",
        name: "Expenses Client Forecast",
        rtlName: "الرسوم البيانية",
        icon: PaymentIcon,
        component: ExpensesClientForecast,
        layout: "/admin",
      },
      {
        path: "/employee-payroll-forecast",
        name: "Employee Payroll Forecast",
        rtlName: "الرسوم البيانية",
        icon: PaymentIcon,
        component: EmployeePayrollForecast,
        layout: "/admin",
      },
      {
        path: "/overhead-forecast",
        name: "Overhead Forecast",
        rtlName: "الرسوم البيانية",
        icon: TrendingUpIcon,
        component: OverheadForecast,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/hospice-income",
    name: "Hospice Income",
    rtlName: "الرسوم البيانية",
    icon: MonetizationOnIcon,
    component: HospiceIncome,
    layout: "/admin",
  },
  {
    path: "/hope",
    name: "HOPE Timeline",
    rtlName: "الرسوم البيانية",
    icon: PaymentIcon,
    component: Hope,
    layout: "/admin",
  },
  {
    path: "/recertification",
    name: "Recertification Timeline",
    rtlName: "الرسوم البيانية",
    icon: Timeline,
    component: RecertificationTimeline,
    layout: "/admin",
  },
  {
    path: "/bereavement",
    name: "Bereavement Timeline",
    rtlName: "الرسوم البيانية",
    icon: FavoriteBorderIcon,
    component: BereavementTimeline,
    layout: "/admin",
  },
  {
    path: "/charts",
    name: "Charts",
    rtlName: "الرسوم البيانية",
    icon: Timeline,
    component: Charts,
    layout: "/admin",
  },
  /*
  {
    collapse: true,
    name: "Pages",
    rtlName: "صفحات",
    icon: Image,
    state: "pageCollapse",
    views: [
      {
        path: "/pricing-page",
        name: "Pricing Page",
        rtlName: "عالتسعير",
        mini: "PP",
        rtlMini: "ع",
        component: PricingPage,
        layout: "/auth",
      },
      {
        path: "/rtl-support-page",
        name: "RTL Support",
        rtlName: "صودعم رتل",
        mini: "RS",
        rtlMini: "صو",
        component: RTLSupport,
        layout: "/rtl",
      },
      {
        path: "/timeline-page",
        name: "Timeline Page",
        rtlName: "تيالجدول الزمني",
        mini: "T",
        rtlMini: "تي",
        component: TimelinePage,
        layout: "/admin",
      },
      {
        path: "/login-page",
        name: "Hospice Management System",
        rtlName: "هعذاتسجيل الدخول",
        mini: "L",
        rtlMini: "هعذا",
        component: LoginPage,
        layout: "/auth",
      },
      {
        path: "/register-page",
        name: "Hospice Management System",
        rtlName: "تسجيل",
        mini: "R",
        rtlMini: "صع",
        component: RegisterPage,
        layout: "/auth",
      },
      {
        path: "/about-page",
        name: "Hospice Management System",
        rtlName: "تسجيل",
        mini: "R",
        rtlMini: "صع",
        component: AboutPage,
        layout: "/auth",
      },
      {
        path: "/lock-screen-page",
        name: "Lock Screen Page",
        rtlName: "اقفل الشاشة",
        mini: "LS",
        rtlMini: "هذاع",
        component: LockScreenPage,
        layout: "/auth",
      },
      {
        path: "/user-page",
        name: "User Profile",
        rtlName: "ملف تعريفي للمستخدم",
        mini: "UP",
        rtlMini: "شع",
        component: UserProfile,
        layout: "/admin",
      },
      {
        path: "/error-page",
        name: "Error Page",
        rtlName: "صفحة الخطأ",
        mini: "E",
        rtlMini: "البريد",
        component: ErrorPage,
        layout: "/auth",
      },
    ],
  },
  {
    collapse: true,
    name: "Components",
    rtlName: "المكونات",
    icon: Apps,
    state: "componentsCollapse",
    views: [
      {
        collapse: true,
        name: "Multi Level Collapse",
        rtlName: "انهيار متعدد المستويات",
        mini: "MC",
        rtlMini: "ر",
        state: "multiCollapse",
        views: [
          {
            path: "#sample-path",
            name: "Example",
            rtlName: "مثال",
            mini: "E",
            rtlMini: "ه",
            component: () => {},
            layout: "#sample-layout",
          },
        ],
      },
      {
        path: "/buttons",
        name: "Buttons",
        rtlName: "وصفت",
        mini: "B",
        rtlMini: "ب",
        component: Buttons,
        layout: "/admin",
      },
      {
        path: "/grid-system",
        name: "Grid System",
        rtlName: "نظام الشبكة",
        mini: "GS",
        rtlMini: "زو",
        component: GridSystem,
        layout: "/admin",
      },
      {
        path: "/panels",
        name: "Panels",
        rtlName: "لوحات",
        mini: "P",
        rtlMini: "ع",
        component: Panels,
        layout: "/admin",
      },
      {
        path: "/sweet-alert",
        name: "Sweet Alert",
        rtlName: "الحلو تنبيه",
        mini: "SA",
        rtlMini: "ومن",
        component: SweetAlert,
        layout: "/admin",
      },
      {
        path: "/notifications",
        name: "Notifications",
        rtlName: "إخطارات",
        mini: "N",
        rtlMini: "ن",
        component: Notifications,
        layout: "/admin",
      },
      {
        path: "/icons",
        name: "Icons",
        rtlName: "الرموز",
        mini: "I",
        rtlMini: "و",
        component: Icons,
        layout: "/admin",
      },
      {
        path: "/typography",
        name: "Typography",
        rtlName: "طباعة",
        mini: "T",
        rtlMini: "ر",
        component: Typography,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Forms",
    rtlName: "إستمارات",
    icon: "content_paste",
    state: "formsCollapse",
    views: [
      {
        path: "/regular-forms",
        name: "Regular Forms",
        rtlName: "أشكال عادية",
        mini: "RF",
        rtlMini: "صو",
        component: RegularForms,
        layout: "/admin",
      },
      {
        path: "/extended-forms",
        name: "Extended Forms",
        rtlName: "نماذج موسعة",
        mini: "EF",
        rtlMini: "هوو",
        component: ExtendedForms,
        layout: "/admin",
      },
      {
        path: "/validation-forms",
        name: "Validation Forms",
        rtlName: "نماذج التحقق من الصحة",
        mini: "VF",
        rtlMini: "تو",
        component: ValidationForms,
        layout: "/admin",
      },
      {
        path: "/wizard",
        name: "Wizard",
        rtlName: "ساحر",
        mini: "W",
        rtlMini: "ث",
        component: Wizard,
        layout: "/admin",
      },
    ],
  },
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
        layout: "/admin",
      },
      {
        path: "/extended-tables",
        name: "Extended Tables",
        rtlName: "جداول ممتدة",
        mini: "ET",
        rtlMini: "هور",
        component: ExtendedTables,
        layout: "/admin",
      },
      {
        path: "/react-tables",
        name: "React Tables",
        rtlName: "رد فعل الطاولة",
        mini: "RT",
        rtlMini: "در",
        component: ReactTables,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Maps",
    rtlName: "خرائط",
    icon: Place,
    state: "mapsCollapse",
    views: [
      {
        path: "/google-maps",
        name: "Google Maps",
        rtlName: "خرائط جوجل",
        mini: "GM",
        rtlMini: "زم",
        component: GoogleMaps,
        layout: "/admin",
      },
      {
        path: "/full-screen-maps",
        name: "Full Screen Map",
        rtlName: "خريطة كاملة الشاشة",
        mini: "FSM",
        rtlMini: "ووم",
        component: FullScreenMap,
        layout: "/admin",
      },
      {
        path: "/vector-maps",
        name: "Vector Map",
        rtlName: "خريطة المتجه",
        mini: "VM",
        rtlMini: "تم",
        component: VectorMap,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/widgets",
    name: "Widgets",
    rtlName: "الحاجيات",
    icon: WidgetsIcon,
    component: Widgets,
    layout: "/admin",
  },
  {
    path: "/charts",
    name: "Charts",
    rtlName: "الرسوم البيانية",
    icon: Timeline,
    component: Charts,
    layout: "/admin",
  },
  {
    path: "/calendar",
    name: "Calendar",
    rtlName: "التقويم",
    icon: DateRange,
    component: Calendar,
    layout: "/admin",
  },
  */
];
export default dashRoutes;
