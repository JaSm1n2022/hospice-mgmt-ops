import React, { useState } from "react";
import Webcam from "react-webcam";

// MUI v4 imports
import { CameraAlt, FlipCameraAndroid } from "@material-ui/icons";
import { Button, Grid, Tooltip } from "@material-ui/core";

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
    setIsRetake((v) => !v);
    setImgSrc(imageSrc);
  }, []);

  const retakeHandler = () => setIsRetake((v) => !v);
  const usePhotoHandler = () => props.onUsePhotoHandler(imgSrc);

  return (
    <>
      {!isRetake && (
        <>
          <Grid container justify="space-between">
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
              muted
              ref={webcamRef}
              style={{
                textAlign: "center",
                zIndex: 8,
                right: 0,
                height: "20vh",
                width: props.isMobile ? "100%" : "50%",
                objectFit: "fill",
              }}
              screenshotFormat="image/jpeg"
              videoConstraints={{ ...videoConstraints, facingMode }}
            />
          </div>
        </>
      )}

      {imgSrc && isRetake && (
        <img src={imgSrc} alt="" width={props.isMobile ? "90%" : "40%"} />
      )}

      {isRetake && (
        <Grid container>
          <div
            style={{
              display: "inline-flex",
              gap: 4,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
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
              onClick={retakeHandler}
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
