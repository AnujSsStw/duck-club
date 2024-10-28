import { v } from "convex/values";
import { action, query } from "./_generated/server";
import { WeatherData } from "./fuckint_types";

export const getUserRecentLocations = query({
  args: {
    hunterId: v.optional(v.id("hunters")),
  },
  handler: async (ctx, args) => {
    if (!args.hunterId) {
      return [];
    }
    return await ctx.db
      .query("huntLocations")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", args.hunterId))
      .order("desc")
      .take(3);
  },
});

export const getLocationName = action({
  args: {
    location: v.object({ lat: v.number(), lng: v.number() }),
  },
  handler: async (ctx, args) => {
    const location = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${args.location.lat},${args.location.lng}&key=${process.env.GOOGLE_MAPS_API}`
    );
    const location_data = await location.json();
    return extractLocationData(location_data);
  },
});

export function extractLocationData(data: { results: any[] }) {
  // Find the result with the most detailed information
  const detailedResult = data.results.reduce(
    (
      prev: { address_components: string | any[] },
      current: { address_components: string | any[] }
    ) =>
      current.address_components.length > prev.address_components.length
        ? current
        : prev
  );

  const getAddressComponent = (types: any[]) => {
    return (
      detailedResult.address_components.find(
        (component: { types: string | any[] }) =>
          types.some((type: any) => component.types.includes(type))
      )?.long_name || ""
    );
  };

  return {
    name: getAddressComponent(["route"]) || "Unnamed Location",
    description: detailedResult.formatted_address,
    latitude: detailedResult.geometry.location.lat,
    longitude: detailedResult.geometry.location.lng,
    state: getAddressComponent(["administrative_area_level_1"]),
    county: getAddressComponent(["country"]),
    city: getAddressComponent([
      "locality",
      "administrative_area_level_2",
      "administrative_area_level_3",
    ]),
  };
}

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
    `https://api.weatherapi.com/v1/history.json?key=${process.env.WEATHER_API}&q=${location.lat},${location.lng}&aqi=no&dt=${date.split("T")[0]}`
  );
  const weatherData = (await weather.json()) as WeatherData;
  console.log(weatherData);
  const hourData = weatherData.forecast.forecastday[0].hour.find(
    (hour) => hour.time === `${date.split("T")[0]} ${slotTime}`
  );

  if (!hourData) {
    throw new Error("Weather data not found for the specified time");
  }

  return {
    dt: hourData.time,
    temperatureF: hourData.temp_f,
    windDirection: hourData.wind_dir,
    windSpeed: hourData.wind_mph,
    precipitation: hourData.precip_in,
    condition: hourData.condition.text,
    humidity: hourData.humidity,
    visibility: hourData.vis_miles,
    uvIndex: hourData.uv,
    source: "weatherapi.com",
  };
}

export async function getLocationData(location: { lat: number; lng: number }) {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.GOOGLE_MAPS_API}`
  );
  const location_data = await res.json();
  return location_data;
}
