import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const getSubHunt_by_id = internalQuery({
  args: {
    subHuntID: v.id("subHunts"),
  },
  handler: async (ctx, { subHuntID }) => {
    return await ctx.db.get(subHuntID);
  },
});
