import Chart from "react-apexcharts";
import React, { useState } from "react";
import { useEffect } from "react";

import { FULL_PATIENT_DASHBOARD_CATEGORY } from "utils/constants";

const optionLabels = FULL_PATIENT_DASHBOARD_CATEGORY;
const ClientFullPieChart = (props) => {
  const [options] = useState({
    labels: [...optionLabels],

    colors: [
      "#5CACEE",
      "#0000FF",
      "#FFA500",
      "#967bb6",
      "#a3a61e",
      "#a9b1d6",
      "#c495a3",
      "#1c8071",

      "#cb6bcf",
    ],
  });
  const [series, setSeries] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    console.log("[Props series]", props.series);

    setSeries([...props.series] || [0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }, [props.series]);
  return (
    <React.Fragment>
      <Chart
        options={options}
        series={series}
        type="pie"
        width={400}
        height={420}
      />
    </React.Fragment>
  );
};

export default ClientFullPieChart;
