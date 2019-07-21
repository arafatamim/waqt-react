import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import './Snackbar.scss';
import styled from "@emotion/styled";

const ErrorBanner = styled("div")({
  backgroundColor: "#ff1c1c",
  fontFamily: "Poppins, sans-serif",
  color: "white",
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100vw",
  maxWidth: "100%",
  padding: "10px 15px",
  boxShadow: "0px -7px 50px rgba(0, 0, 0, 0.7)",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  boxSizing: "border-box"
});

const BtnReload = styled("span")({
  display: "inline-block",
  backgroundColor: "#cc1919",
  padding: 5,
  borderRadius: "50%",
  width: 25,
  height: 25,
  textAlign: "center",
  verticalAlign: "middle",
  cursor: "pointer",
  "&:active": {
    backgroundColor: "#b61515"
  }
});
const Snackbar: React.FC<{ reloadTimes: () => void }> = props => (
  <ErrorBanner>
    <span>
      <FontAwesomeIcon style={{ marginRight: "10px" }} icon="times-circle" />
      <span className="bannerText">Something went wrong</span>
    </span>
    <BtnReload onClick={props.reloadTimes}>
      <FontAwesomeIcon icon="redo" />
    </BtnReload>
  </ErrorBanner>
);
export default Snackbar;
