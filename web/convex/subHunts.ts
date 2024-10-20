import { v } from "convex/values";
import {
  action,
  internalAction,
  internalMutation,
  mutation,
} from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { internal } from "./_generated/api";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// export const logHunt = action({
//   args: {
//     startDate: v.string(),
//     huntLoaction: v.object({ lat: v.number(), lng: v.number() }), // {lat: "123", long: "123"}
//     hunterIDs: v.array(v.id("hunters")),
//     pictures: v.optional(v.array(v.string())),
//     species: v.array(v.object({ name: v.string(), count: v.number() })),
//   },
//   handler: async (ctx, args) => {
//     console.log("Hunt data submitted:", args);
//     const location = await fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${args.huntLoaction.lat},${args.huntLoaction.lng}&key=${process.env.GOOGLE_MAPS_API}`
//     );
//     const location_data = await location.json();
//     const locationId = await ctx.runMutation(
//       internal.hunts.insertLocationData,
//       {
//         data: location_data,
//       }
//     );

//     const weather = await fetch(
//       `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API}&q=${args.huntLoaction.lat},${args.huntLoaction.lng}&aqi=no`
//     );
//     const weather_data = await weather.json();
//     const weatherId = await ctx.runMutation(internal.hunts.insertWeatherData, {
//       locationID: locationId,
//       Weather_data: weather_data,
//     });

//     const huntId = await ctx.runMutation(internal.hunts.insertHuntData, {
//       endDate: args.endDate,
//       startDate: args.startDate,
//       locationID: locationId,
//       weatherID: weatherId,
//       pictures: args.pictures,
//       hunterIDs: args.hunterIDs,
//     });

//     for (const hunterId of args.hunterIDs) {
//       await ctx.scheduler.runAfter(0, internal.hunts.insertHunterHuntData, {
//         hunterID: hunterId,
//         huntID: huntId,
//       });
//     }

//     // for (const species of args.species) {
//     //   await ctx.runMutation(internal.hunts.insertSpeciesTakenData, {
//     //     name: species.name,
//     //     count: species.count,
//     //     huntId: huntId,
//     //   });
//     // }

//     return true;
//   },
// });

// // insert data into SpeciesTaken
// // export const insertSpeciesTakenData = internalMutation({
// //   args: {
// //     name: v.string(),
// //     count: v.number(),
// //     huntId: v.id("hunts"),
// //   },
// //   handler: async (ctx, data) => {
// //     return await ctx.db.insert("harvestDetails", {
// //       huntId: data.huntId,
// //       quantity: data.count,
// //       speciesId: data.name,
// //     });
// //   },
// // });

// // insert data into hunterHunt
// export const insertHunterHuntData = internalMutation({
//   args: {
//     hunterID: v.id("hunters"),
//     huntID: v.id("hunts"),
//   },
//   handler: async (ctx, data) => {
//     return await ctx.db.insert("huntersHunts", {
//       hunterID: data.hunterID,
//       huntID: data.huntID,
//     });
//   },
// });

// // insert data into hunts
// export const insertHuntData = internalMutation({
//   args: {
//     startDate: v.string(),
//     locationID: v.id("huntLocations"),
//     weatherID: v.id("weatherConditions"),
//     hunterIDs: v.array(v.id("hunters")),
//     pictures: v.optional(v.array(v.string())),
//   },
//   handler: async (ctx, data) => {
//     return await ctx.db.insert("hunts", {
//       startDate: data.startDate,
//       locationID: data.locationID,
//       pictures: data.pictures,
//       hunterID: data.hunterIDs,
//       weatherConditionID: data.weatherID,
//       blindID: "1" as any,
//       totalWaterfowl: 0,
//     });
//   },
// });

// // insert data into weatherConditions
// export const insertWeatherData = internalMutation({
//   args: {
//     Weather_data: v.any(),
//     locationID: v.id("huntLocations"),
//   },
//   handler: async (ctx, { Weather_data, locationID }) => {
//     // console.log("Weather data:", args.data);
//     const extractedData = {
//       date: Weather_data.current.last_updated,
//       locationID: locationID, // Assuming a static ID; replace as needed
//       temperatureC: Weather_data.current.temp_c,
//       windDirection: Weather_data.current.wind_dir,
//       windSpeed: Weather_data.current.wind_kph,
//       precipitation:
//         Weather_data.current.precip_mm > 0
//           ? `${Weather_data.current.precip_mm} mm`
//           : "No precipitation",
//       condition: Weather_data.current.condition.text,
//       humidity: Weather_data.current.humidity,
//       visibility: Weather_data.current.vis_km,
//       uvIndex: Weather_data.current.uv,
//       source: "WeatherAPI", // Assuming source; replace as needed
//     };

//     return await ctx.db.insert("weatherConditions", extractedData);
//   },
// });
