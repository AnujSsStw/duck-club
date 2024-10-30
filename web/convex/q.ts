import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import {
  extractLocationData,
  getLocationData,
  getWeatherData,
  getWeatherData2,
} from "./utils";
import { internal } from "./_generated/api";
/*

export const HuntFormSchema = z.object({
    date: z.date({ required_error: "Start date is required" }),
    location: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .required({ lat: true, lng: true })
      .refine((data) => data.lat !== 0 && data.lng !== 0, {
        message: "Location is required",
      }),
    timeSlot: z.string({ required_error: "Time slot is required" }),
  
    blindSessions: z
      .array(
        z.object({
          blindId: z.string({ required_error: "Blind is required" }),
          huntersPresent: z
            .array(
              z.object({
                hunterID: z.string(),
              })
            )
            .min(1, { message: "At least one hunter is required" }),
          harvests: z.array(
            z.object({
              speciesId: z.string({ required_error: "Species is required" }),
              quantity: z.number({ required_error: "Quantity is required" }),
            })
          ),
          notes: z.string().optional(),
          pictures: z.instanceof(FileList).optional(),
        })
      )
      .min(1, { message: "At least one blind session is required" }),
  });
**/

export const i = action({
  args: {
    huntingSession: v.object({
      location: v.object({
        lat: v.number(),
        lng: v.number(),
      }),
      date: v.string(),
      timeSlot: v.union(
        v.literal("morning"),
        v.literal("evening"),
        v.literal("mid-day")
      ),

      blindSessions: v.array(
        v.object({
          blindId: v.string(),
          huntersPresent: v.array(v.id("hunters")),
          harvests: v.array(
            v.object({
              speciesId: v.id("waterfowlSpecies"),
              quantity: v.number(),
            })
          ),
          notes: v.optional(v.string()),
          pictures: v.optional(v.array(v.string())),
        })
      ),
    }),
    createdBy: v.id("hunters"),
    locationId: v.optional(v.id("huntLocations")),
  },
  handler: async (ctx, args): Promise<string> => {
    if (!args.locationId) {
      const locationData = await getLocationData(args.huntingSession.location);
      args.locationId = await ctx.runMutation(internal.q.insertLocationData, {
        data: locationData,
        createdBy: args.createdBy,
      });
    }

    const weatherData = await getWeatherData2(
      args.huntingSession.date,
      args.huntingSession.location,
      args.huntingSession.timeSlot as "morning" | "mid-day" | "afternoon"
    );
    const weatherId = await ctx.runMutation(internal.q.insertWeatherData, {
      locationID: args.locationId,
      Weather_data: weatherData,
    });

    const huntingSessionId = await ctx.runMutation(
      internal.q.insertHuntingSession,
      {
        huntingSession: {
          locationId: args.locationId,
          date: args.huntingSession.date,
          timeSlot: args.huntingSession.timeSlot,
          weatherConditionID: weatherId,
          createdBy: args.createdBy,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    await Promise.all(
      args.huntingSession.blindSessions
        .filter(
          (blindSession) =>
            blindSession.pictures && blindSession.pictures.length > 0
        )
        .flatMap((blindSession) =>
          blindSession.pictures!.map((url) =>
            ctx.runMutation(internal.q.insertImage, {
              image: {
                url,
                isFavorite: false,
                createdBy: args.createdBy,
                huntId: huntingSessionId,
              },
            })
          )
        )
    );

    await Promise.all(
      args.huntingSession.blindSessions.map((blindSession) =>
        ctx.runMutation(internal.q.insertBlindSession, {
          blindSession: {
            huntingSessionId: huntingSessionId,
            blindName: blindSession.blindId, // blindId is the name of the blind
            huntersPresent: blindSession.huntersPresent,
            harvests: blindSession.harvests,
            notes: blindSession.notes,
            pictures: blindSession.pictures,
            totalBirds: blindSession.harvests.reduce(
              (acc, curr) => acc + curr.quantity,
              0
            ),
            updatedAt: new Date().toISOString(),
          },
        })
      )
    );
    return huntingSessionId;
  },
});

// insert data into images
export const insertImage = internalMutation({
  args: { image: v.any() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("images", args.image);
  },
});

// insert data into blindSessions
export const insertBlindSession = internalMutation({
  args: { blindSession: v.any() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blindSessions", args.blindSession);
  },
});

// insert data into huntingSessions
export const insertHuntingSession = internalMutation({
  args: {
    huntingSession: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("huntingSessions", args.huntingSession);
  },
});

// insert data into weatherConditions
export const insertWeatherData = internalMutation({
  args: {
    locationID: v.id("huntLocations"),
    Weather_data: v.any(), // type of this is WeatherData
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("weatherConditions", {
      dt: args.Weather_data.dt,
      locationID: args.locationID,
      temperatureC: args.Weather_data.temperatureF,
      windDirection: args.Weather_data.windDirection,
      windSpeed: args.Weather_data.windSpeed,
      precipitation: args.Weather_data.precipitation,
      condition: args.Weather_data.condition,
      humidity: args.Weather_data.humidity,
      visibility: args.Weather_data.visibility,
      uvIndex: args.Weather_data.uvIndex ?? undefined,
      source: "weatherapi.com",
    });
  },
});

// insert data into huntLocations
export const insertLocationData = internalMutation({
  args: { data: v.any(), createdBy: v.id("hunters") },
  handler: async (ctx, { data, createdBy }) => {
    const extractedData = extractLocationData(data);
    return await ctx.db.insert("huntLocations", {
      ...extractedData,
      createdBy: createdBy,
    });
  },
});
