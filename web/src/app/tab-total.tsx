import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TabsContent } from "@/components/ui/tabs";
import { useQuery } from "convex/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../../convex/_generated/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { species } from "@/lib/constants";
import { speciesGroups } from "../../convex/charts";
import { Badge } from "@/components/ui/badge";

// TODO: Remove this
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

const CHART_CONFIG = {
  totalKills: {
    label: "Total Kills",
    color: "hsl(152, 80%, 50%)", // Bright green
  },
  dabblingDucks: {
    label: "Dabbling Ducks",
    color: "hsl(211, 80%, 60%)", // Bright blue
  },
  divingDucks: {
    label: "Diving Ducks",
    color: "hsl(280, 80%, 60%)", // Purple
  },
  seaDucks: {
    label: "Sea Ducks",
    color: "hsl(190, 80%, 60%)", // Teal
  },
  mergansers: {
    label: "Mergansers",
    color: "hsl(340, 80%, 60%)", // Pink
  },
  geese: {
    label: "Geese",
    color: "hsl(43, 90%, 50%)", // Bright yellow
  },
  swans: {
    label: "Swans",
    color: "hsl(0, 80%, 60%)", // Red
  },
} as const;

const today = new Date().toISOString();

export function TabTotal() {
  const dailyData = useQuery(api.charts.getDailyTotals, {
    today,
  });
  const seasonalData = useQuery(api.charts.getSeasonalTotals, {
    year: new Date().getFullYear(),
  });
  const allTimeData = useQuery(api.charts.getAllTimeTotals, {});

  return (
    <div>
      <TabsContent value="totals">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 justify-center">
              {Object.entries(CHART_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-sm">{config.label}</span>
                </div>
              ))}
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Details</AccordionTrigger>
                <AccordionContent>
                  {Object.entries(speciesGroups).map(([key, group]) => (
                    <div key={key} className="mb-4">
                      <h3 className="text-lg font-semibold capitalize">
                        {key}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {group.map((speciesId) => (
                          <Badge key={speciesId} className=" p-2 rounded-md">
                            {species.find((s) => s._id === speciesId)?.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Totals</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={CHART_CONFIG} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="totalKills" fill="var(--color-totalKills)" />
                    <Bar
                      dataKey="dabblingDucks"
                      fill="var(--color-dabblingDucks)"
                    />
                    <Bar
                      dataKey="divingDucks"
                      fill="var(--color-divingDucks)"
                    />
                    <Bar dataKey="seaDucks" fill="var(--color-seaDucks)" />
                    <Bar dataKey="mergansers" fill="var(--color-mergansers)" />
                    <Bar dataKey="geese" fill="var(--color-geese)" />
                    <Bar dataKey="swans" fill="var(--color-swans)" />
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
              <ChartContainer config={CHART_CONFIG} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={seasonalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="totalKills"
                      stroke="var(--color-totalKills)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="dabblingDucks"
                      stroke="var(--color-dabblingDucks)"
                    />
                    <Line
                      type="monotone"
                      dataKey="divingDucks"
                      stroke="var(--color-divingDucks)"
                    />
                    <Line
                      type="monotone"
                      dataKey="seaDucks"
                      stroke="var(--color-seaDucks)"
                    />
                    <Line
                      type="monotone"
                      dataKey="mergansers"
                      stroke="var(--color-mergansers)"
                    />
                    <Line
                      type="monotone"
                      dataKey="geese"
                      stroke="var(--color-geese)"
                    />
                    <Line
                      type="monotone"
                      dataKey="swans"
                      stroke="var(--color-swans)"
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
              <ChartContainer config={CHART_CONFIG} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={allTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="totalKills" fill="var(--color-totalKills)" />
                    <Bar
                      dataKey="dabblingDucks"
                      fill="var(--color-dabblingDucks)"
                    />
                    <Bar
                      dataKey="divingDucks"
                      fill="var(--color-divingDucks)"
                    />
                    <Bar dataKey="seaDucks" fill="var(--color-seaDucks)" />
                    <Bar dataKey="mergansers" fill="var(--color-mergansers)" />
                    <Bar dataKey="geese" fill="var(--color-geese)" />
                    <Bar dataKey="swans" fill="var(--color-swans)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
}
