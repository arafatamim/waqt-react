import React from 'react';
import styled, { keyframes, css, ThemeProvider } from 'styled-components';
import { rgba } from 'polished';

const flash = keyframes`
    from {
        border-color: #333;
    }
    to {
        border-color: #fff;
    }
`;
const theme = {
  fajr: {
    background: 'linear-gradient(135deg, #00055e 0%, #00055e 0%, #276de6 100%)',
    foreground: '#eee'
  },
  sunrise: {
    background: 'linear-gradient(315deg, #20bf55 0%, #01baef 74%)',
    foreground: '#333'
  },
  dhuhr: {
    background: 'linear-gradient(315deg, #f9d29d 0%, #ffd8cb 74%)',
    foreground: '#333'
  },
  asr: {
    background: 'linear-gradient(315deg, #fce043 0%, #fb7ba2 74%)',
    foreground: '#333'
  },
  maghrib: {
    background: 'linear-gradient(315deg, #d4418e 0%, #0652c5 74%)',
    foreground: '#eee'
  },
  isha: {
    background: 'linear-gradient(315deg, #537895 0%, #09203f 74%)',
    foreground: '#eee'
  }
};
const WaqtContainer = styled.div`
  margin: 10px;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 0 0.5px ${rgba('#000', 0.1)}, 0 5px 8px ${rgba('#000', 0.15)}, 0 20px 20px ${rgba(
  '#000',
  0.2
)};
  ${props =>
    props.activeWaqt &&
    css`
      border: 5px solid #ccc;
      animation: ${flash} 1.5s infinite alternate;
    `}
  background: ${props => props.theme.background};
  color: ${props => props.theme.foreground};
`;
const WaqtName = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 20pt;
  white-space: nowrap;
  overflow: auto;
`;
const WaqtTime = styled.div`
  margin-top: 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 40pt;
  white-space: nowrap;
  overflow: auto;
`;
const TimeBox = props => (
  <ThemeProvider theme={theme[props.waqtName.toLowerCase()]}>
    <WaqtContainer activeWaqt={props.activeWaqt} background={props.background}>
      <WaqtName>
        {props.waqtName}
        {props.activeWaqt && <span>{' ' + props.timeToNextWaqt}</span>}
      </WaqtName>
      <WaqtTime>{props.waqtTime}</WaqtTime>
    </WaqtContainer>
  </ThemeProvider>
);

export default TimeBox;
