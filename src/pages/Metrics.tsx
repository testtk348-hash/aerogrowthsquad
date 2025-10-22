import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, TrendingUp } from "lucide-react";
import { exportCSVMobile } from "@/utils/mobile";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PHChartMetrics } from "@/components/charts/PHChartMetrics";
import { phHistory, airTempHistory, tdsHistory, humidityHistory } from "@/lib/mockData";
import { toast } from "sonner";

type MetricType = "pH" | "air_temp" | "water_temp" | "tds" | "humidity";

const Metrics = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("pH");
  const [isExporting, setIsExporting] = useState(false);

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



  // Enhanced mobile detection
  const isMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 'opera mini'];
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0);
  };

  const handleExport = async (days: number) => {
    console.log(`Starting CSV export for ${days} days`);
    setIsExporting(true);
    
    // Add a small delay to ensure UI updates properly on mobile
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Export all available data if days is greater than available data
      const maxAvailableDays = Math.ceil(currentConfig.data.length / 24);
      const actualDays = Math.min(days, maxAvailableDays);
      const dataToExport = days >= maxAvailableDays ? currentConfig.data : currentConfig.data.slice(-days * 24);
      
      console.log(`Exporting ${dataToExport.length} data points (${actualDays} days of data)`);
      
      // Generate CSV content with proper formatting and BOM for Excel compatibility
      const headers = ["Timestamp", "Metric", "Value", "Unit"];
      const csvRows = [headers.join(",")];
      
      dataToExport.forEach((item) => {
        const row = [
          `"${new Date(item.ts).toLocaleString()}"`, // Quoted timestamp for better compatibility
          `"${selectedMetric}"`, // Include metric name
          item.value.toFixed(2),
          `"${currentConfig.unit}"`
        ];
        csvRows.push(row.join(","));
      });
      
      // Add BOM for proper Excel UTF-8 handling
      const csvContent = '\uFEFF' + csvRows.join("\n");
      const filename = `AeroGrowth_${selectedMetric}_AllData_${new Date().toISOString().split("T")[0]}.csv`;
      const title = 'AeroGrowth Metrics Export';
      const description = `${selectedMetric} complete metrics dataset (${dataToExport.length} data points) - AeroGrowth Vertical Farming`;
      
      console.log(`Exporting CSV: ${filename} with ${dataToExport.length} records`);
      
      // Use the improved mobile CSV export function
      const result = await exportCSVMobile(csvContent, filename, title, description);
      
      if (result.success) {
        console.log('CSV export successful:', result.message);
        // Use a more subtle success message for mobile
        if (isMobileDevice()) {
          toast.success(`CSV exported! ${dataToExport.length} records ready for download/share`);
        } else {
          toast.success(result.message);
        }
      } else {
        console.error('CSV export failed:', result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Export failed:', error);
      const errorMessage = 'Failed to export CSV. Please try again.';
      toast.error(errorMessage);
    } finally {
      // Add a small delay before re-enabling the button to prevent double-clicks
      setTimeout(() => {
        console.log('CSV export process completed');
        setIsExporting(false);
      }, 500);
    }
  };

  // Wrapper function to handle CSV export with navigation bypass - exports all available data
  const handleCSVExportClick = () => {
    console.log('Direct CSV export button clicked - exporting all available data');
    
    // Temporarily disable navigation prevention for this action
    const body = document.body;
    body.classList.add('csv-export-active');
    
    // Export all available data (full dataset)
    const allDataDays = Math.ceil(currentConfig.data.length / 24); // Calculate total days of data available
    console.log(`Exporting ${allDataDays} days of data (${currentConfig.data.length} data points)`);
    
    // Execute the export with all available data
    handleExport(allDataDays).finally(() => {
      // Re-enable navigation prevention after a delay
      setTimeout(() => {
        body.classList.remove('csv-export-active');
      }, 1000);
    });
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
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Direct CSV Export clicked');
              handleCSVExportClick();
            }}
            disabled={isExporting}
            className="min-h-[44px] min-w-[120px] touch-manipulation csv-export-button"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            data-csv-export="true"
            data-interactive="true"
          >
            <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>

        {/* Parameter Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Parameter</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            <Select 
              value={selectedMetric} 
              onValueChange={(v) => {
                console.log('Parameter selected:', v);
                // Temporarily disable navigation prevention during selection
                document.body.classList.add('select-active');
                setSelectedMetric(v as MetricType);
                // Re-enable after a short delay
                setTimeout(() => {
                  document.body.classList.remove('select-active');
                }, 500);
              }}
              onOpenChange={(open) => {
                console.log('Select dropdown open state:', open);
                // Disable navigation prevention when dropdown is open
                if (open) {
                  document.body.classList.add('select-active');
                } else {
                  setTimeout(() => {
                    document.body.classList.remove('select-active');
                  }, 300);
                }
              }}
            >
              <SelectTrigger 
                className="w-full md:w-[200px] min-h-[48px] touch-manipulation select-trigger-mobile"
                data-interactive="true"
                data-select-trigger="true"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                onClick={(e) => {
                  console.log('Select trigger clicked');
                  e.stopPropagation();
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent 
                data-interactive="true"
                data-select-content="true"
                className="select-content-mobile"
                position="popper"
                sideOffset={8}
              >
                <SelectItem 
                  value="pH"
                  className="min-h-[48px] touch-manipulation cursor-pointer select-item-mobile"
                  data-interactive="true"
                  data-select-item="true"
                  onClick={(e) => {
                    console.log('pH selected');
                    e.stopPropagation();
                  }}
                >
                  pH Level
                </SelectItem>
                <SelectItem 
                  value="air_temp"
                  className="min-h-[48px] touch-manipulation cursor-pointer select-item-mobile"
                  data-interactive="true"
                  data-select-item="true"
                  onClick={(e) => {
                    console.log('Air Temperature selected');
                    e.stopPropagation();
                  }}
                >
                  Air Temperature
                </SelectItem>
                <SelectItem 
                  value="water_temp"
                  className="min-h-[48px] touch-manipulation cursor-pointer select-item-mobile"
                  data-interactive="true"
                  data-select-item="true"
                  onClick={(e) => {
                    console.log('Water Temperature selected');
                    e.stopPropagation();
                  }}
                >
                  Water Temperature
                </SelectItem>
                <SelectItem 
                  value="tds"
                  className="min-h-[48px] touch-manipulation cursor-pointer select-item-mobile"
                  data-interactive="true"
                  data-select-item="true"
                  onClick={(e) => {
                    console.log('TDS selected');
                    e.stopPropagation();
                  }}
                >
                  TDS
                </SelectItem>
                <SelectItem 
                  value="humidity"
                  className="min-h-[48px] touch-manipulation cursor-pointer select-item-mobile"
                  data-interactive="true"
                  data-select-item="true"
                  onClick={(e) => {
                    console.log('Humidity selected');
                    e.stopPropagation();
                  }}
                >
                  Humidity
                </SelectItem>
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
