"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export function getHuntsAllDataColumns() {
  const columns: ColumnDef<ReturnType<typeof flattenHuntsData>[number]>[] = [
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
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
        return (
         <DataTableColumnHeader column={column} title="Date" />
        );
      },
      filterFn: "filterByDateRange" as any,
    },
   
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "state",
      header: "State",
    },
    {
      accessorKey: "county",
      header: "County",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "timeSlot",
      header: "Time Slot",
    },
    {
      accessorKey: "totalWaterfowl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Waterfowl" />
      ),
    },
    {
      accessorKey: "weather",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Weather Condition" />
      ),
    },
    {
      accessorKey: "temp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Temperature" />
      ),
    },
    {
      accessorKey: "wind",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Wind" />
      ),
    },
    {
      accessorKey: "hunterName",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Hunter Name" />
        );
      },
      cell: ({ row }) => {
        const label = ["guest", "member"].find((label) => label === row.original.memberType)
  
        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label}</Badge>}
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("hunterName")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    // {
    //   accessorKey: "memberType",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Membership Type" />
    //   ),
    // },
    {
      accessorKey: "blind",
      header: "Blind",
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
          row={{
            original: {
              _id: row.original._id as string,
              timeSlot: row.original.timeSlot || "",
            },
          } as any}
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
          temp: `${Math.round((session.weather.temperatureC * 9/5) + 32)}°F`,
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
