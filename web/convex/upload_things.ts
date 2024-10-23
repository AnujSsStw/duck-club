import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getPhotosBySessionId = query({
  args:{
    huntId: v.id("huntsAllData"),
    sessionId: v.string()  },
  handler: async (ctx, {huntId, sessionId}) => {
    const hunt =  await ctx.db.get(huntId)
    if (!hunt || !hunt.sessions) return []
    const session = hunt.sessions.find(s => s.timeSlot === sessionId)?.pictures
    return Promise.all(session?.map(async (picture) => {
      const url = await ctx.storage.getUrl(picture as Id<"_storage">)
      return url
    }) || [])
  }
})