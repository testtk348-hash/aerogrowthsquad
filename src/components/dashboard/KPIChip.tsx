import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface KPIChipProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit: string;
  delta?: number;
  status: "good" | "warning" | "danger";
  sparklineData?: { value: number }[];
}

export const KPIChip = ({
  icon: Icon,
  label,
  value,
  unit,
  delta,
  status,
  sparklineData = [],
}: KPIChipProps) => {
  const statusColors = {
    good: "border-success/50 bg-success/5",
    warning: "border-warning/50 bg-warning/5",
    danger: "border-destructive/50 bg-destructive/5",
  };

  const iconColors = {
    good: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
  };

  return (
    <Card className={cn(
      "p-5 card-hover border-2 transition-all duration-300",
      statusColors[status]
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-lg bg-background/50", iconColors[status])}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        {delta !== undefined && (
          <span className={cn(
            "text-xs font-semibold px-2 py-1 rounded-md",
            delta > 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
          )}>
            {delta > 0 ? "+" : ""}{delta.toFixed(1)}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-3xl font-bold">
            {typeof value === 'number' ? value.toFixed(1) : value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{unit}</p>
        </div>
        {sparklineData.length > 0 && (
          <div className="h-12 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={status === "good" ? "hsl(var(--success))" : status === "warning" ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
};
