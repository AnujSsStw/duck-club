"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { HuntData } from "./more-types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export function getHuntsAllDataColumns() {
  const columns: ColumnDef<ReturnType<typeof flattenHuntsData2>[number]>[] = [
    {
      id: "id",
      accessorKey: "_id",
      header: "ID",
      enableHiding: false,
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: "blindSessionId",
      accessorKey: "blindSessionId",
      header: "Blind Session ID",
      enableHiding: false,
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          // select all rows
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all"
          className="mr-2"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Date" />;
      },
      filterFn: "filterByDateRange" as any,
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "timeSlot",
      header: "Time Slot",
      cell: ({ row }) => {
        return <div className="capitalize">{row.original.timeSlot}</div>;
      },
    },
    {
      accessorKey: "blind",
      header: "Blind",
    },
    {
      accessorKey: "totalBirds",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Birds" />
      ),
    },
    {
      accessorKey: "weather",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Weather Condition" />
      ),
    },
    {
      accessorKey: "temperature",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Temperature" />
      ),
      cell: ({ row }) => {
        return <div>{row.original.temperature}°F</div>;
      },
    },
    {
      accessorKey: "windSpeed",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Wind" />
      ),
      cell: ({ row }) => {
        return <div>{row.original.windSpeed} mph</div>;
      },
    },
    {
      accessorKey: "windDirection",
      // header: ({ column }) => (
      //   <DataTableColumnHeader column={column} title="Wind Direction" />
      // ),
      header: "Wind Direction",
    },
    {
      accessorKey: "totalHunters",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Hunters" />
      ),
    },
    {
      accessorKey: "hunters",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Hunters Name" />;
      },
      // cell: ({ row }) => {
      //   const label = ["guest", "member"].find(
      //     (label) => label === row.original.memberType
      //   );

      //   return (
      //     <div className="flex space-x-2">
      //       {label && <Badge variant="outline">{label}</Badge>}
      //       <span className="max-w-[500px] truncate font-medium">
      //         {row.getValue("hunterName")}
      //       </span>
      //     </div>
      //   );
      // },
    },
    {
      accessorKey: "harvests",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Harvest" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={
            {
              original: {
                _id: row.original._id as string,
                timeSlot: row.original.timeSlot || "",
                blindSessionId: row.original.blindSessionId || "",
              },
            } as any
          }
        />
      ),
    },
  ];

  return columns;
}

export function flattenHuntsData(data: Doc<"huntsAllData">[]) {
  const rows = data.flatMap((hunt) => {
    return (hunt.sessions || []).flatMap((session) => {
      return (session.hunters || []).flatMap((hunter) => {
        const baseRow = {
          // Add the id field
          _id: hunt._id,

          // Hunt Info
          date: new Date(hunt.date!).toLocaleDateString(),
          location: hunt.locationName,
          city: hunt.city,
          state: hunt.state,
          county: hunt.county,

          // Session Info
          timeSlot: session.timeSlot,
          totalWaterfowl: session.totalWaterfowl,

          // Weather Info
          weather: session.weather.condition,
          temp: `${Math.round((session.weather.temperatureC * 9) / 5 + 32)}°F`,
          wind: `${session.weather.windSpeed} ${session.weather.windDirection}`,

          // Hunter Info
          hunterName: hunter.fullName,
          email: hunter.email,
          phone: hunter.phoneNumber,
          memberType: hunter.memberShipType,

          // Blind Info
          blind: hunter.duckBlind?.name || "No blind",

          // Harvest Info
          harvests:
            (hunter.harvests || [])
              .map((h) => `${h.quantity} ${h.speciesName}`)
              .join(", ") || "No harvest",
        };
        return baseRow;
      });
    });
  });
  return rows;
}

export function flattenHuntsData2(combinedData: HuntData[]) {
  const rows = combinedData.flatMap((hunt) => {
    // Create a row for each blind session
    return hunt.blindSessions.map((blindSession) => {
      // Get all hunters in this blind
      const hunterNames =
        blindSession.hunters?.map((h) => `${h.fullName}`).join(", ") || "";

      // Combine all harvests from this blind session
      const harvestCounts: { [speciesId: string]: number } = {};
      blindSession.harvests?.forEach((harvest) => {
        harvestCounts[harvest.speciesId] =
          (harvestCounts[harvest.speciesId] || 0) + harvest.quantity;
      });

      // Create harvest string using species mapping
      const harvestString =
        blindSession.species
          ?.map((species) => {
            const count = harvestCounts[species._id] || 0;
            return count > 0 ? `${count} ${species.name}` : null;
          })
          .filter(Boolean)
          .join(", ") || "No harvest";

      return {
        _id: hunt._id,
        blindSessionId: blindSession._id,
        date: new Date(hunt.date).toLocaleDateString(),
        timeSlot: hunt.timeSlot,
        hunters: hunterNames,
        blind: blindSession.blindName || "",
        harvests: harvestString,
        totalBirds: blindSession.totalBirds,

        location: hunt.description,

        weather: hunt.condition,
        temperature: hunt.temperatureC,
        windSpeed: hunt.windSpeed,
        windDirection: hunt.windDirection,
        totalHunters: blindSession.hunters?.length || 0,
      };
    });
  });

  return rows;
}
