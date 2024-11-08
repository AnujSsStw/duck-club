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
      .index("by_tokenIdentifier", ["tokenIdentifier"])
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

      createdBy: v.optional(v.id("hunters")),
    }).index("by_createdBy", ["createdBy"]),

    weatherConditions: defineTable({
      dt: v.string(),
      locationID: v.id("huntLocations"),
      temperatureC: v.number(),
      windDirection: v.union(v.string(), v.number()), // can be string or number
      windSpeed: v.number(),
      precipitation: v.number(),
      condition: v.string(),
      humidity: v.number(),
      visibility: v.number(),
      uvIndex: v.optional(v.number()),
      source: v.string(),
    }),

    waterfowlSpecies: defineTable({
      // predefined species
      name: v.string(),
    }),

    huntingSessions: defineTable({
      // Session identification
      locationId: v.id("huntLocations"),
      date: v.string(), // YYYY-MM-DD format
      timeSlot: v.union(
        v.literal("morning"),
        v.literal("evening"),
        v.literal("mid-day")
      ),

      // Weather data (shared across all blinds for this session)
      weatherConditionID: v.id("weatherConditions"),

      // Metadata
      createdBy: v.id("hunters"),
      updatedAt: v.string(),
    })
      .index("by_date", ["date"])
      .index("by_location", ["locationId", "date"])
      .index("by_createdBy", ["createdBy"]),

    // Blind sessions table (represents each blind's activity in a hunting session)
    blindSessions: defineTable({
      // References
      huntingSessionId: v.id("huntingSessions"),
      // blindId: v.id("duckBlinds"),
      blindName: v.string(), // for now

      // Harvest data
      totalBirds: v.number(),
      harvests: v.array(
        v.object({
          speciesId: v.id("waterfowlSpecies"),
          quantity: v.number(),
        })
      ),

      // Hunters in this blind for this session
      huntersPresent: v.array(v.id("hunters")),

      // Optional data
      pictures: v.optional(v.array(v.string())),
      notes: v.optional(v.string()),

      // Metadata
      updatedAt: v.string(),
    })
      .index("by_hunting_session", ["huntingSessionId"])
      .index("by_blind_name", ["blindName"]),

    images: defineTable({
      url: v.string(),
      isFavorite: v.boolean(),
      createdBy: v.id("hunters"),
      huntId: v.id("huntingSessions"),
    })
      .index("by_createdBy", ["createdBy"])
      .index("by_huntId", ["huntId"]),

    duckBlinds: defineTable({
      name: v.string(),
      latitude: v.number(),
      longitude: v.number(),
      huntLocationId: v.id("huntLocations"),
    }).index("by_huntLocationId", ["huntLocationId"]),
  },
  { schemaValidation: true }
);
