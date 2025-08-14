import { Button, Grid, Tooltip, Typography } from "@material-ui/core";
import { CameraAlt, FlipCameraAndroid } from "@material-ui/icons";
import React, { useState } from "react";
import Webcam from "react-webcam";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
  facingMode: FACING_MODE_USER,
};
const Proof = (props) => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isRetake, setIsRetake] = useState(false);
  const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);

  const handleClick = React.useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setIsRetake(!isRetake);
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);
  const retakeHandler = () => {
    setIsRetake(!isRetake);
  };
  const usePhotoHandler = () => {
    props.onUsePhotoHandler(imgSrc);
  };
  return (
    <>
      {!isRetake && (
        <>
          <Grid container justifyContent="space-between">
            <div
              style={{
                display: "inline-flex",
                gap: 6,
                paddingBottom: 4,
                paddingTop: 4,
              }}
            >
              <Tooltip title="Take a picture">
                <CameraAlt
                  onClick={capture}
                  style={{ fontSize: "32pt", color: "green" }}
                />
              </Tooltip>
              <Tooltip title="Flip a camera">
                <FlipCameraAndroid
                  style={{ fontSize: "32pt" }}
                  onClick={handleClick}
                />
              </Tooltip>
            </div>
          </Grid>
          <div>
            <Webcam
              audio={false}
              muted={true}
              ref={webcamRef}
              style={{
                position: "absolute",
                textAlign: "center",
                zindex: 8,
                right: 0,
                height: "40vh",
                width: "100%",
                objectFit: "fill",
              }}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                ...videoConstraints,
                facingMode,
              }}
            />
          </div>
        </>
      )}
      {imgSrc && isRetake && <img src={imgSrc} height="30%" width="50%" />}
      {isRetake && (
        <Grid container>
          <div style={{ display: "inline-flex", gap: 4 }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={usePhotoHandler}
            >
              Use Photo
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => retakeHandler()}
              color="secondary"
            >
              Retake
            </Button>
          </div>
        </Grid>
      )}
    </>
  );
};
export default Proof;
