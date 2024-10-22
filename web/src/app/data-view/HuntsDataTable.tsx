"use client";

import React from 'react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useQuery } from 'convex/react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface HuntsDataTableProps {
  creatorId: Id<"hunters">;
}

export const HuntsDataTable: React.FC<HuntsDataTableProps> = ({ creatorId }) => {
  const huntsData = useQuery(api.huntsAllData.getHuntsByCreator, { creatorId });

  const columns: any = [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "totalSessions",
      header: "Total Sessions",
    },
    {
      accessorKey: "totalHarvest",
      header: "Total Harvest",
    },
  ];

  const table = useReactTable({
    data: huntsData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!huntsData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Hunts Data Table</h2>
      <Table>
        <TableCaption>A list of your recent hunts.</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {huntsData.length > 0 && <HuntDetailsChart huntId={huntsData[1].id} />}
    </div>
  );
};

interface HuntDetailsChartProps {
  huntId: Id<"huntsAllData">;
}

const HuntDetailsChart: React.FC<HuntDetailsChartProps> = ({ huntId }) => {
  const huntDetails = useQuery(api.huntsAllData.getHuntDetails, { huntId });

  if (!huntDetails) return null;

  return (
    <div>
      <h3>Hunt Details</h3>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h4>Sessions Data</h4>
          <BarChart width={500} height={300} data={huntDetails.sessionsData}>
            <XAxis dataKey="timeSlot" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalWaterfowl" fill="#8884d8" />
            <Bar dataKey="temperature" fill="#82ca9d" />
          </BarChart>
        </div>
        <div>
          <h4>Species Distribution</h4>
          <PieChart width={400} height={300}>
            <Pie
              data={huntDetails.aggregatedSpeciesData}
              dataKey="quantity"
              nameKey="species"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {huntDetails.aggregatedSpeciesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};
