import { Droplets, Thermometer, Wind, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const actions = [
  { icon: Droplets, label: "Flush System", color: "text-blue-500" },
  { icon: Zap, label: "Adjust Nutrient", color: "text-accent" },
  { icon: Thermometer, label: "Raise Temp +1°C", color: "text-orange-500" },
  { icon: Wind, label: "Notify Team", color: "text-primary" },
];

export const QuickActionsPanel = () => {
  const handleAction = (label: string) => {
    toast.success(`Action initiated: ${label}`);
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => handleAction(action.label)}
            >
              <action.icon className={`h-6 w-6 ${action.color}`} />
              <span className="text-xs font-medium text-center">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
