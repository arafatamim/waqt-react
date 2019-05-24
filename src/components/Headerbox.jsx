import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import './Headerbox.scss';
import styled, { ThemeProvider } from 'styled-components';

const HeaderContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  font-size: 20pt;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 575px) {
    margin: 30px 50px 10px 50px;
  }
`;
const HeaderText = styled.div`
  color: ${props =>
    props.theme.dark ? props.theme.foreground.light : props.theme.foreground.dark};
`;
const Icon = styled(FontAwesomeIcon)`
  color: ${props =>
    props.theme.dark ? props.theme.foreground.light : props.theme.foreground.dark};
  cursor: pointer;
`;
// TODO: update style with theme
const Headerbox = props => (
  <ThemeProvider theme={props.theme}>
    <HeaderContainer>
      <HeaderText id="headerText">Waqt</HeaderText>
      <Icon className="iconButton" icon="cog" onClick={props.toggleDialog} />
    </HeaderContainer>
  </ThemeProvider>
);
export default Headerbox;
