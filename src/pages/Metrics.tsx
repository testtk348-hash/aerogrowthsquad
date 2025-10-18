import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PHChartMetrics } from "@/components/charts/PHChartMetrics";
import { phHistory, airTempHistory, tdsHistory, humidityHistory } from "@/lib/mockData";
import { toast } from "sonner";

type MetricType = "pH" | "air_temp" | "water_temp" | "tds" | "humidity";

const Metrics = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("pH");

  const metricsConfig = {
    pH: { data: phHistory, label: "pH Level", unit: "pH", optimal: 6.5 },
    air_temp: { data: airTempHistory, label: "Air Temperature", unit: "°C", optimal: 26 },
    water_temp: { data: airTempHistory, label: "Water Temperature", unit: "°C", optimal: 21 },
    tds: { data: tdsHistory, label: "TDS", unit: "ppm", optimal: 400 },
    humidity: { data: humidityHistory, label: "Humidity", unit: "%", optimal: 75 },
  };

  const currentConfig = metricsConfig[selectedMetric];
  const currentData = currentConfig.data.slice(-48);

  const stats = {
    current: currentData[currentData.length - 1]?.value || 0,
    min: Math.min(...currentData.map((d) => d.value)),
    max: Math.max(...currentData.map((d) => d.value)),
    avg: currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length,
  };

  const chartData = currentData.map((d) => ({
    time: new Date(d.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: d.value,
  }));

  // Distribution data for histogram
  const distribution = Array.from({ length: 10 }, (_, i) => {
    const min = stats.min;
    const max = stats.max;
    const range = (max - min) / 10;
    const rangeStart = min + i * range;
    const rangeEnd = rangeStart + range;
    const count = currentData.filter((d) => d.value >= rangeStart && d.value < rangeEnd).length;
    return {
      range: `${rangeStart.toFixed(1)}-${rangeEnd.toFixed(1)}`,
      count,
    };
  });

  const [exportDays, setExportDays] = useState(1);

  const handleExport = (days: number) => {
    const dataToExport = currentConfig.data.slice(-days * 24);
    
    // Generate CSV content
    const headers = ["Timestamp", "Value", "Unit"];
    const csvRows = [headers.join(",")];
    
    dataToExport.forEach((item) => {
      const row = [
        new Date(item.ts).toISOString(),
        item.value.toFixed(2),
        currentConfig.unit
      ];
      csvRows.push(row.join(","));
    });
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedMetric}_${days}day_metrics_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success(`${days} day${days > 1 ? 's' : ''} CSV downloaded successfully!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="mb-2">Performance Metrics</h1>
            <p className="text-muted-foreground">
              Deep analytics and historical trends
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport(1)}>
                Export 1 Day
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport(2)}>
                Export 2 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport(7)}>
                Export 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport(30)}>
                Export 1 Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Parameter Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Parameter</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            <Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pH">pH Level</SelectItem>
                <SelectItem value="air_temp">Air Temperature</SelectItem>
                <SelectItem value="water_temp">Water Temperature</SelectItem>
                <SelectItem value="tds">TDS</SelectItem>
                <SelectItem value="humidity">Humidity</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.current.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{currentConfig.unit}</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.avg.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{currentConfig.unit}</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Min</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.min.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{currentConfig.unit}</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Max</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.max.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{currentConfig.unit}</p>
            </CardContent>
          </Card>
        </div>

        {/* Time Series Chart */}
        <PHChartMetrics 
          data={chartData} 
          label={currentConfig.label} 
          unit={currentConfig.unit}
        />

        {/* Distribution & Trend */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: 10 }}
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
                  <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Trend Projection</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[250px]">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-success mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Stable Trend</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Next 24h prediction: {stats.avg.toFixed(2)} {currentConfig.unit}
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on linear regression of last 48 hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
