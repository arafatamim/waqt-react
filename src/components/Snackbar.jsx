import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import './Snackbar.scss';
import styled from 'styled-components';

const ErrorBanner = styled.div`
  background-color: #ff1c1c;
  font-family: 'Poppins', sans-serif;
  color: white;
  position: fixed;
  bottom: 0px;
  left: 0;
  width: 100vw;
  max-width: 100%;
  padding: 10px 15px;
  box-shadow: 0px -7px 50px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
  box-sizing: border-box;
`;
const BtnReload = styled.span`
  display: inline-block;
  background-color: #cc1919;
  padding: 5px;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  &:active {
    background-color: #b61515;
  }
`;
const Snackbar = props => (
  <ErrorBanner>
    <span>
      <FontAwesomeIcon style={{ marginRight: '10px' }} icon="times-circle" />
      <span className="bannerText">Something went wrong</span>
    </span>
    <BtnReload onClick={props.reloadTimes}>
      <FontAwesomeIcon icon="redo" />
    </BtnReload>
  </ErrorBanner>
);
export default Snackbar;
