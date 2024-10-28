import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getPhotosBySessionId = query({
  args: {
    // huntId: v.id("huntingSessions"),
    sessionId: v.id("blindSessions"),
  },
  handler: async (ctx, { sessionId }) => {
    const session = await ctx.db.get(sessionId);
    if (!session || !session.pictures) return [];
    return Promise.all(
      session.pictures.map(async (picture) => {
        const url = await ctx.storage.getUrl(picture as Id<"_storage">);
        return url;
      }) || []
    );
  },
});

export const getImagesByHunterId = query({
  args: {},
  handler: async (ctx, {}) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];
    const hunterId = await ctx.db
      .query("hunters")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", user.subject)
      )
      .first();
    if (!hunterId) return [];
    const images = await ctx.db
      .query("images")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", hunterId._id))
      .collect();

    return Promise.all(
      images.map(async (image) => {
        const url = await ctx.storage.getUrl(image.url as Id<"_storage">);
        return {
          url,
          isFavorite: image.isFavorite,
          huntId: image.huntId,
          _id: image._id,
        };
      })
    );
  },
});

export const setAsFavorite = mutation({
  args: { imageId: v.id("images"), isFavorite: v.boolean() },
  handler: async (ctx, { imageId, isFavorite }) => {
    await ctx.db.patch(imageId, { isFavorite });
  },
});

export const getFavoriteImages = query({
  args: {},
  handler: async (ctx, {}) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    const images = await ctx.db.query("images").collect();
    return Promise.all(
      images
        .filter((image) => image.isFavorite)
        .map(async (image) => {
          const url = await ctx.storage.getUrl(image.url as Id<"_storage">);
          return {
            url,
            _id: image._id,
            isFavorite: image.isFavorite,
          };
        })
    );
  },
});
