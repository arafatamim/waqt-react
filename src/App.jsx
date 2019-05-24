import React from 'react';
import Headerbox from './components/Headerbox';
import Settings from './components/Settings';
import Snackbar from './components/Snackbar';
import TimeBox from './components/TimeBox';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import adhan from 'adhan';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props =>
      props.theme.dark ? props.theme.background.dark : props.theme.background.light};
      user-select: none;
  -webkit-tap-highlight-color: transparent;
  }
`;
const TimeBoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 33.3%);
  grid-template-rows: repeat(2, 220px);

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(3, 220px);
  }
  @media (max-width: 575px) {
    grid-template-columns: 100%;
    grid-template-rows: repeat(6, 220px);
  }
`;
const BossContainer = styled.div`
  @media (min-width: 825px) {
    padding: 3% 5%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
  }
`;

class App extends React.Component {
  state = {
    fajr: '...',
    sunrise: '...',
    dhuhr: '...',
    asr: '...',
    maghrib: '...',
    isha: '...',
    timeFormat: 'H:mm',
    timeToNextWaqt: null,
    nextWaqt: null,
    settingsDialog: false,
    localTime: null,
    timeZone: null,
    snackbar: false,
    theme: {
      dark: false,
      foreground: {
        dark: '#333',
        light: '#eee'
      },
      background: {
        light: '#eee',
        dark: '#222'
      }
    }
  };

  render() {
    return (
      <div>
        <GlobalStyle theme={this.state.theme} />
        {this.state.settingsDialog && (
          <Settings
            localtime={this.state.localTime}
            timezone={this.state.timeZone}
            tformat={this.state.timeFormat}
            appTheme={this.state.theme.dark ? 'dark' : 'light'}
            toggleDialog={this.toggleDialog}
            updateFormat={this.updateFormat}
            updateTheme={this.updateTheme}
            theme={this.state.theme}
          />
        )}
        <BossContainer>
          <Headerbox toggleDialog={this.toggleDialog} theme={this.state.theme} />
          <TimeBoxContainer>
            {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((val, i) => (
              <TimeBox
                waqtName={val}
                waqtTime={this.state[val.toLowerCase()]}
                timeToNextWaqt={this.state.timeToNextWaqt}
                activeWaqt={this.state.nextWaqt === val.toLowerCase()}
                key={`waqt-${i}`}
              />
            ))}
          </TimeBoxContainer>
          {this.state.snackbar && <Snackbar reloadTimes={this.reloadTimes} />}
        </BossContainer>
      </div>
    );
  }
  componentDidMount() {
    if (localStorage.getItem('timeFormat') != null) {
      this.setState({ timeFormat: localStorage.getItem('timeFormat') });
    } else {
      this.setState({ timeFormat: 'h:mm A' });
    }
    if (localStorage.getItem('appTheme') != null) {
      var theme = { ...this.state.theme };
      if (localStorage.getItem('appTheme') === 'light') {
        theme.dark = false;
      } else {
        theme.dark = true;
      }
      this.setState({ theme });
    }
    setInterval(this.getLocation(), 600000);
  }

  toggleDialog = () => {
    this.setState({
      settingsDialog: !this.state.settingsDialog
    });
  };
  updateFormat = val => {
    this.setState({
      timeFormat: val
    });
    localStorage.setItem('timeFormat', val);
    this.toggleDialog();
    this.getLocation();
  };
  updateTheme = val => {
    var theme = { ...this.state.theme };
    if (val === 'light') {
      theme.dark = false;
    } else {
      theme.dark = true;
    }
    this.setState({ theme });
    localStorage.setItem('appTheme', val);
    this.toggleDialog();
    window.location.reload();
  };
  reloadTimes = () => {
    this.setState({
      snackbar: false
    });
    this.getLocation();
  };

  getLocation() {
    var coords = {};
    navigator.geolocation.getCurrentPosition(
      location => {
        coords.lat = location.coords.latitude.toFixed(4);
        coords.lon = location.coords.longitude.toFixed(4);
        this.getTimes(coords);
      },
      err => {
        console.error(err);
        console.log('Fallback to IP geolocation');
        axios
          .get('http://ip-api.com/json/')
          .then(response => {
            coords.lat = response.data.lat.toFixed(4);
            coords.lon = response.data.lon.toFixed(4);
            this.getTimes(coords);
          })
          .catch(error => {
            console.error(error);
            this.setState({
              snackbar: true
            });
          });
      }
    );

    return coords;
  }
  getTimes(coords) {
    var date = new Date();
    var coordinates = new adhan.Coordinates(coords.lat, coords.lon);
    var params = adhan.CalculationMethod.Karachi();
    params.madhab = adhan.Madhab.Hanafi;
    params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
    var prayerTimes = new adhan.PrayerTimes(coordinates, date, params);
    var formattedTime = adhan.Date.formattedTime;
    let UTCOffset = moment
      .duration(
        moment()
          .parseZone()
          .format('Z')
      )
      .asHours();
    var milFajr = formattedTime(prayerTimes.fajr, UTCOffset, '24h');
    var milSunrise = formattedTime(prayerTimes.sunrise, UTCOffset, '24h');
    var milDhuhr = formattedTime(prayerTimes.dhuhr, UTCOffset, '24h');
    var milAsr = formattedTime(prayerTimes.asr, UTCOffset, '24h');
    var milMaghrib = formattedTime(prayerTimes.maghrib, UTCOffset, '24h');
    var milIsha = formattedTime(prayerTimes.isha, UTCOffset, '24h');

    this.setState({ fajr: moment(milFajr, 'HH:mm').format(this.state.timeFormat) });
    this.setState({ sunrise: moment(milSunrise, 'HH:mm').format(this.state.timeFormat) });
    this.setState({ dhuhr: moment(milDhuhr, 'HH:mm').format(this.state.timeFormat) });
    this.setState({ asr: moment(milAsr, 'HH:mm').format(this.state.timeFormat) });
    this.setState({ maghrib: moment(milMaghrib, 'HH:mm').format(this.state.timeFormat) });
    this.setState({ isha: moment(milIsha, 'HH:mm').format(this.state.timeFormat) });

    this.setState({ localTime: moment().format('MMMM Do YYYY') });
    this.setState({
      timeZone:
        'GMT' +
        moment()
          .parseZone()
          .format('Z')
    });

    let unixNow = moment().unix();

    let unixFajr = moment(milFajr, 'HH:mm').unix();
    let unixSunrise = moment(milSunrise, 'HH:mm').unix();
    let unixDhuhr = moment(milDhuhr, 'HH:mm').unix();
    let unixAsr = moment(milAsr, 'HH:mm').unix();
    let unixMaghrib = moment(milMaghrib, 'HH:mm').unix();
    let unixIsha = moment(milIsha, 'HH:mm').unix();

    if (unixNow < unixFajr) {
      this.setState({ nextWaqt: 'fajr' });
      this.setState({ timeToNextWaqt: moment.unix(unixFajr).fromNow() });
    } else if (unixNow < unixSunrise && unixNow > unixFajr) {
      this.setState({ nextWaqt: 'sunrise' });
      this.setState({ timeToNextWaqt: moment.unix(unixSunrise).fromNow() });
    } else if (unixNow < unixDhuhr && unixNow > unixSunrise) {
      this.setState({ nextWaqt: 'dhuhr' });
      this.setState({ timeToNextWaqt: moment.unix(unixDhuhr).fromNow() });
    } else if (unixNow < unixAsr && unixNow > unixDhuhr) {
      this.setState({ nextWaqt: 'asr' });
      this.setState({ timeToNextWaqt: moment.unix(unixAsr).fromNow() });
    } else if (unixNow < unixMaghrib && unixNow > unixAsr) {
      this.setState({ nextWaqt: 'maghrib' });
      this.setState({ timeToNextWaqt: moment.unix(unixMaghrib).fromNow() });
    } else if (unixNow < unixIsha && unixNow > unixMaghrib) {
      this.setState({ nextWaqt: 'isha' });
      this.setState({ timeToNextWaqt: moment.unix(unixIsha).fromNow() });
    }
  }
}

export default App;
