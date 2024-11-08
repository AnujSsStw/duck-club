import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getRecentBlinds = query({
  args: {
    locationId: v.optional(v.id("huntLocations")),
  },
  handler: async (ctx, args) => {
    if (args.locationId) {
      const res = await ctx.db
        .query("duckBlinds")
        .withIndex("by_huntLocationId", (q) =>
          q.eq("huntLocationId", args.locationId as Id<"huntLocations">)
        )
        .collect();

      return res;
    }
  },
});
