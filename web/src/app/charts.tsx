"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data (replace with actual data fetching logic)
const dailyData = [
  { date: "2023-11-01", totalKills: 12, ducks: 8, geese: 4 },
  { date: "2023-11-02", totalKills: 15, ducks: 10, geese: 5 },
  { date: "2023-11-03", totalKills: 8, ducks: 6, geese: 2 },
  { date: "2023-11-04", totalKills: 20, ducks: 15, geese: 5 },
  { date: "2023-11-05", totalKills: 18, ducks: 12, geese: 6 },
];

const seasonalData = [
  { month: "Sep", totalKills: 150, ducks: 100, geese: 50 },
  { month: "Oct", totalKills: 200, ducks: 130, geese: 70 },
  { month: "Nov", totalKills: 180, ducks: 120, geese: 60 },
  { month: "Dec", totalKills: 220, ducks: 150, geese: 70 },
];

const allTimeData = [
  { year: "2020", totalKills: 800, ducks: 550, geese: 250 },
  { year: "2021", totalKills: 900, ducks: 600, geese: 300 },
  { year: "2022", totalKills: 950, ducks: 650, geese: 300 },
  { year: "2023", totalKills: 1000, ducks: 700, geese: 300 },
];

const speciesData = [
  { species: "Mallard", count: 250 },
  { species: "Wood Duck", count: 150 },
  { species: "Canada Goose", count: 200 },
  { species: "Teal", count: 100 },
  { species: "Pintail", count: 50 },
];

const blindData = [
  { blind: "Blind 1", totalKills: 150, avgKillsPerSession: 7.5 },
  { blind: "Blind 2", totalKills: 180, avgKillsPerSession: 9 },
  { blind: "Blind 3", totalKills: 120, avgKillsPerSession: 6 },
  { blind: "Blind 4", totalKills: 200, avgKillsPerSession: 10 },
];

const weatherData = [
  {
    date: "2023-11-01",
    kills: 12,
    precipitation: 0.2,
    tempFluctuation: 5,
    windSpeed: 10,
  },
  {
    date: "2023-11-02",
    kills: 15,
    precipitation: 0,
    tempFluctuation: 8,
    windSpeed: 15,
  },
  {
    date: "2023-11-03",
    kills: 8,
    precipitation: 0.5,
    tempFluctuation: 3,
    windSpeed: 5,
  },
  {
    date: "2023-11-04",
    kills: 20,
    precipitation: 0.1,
    tempFluctuation: 6,
    windSpeed: 12,
  },
  {
    date: "2023-11-05",
    kills: 18,
    precipitation: 0,
    tempFluctuation: 4,
    windSpeed: 8,
  },
];

export function HuntingDashboard() {
  const [timePeriod, setTimePeriod] = useState("day");

  return (
    <div className="container mx-auto p-4 space-y-8 ">
      <h1 className="text-3xl font-bold mb-4">Hunting Dashboard</h1>

      <Select onValueChange={(value) => setTimePeriod(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="season">Season</SelectItem>
          <SelectItem value="allTime">All Time</SelectItem>
        </SelectContent>
      </Select>

      <Tabs defaultValue="totals" className="w-full">
        <TabsList>
          <TabsTrigger value="totals">Totals</TabsTrigger>
          <TabsTrigger value="species">Species</TabsTrigger>
          <TabsTrigger value="blinds">Blinds</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
        </TabsList>

        <TabsContent value="totals">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Totals</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    totalKills: {
                      label: "Total Kills",
                      color: "hsl(152, 80%, 50%)", // Bright green
                    },
                    ducks: {
                      label: "Ducks",
                      color: "hsl(211, 80%, 60%)", // Bright blue
                    },
                    geese: {
                      label: "Geese",
                      color: "hsl(43, 90%, 50%)", // Bright yellow
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="totalKills"
                        fill="var(--color-totalKills)"
                      />
                      <Bar dataKey="ducks" fill="var(--color-ducks)" />
                      <Bar dataKey="geese" fill="var(--color-geese)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seasonal Totals</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    totalKills: {
                      label: "Total Kills",
                      color: "hsl(152, 80%, 50%)", // Bright green
                    },
                    ducks: {
                      label: "Ducks",
                      color: "hsl(211, 80%, 60%)", // Bright blue
                    },
                    geese: {
                      label: "Geese",
                      color: "hsl(43, 90%, 50%)", // Bright yellow
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={seasonalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="totalKills"
                        stroke="var(--color-totalKills)"
                      />
                      <Line
                        type="monotone"
                        dataKey="ducks"
                        stroke="var(--color-ducks)"
                      />
                      <Line
                        type="monotone"
                        dataKey="geese"
                        stroke="var(--color-geese)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Time Totals</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    totalKills: {
                      label: "Total Kills",
                      color: "hsl(152, 80%, 50%)", // Bright green
                    },
                    ducks: {
                      label: "Ducks",
                      color: "hsl(211, 80%, 60%)", // Bright blue
                    },
                    geese: {
                      label: "Geese",
                      color: "hsl(43, 90%, 50%)", // Bright yellow
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={allTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="totalKills"
                        fill="var(--color-totalKills)"
                      />
                      <Bar dataKey="ducks" fill="var(--color-ducks)" />
                      <Bar dataKey="geese" fill="var(--color-geese)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="species">
          <Card>
            <CardHeader>
              <CardTitle>Species Count ({timePeriod})</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: {
                    label: "Count",
                    color: "hsl(280, 80%, 60%)", // Bright purple
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={speciesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="species" type="category" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blinds">
          <Card>
            <CardHeader>
              <CardTitle>Totals and Averages by Blind</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  totalKills: {
                    label: "Total Kills",
                    color: "hsl(152, 80%, 50%)", // Bright green
                  },
                  avgKillsPerSession: {
                    label: "Avg Kills Per Session",
                    color: "hsl(211, 80%, 60%)", // Bright blue
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={blindData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="blind" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="totalKills"
                      fill="var(--color-totalKills)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="avgKillsPerSession"
                      fill="var(--color-avgKillsPerSession)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weather">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Kills vs Precipitation</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    kills: {
                      label: "Kills",
                      color: "hsl(152, 80%, 50%)", // Bright green
                    },
                    precipitation: {
                      label: "Precipitation",
                      color: "hsl(211, 80%, 60%)", // Bright blue
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weatherData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="kills"
                        stroke="var(--color-kills)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="precipitation"
                        stroke="var(--color-precipitation)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kills vs Temperature Fluctuation</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    kills: {
                      label: "Kills",
                      color: "hsl(152, 80%, 50%)", // Bright green
                    },
                    tempFluctuation: {
                      label: "Temp Fluctuation",
                      color: "hsl(280, 80%, 60%)", // Bright purple
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weatherData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="kills"
                        stroke="var(--color-kills)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="tempFluctuation"
                        stroke="var(--color-tempFluctuation)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kills vs Wind Speed</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    kills: {
                      label: "Kills",
                      color: "hsl(152, 80%, 50%)", // Bright green
                    },
                    windSpeed: {
                      label: "Wind Speed",
                      color: "hsl(43, 90%, 50%)", // Bright yellow
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weatherData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="kills"
                        stroke="var(--color-kills)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="windSpeed"
                        stroke="var(--color-windSpeed)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
