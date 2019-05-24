import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { ThemeProvider } from 'styled-components';
import { lighten, darken } from 'polished';

const Overlay = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.4;
  z-index: 1000;
`;
const SettingsBox = styled.div`
  position: fixed;
  width: 30%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props =>
    props.theme.dark ? props.theme.background.dark : props.theme.background.light};
  border-radius: 20px;
  box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.4);
  padding: 25px;
  z-index: 1001;

  @media (max-width: 768px) {
    width: 60%;
  }
  @media (max-width: 825px) {
    width: 60%;
  }
  @media (max-width: 1024px) {
    width: 50%;
  }
  @media (max-width: 575px) {
    width: 90%;
    border-radius: 0;
  }
  @media (max-width: 640px) {
    border-radius: 0;
  }
`;

const SettingsBoxHeader = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 15pt;
  color: ${props =>
    props.theme.dark ? props.theme.foreground.light : props.theme.foreground.dark};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SettingsBoxContent = styled.div`
  font-family: 'Poppins', sans-serif;
  color: ${props =>
    props.theme.dark ? props.theme.foreground.light : props.theme.foreground.dark};
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  font-size: 11pt;
`;

const SettingsBoxContentControl = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const SelectControl = styled.select`
  font-family: 'Poppins', sans-serif;
  width: 221px;
  padding: 5px 15px;
  font-size: 11pt;
  border: none;
  border-radius: 100px;
  outline: none;
  background-color: ${props =>
    props.theme.dark
      ? lighten(0.1, props.theme.background.dark)
      : darken(0.1, props.theme.background.light)};
  color: ${props =>
    props.theme.dark ? props.theme.foreground.light : props.theme.foreground.dark};
`;
const SettingsBoxContentLink = styled.a`
  margin-top: 2px;
  color: ${props =>
    props.theme.dark
      ? darken(0.2, props.theme.foreground.light)
      : lighten(0.2, props.theme.foreground.dark)};
  text-decoration: none;
  &:hover {
    color: ${props =>
      props.theme.dark
        ? lighten(0.4, props.theme.foreground.light)
        : darken(0.4, props.theme.foreground.dark)};
  }
`;
const SettingsBoxContentAboutInfo = styled.div`
  color: ${props =>
    props.theme.dark
      ? darken(0.2, props.theme.foreground.light)
      : lighten(0.2, props.theme.foreground.dark)};
`;
class Settings extends Component {
  state = { timeFormat: 'h:mm A', theme: 'dark' };

  render() {
    return (
      <div>
        <Overlay onClick={this.props.toggleDialog} />
        <ThemeProvider theme={this.props.theme}>
          <SettingsBox>
            <SettingsBoxHeader>
              <div>Settings</div>
              <FontAwesomeIcon
                icon="save"
                id="closeIcon"
                className="iconButton"
                onClick={this.handleCloseAndUpdate}
                style={{ cursor: 'pointer' }}
              />
            </SettingsBoxHeader>
            <SettingsBoxContent>
              <SettingsBoxContentControl>
                Time format
                <SelectControl value={this.state.timeFormat} onChange={this.handleFormatChange}>
                  <option value="h:mm A">12-hour</option>
                  <option value="H:mm">24-hour</option>
                </SelectControl>
              </SettingsBoxContentControl>
              <SettingsBoxContentControl>
                Theme
                <SelectControl value={this.state.theme} onChange={this.handleThemeChange}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </SelectControl>
              </SettingsBoxContentControl>
              <div id="localTime">Local Time: {this.props.localtime}</div>
              <div id="timezone">Timezone: {this.props.timezone}</div>
              <SettingsBoxContentAboutInfo>
                An app to display current prayer times for the selected location.
                <br />
                Made with love by Tamim Arafat.
                <br />
                <SettingsBoxContentLink
                  href="http://github.com/arafatamim/waqt-web"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="aboutLink"
                >
                  <FontAwesomeIcon icon={['fab', 'github']} />
                  &nbsp;Source on GitHub
                </SettingsBoxContentLink>
                <br />
                <br />
                <a href="https://ko-fi.com/Q5Q1TLM1" rel="noopener noreferrer" target="_blank">
                  <img
                    height="36"
                    style={{ border: '0px', height: '36px' }}
                    src={require('../assets/kofi3.png')}
                    border="0"
                    alt="Buy Me a Coffee at ko-fi.com"
                  />
                </a>
              </SettingsBoxContentAboutInfo>
            </SettingsBoxContent>
          </SettingsBox>
        </ThemeProvider>
      </div>
    );
  }

  windowKeyDown = e => {
    if (e.keyCode === 27) this.props.toggleDialog();
  };
  componentDidMount() {
    this.setState({
      timeFormat: this.props.tformat,
      theme: this.props.appTheme
    });
    document.addEventListener('keydown', this.windowKeyDown, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.windowKeyDown, false);
  }
  handleFormatChange = e => {
    this.setState({
      timeFormat: e.target.value
    });
  };
  handleThemeChange = e => {
    this.setState({
      theme: e.target.value
    });
  };

  handleCloseAndUpdate = () => {
    this.props.updateFormat(this.state.timeFormat);
    this.props.updateTheme(this.state.theme);
  };
}

export default Settings;
