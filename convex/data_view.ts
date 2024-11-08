// data view for the hunts page
// this is where we will get the data for the hunts page

import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {
    hunterId: v.optional(v.id("hunters")),
  },
  handler: async (ctx, args) => {
    if (!args.hunterId) {
      return [];
    }
    const hunterId = args.hunterId;
    const huntingSessions = await ctx.db
      .query("huntingSessions")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", hunterId))
      .collect();

    // get the blind sessions for each hunting session
    const blindSessions = await Promise.all(
      huntingSessions.map(async (huntingSession) => {
        return await ctx.db
          .query("blindSessions")
          .withIndex("by_hunting_session", (q) =>
            q.eq("huntingSessionId", huntingSession._id)
          )
          .collect();
      })
    );

    // get the weather data for each hunting session
    const weatherData = await Promise.all(
      huntingSessions.map(async (huntingSession) => {
        return await ctx.db.get(huntingSession.weatherConditionID);
      })
    );

    // get the location data for each hunting session
    const locationData = await Promise.all(
      huntingSessions.map(async (huntingSession) => {
        return await ctx.db.get(huntingSession.locationId);
      })
    );

    // combine the data with appropriate hunting session data
    const combinedData = await Promise.all(
      huntingSessions.map(async (huntingSession, index) => {
        return {
          ...weatherData[index],
          ...locationData[index],
          // Process blind sessions and resolve all promises
          blindSessions: await Promise.all(
            blindSessions[index].map(async (blindSession) => {
              return {
                ...blindSession,
                hunters: await Promise.all(
                  blindSession.huntersPresent.map(async (hunterId) => {
                    return await ctx.db.get(hunterId);
                  })
                ),
                species: await Promise.all(
                  blindSession.harvests.map(async (harvest) => {
                    return await ctx.db.get(harvest.speciesId);
                  })
                ),
              };
            })
          ),
          ...huntingSession,
        };
      })
    );

    return combinedData;
  },
});
