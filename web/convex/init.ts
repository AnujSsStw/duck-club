import { internalMutation } from "./_generated/server";

// add all the predefined data
// Run npx convex run init:init to initialize this in the database
export const init = internalMutation({
  args: {},
  handler: async (ctx) => {
    if ((await ctx.db.query("waterfowlSpecies").first()) !== null) {
      throw new Error("There's an existing waterflowSpecies setup already.");
    }

    for (const species of waterfowlSpecies) {
      await ctx.db.insert("waterfowlSpecies", { name: species });
    }
  },
});

const waterfowlSpecies = [
  // Ducks
  "Mallard",
  "American Black Duck",
  "Northern Pintail",
  "Green-winged Teal",
  "Blue-winged Teal",
  "Cinnamon Teal",
  "Northern Shoveler",
  "Gadwall",
  "American Wigeon",
  "Wood Duck",
  "Canvasback",
  "Redhead",
  "Ring-necked Duck",
  "Greater Scaup",
  "Lesser Scaup",
  "Common Goldeneye",
  "Bufflehead",
  "Ruddy Duck",
  "Common Eider",
  "King Eider",
  "Harlequin Duck",
  "Long-tailed Duck",
  "Surf Scoter",
  "White-winged Scoter",
  "Black Scoter",
  "Common Merganser",
  "Red-breasted Merganser",
  "Hooded Merganser",

  // Geese
  "Canada Goose",
  "Snow Goose",
  "Ross's Goose",
  "Greater White-fronted Goose",
  "Brant",

  // Swans
  "Tundra Swan",
  "Trumpeter Swan",
  "Mute Swan",
];
