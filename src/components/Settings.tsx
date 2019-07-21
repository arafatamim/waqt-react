import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "@emotion/styled";
import { lighten, darken } from "polished";

const Overlay = styled("div")({
  top: 0,
  left: 0,
  position: "fixed",
  width: "100%",
  height: "100%",
  backgroundColor: "#000",
  opacity: 0.4,
  zIndex: 1000
});
const SettingsBox = styled("div")({
  position: "fixed",
  width: "30%",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#222",
  borderRadius: 20,
  boxShadow: "20px 20px 50px rgba(0, 0, 0, 0.4)",
  padding: 25,
  zIndex: 1001,
  "@media (max-width: 768px)": {
    width: "60%"
  },
  "@media (max-width: 825px)": {
    width: "60%"
  },
  "@media (max-width: 1024px)": {
    width: "50%"
  },
  "@media (max-width: 575px)": {
    width: "90%",
    borderRadius: 0
  },
  "@media (max-width: 640px)": {
    borderRadius: 0
  }
});

const SettingsBoxHeader = styled("div")({
  fontFamily: "Poppins, sans-serif",
  fontSize: "15pt",
  color: "#eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20
});

const SettingsBoxContent = styled("div")({
  fontFamily: "Poppins, sans-serif",
  color: "#eee",
  position: "relative",
  display: "grid",
  gridRowGap: 12,
  fontSize: "11pt"
});

const SettingsBoxContentControl = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
});

const SelectControl = styled("select")({
  fontFamily: "Poppins, sans-serif",
  width: 221,
  padding: "5px 15px",
  fontSize: "11pt",
  border: "none",
  borderRadius: 100,
  outline: "none",
  backgroundColor: lighten(0.1, "#222"),
  color: "#eee"
});
const SettingsBoxContentLink = styled("a")({
  marginTop: 2,
  color: darken(0.2, "#eee"),
  textDecoration: "none",
  "&:hover": {
    color: lighten(0.4, "#eee")
  }
});
const SettingsBoxContentAboutInfo = styled("div")({
  color: darken(0.2, "#eee")
});
const DialogIconButton = styled("button")({
  background: "none",
  border: "none",
  color: "#eee",
  fontSize: "15pt"
});

export enum TimeFormat {
  Metric = "h:mm A",
  Imperial = "H:mm"
}
export type SettingsObject = {
  timeFormat: TimeFormat.Metric | TimeFormat.Imperial;
  calcMethod: "karachi" | "mwl" | "egypt" | "makkah" | "kuwait" | "america";
  lateAsr: boolean;
};
interface Props {
  params: { localTime: string; timeZone: string; settings: SettingsObject };
  toggleDialog: () => void;
  updateSettings: (settingsObj: SettingsObject) => void;
  repoURL: string;
}

class Settings extends React.Component<Props> {
  state: SettingsObject = { timeFormat: TimeFormat.Metric, calcMethod: "karachi", lateAsr: true };

  render() {
    return (
      <div>
        <Overlay onClick={this.props.toggleDialog} />
        <SettingsBox>
          <SettingsBoxHeader>
            <div>Settings</div>
            <DialogIconButton onClick={this.handleCloseAndUpdate}>
              <FontAwesomeIcon icon="save" className="iconButton" style={{ cursor: "pointer" }} />
            </DialogIconButton>
          </SettingsBoxHeader>
          <SettingsBoxContent>
            <SettingsBoxContentControl>
              Time format
              <SwitchButton
                buttons={{
                  left: {
                    value: TimeFormat.Metric,
                    label: "12-hour",
                    checked: this.state.timeFormat === TimeFormat.Metric ? true : false
                  },
                  right: {
                    value: TimeFormat.Imperial,
                    label: "24-hour",
                    checked: this.state.timeFormat === TimeFormat.Imperial ? true : false
                  }
                }}
                onChange={value => {
                  this.setState({ timeFormat: value });
                }}
              />
            </SettingsBoxContentControl>
            <SettingsBoxContentControl>
              Calculation method
              <SelectControl
                value={this.state.calcMethod}
                onChange={e => {
                  this.setState({ calcMethod: e.target.value });
                }}
              >
                <option value="karachi">Karachi</option>
                <option value="mwl">Muslim World League</option>
                <option value="egypt">Egyptian</option>
                <option value="makkah">Makkah</option>
                <option value="kuwait">Kuwait</option>
                <option value="america">North America</option>
              </SelectControl>
            </SettingsBoxContentControl>
            <SettingsBoxContentControl>
              Asr time
              <SwitchButton
                buttons={{
                  left: {
                    value: "earlier",
                    label: "Earlier",
                    checked: this.state.lateAsr ? false : true
                  },
                  right: {
                    value: "later",
                    label: "Later",
                    checked: this.state.lateAsr ? true : false
                  }
                }}
                onChange={value => {
                  value === "earlier"
                    ? this.setState({ lateAsr: false })
                    : this.setState({ lateAsr: true });
                }}
              />
            </SettingsBoxContentControl>
            <div id="localTime">Local Time: {this.props.params.localTime}</div>
            <div id="timezone">Timezone: {this.props.params.timeZone}</div>
            <SettingsBoxContentAboutInfo>
              View current prayer times for your location.
              <br />
              Made with ❤️ by Tamim Arafat.
              <br />
              <SettingsBoxContentLink
                href={this.props.repoURL}
                rel="noopener noreferrer"
                target="_blank"
                className="aboutLink"
              >
                <FontAwesomeIcon icon={["fab", "github"]} />
                &nbsp;Source on GitHub
              </SettingsBoxContentLink>
              <br />
              <br />
              <a href="https://ko-fi.com/Q5Q1TLM1" rel="noopener noreferrer" target="_blank">
                <img
                  height="36"
                  style={{ border: "0px", height: "36px" }}
                  src={require("../assets/kofi3.png")}
                  alt="Buy Me a Coffee at ko-fi.com"
                />
              </a>
            </SettingsBoxContentAboutInfo>
          </SettingsBoxContent>
        </SettingsBox>
      </div>
    );
  }

  windowKeyDown = (e: { keyCode: number }) => {
    if (e.keyCode === 27) this.props.toggleDialog();
  };
  componentDidMount() {
    this.setState({
      timeFormat: this.props.params.settings.timeFormat,
      calcMethod: this.props.params.settings.calcMethod,
      lateAsr: this.props.params.settings.lateAsr
    } as SettingsObject);
    document.addEventListener("keydown", this.windowKeyDown, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.windowKeyDown, false);
  }

  handleCloseAndUpdate = () => {
    this.props.updateSettings({
      timeFormat: this.state.timeFormat,
      calcMethod: this.state.calcMethod,
      lateAsr: this.state.lateAsr
    } as SettingsObject);
  };
}

const SwitchButton: React.FC<{
  buttons: {
    left: {
      value: string | number;
      label: string;
      checked: boolean;
    };
    right: {
      value: string | number;
      label: string;
      checked: boolean;
    };
  };
  onChange: (e: any) => void;
}> = props => {
  const ButtonsWrapper = styled.div({
    clear: "both",
    display: "inline-block"
  });
  const Switch = styled.input({
    position: "absolute",
    left: "-9999em",
    top: "-9999em",
    "& + label": {
      float: "left",
      padding: ".4em 1em",
      cursor: "pointer",
      marginRight: -1,
      color: "#fff",
      backgroundColor: "transparent",
      borderRadius: 100
    },
    "&:checked + label": {
      backgroundColor: lighten(0.1, "#222")
    }
  });
  const handleChange = (e: any) => {
    props.onChange(e.target.value);
  };
  return (
    <ButtonsWrapper>
      <Switch
        type="radio"
        value={props.buttons.left.value}
        id={props.buttons.left.value as string}
        checked={props.buttons.left.checked}
        onChange={handleChange}
      />
      <label htmlFor={props.buttons.left.value as string}>{props.buttons.left.label}</label>
      <Switch
        type="radio"
        value={props.buttons.right.value}
        id={props.buttons.right.value as string}
        checked={props.buttons.right.checked}
        onChange={handleChange}
      />
      <label htmlFor={props.buttons.right.value as string}>{props.buttons.right.label}</label>
    </ButtonsWrapper>
  );
};

export default Settings;
