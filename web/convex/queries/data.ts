import { v } from "convex/values";
import { internal } from "../_generated/api";
import { httpAction, internalQuery } from "../_generated/server";

export const getData = httpAction(async (ctx, request) => {
  const token = request.headers.get("Authorization"); // get the tokenIdentifier from the request
  if (!token) return new Response("Unauthorized", { status: 401 });

  const user = await ctx.runQuery(internal.users.getUserBy_tokenIdentifier, {
    tokenIdentifier: token,
  });
  if (!user) return new Response("No user Found", { status: 401 });

  // from hunt get the location, date, hunters(pics, fullname), harvest_count(number), weather_conditions
  const h = await ctx.runQuery(internal.queries.data.hunterHunts, {
    id: user._id,
  }); // gives date, subHuntID, locationId

  const result = await Promise.all(
    h.map(async (i) => {
      const location = await ctx.runQuery(internal.queries.data.getLocations, {
        id: i.locationID,
      });

      const subHunts = await ctx.runQuery(internal.queries.data.getSubHunts, {
        id: i.subHunts,
      });

      const weatherPromises = subHunts.map(async (subHunt) => {
        if (!subHunt || !subHunt.weatherConditionID) return null;
        return ctx.runQuery(internal.queries.data.getWeather, {
          id: subHunt?.weatherConditionID,
        });
      });

      const huntersPromises = subHunts.map(async (subHunt) => {
        const hunters = subHunt?.hunterIDs;
        if (!hunters) return [];

        const userPromises = hunters.map(async (hunter) => {
          return ctx.runQuery(internal.queries.data.getUsers, {
            id: hunter,
          });
        });
        return Promise.all(userPromises); // Awaiting here
      });

      const harvestPromises = subHunts.map(async (subHunt) => {
        if (subHunt && subHunt.hunterIDs) {
          return ctx.runQuery(internal.queries.data.getHarverts, {
            id: subHunt.hunterIDs,
            huntID: subHunt._id,
          });
        }
        return []; // Return an empty array if no subHunt
      });

      // Await all promises here
      const [weather, hunters, harvest] = await Promise.all([
        Promise.all(weatherPromises),
        Promise.all(huntersPromises),
        Promise.all(harvestPromises),
      ]);

      return {
        date: i.date,
        location: location,
        hunters: hunters,
        harvest: harvest,
        weather: weather,
      };
    })
  );

  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});

export const getUsers = internalQuery({
  args: { id: v.id("hunters") },
  handler: async (ctx, args) => {
    const d = await ctx.db.get(args.id);
    return {
      name: d?.fullName,
      pictureUrl: d?.pictureUrl,
    };
  },
});

export const getWeather = internalQuery({
  args: { id: v.id("weatherConditions") },
  handler: async (ctx, args) => {
    const data = await ctx.db.get(args.id);
    return {
      temperature: data?.temperatureC,
      windSpeed: data?.windSpeed,
      condition: data?.condition,
      visibility: data?.visibility,
    };
  },
});

export const getLocations = internalQuery({
  args: { id: v.id("huntLocations") },
  handler: async (ctx, args) => {
    const data = await ctx.db.get(args.id);
    return {
      description: data?.description,
      latitude: data?.latitude,
      longitude: data?.longitude,
      city: data?.city,
    };
  },
});

// get the harvests for each hunter of one subhunt
export const getHarverts = internalQuery({
  args: {
    id: v.array(v.id("hunters")),
    huntID: v.id("subHunts"),
  },
  handler: async (ctx, { id, huntID }) => {
    // Collect all promises for each hunter's harvests
    const harvests = await Promise.all(
      id.map(async (hunterId) => {
        const harvestDetails = await ctx.db
          .query("harvestDetails")
          .withIndex("by_huntId_and_hunterId", (q) =>
            q.eq("huntId", huntID).eq("hunterID", hunterId)
          )
          .collect();

        // Collect promises for species names
        const speciesPromises = harvestDetails.map(async (harvest) => {
          const species = await ctx.db.get(harvest.speciesId);
          return {
            species: species?.name,
            quantity: harvest.quantity,
          };
        });

        // Resolve the species promises
        return Promise.all(speciesPromises);
      })
    );

    // Flatten the resulting array if needed
    return harvests.flat();
  },
});

export const getSubHunts = internalQuery({
  args: {
    id: v.array(v.id("subHunts")),
  },
  handler: async (ctx, { id }) => {
    return await Promise.all(
      id.map(async (i) => {
        const subHunts = await ctx.db.get(i);

        return subHunts;
      })
    );
  },
});

export const hunterHunts = internalQuery({
  args: { id: v.id("hunters") },
  handler: async (ctx, { id }) => {
    return ctx.db
      .query("hunts")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", id))
      .collect();
  },
});
