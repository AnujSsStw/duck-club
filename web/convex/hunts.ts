import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

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

export const addHunt = action({
  args: {
    date: v.string(),
    creatorID: v.id("hunters"),
    location: v.object({ lat: v.number(), lng: v.number() }),
  },
  handler: async (ctx, args): Promise<Id<"hunts">> => {
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

    const timeSlot = ["morning", "mid-day", "afternoon"];
    const subHunts: Array<Id<"subHunts">> = [];

    for (const slot of timeSlot) {
      const id = await ctx.runMutation(internal.hunts.insertsubHuntData, {
        timeSlot: slot,
        locationID: locationId,
        creatorID: args.creatorID,
        date: args.date,
      });
      subHunts.push(id);
    }

    return ctx.runMutation(internal.hunts.insertHuntData, {
      subHunts,
      creatorID: args.creatorID,
    });
  },
});

// insert data into hunt
export const insertHuntData = internalMutation({
  args: {
    subHunts: v.array(v.id("subHunts")),
    creatorID: v.id("hunters"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("hunts", {
      createdBy: args.creatorID,
      subHunts: args.subHunts,
    });
  },
});

//insert data into subHunt
export const insertsubHuntData = internalMutation({
  args: {
    timeSlot: v.string(),
    locationID: v.id("huntLocations"),
    creatorID: v.id("hunters"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subHunts", {
      timeSlot: args.timeSlot as any,
      locationID: args.locationID,
      creatorId: args.creatorID,
      date: args.date,
      init: false,
    });
  },
});

// insert data into huntLocations
export const insertLocationData = internalMutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    // console.log("Location data:", args.data);
    const extractedData = extractLocationData(data);
    return await ctx.db.insert("huntLocations", extractedData);
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
