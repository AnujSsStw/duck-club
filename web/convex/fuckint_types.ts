// export interface WeatherData {
//   location: Location;
//   forecast: {
//     forecastday: Array<ForecastDay>;
//   };
// }

// interface Location {
//   name: string;
//   region: string;
//   country: string;
//   lat: number;
//   lon: number;
//   tz_id: string;
//   localtime_epoch: number;
//   localtime: string;
// }

// interface ForecastDay {
//   date: string;
//   date_epoch: number;
//   day: {
//     maxtemp_c: number;
//     maxtemp_f: number;
//     mintemp_c: number;
//     mintemp_f: number;
//     avgtemp_c: number;
//     avgtemp_f: number;
//     maxwind_mph: number;
//     maxwind_kph: number;
//     totalprecip_mm: number;
//     totalprecip_in: number;
//     totalsnow_cm: number;
//     avgvis_km: number;
//     avgvis_miles: number;
//     avghumidity: number;
//     daily_will_it_rain: number;
//     daily_chance_of_rain: number;
//     daily_will_it_snow: number;
//     daily_chance_of_snow: number;
//     condition: {
//       text: string;
//       icon: string;
//       code: number;
//     };
//     uv: number;
//   };
//   astro: {
//     sunrise: string;
//     sunset: string;
//     moonrise: string;
//     moonset: string;
//     moon_phase: string;
//     moon_illumination: number;
//   };
//   hour: Array<Hour>;
// }

// interface Day {
//   maxtemp_c: number;
//   maxtemp_f: number;
//   mintemp_c: number;
//   mintemp_f: number;
//   avgtemp_c: number;
//   avgtemp_f: number;
//   maxwind_mph: number;
//   maxwind_kph: number;
//   totalprecip_mm: number;
//   totalprecip_in: number;
//   totalsnow_cm: number;
//   avgvis_km: number;
//   avgvis_miles: number;
//   avghumidity: number;
//   daily_will_it_rain: number;
//   daily_chance_of_rain: number;
//   daily_will_it_snow: number;
//   daily_chance_of_snow: number;
//   condition: {
//     text: string;
//     icon: string;
//     code: number;
//   };
//   uv: number;
// }

// interface Astro {
//   sunrise: string;
//   sunset: string;
//   moonrise: string;
//   moonset: string;
//   moon_phase: string;
//   moon_illumination: number;
// }

// interface Hour {
//   time_epoch: number;
//   time: string;
//   temp_c: number;
//   temp_f: number;
//   is_day: number;
//   condition: {
//     text: string;
//     icon: string;
//     code: number;
//   };
//   wind_mph: number;
//   wind_kph: number;
//   wind_degree: number;
//   wind_dir: string;
//   pressure_mb: number;
//   pressure_in: number;
//   precip_mm: number;
//   precip_in: number;
//   snow_cm: number;
//   humidity: number;
//   cloud: number;
//   feelslike_c: number;
//   feelslike_f: number;
//   windchill_c: number;
//   windchill_f: number;
//   heatindex_c: number;
//   heatindex_f: number;
//   dewpoint_c: number;
//   dewpoint_f: number;
//   will_it_rain: number;
//   chance_of_rain: number;
//   will_it_snow: number;
//   chance_of_snow: number;
//   vis_km: number;
//   vis_miles: number;
//   gust_mph: number;
//   gust_kph: number;
//   uv: number;
// }
export interface WeatherData {
  queryCost: number;
  latitude: number;
  longitude: number;
  resolvedAddress: string;
  address: string;
  timezone: string;
  tzoffset: number;
  days: Day[];
  stations: { [key: string]: Station };
}

export interface Day {
  datetime: Date;
  datetimeEpoch: number;
  tempmax: number;
  tempmin: number;
  temp: number;
  feelslikemax: number;
  feelslikemin: number;
  feelslike: number;
  dew: number;
  humidity: number;
  precip: number;
  precipprob: number;
  precipcover: number;
  preciptype: null;
  snow: number;
  snowdepth: number;
  windgust: null;
  windspeed: number;
  winddir: number;
  pressure: number;
  cloudcover: number;
  visibility: number;
  solarradiation: null;
  solarenergy: null;
  uvindex: null;
  sunrise: string;
  sunriseEpoch: number;
  sunset: string;
  sunsetEpoch: number;
  moonphase: number;
  conditions: Conditions;
  description: string;
  icon: Icon;
  stations: string[];
  source: Source;
  hours: Hour[];
}

export enum Conditions {
  Clear = "Clear",
  PartiallyCloudy = "Partially cloudy",
}

export interface Hour {
  datetime: string;
  datetimeEpoch: number;
  temp: number;
  feelslike: number;
  humidity: number;
  dew: number;
  precip: number;
  precipprob: number;
  snow: number;
  snowdepth: number;
  preciptype: null;
  windgust: null;
  windspeed: number;
  winddir: number;
  pressure: number;
  visibility: number;
  cloudcover: number;
  solarradiation: null;
  solarenergy: null;
  uvindex: null;
  conditions: Conditions;
  icon: Icon;
  stations: string[];
  source: Source;
}

export enum Icon {
  ClearNight = "clear-night",
  PartlyCloudyDay = "partly-cloudy-day",
  PartlyCloudyNight = "partly-cloudy-night",
}

export enum Source {
  Obs = "obs",
}

export interface Station {
  distance: number;
  latitude: number;
  longitude: number;
  useCount: number;
  id: string;
  name: string;
  quality: number;
  contribution: number;
}
