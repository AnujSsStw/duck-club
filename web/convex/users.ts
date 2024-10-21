import {
  internalMutation,
  internalQuery,
  query,
  QueryCtx,
} from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";
import { Doc } from "./_generated/dataModel";

export const getUserByQuery = internalQuery({
  args: { query: v.string() },
  handler: async (ctx, { query }) => {
    return (
      await ctx.db
        .query("hunters")
        .withSearchIndex("search_hunter", (q) => q.search("fullName", query))
        .collect()
    ).map((u) => {
      return {
        _id: u._id,
        email: u.email,
        fullName: u.fullName,
        pictureUrl: u.pictureUrl,
        memberShipType: u.memberShipType,
      };
    });
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      email: data.email_addresses[0].email_address,
      firstName: data.first_name ?? "user without first name",
      lastName: data.last_name ?? "user without last name",
      fullName: `${data.first_name} ${data.last_name ?? ""}`,
      pictureUrl: data.image_url,
      tokenIdentifier: data.id,
      memberShipType: "guest" as "guest" | "member",
      phoneNumber: data.phone_numbers[0]?.phone_number,
    };

    const user = await userByExternalId(
      ctx,
      data.email_addresses[0].email_address
    );
    if (user === null) {
      await ctx.db.insert("hunters", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.email as string);
}

async function userByExternalId(ctx: QueryCtx, email: string) {
  return await ctx.db
    .query("hunters")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();
}
