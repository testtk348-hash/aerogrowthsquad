import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface TDSGaugeProps {
  value: number;
  optimal: number;
  historyData?: Array<{ ts: string; value: number }>;
}

export const TDSGauge = ({ value, optimal, historyData }: TDSGaugeProps) => {
  const safeValue = value ?? 0;
  const safeOptimal = optimal ?? 400;
  const percentage = (safeValue / safeOptimal) * 100;
  
  // Use real data if available, otherwise generate mock data
  const generateTDSHistory = () => {
    const data = [];
    const now = Date.now();
    for (let i = 11; i >= 0; i--) {
      const variance = (Math.random() - 0.5) * 30;
      const timestamp = new Date(now - i * 2 * 60 * 60 * 1000);
      data.push({
        time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: safeOptimal + variance,
      });
    }
    return data;
  };

  const chartData = historyData && historyData.length > 0 
    ? historyData.slice(-12).map(d => ({
        time: new Date(d.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: d.value,
      }))
    : generateTDSHistory();
  
  const getStatusColor = () => {
    if (percentage >= 90 && percentage <= 110) return "hsl(var(--success))";
    if (percentage >= 80 && percentage <= 120) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="text-lg">TDS Level</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Value Display */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold" style={{ color: getStatusColor() }}>
              {safeValue.toFixed(0)}
            </p>
            <p className="text-sm text-muted-foreground">ppm</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-muted-foreground">{safeOptimal}</p>
            <p className="text-xs text-muted-foreground">optimal</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: getStatusColor(),
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 ppm</span>
            <span>{percentage.toFixed(0)}% of optimal</span>
            <span>500 ppm</span>
          </div>
        </div>

        {/* Mini Trend Chart */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Last 24 hours trend</p>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tdsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[safeOptimal - 50, safeOptimal + 50]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelFormatter={(value) => `${value}`}
                formatter={(value: number) => [`${(value ?? 0).toFixed(0)} ppm`, "TDS"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                fill="url(#tdsFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};