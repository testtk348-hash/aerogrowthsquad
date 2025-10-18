import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface PHChartMetricsProps {
  data: Array<{ time: string; value: number }>;
  label: string;
  unit: string;
}

export const PHChartMetrics = ({ data, label, unit }: PHChartMetricsProps) => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>{label} Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [value.toFixed(2) + " " + unit, label]}
            />
            {label === "pH Level" && (
              <>
                <ReferenceLine y={6.0} stroke="hsl(var(--success))" strokeDasharray="3 3" label="Min Optimal" />
                <ReferenceLine y={6.8} stroke="hsl(var(--success))" strokeDasharray="3 3" label="Max Optimal" />
              </>
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#colorValue)"
              dot={{ fill: "hsl(var(--primary))", r: 3 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};