import React from "react";

import Headerbox from "./components/Headerbox";
import Settings, { SettingsObject, TimeFormat } from "./components/Settings";
import Snackbar from "./components/Snackbar";
import TimeBox from "./components/TimeBox";
import * as functions from "./utils";

import { Global } from "@emotion/core";
import styled from "@emotion/styled";

const rowHeight: string = "210px";
const TimeBoxContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 33.3%)",
  gridTemplateRows: `repeat(2, ${rowHeight})`,
  // gridTemplateRows: 'auto',
  "@media (max-width: 800px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
    gridTemplateRows: `repeat(3, ${rowHeight})`
  },
  "@media (max-width: 575px)": {
    gridTemplateColumns: "1fr",
    gridTemplateRows: `repeat(6, ${rowHeight})`
  }
});
const BossContainer = styled("div")({
  "@media (min-width: 825px)": {
    padding: "3% 5%",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%"
  }
});

interface AppState {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  timeFormat: string;
  calcMethod: string;
  lateAsr: boolean;
  nextWaqt: string;
  timeToNextWaqt: string;
  settingsDialog: boolean;
  localTime: string;
  timeZone: string;
  snackbar: boolean;
}
class App extends React.Component {
  state: AppState = {
    fajr: "...",
    sunrise: "...",
    dhuhr: "...",
    asr: "...",
    maghrib: "...",
    isha: "...",
    timeFormat: TimeFormat.Metric,
    calcMethod: "karachi",
    lateAsr: false,
    nextWaqt: "",
    timeToNextWaqt: "",
    settingsDialog: false,
    localTime: "",
    timeZone: "",
    snackbar: false
  };

  render() {
    return (
      <div>
        <Global
          styles={{
            body: {
              backgroundColor: "#222",
              userSelect: "none",
              WebkitTapHighlightColor: "transparent"
            }
          }}
        />
        {this.state.settingsDialog && (
          <Settings
            params={this.settingsParameters()}
            toggleDialog={this.toggleDialog}
            updateSettings={this.updateSettings}
            repoURL="https://github.com/arafatamim/waqt-react"
          />
        )}
        <BossContainer>
          <Headerbox toggleDialog={this.toggleDialog} />
          <TimeBoxContainer>
            {["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((val, i) => (
              <TimeBox
                waqtName={val}
                waqtTime={this.state[val.toLowerCase()]}
                timeToNextWaqt={this.state.timeToNextWaqt}
                activeWaqt={this.state.nextWaqt === val}
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
    if (localStorage.getItem("settings")) {
      const settingsStore: SettingsObject = JSON.parse(localStorage.getItem("settings")!);
      this.setState({
        calcMethod: settingsStore.calcMethod,
        timeFormat: settingsStore.timeFormat,
        lateAsr: settingsStore.lateAsr
      } as SettingsObject);
    } else {
      this.setState({
        timeFormat: "h:mm A",
        calcMethod: functions.determineCalcMethod(),
        lateAsr: false
      } as SettingsObject);
    }
    // setInterval(this.setTimes(), 600000);
    this.setTimes();
  }

  toggleDialog = () => {
    this.setState({
      settingsDialog: !this.state.settingsDialog
    });
  };
  updateSettings = (settingsObj: SettingsObject) => {
    this.setState({
      timeFormat: settingsObj.timeFormat,
      calcMethod: settingsObj.calcMethod,
      lateAsr: settingsObj.lateAsr
    } as SettingsObject);
    localStorage.setItem("settings", JSON.stringify(settingsObj));
    this.toggleDialog();
    this.setTimes();
  };
  reloadTimes = () => {
    this.setState({
      snackbar: false
    });
    this.setTimes();
  };

  settingsParameters = () => {
    return {
      localTime: this.state.localTime,
      timeZone: this.state.timeZone,
      settings: {
        timeFormat: this.state.timeFormat,
        calcMethod: this.state.calcMethod,
        lateAsr: this.state.lateAsr
      } as SettingsObject
    };
  };
  setTimes = () => {
    functions
      .getLocation()
      .then(coords => {
        const times = functions.getPrayerTimes({
          coords: coords,
          calcMethod: this.state.calcMethod,
          timeFormat: this.state.timeFormat,
          lateAsr: this.state.lateAsr
        });
        const { nextWaqt, timeToNextWaqt } = functions.determineNextWaqt({
          formattedTimes: times,
          timeFormat: this.state.timeFormat
        });
        const { timeZone, localTime } = functions.getTimezoneAndLocaltime();

        this.setState({
          fajr: times.fajr,
          sunrise: times.sunrise,
          dhuhr: times.dhuhr,
          asr: times.asr,
          maghrib: times.maghrib,
          isha: times.isha,
          nextWaqt: nextWaqt,
          timeToNextWaqt: timeToNextWaqt,
          timeZone: timeZone,
          localTime: localTime,
          snackbar: false
        });
      })
      .catch(() => {
        this.setState({ snackbar: true });
      });
  };
}

export default App;
