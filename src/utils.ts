import * as adhan from "adhan";
import moment from "moment";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}
/** Uses HTML5 geolocation if present, else IP geolocation, which may not be accurate */
export const getLocation = () => {
  const getIPLocation = (
    resolve: (value?: Coordinates | PromiseLike<Coordinates> | undefined) => void,
    reject: (reason?: any) => void
  ) => {
    fetch("https://ipapi.co/json")
      .then(response => {
        if (response.ok) {
          return response.json().then(data => {
            resolve({ latitude: data.latitude, longitude: data.longitude });
          });
        } else {
          reject(response.statusText);
        }
      })
      .catch(err => {
        reject(err);
      });
  };
  return new Promise<Coordinates>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        location => {
          resolve({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        },
        error => {
          getIPLocation(resolve, reject);
        }
      );
    } else {
      getIPLocation(resolve, reject);
    }
  });
};

/** Calculate prayer times using Adhan.js library */
export const getPrayerTimes = (parameters: {
  coords: Coordinates;
  calcMethod: string;
  timeFormat: string;
  lateAsr: boolean;
}) => {
  const coordinates = new adhan.Coordinates(
    parameters.coords.latitude,
    parameters.coords.longitude
  );
  const date = new Date();
  let params: any;
  // Calculation method; refer https://github.com/batoulapps/adhan-js#calculation-parameters
  const method = parameters.calcMethod;
  switch (method) {
    case "karachi":
      params = adhan.CalculationMethod.Karachi();
      break;
    case "mwl":
      params = adhan.CalculationMethod.MuslimWorldLeague();
      break;
    case "egypt":
      params = adhan.CalculationMethod.Egyptian();
      break;
    case "makkah":
      params = adhan.CalculationMethod.UmmAlQura();
      break;
    case "kuwait":
      params = adhan.CalculationMethod.Kuwait();
      break;
    case "america":
      params = adhan.CalculationMethod.NorthAmerica();
      break;
  }
  // Asr method; Shafi has early Asrs, while Hanafi delays Asr time
  const lateAsr = parameters.lateAsr;
  switch (lateAsr) {
    case true:
      params.madhab = adhan.Madhab.Hanafi;
      break;
    case false:
      params.madhab = adhan.Madhab.Shafi;
      break;
  }
  // For regions in higher latitudes
  params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;

  const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);
  let formattedTimes: PrayerTimes = {
    fajr: moment(prayerTimes.fajr).format(parameters.timeFormat),
    sunrise: moment(prayerTimes.sunrise).format(parameters.timeFormat),
    dhuhr: moment(prayerTimes.dhuhr).format(parameters.timeFormat),
    asr: moment(prayerTimes.asr).format(parameters.timeFormat),
    maghrib: moment(prayerTimes.maghrib).format(parameters.timeFormat),
    isha: moment(prayerTimes.isha).format(parameters.timeFormat)
  };
  return formattedTimes;
};

/** Determines the next prayer time by comparing unix timestamps */
export const determineNextWaqt = (parameters: {
  formattedTimes: PrayerTimes;
  timeFormat: string;
}) => {
  const unixNow = moment().unix();

  const unixFajr = moment(parameters.formattedTimes.fajr, parameters.timeFormat).unix();
  const unixSunrise = moment(parameters.formattedTimes.sunrise, parameters.timeFormat).unix();
  const unixDhuhr = moment(parameters.formattedTimes.dhuhr, parameters.timeFormat).unix();
  const unixAsr = moment(parameters.formattedTimes.asr, parameters.timeFormat).unix();
  const unixMaghrib = moment(parameters.formattedTimes.maghrib, parameters.timeFormat).unix();
  const unixIsha = moment(parameters.formattedTimes.isha, parameters.timeFormat).unix();

  var nextWaqt: string;
  var timeToNextWaqt: string;

  if (unixNow < unixFajr) {
    nextWaqt = "Fajr";
    timeToNextWaqt = moment.unix(unixFajr).fromNow();
  } else if (unixNow < unixSunrise && unixNow > unixFajr) {
    nextWaqt = "Sunrise";
    timeToNextWaqt = moment.unix(unixSunrise).fromNow();
  } else if (unixNow < unixDhuhr && unixNow > unixSunrise) {
    nextWaqt = "Dhuhr";
    timeToNextWaqt = moment.unix(unixDhuhr).fromNow();
  } else if (unixNow < unixAsr && unixNow > unixDhuhr) {
    nextWaqt = "Asr";
    timeToNextWaqt = moment.unix(unixAsr).fromNow();
  } else if (unixNow < unixMaghrib && unixNow > unixAsr) {
    nextWaqt = "Maghrib";
    timeToNextWaqt = moment.unix(unixMaghrib).fromNow();
  } else if (unixNow < unixIsha && unixNow > unixMaghrib) {
    nextWaqt = "Isha";
    timeToNextWaqt = moment.unix(unixIsha).fromNow();
  } else if (unixNow > unixIsha) {
    nextWaqt = "Fajr";
    timeToNextWaqt = "tomorrow";
  } else {
    nextWaqt = "";
    timeToNextWaqt = "";
  }

  return {
    nextWaqt,
    timeToNextWaqt
  };
};

/** Returns timezone and localtime */
export const getTimezoneAndLocaltime = () => {
  return {
    timeZone:
      "GMT " +
      moment()
        .parseZone()
        .format("Z"),
    localTime: moment().format("Do MMMM YYYY")
  };
};

/** Rough determination of calcMethod from timezone */
export const determineCalcMethod = () => {
  const timeZone = parseInt(
    moment()
      .parseZone()
      .format("Z")
  );
  if (timeZone >= 0 && timeZone <= 2) {
    return "mwl";
  } else if (timeZone >= 3 && timeZone <= 4) {
    return "makkah";
  } else if (timeZone >= 5 && timeZone <= 7) {
    return "karachi";
  } else if (timeZone >= 8 && timeZone <= 12) {
    return "mwl";
  } else {
    return "mwl";
  }
};
