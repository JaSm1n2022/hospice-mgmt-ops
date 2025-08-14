import { Grid, Typography } from "@material-ui/core";
import Clear from "@material-ui/icons/Clear";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";

export default function HeaderModal(props) {
  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Card>
        <CardHeader plain color="success">
          <Grid container justifyContent="space-between">
            <div>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                {props.title}
              </Typography>
            </div>
            <div style={{ paddinTop: 12 }}>
              <Clear
                style={{ cursor: "pointer" }}
                onClick={() => props.onClose()}
              />
            </div>
          </Grid>
        </CardHeader>
      </Card>
    </div>
  );
}
