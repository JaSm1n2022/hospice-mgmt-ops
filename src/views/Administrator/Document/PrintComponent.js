import { Button } from "@material-ui/core";
import React, { useRef } from "react";

import ReactToPrint from "react-to-print";
import ComponentToPrint from "./ComponentToPrint";

export default function PrintComponent(props) {
  let componentRef = useRef();

  return (
    <>
      <div>
        {/* button to trigger printing of target component */}
        <ReactToPrint
          trigger={() => (
            <Button variant="contained" color="primary">
              Print Form
            </Button>
          )}
          content={() => componentRef}
        />

        {/* component to be printed */}
        <ComponentToPrint
          ref={(el) => (componentRef = el)}
          multiPatients={props.multiPatients}
          details={props.details}
          general={props.general}
        />
      </div>
    </>
  );
}
