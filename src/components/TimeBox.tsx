import { keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';

const flash = keyframes({
  from: {
    borderColor: '#333'
  },
  to: {
    borderColor: '#fff'
  }
});

const themes: { [key: string]: any } = {
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
    background: 'linear-gradient(315deg, #203695 0%, #092070 74%)',
    foreground: '#eee'
  }
};

type StyleProps = {
  activeWaqt: boolean;
  currentTheme: {
    background: string;
    foreground: string;
  };
};

const WaqtContainer = styled('div')<StyleProps>(
  {
    margin: '10px',
    padding: '25px',
    borderRadius: '20px',
    boxShadow:
      '0 0 0.5px rgba(0, 0, 0, 0.1), 0 5px 8px rgba(0, 0, 0, 0.15),  0 20px 20px rgba(0, 0, 0, 0.2)'
  },
  props => ({ background: props.currentTheme.background, color: props.currentTheme.foreground }),
  props =>
    props.activeWaqt && { border: `5px solid #ccc`, animation: `${flash} 1.5s infinite alternate` }
);

const WaqtName = styled('div')({
  fontFamily: 'Poppins',
  fontSize: '20pt',
  whiteSpace: 'nowrap',
  overflow: 'auto'
});

const WaqtTime = styled('div')({
  marginTop: '20px',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '40pt',
  whiteSpace: 'nowrap',
  overflow: 'auto'
});

type ThemeObject = {
  background: string;
  foreground: string;
};
const getTheme = (waqtName: string): ThemeObject => {
  return themes[waqtName.toLowerCase()];
};

const TimeBox: React.FC<{
  waqtName: string;
  activeWaqt: boolean;
  timeToNextWaqt: string;
  waqtTime: string;
}> = props => (
  <WaqtContainer activeWaqt={props.activeWaqt} currentTheme={getTheme(props.waqtName)}>
    <WaqtName>
      {props.waqtName}
      {props.activeWaqt && <span>{' ' + props.timeToNextWaqt}</span>}
    </WaqtName>
    <WaqtTime>{props.waqtTime}</WaqtTime>
  </WaqtContainer>
);

export default TimeBox;
