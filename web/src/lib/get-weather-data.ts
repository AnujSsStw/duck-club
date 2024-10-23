import { WeatherData } from "../../convex/fuckint_types";

const timeSlot = [
  {
    slot: "morning",
    avgT: "07:00",
  },
  {
    slot: "mid-day",
    avgT: "12:00",
  },
  {
    slot: "afternoon",
    avgT: "17:00",
  },
];

export async function getWeatherData(
  date: string,
  location: { lat: number; lng: number },
  slot: "morning" | "mid-day" | "afternoon"
): Promise<any> {
  const slotTime = timeSlot.find((t) => t.slot === slot)?.avgT || "12:00";
  const weather = await fetch(
    `https://api.weatherapi.com/v1/history.json?key=${process.env.NEXT_PUBLIC_WEATHER_API}&q=${location.lat},${location.lng}&aqi=no&dt=${date.split("T")[0]}`
  );
  const weatherData = (await weather.json()) as WeatherData;

  const hourData = weatherData.forecast.forecastday[0].hour.find(
    (hour) => hour.time === `${date.split("T")[0]} ${slotTime}`
  );

  if (!hourData) {
    throw new Error("Weather data not found for the specified time");
  }

  return {
    dt: hourData.time,
    temperatureC: hourData.temp_c,
    windDirection: hourData.wind_dir,
    windSpeed: hourData.wind_kph,
    precipitation: hourData.precip_mm,
    condition: hourData.condition.text,
    humidity: hourData.humidity,
    visibility: hourData.vis_km,
    uvIndex: hourData.uv,
    source: "weatherapi.com",
  };
}
