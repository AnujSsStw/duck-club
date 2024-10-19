// NOTE: You can remove this file. Declaring the shape
// of the database is entirely optional in Convex.
// See https://docs.convex.dev/database/schemas.

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    documents: defineTable({
      fieldOne: v.string(),
      fieldTwo: v.object({
        subFieldOne: v.array(v.number()),
      }),
    }),
    // This definition matches the example query and mutation code:
    numbers: defineTable({
      value: v.number(),
    }),
    hunters: defineTable({
      email: v.string(),
      firstName: v.string(),
      lastName: v.string(),
      fullName: v.string(),
      pictureUrl: v.string(),
      phoneNumber: v.optional(v.string()),

      tokenIdentifier: v.string(),

      memberShipType: v.union(v.literal("guest"), v.literal("member")),
    }).index("by_email", ["email"]),

    huntLocations: defineTable({
      name: v.string(),
      description: v.string(),

      latitude: v.number(),
      longitude: v.number(),

      state: v.string(),
      county: v.string(),
      city: v.string(),
    }),

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
      locationID: v.id("huntLocations"),
      startDate: v.string(),
      endDate: v.string(),
      weatherConditionID: v.id("weatherConditions"),
      hunterID: v.array(v.id("hunters")),

      pictures: v.array(v.string()),
    }),

    huntersHunts: defineTable({
      hunterID: v.id("hunters"),
      huntID: v.id("hunts"),
    }).index("by_hunterID", ["hunterID"]),
  },
  { schemaValidation: true }
);
