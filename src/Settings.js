import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Settings.scss';

class Settings extends Component {
    state = { timeFormat: 'h:mm A' };
    formatChanged = e => {
        console.log(e.target.value);
        this.setState({
            timeFormat: e.target.value
        });
    };
    windowKeyDown = e => {
        if (e.keyCode === 27) this.props.toggleDialog();
    };
    componentDidMount() {
        this.setState({
            timeFormat: this.props.tformat
        });
        document.addEventListener('keydown', this.windowKeyDown, false);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.windowKeyDown, false);
    }
    formatChanged = e => {
        this.setState({
            timeFormat: e.target.value
        });
    };

    closeAndUpdate = () => {
        this.props.updateFormat(this.state.timeFormat);
    };

    render() {
        return (
            <div>
                <div id="bg" onClick={this.props.toggleDialog} />
                <div id="settingsBox">
                    <div id="divSettingsHeader">
                        <div id="settingsText">Settings</div>
                        <FontAwesomeIcon
                            icon="save"
                            id="closeIcon"
                            className="iconButton"
                            onClick={this.closeAndUpdate}
                        />
                    </div>
                    <div id="divSettingsContent">
                        <div className="control2">
                            Time format
                            <select
                                id="cmbFormat"
                                value={this.state.timeFormat}
                                onChange={this.formatChanged}
                            >
                                <option value="h:mm A">12-hour</option>
                                <option value="H:mm">24-hour</option>
                            </select>
                        </div>
                        <div id="localTime">Local Time: {this.props.localtime}</div>
                        <div id="timezone">Timezone: {this.props.timezone}</div>
                        <div id="aboutInfo">
                            An app to display current prayer times for the selected location.
                            <br />
                            Made with love by Tamim Arafat.
                            <br />
                            <a
                                href="http://github.com/arafatamim/waqt-web"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="aboutLink"
                            >
                                <FontAwesomeIcon icon={['fab', 'github']} />
                                &nbsp;Source on GitHub
                            </a>
                            <br />
                            <br />
                            <a
                                href="https://ko-fi.com/Q5Q1TLM1"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <img
                                    height="36"
                                    style={{ border: '0px', height: '36px' }}
                                    src={require('./assets/kofi3.png')}
                                    border="0"
                                    alt="Buy Me a Coffee at ko-fi.com"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Settings;
