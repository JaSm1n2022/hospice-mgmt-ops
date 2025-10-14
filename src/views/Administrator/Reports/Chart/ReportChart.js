import React, { useEffect, useState } from "react";

import Helper from "utils/helper";
import ChartistGraph from "react-chartist";
import { makeStyles } from "@material-ui/core/styles";
import { simpleBarChart } from "variables/charts";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import styles from "assets/jss/material-dashboard-pro-react/views/chartsStyle.js";

const useStyles = makeStyles(styles);
const ReportChart = (props) => {
  const classes = useStyles();
  const [data, setData] = useState({
    labels: [],
    series: [[]],
  });
  const [options, setOptions] = useState({
    seriesBarDistance: 30,
    axisX: {
      showGrid: false,
    },

    height: "300px",
  });

  useEffect(() => {
    const summary = props.data;
    const categories = [];
    const values = [];
    for (const rep of summary) {
      categories.push(Helper.formatReportDateAxisCategory(rep.range));
      values.push(rep.total);
    }
    setData({
      labels: categories,
      series: [values],
    });
  }, [props]);

  return (
    <React.Fragment>
      <GridContainer>
        {data?.series?.length && (
          <GridItem xs={12} sm={12} md={12}>
            <Card chart>
              <CardHeader color="rose">
                <ChartistGraph
                  className="ct-chart-white-colors"
                  data={data}
                  type="Bar"
                  options={options}
                  responsiveOptions={simpleBarChart.responsiveOptions}
                  listener={simpleBarChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}></h4>
              </CardBody>
            </Card>
          </GridItem>
        )}
      </GridContainer>
    </React.Fragment>
  );
};
export default ReportChart;
