import { QueryCtx, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { format } from "date-fns";
import { getCurrentUser } from "./users";

function getDateRange(timePeriod: string) {
  if (timePeriod === "day") {
    return {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
  } else if (timePeriod === "week") {
    return {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
    };
  } else if (timePeriod === "month") {
    return {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
    };
  } else if (timePeriod === "season") {
    return {
      startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
    };
  } else {
    return {
      startDate: "",
      endDate: "",
    };
  }
}

// Define species categories
export const speciesGroups = {
  swans: [
    "k970w0t2h9dbz9jmtrm6vk8y21731f2n", // Mute Swan
    "k97fe2ezsp4dgy0bzcg96mkzbd731kzc", // Trumpeter Swan
    "k971wy0z01y0s9hg2g782wzd7d731dwm", // Tundra Swan
  ],
  geese: [
    "k971znxrba5h95akzf5qq1fe5s731nsr", // Brant
    "k97fanyhwjkcwhtk2eaqmkr3ah730fd6", // Greater White-fronted Goose
    "k97exxdvxm2kd4zdnmsjk6srhs7305j1", // Ross's Goose
    "k97f5zqs3bna44yh8w2mmw71c97308np", // Snow Goose
    "k97ch0p9s02m7txg17rqrqvpsn730f3e", // Canada Goose
  ],
  mergansers: [
    "k97bkekehfyb98e56fsq7tg6b9731jy1", // Hooded Merganser
    "k9790qnmvfp6cbn2700v6yaf5x731t2p", // Red-breasted Merganser
    "k97ctt9ex8jg9qmwje6fq437d5731m9g", // Common Merganser
  ],
  seaDucks: [
    "k9743zfqr68ybxfj65gq9s2k09731y34", // Black Scoter
    "k9714ayk92wv5synczvzqzdtnn7318hn", // White-winged Scoter
    "k970a9zzarw8wstqyxed0qhnv5731ypq", // Surf Scoter
    "k9729zy3d6pa919qn55snedx29731nzk", // Long-tailed Duck
    "k97acjvpxfbthx0ynxg3g0k179730bbw", // Harlequin Duck
    "k970q59wrnq47hxy87971wd52d730tf7", // King Eider
    "k970qcq9ayc5b51qjwzw6peqan730ede", // Common Eider
  ],
  divingDucks: [
    "k97aavebef0dsnhwh04bwjwyex7304my", // Ruddy Duck
    "k974jz5sv008fqzg6k52yyd44d730zt1", // Bufflehead
    "k97d2n409f57ydkfkrs8gw8jjx731dj9", // Common Goldeneye
    "k97dm6ds3g4gvqtfnj1bv6e8m9730r26", // Lesser Scaup
    "k97fkz970dj4gx08avsz2cabbn731ga5", // Greater Scaup
    "k970jsfwwtjcwhch1y1sgmn089730q4h", // Ring-necked Duck
    "k971eem8mgp6eqm2mjgtmpsphd730rf6", // Redhead
    "k977cgtcnz27gmrj95c39zg9c9731yc6", // Canvasback
  ],
  dabblingDucks: [
    "k97dkw9yasfjqvjxew128b0gd1731pgf", // Wood Duck
    "k973v2qv6yagdwf0xzg4c3apw573091s", // American Wigeon
    "k97drsvknerf6m64jq6rrjpzk5730bm9", // Gadwall
    "k97dzb6qq2z3atrgfk86t1tnd9730vdc", // Northern Shoveler
    "k972512t0pqsw6tk86fqhc7q3x730h58", // Cinnamon Teal
    "k9707ks6qy2vjhzjktta82qhd1731v9z", // Blue-winged Teal
    "k97fvgzv1vdj1jm0ccb61kpv2973020x", // Green-winged Teal
    "k97bbhfq3sn2yvjxppvvysqv2h731yc8", // Northern Pintail
    "k977w9hgwb13vac1nsr0jhk6hs7319hj", // American Black Duck
    "k971gav7r7zpx7j6rvgm61tamn7300nn", // Mallard
  ],
};

const countHarvestsByGroup = (blinds: any[], groupIds: string[]) => {
  return blinds.reduce((acc, blind) => {
    const groupHarvests = blind.harvests.filter((h: any) =>
      groupIds.includes(h.speciesId)
    );
    return (
      acc + groupHarvests.reduce((sum: number, h: any) => sum + h.quantity, 0)
    );
  }, 0);
};

// Get data for daily totals
export const getDailyTotals = query({
  args: {
    locationId: v.optional(v.id("huntLocations")),
    today: v.string(),
  },
  handler: async (ctx, args) => {
    const { locationId, today } = args;
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Can't get current user");

    // Get all hunting sessions within date range
    const sessions = await ctx.db
      .query("huntingSessions")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
      .filter((q) =>
        q.and(
          locationId ? q.eq(q.field("locationId"), locationId) : true,
          // from today to previous some days
          q.lte(q.field("date"), today),
          q.gte(
            q.field("date"),
            new Date(
              new Date(today).setDate(new Date(today).getDate() - 4)
            ).toISOString()
          )
        )
      )
      .collect();
    // .order("desc")
    // .take(4);

    // Get all blind sessions for these hunting sessions
    const blindSessions = await Promise.all(
      sessions.map((session) =>
        ctx.db
          .query("blindSessions")
          .withIndex("by_hunting_session", (q) =>
            q.eq("huntingSessionId", session._id)
          )
          .collect()
      )
    );

    // Aggregate data by date
    const dailyData = sessions.map((session, index) => {
      const sessionBlinds = blindSessions[index];

      return {
        date: format(new Date(session.date), "MMM d, yyyy"),
        swans: countHarvestsByGroup(sessionBlinds, speciesGroups.swans),
        geese: countHarvestsByGroup(sessionBlinds, speciesGroups.geese),
        mergansers: countHarvestsByGroup(
          sessionBlinds,
          speciesGroups.mergansers
        ),
        seaDucks: countHarvestsByGroup(sessionBlinds, speciesGroups.seaDucks),
        divingDucks: countHarvestsByGroup(
          sessionBlinds,
          speciesGroups.divingDucks
        ),
        dabblingDucks: countHarvestsByGroup(
          sessionBlinds,
          speciesGroups.dabblingDucks
        ),
        get totalKills() {
          return (
            this.swans +
            this.geese +
            this.mergansers +
            this.seaDucks +
            this.divingDucks +
            this.dabblingDucks
          );
        },
      };
    });

    return dailyData;
  },
});

// Get seasonal totals
export const getSeasonalTotals = query({
  args: {
    year: v.number(),
    locationId: v.optional(v.id("huntLocations")),
  },
  handler: async (ctx, args) => {
    const { year, locationId } = args;
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Can't get current user");

    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(year, i, 1).toISOString();
      const monthEnd = new Date(year, i + 1, 0).toISOString();

      const sessions = await ctx.db
        .query("huntingSessions")
        .withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
        .filter((q) =>
          q.and(
            locationId ? q.eq(q.field("locationId"), locationId) : true,
            q.gte(q.field("date"), monthStart),
            q.lte(q.field("date"), monthEnd)
          )
        )
        .collect();

      const blindSessions = await Promise.all(
        sessions.map((session) =>
          ctx.db
            .query("blindSessions")
            .filter((q) => q.eq(q.field("huntingSessionId"), session._id))
            .collect()
        )
      );

      const flattenedBlinds = blindSessions.flat();

      const monthlyTotals = {
        month: format(new Date(monthStart), "MMM"),
        swans: countHarvestsByGroup(flattenedBlinds, speciesGroups.swans),
        geese: countHarvestsByGroup(flattenedBlinds, speciesGroups.geese),
        mergansers: countHarvestsByGroup(
          flattenedBlinds,
          speciesGroups.mergansers
        ),
        seaDucks: countHarvestsByGroup(flattenedBlinds, speciesGroups.seaDucks),
        divingDucks: countHarvestsByGroup(
          flattenedBlinds,
          speciesGroups.divingDucks
        ),
        dabblingDucks: countHarvestsByGroup(
          flattenedBlinds,
          speciesGroups.dabblingDucks
        ),
        get totalKills() {
          return (
            this.swans +
            this.geese +
            this.mergansers +
            this.seaDucks +
            this.divingDucks +
            this.dabblingDucks
          );
        },
      };

      monthlyData.push(monthlyTotals);
    }

    return monthlyData;
  },
});

// Get all time totals
export const getAllTimeTotals = query({
  args: {
    locationId: v.optional(v.id("huntLocations")),
  },
  handler: async (ctx, args) => {
    const { locationId } = args;
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Can't get current user");

    const sessions = await ctx.db
      .query("huntingSessions")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
      .filter((q) =>
        locationId ? q.eq(q.field("locationId"), locationId) : true
      )
      .collect();

    // Group sessions by year
    const sessionsByYear = sessions.reduce(
      (acc, session) => {
        const year = new Date(session.date).getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(session);
        return acc;
      },
      {} as Record<number, typeof sessions>
    );

    // Calculate totals for each year
    const yearlyTotals = await Promise.all(
      Object.entries(sessionsByYear).map(async ([year, yearSessions]) => {
        const blindSessions = await Promise.all(
          yearSessions.map((session) =>
            ctx.db
              .query("blindSessions")
              .withIndex("by_hunting_session", (q) =>
                q.eq("huntingSessionId", session._id)
              )
              .collect()
          )
        );

        const flattenedBlinds = blindSessions.flat();

        return {
          year: parseInt(year),
          swans: countHarvestsByGroup(flattenedBlinds, speciesGroups.swans),
          geese: countHarvestsByGroup(flattenedBlinds, speciesGroups.geese),
          mergansers: countHarvestsByGroup(
            flattenedBlinds,
            speciesGroups.mergansers
          ),
          seaDucks: countHarvestsByGroup(
            flattenedBlinds,
            speciesGroups.seaDucks
          ),
          divingDucks: countHarvestsByGroup(
            flattenedBlinds,
            speciesGroups.divingDucks
          ),
          dabblingDucks: countHarvestsByGroup(
            flattenedBlinds,
            speciesGroups.dabblingDucks
          ),
          totalKills: countHarvestsByGroup(flattenedBlinds, [
            ...speciesGroups.swans,
            ...speciesGroups.geese,
            ...speciesGroups.mergansers,
            ...speciesGroups.seaDucks,
            ...speciesGroups.divingDucks,
            ...speciesGroups.dabblingDucks,
          ]),
        };
      })
    );

    return yearlyTotals.sort((a, b) => a.year - b.year);
  },
});

// Get species breakdown
export const getSpeciesBreakdown = query({
  args: {
    timePeriod: v.string(),
    locationId: v.optional(v.id("huntLocations")),
  },
  handler: async (ctx, args) => {
    const { timePeriod, locationId } = args;
    const { startDate, endDate } = getDateRange(timePeriod);
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Can't get current user");

    // Get all sessions in date range
    const sessions = await ctx.db
      .query("huntingSessions")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
      .filter((q) =>
        q.and(
          startDate ? q.gte(q.field("date"), startDate) : true,
          endDate ? q.lte(q.field("date"), endDate) : true,
          locationId ? q.eq(q.field("locationId"), locationId) : true
        )
      )
      .collect();

    // Get all blind sessions
    const blindSessions = await Promise.all(
      sessions.map((session) =>
        ctx.db
          .query("blindSessions")
          .filter((q) => q.eq(q.field("huntingSessionId"), session._id))
          .collect()
      )
    );

    // Get all species
    const species = await ctx.db.query("waterfowlSpecies").collect();

    // Create species count map
    const speciesCount = new Map(
      species.map((s) => [s._id, { species: s.name, count: 0 }])
    );

    // Count harvests by species
    blindSessions.flat().forEach((blind) => {
      blind.harvests.forEach((harvest) => {
        const current = speciesCount.get(harvest.speciesId);
        if (current) {
          current.count += harvest.quantity;
        }
      });
    });

    return Array.from(speciesCount.values());
  },
});

// Get blind performance data
export const getBlindPerformance = query({
  args: {
    timePeriod: v.string(),
    locationId: v.optional(v.id("huntLocations")),
  },
  handler: async (ctx, args) => {
    const { timePeriod, locationId } = args;
    const { startDate, endDate } = getDateRange(timePeriod);

    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Can't get current user");

    // Get all sessions in date range
    const sessions = await ctx.db
      .query("huntingSessions")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
      .filter((q) =>
        q.and(
          startDate ? q.gte(q.field("date"), startDate) : true,
          endDate ? q.lte(q.field("date"), endDate) : true,
          locationId ? q.eq(q.field("locationId"), locationId) : true
        )
      )
      .collect();

    // Get all blind sessions
    const blindSessions = await Promise.all(
      sessions.map((session) =>
        ctx.db
          .query("blindSessions")
          .filter((q) => q.eq(q.field("huntingSessionId"), session._id))
          .collect()
      )
    ).then((arrays) => arrays.flat());

    // Aggregate data by blind
    const blindStats = new Map();

    blindSessions.forEach((blind) => {
      if (!blindStats.has(blind.blindName)) {
        blindStats.set(blind.blindName, {
          blind: blind.blindName,
          totalKills: 0,
          sessionCount: 0,
        });
      }

      const stats = blindStats.get(blind.blindName);
      stats.totalKills += blind.totalBirds;
      stats.sessionCount += 1;
    });

    return Array.from(blindStats.values()).map((stats) => ({
      blind: stats.blind,
      totalKills: stats.totalKills,
      avgKillsPerSession: stats.totalKills / stats.sessionCount,
    }));
  },
});

// Get weather correlation data
export const getWeatherData = query({
  args: {
    timePeriod: v.string(),
    locationId: v.optional(v.id("huntLocations")),
  },
  handler: async (ctx, args) => {
    const { timePeriod, locationId } = args;
    const { startDate, endDate } = getDateRange(timePeriod);
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Can't get current user");

    // Get all sessions in date range
    const sessions = await ctx.db
      .query("huntingSessions")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
      .filter((q) =>
        q.and(
          startDate ? q.gte(q.field("date"), startDate) : true,
          endDate ? q.lte(q.field("date"), endDate) : true,
          locationId ? q.eq(q.field("locationId"), locationId) : true
        )
      )
      .collect();

    // Get weather conditions and blind sessions for each hunting session
    const weatherData = await Promise.all(
      sessions.map(async (session) => {
        const weather = await ctx.db.get(session.weatherConditionID);
        const blindSessions = await ctx.db
          .query("blindSessions")
          .filter((q) => q.eq(q.field("huntingSessionId"), session._id))
          .collect();

        const totalKills = blindSessions.reduce(
          (acc, blind) => acc + blind.totalBirds,
          0
        );

        return {
          date: format(new Date(session.date), "MMM d, yyyy"),
          kills: totalKills,
          precipitation: weather?.precipitation,
          windSpeed: weather?.windSpeed,
          tempFluctuation: Math.abs((weather?.temperatureC ?? 0) * 1.8 + 32),
        };
      })
    );

    return weatherData;
  },
});

// export const getWeatherData = query({
//   args: {
//     timePeriod: v.string(),
//     locationId: v.optional(v.id("huntLocations")),
//   },
//   handler: async (ctx, args) => {
//     const { timePeriod, locationId } = args;
//     const { startDate, endDate } = getDateRange(timePeriod);

//     // ... existing session query code ...

//     // Modify the weather data processing
//     let weatherData;
//     if (timePeriod === "season") {
//       // Group by month for seasonal view
//       const monthlyData = sessions.reduce((acc, session) => {
//         const monthKey = format(new Date(session.date), "MMM yyyy");
//         if (!acc[monthKey]) {
//           acc[monthKey] = {
//             kills: 0,
//             precipitation: 0,
//             windSpeed: 0,
//             tempFluctuation: 0,
//             count: 0
//           };
//         }

//         const weather = await ctx.db.get(session.weatherConditionID);
//         const blindSessions = await ctx.db
//           .query("blindSessions")
//           .filter((q) => q.eq(q.field("huntingSessionId"), session._id))
//           .collect();

//         const totalKills = blindSessions.reduce(
//           (acc, blind) => acc + blind.totalBirds,
//           0
//         );

//         acc[monthKey].kills += totalKills;
//         acc[monthKey].precipitation += weather?.precipitation ?? 0;
//         acc[monthKey].windSpeed += weather?.windSpeed ?? 0;
//         acc[monthKey].tempFluctuation += Math.abs((weather?.temperatureC ?? 0) * 1.8 + 32);
//         acc[monthKey].count++;

//         return acc;
//       }, {});

//       // Calculate averages
//       weatherData = Object.entries(monthlyData).map(([date, data]) => ({
//         date,
//         kills: data.kills,
//         precipitation: data.precipitation / data.count,
//         windSpeed: data.windSpeed / data.count,
//         tempFluctuation: data.tempFluctuation / data.count,
//       }));
//     } else {
//       // Original daily data processing
//       weatherData = await Promise.all(
//         sessions.map(async (session) => {
//           const weather = await ctx.db.get(session.weatherConditionID);
//           const blindSessions = await ctx.db
//             .query("blindSessions")
//             .filter((q) => q.eq(q.field("huntingSessionId"), session._id))
//             .collect();

//           const totalKills = blindSessions.reduce(
//             (acc, blind) => acc + blind.totalBirds,
//             0
//           );

//           return {
//             date: format(new Date(session.date), "MMM d, yyyy"),
//             kills: totalKills,
//             precipitation: weather?.precipitation,
//             windSpeed: weather?.windSpeed,
//             tempFluctuation: Math.abs((weather?.temperatureC ?? 0) * 1.8 + 32),
//           };
//         })
//       );
//     }

//     return weatherData;
//   },
// });
