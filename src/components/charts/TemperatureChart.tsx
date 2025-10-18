import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SensorReading } from "@/lib/mockData";

interface TemperatureChartProps {
  airTemp: SensorReading[];
  waterTemp: SensorReading[];
}

export const TemperatureChart = ({ airTemp, waterTemp }: TemperatureChartProps) => {
  const chartData = airTemp.map((d, i) => ({
    time: new Date(d.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    air: d.value,
    water: waterTemp[i]?.value || 0,
  }));

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="text-lg">Air vs Water Temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
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
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="air"
              stackId="1"
              stroke="hsl(var(--chart-4))"
              fill="hsl(var(--chart-4))"
              fillOpacity={0.6}
              name="Air Temp (°C)"
            />
            <Area
              type="monotone"
              dataKey="water"
              stackId="2"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.6}
              name="Water Temp (°C)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
