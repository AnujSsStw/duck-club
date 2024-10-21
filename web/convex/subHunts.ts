import { v } from "convex/values";
import {
  action,
  internalAction,
  internalMutation,
  mutation,
} from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { internal } from "./_generated/api";

function getAverageTimeOrCurrent(
  timeSlots: "morning" | "mid-day" | "afternoon",
  currentTime: string
) {
  const timeSlotMap = {
    morning: ["06:00", "09:00"],
    "mid-day": ["11:00", "14:00"],
    afternoon: ["16:00", "19:00"],
  };

  const timeSlot = timeSlotMap[timeSlots];

  const [start, end] = timeSlot.map(
    (time) => new Date(`1970-01-01T${time}:00`)
  );
  const now = new Date(`1970-01-01T${currentTime}:00`);

  // Check if current time is greater than the end of the time slot
  if (now > end) {
    // Calculate average time of the time slot
    const averageTime = new Date(
      start.getTime() + (end.getTime() - start.getTime()) / 2
    );
    return averageTime.toTimeString();
  } else {
    return now.toTimeString();
  }
}

export const addSubHunt = action({
  args: {
    huntId: v.id("hunts"),
    subHuntId: v.id("subHunts"),
    hunters: v.array(
      v.object({
        hunterID: v.id("hunters"),
        species: v.array(
          v.object({
            name: v.string(),
            count: v.number(),
          })
        ),
        blinds: v.array(
          v.object({
            name: v.string(),
          })
        ),
      })
    ),
    pictures: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    console.log("Hunt data submitted:", args);
    const subHunt = await ctx.runQuery(
      internal.queries.subHunt.getSubHunt_by_id,
      {
        subHuntID: args.subHuntId,
      }
    );
  },
});

export const insertSubHunt = mutation({
  args: {
    huntId: v.id("hunts"),
    subHuntId: v.id("subHunts"),
    hunters: v.array(
      v.object({
        hunterID: v.id("hunters"),
        species: v.array(
          v.object({
            id: v.id("waterfowlSpecies"),
            count: v.number(),
          })
        ),
        blinds: v.object({
          name: v.string(),
        }),
      })
    ),
    pictures: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.subHuntId, {
      init: true,
      hunterIDs: args.hunters.map((hunter) => hunter.hunterID),
      pictures: args.pictures,
      totalWaterfowl: args.hunters.reduce(
        (acc, hunter) =>
          acc + hunter.species.reduce((acc, species) => acc + species.count, 0),
        0
      ),
    });

    const loc = (await ctx.db.get(args.huntId))?.locationID!;
    const location = await ctx.db.get(loc);
    if (!location) {
      throw new Error("Location not found");
    }

    // currently setting duckblinds lng and lat to the location of the hunt
    await Promise.all(
      args.hunters.map(async (hunter) => {
        const id = await ctx.db.insert("duckBlinds", {
          huntLocationId: loc,
          latitude: location?.latitude,
          longitude: location?.longitude,
          name: hunter.blinds.name,
        });

        await ctx.db.insert("huntersHunts", {
          hunterID: hunter.hunterID,
          huntID: args.subHuntId,
          blindId: id,
        });

        await Promise.all(
          hunter.species.map(async (species) => {
            await ctx.db.insert("harvestDetails", {
              huntId: args.subHuntId,
              hunterID: hunter.hunterID,
              speciesId: species.id,
              quantity: species.count,
            });
          })
        );
      })
    );
  },
});
