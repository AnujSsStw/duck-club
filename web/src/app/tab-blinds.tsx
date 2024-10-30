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
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../../convex/_generated/api";

export function TabBlinds({ timePeriod }: { timePeriod: string }) {
  const blindData = useQuery(api.charts.getBlindPerformance, { timePeriod });

  return (
    <div>
      <TabsContent value="blinds">
        <Card>
          <CardHeader>
            <CardTitle>Totals and Averages by Blind</CardTitle>
          </CardHeader>
          <CardContent>
            {blindData?.length ? (
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
            ) : (
              <div>No data</div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
