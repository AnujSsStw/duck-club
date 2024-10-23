import { v } from "convex/values";
import { httpAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { WeatherData } from "./fuckint_types";
import { internal } from "./_generated/api";

export const initializeHunt = internalMutation({
    args: {
        date: v.string(),
        locationId: v.id("huntLocations"),
        createdBy: v.id("hunters"),
    },
    handler: async (ctx, args) => {
        const location = await ctx.db.get(args.locationId);
        if (!location) {
            throw new Error("Location not found");
        }

        const huntId = await ctx.db.insert("huntsAllData", {
            date: args.date,
            locationName: location.name,
            locationDescription: location.description,
            latitude: location.latitude,
            longitude: location.longitude,
            state: location.state,
            county: location.county,
            city: location.city,
            sessions: [],
            createdBy: args.createdBy,
            updatedAt: new Date().toISOString(),
        });

        return huntId;
    },
});

export const addHuntSession = mutation({
    args: {
        huntId: v.id("huntsAllData"),
        timeSlot: v.union(v.literal("morning"), v.literal("mid-day"), v.literal("afternoon")),
        pictures: v.optional(v.array(v.string())),
        hunters: v.array(v.object({
            hunterID: v.id("hunters"),
            species: v.array(v.object({
                id: v.id("waterfowlSpecies"),
                count: v.number(),
            })),
            blinds: v.object({
                name: v.string(),
            }),
        })),
        weather: v.any(),
        note: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const hunt = await ctx.db.get(args.huntId);
        if (!hunt) {
            throw new Error("Hunt not found");
        }


        const newSession = {
            note: args.note,
            timeSlot: args.timeSlot,
            pictures: args.pictures,
            totalWaterfowl: args.hunters.reduce(
                (acc, hunter) => acc + hunter.species.reduce((sum, species) => sum + species.count, 0),
                0
            ),
            weather: args.weather,
            hunters: await Promise.all(args.hunters.map(async (hunter) => {
                const hunterData = await ctx.db.get(hunter.hunterID);
                if (!hunterData) {
                    throw new Error(`Hunter not found: ${hunter.hunterID}`);
                }

                return {
                    id: hunter.hunterID,
                    email: hunterData.email,
                    firstName: hunterData.firstName,
                    lastName: hunterData.lastName,
                    fullName: hunterData.fullName,
                    pictureUrl: hunterData.pictureUrl,
                    phoneNumber: hunterData.phoneNumber,
                    memberShipType: hunterData.memberShipType,
                    duckBlind: {
                        name: hunter.blinds.name,
                        latitude: hunt.latitude,  // Using hunt location as a placeholder
                        longitude: hunt.longitude,  // Using hunt location as a placeholder
                    },
                    harvests: await Promise.all(hunter.species.map(async (species) => {
                        const speciesData = await ctx.db.get(species.id);
                        if (!speciesData) {
                            throw new Error(`Species not found: ${species.id}`);
                        }
                        return { speciesId: species.id, speciesName: speciesData.name, quantity: species.count };
                    })),
                };
            })),
        };

        await ctx.db.patch(args.huntId, {
            sessions: [...(hunt.sessions || []), newSession],
            updatedAt: new Date().toISOString(),
        });

        return args.huntId;
    },
});

export const getTakenTimeSlots = query({
    args: { huntId: v.id("huntsAllData") },
    handler: async (ctx, args) => {
        const hunt = await ctx.db.get(args.huntId);
        if (!hunt) {
            throw new Error("Hunt not found");
        }
        // check which timeslots are already taken
        const timeslots = ["morning", "mid-day", "afternoon"];
        return timeslots.filter(timeslot => hunt.sessions?.some(session => session.timeSlot === timeslot));
    },
});

export const getHuntLocation = query({
    args: { huntId: v.id("huntsAllData") },
    handler: async (ctx, args) => {
        const hunt = await ctx.db.get(args.huntId);
        if (!hunt) {
            throw new Error("Hunt not found");
        }
        return {
            latitude: hunt.latitude,
            longitude: hunt.longitude,
            date: hunt.date,
        }
    },
});

export const getHuntsByCreator = query({
    args: { creatorId: v.optional(v.id("hunters")) },
    handler: async (ctx, args) => {
        if (!args.creatorId) {
            throw new Error("Creator ID is required");
        }
        const hunts = await ctx.db
            .query("huntsAllData")
            .withIndex("by_createdBy", (q) => q.eq("createdBy", args.creatorId))
            .collect();

        return hunts.map(hunt => ({
            id: hunt._id,
            date: hunt.date,
            createdAt: hunt._creationTime,
            location: `${hunt.city}, ${hunt.state}`,
            totalSessions: hunt.sessions?.length || 0,
            totalHarvest: hunt.sessions?.reduce((total, session) =>
                total + (session.totalWaterfowl || 0), 0) || 0,
            // Add more aggregated data as needed
        }));
    },
});

export const getHuntsAllData = query({
    args: {},
    handler: async (ctx, args) => {
        const hunts = await ctx.db.query("huntsAllData").collect();
        return hunts;
    },
});

export const getHuntDetails = httpAction(async (ctx, request) => {
    const token = request.headers.get("Authorization");
    if (!token) return new Response("Unauthorized", { status: 401 });
  
    const user = await ctx.runQuery(internal.users.getUserBy_tokenIdentifier, {
      tokenIdentifier: token,
    });
    if (!user) return new Response("No user Found", { status: 401 });

    const huntId = request.headers.get("huntId") as Id<"huntsAllData">;
    const huntDetails = await ctx.runQuery(internal.huntsAllData.getHuntDetails_interanl, {huntId});
    
    if (!huntDetails) return new Response("Hunt not found", { status: 404 });
    
    return new Response(JSON.stringify(huntDetails), {
        headers: { "Content-Type": "application/json" },
    });
});

export const getHuntDetails2 = query({
    args: { huntId: v.id("huntsAllData") },
    handler: async (ctx, args) => {
        const hunt = await ctx.db.get(args.huntId);
        if (!hunt) {
            throw new Error("Hunt not found");
        }
        return hunt
    },
});

export const getHuntDetails_interanl = internalQuery({
    args: { huntId: v.id("huntsAllData") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.huntId);
    },
});

export const getHuntSessionDetails = query({
    args: { huntId: v.id("huntsAllData"), sessionId: v.string() },
    handler: async (ctx, args) => {
        const hunt = await ctx.db.get(args.huntId);
        if (!hunt) {
            throw new Error("Hunt not found");
        }
        return hunt.sessions?.find(session => session.timeSlot === args.sessionId);
    },
});

export const updateHuntSession = mutation({
    args: {
        huntId: v.id("huntsAllData"),
        sessionId: v.string(),
        sessions: v.any(),
    },
    handler: async (ctx, args) => {
        
       await ctx.db.patch(args.huntId, {
            sessions: args.sessions
        });
        return "success";
    },
});