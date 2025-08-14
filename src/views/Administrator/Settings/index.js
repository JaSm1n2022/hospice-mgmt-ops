import { Grid } from "@material-ui/core";
import CustomTabs from "components/CustomTabs/CustomTabs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { useState } from "react";
import Scheduled from "@material-ui/icons/Schedule";
import ProductIcon from "@material-ui/icons/LocalShipping";
import VendorIcon from "@material-ui/icons/LocalShipping";
import BusinesssIcon from "@material-ui/icons/Business";
import EmployeeIcon from "@material-ui/icons/SupervisorAccount";
import PatientIcon from "@material-ui/icons/PeopleAlt";
import ShopIcon from "@material-ui/icons/Shop";
import VendorFunction from "views/Settings/Vendor/VendorFunction";
import LocationFunction from "views/Settings/Location/LocationFunction";
import EmployeeFunction from "views/Settings/Employee/EmployeeFunction";

import PatientFunction from "views/Settings/Patient/PatientFunction";
import ProductFunction from "./Product/ProductFunction";
import CategoryFunction from "./Category/CategoryFunction";
import SubCategoryFunction from "./SubCategory/SubCategoryFunction";

function Settings() {
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CustomTabs
            title="Configuration :"
            headerColor="haloes"
            noGear={true}
            divide={6}
            tabs={[
              {
                tabName: "Vendor",
                tabIcon: VendorIcon,
                tabContent: <VendorFunction />,
              },
              {
                tabName: "Product/Item",
                tabIcon: ProductIcon,
                tabContent: <ProductFunction />,
              },
              {
                tabName: "Patients",
                tabIcon: PatientIcon,
                tabContent: <PatientFunction />,
              },

              {
                tabName: "Facilities/Group Home",
                tabIcon: BusinesssIcon,
                tabContent: <LocationFunction />,
              },
              {
                tabName: "Employees",
                tabIcon: EmployeeIcon,
                tabContent: <EmployeeFunction />,
              },
              {
                tabName: "Transaction Categories",
                tabIcon: ShopIcon,
                tabContent: <CategoryFunction />,
              },
              {
                tabName: "Item Sub-Category",
                tabIcon: ShopIcon,
                tabContent: <SubCategoryFunction />,
              },
            ]}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default Settings;
