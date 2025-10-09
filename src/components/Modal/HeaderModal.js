import { Grid, Typography } from "@material-ui/core";
import Clear from "@material-ui/icons/Clear";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";

export default function HeaderModal(props) {
  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Card plain>
        <CardHeader plain color={props.color || "rose"}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Left side: Select */}

            <div style={{ flex: "0 0 90%" }}>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                {props.title}
              </Typography>
            </div>
            <div align="right" style={{ flex: "0 0 10%" }}>
              <Clear
                style={{ cursor: "pointer" }}
                onClick={() => props.onClose()}
              />
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
