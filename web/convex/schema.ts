import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    hunters: defineTable({
      email: v.string(),
      firstName: v.string(),
      lastName: v.string(),
      fullName: v.string(),
      pictureUrl: v.string(),
      phoneNumber: v.optional(v.string()),
      tokenIdentifier: v.string(),
      memberShipType: v.union(v.literal("guest"), v.literal("member")),
    })
      .index("by_email", ["email"])
      .searchIndex("search_hunter", {
        searchField: "fullName",
        filterFields: ["email"],
      }),

    huntLocations: defineTable({
      name: v.string(),
      description: v.string(),
      latitude: v.number(),
      longitude: v.number(),
      state: v.string(),
      county: v.string(),
      city: v.string(),
    }),

    duckBlinds: defineTable({
      name: v.string(),
      latitude: v.number(),
      longitude: v.number(),
      huntLocationId: v.id("huntLocations"),
    }).index("by_huntLocationId", ["huntLocationId"]),

    weatherConditions: defineTable({
      date: v.string(),
      locationID: v.id("huntLocations"),
      temperatureC: v.number(),
      windDirection: v.string(),
      windSpeed: v.number(),
      precipitation: v.string(),
      condition: v.string(),
      humidity: v.number(),
      visibility: v.number(),
      uvIndex: v.number(),
      source: v.string(),
    }),

    hunts: defineTable({
      timeSlot: v.optional(
        v.union(
          v.literal("morning"),
          v.literal("mid-day"),
          v.literal("afternoon")
        )
      ),
      weatherConditionID: v.optional(v.id("weatherConditions")),
      hunterIDs: v.optional(v.array(v.id("hunters"))),
      pictures: v.optional(v.array(v.string())),
      totalWaterfowl: v.optional(v.number()),
      blindUsed: v.optional(v.id("duckBlinds")),

      creatorId: v.id("hunters"),
      locationID: v.id("huntLocations"),
      date: v.string(),
    }).index("by_date", ["date"]),

    huntersHunts: defineTable({
      hunterID: v.id("hunters"),
      huntID: v.id("hunts"),
      blindID: v.id("duckBlinds"),
    }).index("by_hunterID", ["hunterID"]),

    waterfowlSpecies: defineTable({
      // predefined species
      name: v.string(),
    }),

    harvestDetails: defineTable({
      huntId: v.id("hunts"),
      speciesId: v.id("waterfowlSpecies"),
      quantity: v.number(),
    }).index("by_huntId", ["huntId"]),
  },
  { schemaValidation: true }
);
