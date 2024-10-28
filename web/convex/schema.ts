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
      windDirection: v.string(),
      windSpeed: v.number(),
      precipitation: v.number(),
      condition: v.string(),
      humidity: v.number(),
      visibility: v.number(),
      uvIndex: v.number(),
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

    subHunts: defineTable({
      weatherConditionID: v.optional(v.id("weatherConditions")),
      hunterIDs: v.optional(v.array(v.id("hunters"))),
      pictures: v.optional(v.array(v.string())),
      totalWaterfowl: v.optional(v.number()),

      timeSlot: v.optional(
        v.union(
          v.literal("morning"),
          v.literal("mid-day"),
          v.literal("afternoon")
        )
      ),
      init: v.boolean(),
    }),

    huntersHunts: defineTable({
      hunterID: v.id("hunters"),
      huntID: v.id("subHunts"),
      blindId: v.id("duckBlinds"),
    }).index("by_hunterID", ["hunterID"]),

    harvestDetails: defineTable({
      huntId: v.id("subHunts"),
      hunterID: v.id("hunters"),
      speciesId: v.id("waterfowlSpecies"),
      quantity: v.number(),
    }).index("by_huntId_and_hunterId", ["huntId", "hunterID"]),

    hunts: defineTable({
      subHunts: v.array(v.id("subHunts")),
      createdBy: v.id("hunters"),
      locationID: v.id("huntLocations"),
      date: v.string(),
    }).index("by_createdBy", ["createdBy"]),

    huntsAllData: defineTable({
      // Hunt details
      date: v.optional(v.string()),

      // Hunt location details
      locationName: v.optional(v.string()),
      locationDescription: v.optional(v.string()),
      latitude: v.optional(v.number()),
      longitude: v.optional(v.number()),
      state: v.optional(v.string()),
      county: v.optional(v.string()),
      city: v.optional(v.string()),

      // Hunt sessions
      sessions: v.optional(
        v.array(
          v.object({
            note: v.optional(v.string()),

            timeSlot: v.optional(
              v.union(
                v.literal("morning"),
                v.literal("mid-day"),
                v.literal("afternoon")
              )
            ),
            totalWaterfowl: v.optional(v.number()),
            pictures: v.optional(v.array(v.string())),

            // Weather conditions for this session
            weather: v.object({
              dt: v.string(),
              temperatureC: v.number(),
              windDirection: v.string(),
              windSpeed: v.number(),
              precipitation: v.number(),
              condition: v.string(),
              humidity: v.number(),
              visibility: v.number(),
              uvIndex: v.number(),
              source: v.string(),
            }),

            // Hunter details for this session
            hunters: v.optional(
              v.array(
                v.object({
                  id: v.optional(v.id("hunters")),
                  email: v.optional(v.string()),
                  firstName: v.optional(v.string()),
                  lastName: v.optional(v.string()),
                  fullName: v.optional(v.string()),
                  pictureUrl: v.optional(v.string()),
                  phoneNumber: v.optional(v.string()),
                  memberShipType: v.optional(
                    v.union(v.literal("guest"), v.literal("member"))
                  ),

                  // Duck blind for this hunter in this session
                  duckBlind: v.optional(
                    v.object({
                      id: v.optional(v.id("duckBlinds")),
                      name: v.optional(v.string()),
                      latitude: v.optional(v.number()),
                      longitude: v.optional(v.number()),
                    })
                  ),

                  // Harvests for this hunter in this session
                  harvests: v.optional(
                    v.array(
                      v.object({
                        speciesId: v.optional(v.id("waterfowlSpecies")),
                        speciesName: v.optional(v.string()),
                        quantity: v.optional(v.number()),
                      })
                    )
                  ),
                })
              )
            ),
          })
        )
      ),

      // Metadata
      createdBy: v.optional(v.id("hunters")),
      updatedAt: v.optional(v.string()),
    })
      .index("by_date", ["date"])
      .index("by_location", ["state", "county", "city"])
      .index("by_createdBy", ["createdBy"])
      .searchIndex("search_hunts", {
        searchField: "locationName",
        filterFields: ["state", "county", "city", "date"],
      }),
  },
  { schemaValidation: true }
);

/**
 * in a one day hunt, there can be multiple sub hunts with different time slots like morning, mid-day, afternoon
 *
 * in a sub hunt, there can be multiple hunters, multiple blinds, multiple species taken
 *
 * we have to store each hunter blind and species taken in a separate table
 */
