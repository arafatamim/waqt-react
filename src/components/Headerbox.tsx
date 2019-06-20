import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

const HeaderContainer = styled('div')({
  fontFamily: 'Poppins, sans-serif',
  padding: 20,
  fontSize: '20pt',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  '@media (max-width: 575px)': {
    margin: '30px 50px 10px 50px'
  }
});
const HeaderText = styled('div')({
  color: '#eee'
});

const Button = styled.button({
  background: 'none',
  cursor: 'pointer',
  color: '#eee',
  border: 'none',
  fontSize: '20pt'
});

const Headerbox: React.FC<{ toggleDialog: () => void }> = props => (
  <HeaderContainer>
    <HeaderText id="headerText">Waqt</HeaderText>
    <Button onClick={props.toggleDialog}>
      <FontAwesomeIcon className="iconButton" icon="cog" />
    </Button>
  </HeaderContainer>
);
export default Headerbox;
