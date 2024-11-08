import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { get } from "../../../convex/data_view";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./data-table-row-actions";

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
      id: "date",
      accessorKey: "date",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Date" />;
      },
      filterFn: "filterByDateRange" as any,
    },
    {
      id: "location",
      accessorKey: "location",
      header: "Location",
    },
    {
      id: "timeSlot",
      accessorKey: "timeSlot",
      header: "Time Slot",
      cell: ({ row }) => {
        return <div className="capitalize">{row.original.timeSlot}</div>;
      },
    },
    {
      id: "blind",
      accessorKey: "blind",
      header: "Blind",
    },
    {
      id: "totalBirds",
      accessorKey: "totalBirds",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Birds" />
      ),
    },
    {
      id: "weather",
      accessorKey: "weather",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Weather Condition" />
      ),
    },
    {
      id: "temperature",
      accessorKey: "temperature",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Temperature" />
      ),
      cell: ({ row }) => {
        return <div>{row.original.temperature}°F</div>;
      },
    },
    {
      id: "windSpeed",
      accessorKey: "windSpeed",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Wind" />
      ),
      cell: ({ row }) => {
        return <div>{row.original.windSpeed} mph</div>;
      },
    },
    {
      id: "windDirection",
      accessorKey: "windDirection",
      // header: ({ column }) => (
      //   <DataTableColumnHeader column={column} title="Wind Direction" />
      // ),
      header: "Wind Direction",
      cell: ({ row }) => {
        return (
          <div>
            {typeof row.original.windDirection === "number"
              ? row.original.windDirection + "°"
              : row.original.windDirection}
          </div>
        );
      },
    },
    {
      id: "totalHunters",
      accessorKey: "totalHunters",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Hunters" />
      ),
    },
    {
      id: "hunters",
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
      id: "harvests",
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

export function flattenHuntsData(
  combinedData: Awaited<ReturnType<typeof get>>
) {
  const rows = combinedData.flatMap((hunt) => {
    // Create a row for each blind session
    return hunt.blindSessions.map((blindSession) => {
      // Get all hunters in this blind
      const hunterNames =
        blindSession.hunters?.map((h) => `${h!.fullName}`).join(", ") || "";

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
            const count = harvestCounts[species!._id] || 0;
            return count > 0 ? `${count} ${species!.name}` : null;
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
