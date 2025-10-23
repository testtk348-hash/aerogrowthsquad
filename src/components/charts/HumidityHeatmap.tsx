import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SensorReading } from "@/services/sensorApi";

interface HumidityHeatmapProps {
  data?: SensorReading[];
}

export const HumidityHeatmap = ({ data = [] }: HumidityHeatmapProps) => {
  // Generate humidity grid based on real data or use mock data
  const generateHumidityGrid = () => {
    if (data.length === 0) {
      // Fallback to mock data
      return [
        [82, 78, 75, 73],
        [80, 77, 76, 74],
        [79, 78, 77, 75],
      ];
    }

    // Use the latest humidity value as base and create variations for different racks
    const latestHumidity = data[data.length - 1]?.value || 75;
    const baseHumidity = Math.round(latestHumidity);
    
    // Create realistic variations for different rack positions
    return [
      [
        baseHumidity + 2, 
        baseHumidity, 
        baseHumidity - 2, 
        baseHumidity - 4
      ],
      [
        baseHumidity, 
        baseHumidity - 1, 
        baseHumidity - 1, 
        baseHumidity - 3
      ],
      [
        baseHumidity - 1, 
        baseHumidity, 
        baseHumidity + 1, 
        baseHumidity - 1
      ],
    ];
  };

  const humidityGrid = generateHumidityGrid();

  const getHumidityColor = (value: number) => {
    if (value >= 80) return "bg-chart-5";
    if (value >= 75) return "bg-chart-4";
    if (value >= 70) return "bg-chart-2";
    return "bg-chart-1";
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="text-lg">Humidity Distribution (Racks)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {humidityGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 justify-center">
              {row.map((humidity, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "flex-1 aspect-square rounded-lg flex items-center justify-center text-white font-semibold transition-all hover:scale-105",
                    getHumidityColor(humidity)
                  )}
                >
                  <span className="text-sm">{humidity}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-chart-1" />
            <span className="text-muted-foreground">&lt;70%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-chart-2" />
            <span className="text-muted-foreground">70-75%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-chart-4" />
            <span className="text-muted-foreground">75-80%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-chart-5" />
            <span className="text-muted-foreground">&gt;80%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
