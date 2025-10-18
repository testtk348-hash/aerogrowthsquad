import { AlertTriangle, Info, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Alert } from "@/lib/mockData";

interface AlertsPanelProps {
  alerts: Alert[];
}

export const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  const getIcon = (type: Alert["type"]) => {
    switch (type) {
      case "danger":
        return XCircle;
      case "warning":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="text-lg">Alerts & Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            {alerts.map((alert) => {
              const Icon = getIcon(alert.type);
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border",
                    alert.type === "danger" && "bg-destructive/10 border-destructive/20",
                    alert.type === "warning" && "bg-warning/10 border-warning/20",
                    alert.type === "info" && "bg-primary/10 border-primary/20"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 mt-0.5",
                    alert.type === "danger" && "text-destructive",
                    alert.type === "warning" && "text-warning",
                    alert.type === "info" && "text-primary"
                  )} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
