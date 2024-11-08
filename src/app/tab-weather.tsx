import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TabsContent } from "@/components/ui/tabs";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function TabWeather({ timePeriod }: { timePeriod: string }) {
  const weatherData = useQuery(api.charts.getWeatherData, { timePeriod });

  return (
    <div>
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
    </div>
  );
}
