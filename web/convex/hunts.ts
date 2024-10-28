import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { WeatherData } from "./fuckint_types";
import { extractLocationData } from "./utils";

export const getSubHunts = query({
  args: { id: v.id("hunts") },
  handler: async (ctx, { id }) => {
    const data = await ctx.db.get(id);
    if (!data) return null;

    const subHunts = await Promise.all(
      data.subHunts.map((subHunt: Id<"subHunts">) => ctx.db.get(subHunt))
    );

    return subHunts;
  },
});

export const getHunts = query({
  args: { id: v.optional(v.id("hunters")) },
  handler: async (ctx, args) => {
    if (args.id === undefined) return null;
    const data = await ctx.db
      .query("hunts")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", args.id!))
      .collect();

    // get the location
    const huntsWithLocation = await Promise.all(
      data.map(async (hunt) => {
        const location = await ctx.db.get(hunt.locationID);
        return {
          ...hunt,
          locationName: location?.description,
        };
      })
    );

    return huntsWithLocation;
  },
});

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

export const addHunt = action({
  args: {
    date: v.string(),
    creatorID: v.id("hunters"),
    location: v.object({ lat: v.number(), lng: v.number() }),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ noSql_huntsId: Id<"huntsAllData"> }> => {
    const location = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${args.location.lat},${args.location.lng}&key=${process.env.GOOGLE_MAPS_API}`
    );
    const location_data = await location.json();
    const locationId = await ctx.runMutation(
      internal.hunts.insertLocationData,
      {
        data: location_data,
      }
    );

    // const subHunts: Array<Id<"subHunts">> = [];

    // const weather = await fetch(
    //   `http://api.weatherapi.com/v1/history.json?key=${process.env.WEATHER_API}&q=${args.location.lat},${args.location.lng}&aqi=no&dt=${args.date.split("T")[0]}`
    // );
    // const Weather_data = (await weather.json()) as WeatherData;

    // for (const slot of timeSlot) {
    //   const weather_id = await ctx.runMutation(
    //     internal.hunts.insertWeatherData,
    //     {
    //       locationID: locationId,
    //       Weather_data: Weather_data.forecast.forecastday[0].hour.find(
    //         (hour) => hour.time === `${args.date.split("T")[0]} ${slot.avgT}`
    //       ),
    //     }
    //   );
    //   const id = await ctx.runMutation(internal.hunts.insertsubHuntData, {
    //     timeSlot: slot.slot,
    //     weatherId: weather_id,
    //   });
    //   subHunts.push(id);
    // }

    // for new table
    const noSql_huntsId = await ctx.runMutation(
      internal.huntsAllData.initializeHunt,
      {
        createdBy: args.creatorID,
        date: args.date,
        locationId: locationId,
      }
    );

    // const d = await ctx.runMutation(internal.hunts.insertHuntData, {
    //   subHunts,
    //   creatorID: args.creatorID,
    //   date: args.date,
    //   locationID: locationId,
    // });
    return {
      // huntsId: d,
      noSql_huntsId: noSql_huntsId,
    };
  },
});
