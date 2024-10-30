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

export function TabSpecies({ timePeriod }: { timePeriod: string }) {
  const speciesData = useQuery(api.charts.getSpeciesBreakdown, {
    timePeriod,
  });

  return (
    <div>
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
              <ResponsiveContainer width="100%" height="100%" className="pl-4">
                <BarChart
                  data={
                    speciesData?.find((s) => s.count > 0)
                      ? speciesData.filter((s) => s.count > 0)
                      : speciesData
                  }
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis
                    dataKey="species"
                    type="category"
                    className="text-xs w-auto"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
