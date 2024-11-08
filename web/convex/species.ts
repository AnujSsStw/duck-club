import { query } from "./_generated/server";

export const getWaterfowlSpecies = query({
  handler: async (ctx) => {
    return await ctx.db.query("waterfowlSpecies").collect();
  },
});
