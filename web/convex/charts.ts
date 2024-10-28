import { QueryCtx, mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Get data for daily totals
export const getDailyTotals = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
    locationId: v.optional(v.id("huntLocations")),
  },
  handler: async (ctx, args) => {
    const { startDate, endDate, locationId } = args;

    // Get all hunting sessions within date range
    const sessions = await ctx.db
      .query("huntingSessions")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate),
          locationId ? q.eq(q.field("locationId"), locationId) : true
        )
      )
      .collect();

    // Get all blind sessions for these hunting sessions
    const blindSessions = await Promise.all(
      sessions.map((session) =>
        ctx.db
          .query("blindSessions")
          .filter((q) => q.eq(q.field("huntingSessionId"), session._id))
          .collect()
      )
    );

    // Aggregate data by date
    const dailyData = sessions.map((session, index) => {
      const sessionBlinds = blindSessions[index];
      const ducks = sessionBlinds.reduce((acc, blind) => {
        const duckHarvests = blind.harvests.filter(
          (h) =>
            // You would need to maintain a list of duck species IDs
            // This is a simplified example
            h.speciesId !== "geese-species-id"
        );
        return acc + duckHarvests.reduce((sum, h) => sum + h.quantity, 0);
      }, 0);

      const geese = sessionBlinds.reduce((acc, blind) => {
        const geeseHarvests = blind.harvests.filter(
          (h) =>
            // You would need to maintain a list of geese species IDs
            h.speciesId === "geese-species-id"
        );
        return acc + geeseHarvests.reduce((sum, h) => sum + h.quantity, 0);
      }, 0);

      return {
        date: session.date,
        totalKills: ducks + geese,
        ducks,
        geese,
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
    const startDate = `${year}-09-01`; // Assuming season starts in September
    const endDate = `${year + 1}-01-31`; // Ends in January next year

    const monthlyData = [];
    const months = ["Sep", "Oct", "Nov", "Dec", "Jan"];

    for (let i = 0; i < months.length; i++) {
      const monthStart = i < 4 ? `${year}-${i + 9}-01` : `${year + 1}-01-01`;
      const monthEnd = i < 4 ? `${year}-${i + 9}-31` : `${year + 1}-01-31`;

      const sessions = await ctx.db
        .query("huntingSessions")
        .filter((q) =>
          q.and(
            q.gte(q.field("date"), monthStart),
            q.lte(q.field("date"), monthEnd),
            locationId ? q.eq(q.field("locationId"), locationId) : true
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

      const monthlyTotals = {
        month: months[i],
        totalKills: 0,
        ducks: 0,
        geese: 0,
      };

      blindSessions.flat().forEach((blind) => {
        blind.harvests.forEach((harvest) => {
          const quantity = harvest.quantity;
          monthlyTotals.totalKills += quantity;
          if (harvest.speciesId === "geese-species-id") {
            monthlyTotals.geese += quantity;
          } else {
            monthlyTotals.ducks += quantity;
          }
        });
      });

      monthlyData.push(monthlyTotals);
    }

    return monthlyData;
  },
});

// Get species breakdown
export const getSpeciesBreakdown = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
    locationId: v.optional(v.id("huntLocations")),
  },
  handler: async (ctx, args) => {
    const { startDate, endDate, locationId } = args;

    // Get all sessions in date range
    const sessions = await ctx.db
      .query("huntingSessions")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate),
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
    startDate: v.string(),
    endDate: v.string(),
    locationId: v.optional(v.id("huntLocations")),
  },
  handler: async (ctx, args) => {
    const { startDate, endDate, locationId } = args;

    // Get all sessions in date range
    const sessions = await ctx.db
      .query("huntingSessions")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate),
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
    startDate: v.string(),
    endDate: v.string(),
    locationId: v.optional(v.id("huntLocations")),
  },
  handler: async (ctx, args) => {
    const { startDate, endDate, locationId } = args;

    // Get all sessions in date range
    const sessions = await ctx.db
      .query("huntingSessions")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate),
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
          date: session.date,
          kills: totalKills,
          precipitation: weather?.precipitation,
          tempFluctuation: Math.abs(weather?.temperatureC ?? 0 - 15), // Example: difference from 15°C
          windSpeed: weather?.windSpeed,
        };
      })
    );

    return weatherData;
  },
});
