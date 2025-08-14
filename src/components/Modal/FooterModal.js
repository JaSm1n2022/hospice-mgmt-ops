import { Button, Grid, Typography } from "@material-ui/core";

export default function FooterModal(props) {
  return (
    <Grid container wrap="wrap">
      <Button
        variant="contained"
        color="primary"
        onClick={() => props.onSubmit()}
      >
        Submit
      </Button>
    </Grid>
  );
}
