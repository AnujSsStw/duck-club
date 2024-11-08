import { v } from "convex/values";
import {
  httpAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { WeatherData } from "./fuckint_types";
import { internal } from "./_generated/api";

export const getHuntDetails = httpAction(async (ctx, request) => {
  const token = request.headers.get("Authorization");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const user = await ctx.runQuery(internal.users.getUserBy_tokenIdentifier, {
    tokenIdentifier: token,
  });
  if (!user) return new Response("No user Found", { status: 401 });

  const huntId = request.headers.get("huntId") as Id<"huntingSessions">;
  const huntDetails = await ctx.runQuery(internal.q.getHuntSessionDetails, {
    huntId,
  });

  if (!huntDetails) return new Response("Hunt not found", { status: 404 });

  return new Response(JSON.stringify(huntDetails), {
    headers: { "Content-Type": "application/json" },
  });
});

export const getHuntDetails2 = query({
  args: { huntId: v.id("huntingSessions") },
  handler: async (ctx, args) => {
    const hunt = await ctx.db.get(args.huntId);
    if (!hunt) {
      throw new Error("Hunt not found");
    }

    // get all the sessions for the hunt
    const sessions = await ctx.db
      .query("blindSessions")
      .withIndex("by_hunting_session", (q) =>
        q.eq("huntingSessionId", args.huntId)
      )
      .collect();

    // create an array of obj of all the blind names and their harvests with the total quantity and hunters involved in it
    const blindHarvests = await Promise.all(
      sessions.map(async (session) => {
        const harvests = await Promise.all(
          session.harvests.map(async (harvest) => {
            return await ctx.db.get(harvest.speciesId);
          })
        );
        const hunters = await Promise.all(
          session.huntersPresent.map(async (hunterId) => {
            return await ctx.db.get(hunterId);
          })
        );
        return {
          blindName: session.blindName,
          harvests: harvests,
          hunters: hunters,
          totalHarvest: session.harvests.reduce(
            (sum, harvest) => sum + harvest.quantity,
            0
          ),
          id: session._id,
        };
      })
    );

    return { hunt, sessions, blindHarvests };
  },
});

export const getHuntSessionDetails = query({
  args: { huntId: v.id("huntingSessions"), sessionId: v.id("blindSessions") },
  handler: async (ctx, args) => {
    const hunt = await ctx.db.get(args.huntId);
    const blindInfo = await ctx.db.get(args.sessionId);

    if (!hunt || !blindInfo) {
      throw new Error("Hunt or Blind Info not found");
    }

    const weather = await ctx.db.get(hunt.weatherConditionID);
    const location = await ctx.db.get(hunt.locationId);
    const timeSlot = hunt.timeSlot;
    const hunters = await Promise.all(
      blindInfo.huntersPresent.map(async (hunterId) => {
        return await ctx.db.get(hunterId);
      })
    );
    const harvests = await Promise.all(
      blindInfo.harvests.map(async (harvest) => {
        return await ctx.db.get(harvest.speciesId);
      })
    );

    if (!hunters || !weather || !location) {
      throw new Error("Hunters, Weather, or Location not found");
    }

    return { weather, location, timeSlot, hunters, blindInfo, harvests };
  },
});
