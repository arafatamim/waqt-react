import React from 'react';
import './App.scss';
import Headerbox from './Headerbox';
import Settings from './Settings';
import axios from 'axios';
import moment from 'moment';
import adhan from 'adhan';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fajr: '...',
            sunrise: '...',
            dhuhr: '...',
            asr: '...',
            maghrib: '...',
            isha: '...',
            timeFormat: 'h:mm A',
            timeToNextWaqt: null,
            nextWaqt: null,
            settingsDialog: false,
            localTime: null,
            timeZone: null
        };
    }

    componentDidMount() {
        setInterval(this.getLocation(), 600000);
    }
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
        // this.localTime = moment().format('MMMM Do YYYY');
        // this.timezone =
        //     'GMT' +
        //     moment()
        //         .parseZone()
        //         .format('Z');
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
    render() {
        return (
            <div id="bossContainer">
                {this.state.settingsDialog && (
                    <Settings localtime={this.state.localTime} timezone={this.state.timeZone} />
                )}
                <div id="secondBossContainer">
                    <Headerbox />
                    <div className="contentBoxes">
                        <div
                            className={
                                'contentBox ' + (this.state.nextWaqt === 'fajr' ? 'active' : null)
                            }
                        >
                            <div className="divWaqt" id="divWaqt1">
                                <div className="waqtName">
                                    Fajr
                                    {this.state.nextWaqt === 'fajr' && (
                                        <span className="nextWaqtTime">
                                            {this.state.timeToNextWaqt}
                                        </span>
                                    )}
                                </div>
                                <div className="waqtTime" id="waqtTime1">
                                    {this.state.fajr}
                                </div>
                            </div>
                        </div>
                        <div
                            className={
                                'contentBox ' +
                                (this.state.nextWaqt === 'sunrise' ? 'active' : null)
                            }
                        >
                            <div className="divWaqt" id="divWaqt2">
                                <div className="waqtName">
                                    Sunrise
                                    {this.state.nextWaqt === 'sunrise' && (
                                        <span className="nextWaqtTime">
                                            {this.state.timeToNextWaqt}
                                        </span>
                                    )}
                                </div>
                                <div className="waqtTime" id="waqtTime2">
                                    {this.state.sunrise}
                                </div>
                            </div>
                        </div>

                        <div
                            className={
                                'contentBox ' + (this.state.nextWaqt === 'dhuhr' ? 'active' : null)
                            }
                        >
                            <div className="divWaqt" id="divWaqt3">
                                <div className="waqtName">
                                    Dhuhr
                                    {this.state.nextWaqt === 'dhuhr' && (
                                        <span className="nextWaqtTime">
                                            {this.state.timeToNextWaqt}
                                        </span>
                                    )}
                                </div>
                                <div className="waqtTime" id="waqtTime3">
                                    {this.state.dhuhr}
                                </div>
                            </div>
                        </div>

                        <div
                            className={
                                'contentBox ' + (this.state.nextWaqt === 'asr' ? 'active' : null)
                            }
                        >
                            <div className="divWaqt" id="divWaqt4">
                                <div className="waqtName">
                                    Asr
                                    {this.state.nextWaqt === 'asr' && (
                                        <span className="nextWaqtTime">
                                            {this.state.timeToNextWaqt}
                                        </span>
                                    )}
                                </div>
                                <div className="waqtTime" id="waqtTime4">
                                    {this.state.asr}
                                </div>
                            </div>
                        </div>

                        <div
                            className={
                                'contentBox ' +
                                (this.state.nextWaqt === 'maghrib' ? 'active' : null)
                            }
                        >
                            <div className="divWaqt" id="divWaqt5">
                                <div className="waqtName">
                                    Maghrib
                                    {this.state.nextWaqt === 'maghrib' && (
                                        <span className="nextWaqtTime">
                                            {this.state.timeToNextWaqt}
                                        </span>
                                    )}
                                </div>
                                <div className="waqtTime" id="waqtTime5">
                                    {this.state.maghrib}
                                </div>
                            </div>
                        </div>

                        <div
                            className={
                                'contentBox ' + (this.state.nextWaqt === 'isha' ? 'active' : null)
                            }
                        >
                            <div className="divWaqt" id="divWaqt6">
                                <div className="waqtName">
                                    Isha
                                    {this.state.nextWaqt === 'isha' && (
                                        <span className="nextWaqtTime">
                                            {this.state.timeToNextWaqt}
                                        </span>
                                    )}
                                </div>
                                <div className="waqtTime" id="waqtTime6">
                                    {this.state.isha}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
