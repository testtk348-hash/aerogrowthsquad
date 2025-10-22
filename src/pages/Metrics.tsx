import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Thermometer, Droplets, Activity, Gauge } from "lucide-react";
import { exportCSVMobile } from "@/utils/mobile";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PHChartMetrics } from "@/components/charts/PHChartMetrics";
import { phHistory, airTempHistory, tdsHistory, humidityHistory } from "@/lib/mockData";
import { toast } from "sonner";

type MetricType = "pH" | "air_temp" | "water_temp" | "tds" | "humidity";

const Metrics = () => {
  const [isExporting, setIsExporting] = useState<{ [key: string]: boolean }>({});

  const metricsConfig = {
    pH: { 
      data: phHistory, 
      label: "pH Level", 
      unit: "pH", 
      optimal: 6.5, 
      icon: Activity,
      color: "hsl(var(--chart-1))",
      description: "Acidity/alkalinity level of the nutrient solution"
    },
    air_temp: { 
      data: airTempHistory, 
      label: "Air Temperature", 
      unit: "°C", 
      optimal: 26, 
      icon: Thermometer,
      color: "hsl(var(--chart-2))",
      description: "Ambient air temperature in the growing environment"
    },
    water_temp: { 
      data: airTempHistory, 
      label: "Water Temperature", 
      unit: "°C", 
      optimal: 21, 
      icon: Thermometer,
      color: "hsl(var(--chart-3))",
      description: "Temperature of the nutrient solution"
    },
    tds: { 
      data: tdsHistory, 
      label: "TDS", 
      unit: "ppm", 
      optimal: 400, 
      icon: Gauge,
      color: "hsl(var(--chart-4))",
      description: "Total dissolved solids in the nutrient solution"
    },
    humidity: { 
      data: humidityHistory, 
      label: "Humidity", 
      unit: "%", 
      optimal: 75, 
      icon: Droplets,
      color: "hsl(var(--chart-5))",
      description: "Relative humidity in the growing environment"
    },
  };

  // Helper function to get stats for a metric
  const getStatsForMetric = (metricKey: MetricType) => {
    const config = metricsConfig[metricKey];
    const data = config.data.slice(-48);
    return {
      current: data[data.length - 1]?.value || 0,
      min: Math.min(...data.map((d) => d.value)),
      max: Math.max(...data.map((d) => d.value)),
      avg: data.reduce((sum, d) => sum + d.value, 0) / data.length,
      chartData: data.map((d) => ({
        time: new Date(d.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: d.value,
      })),
    };
  };



  // Enhanced mobile detection
  const isMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 'opera mini'];
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0);
  };

  const handleExport = async (metricKey: MetricType) => {
    console.log(`Starting CSV export for ${metricKey}`);
    setIsExporting(prev => ({ ...prev, [metricKey]: true }));
    
    // Add a small delay to ensure UI updates properly on mobile
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const config = metricsConfig[metricKey];
      const dataToExport = config.data;
      
      console.log(`Exporting ${dataToExport.length} data points for ${metricKey}`);
      
      // Generate CSV content with proper formatting and BOM for Excel compatibility
      const headers = ["Timestamp", "Metric", "Value", "Unit"];
      const csvRows = [headers.join(",")];
      
      dataToExport.forEach((item) => {
        const row = [
          `"${new Date(item.ts).toLocaleString()}"`, // Quoted timestamp for better compatibility
          `"${metricKey}"`, // Include metric name
          item.value.toFixed(2),
          `"${config.unit}"`
        ];
        csvRows.push(row.join(","));
      });
      
      // Add BOM for proper Excel UTF-8 handling
      const csvContent = '\uFEFF' + csvRows.join("\n");
      const filename = `AeroGrowth_${metricKey}_AllData_${new Date().toISOString().split("T")[0]}.csv`;
      const title = 'AeroGrowth Metrics Export';
      const description = `${metricKey} complete metrics dataset (${dataToExport.length} data points) - AeroGrowth Vertical Farming`;
      
      console.log(`Exporting CSV: ${filename} with ${dataToExport.length} records`);
      
      // Use the improved mobile CSV export function
      const result = await exportCSVMobile(csvContent, filename, title, description);
      
      if (result.success) {
        console.log('CSV export successful:', result.message);
        // Use a more subtle success message for mobile
        if (isMobileDevice()) {
          toast.success(`${config.label} CSV exported! ${dataToExport.length} records ready`);
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
        setIsExporting(prev => ({ ...prev, [metricKey]: false }));
      }, 500);
    }
  };

  // Wrapper function to handle CSV export with navigation bypass
  const handleCSVExportClick = (metricKey: MetricType) => {
    console.log(`Direct CSV export clicked for ${metricKey}`);
    
    // Temporarily disable navigation prevention for this action
    const body = document.body;
    body.classList.add('csv-export-active');
    
    // Execute the export
    handleExport(metricKey).finally(() => {
      // Re-enable navigation prevention after a delay
      setTimeout(() => {
        body.classList.remove('csv-export-active');
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="mb-2">Performance Metrics</h1>
          <p className="text-muted-foreground">
            Complete analytics and historical trends for all parameters
          </p>
        </div>

        {/* All Metrics Sections */}
        {Object.entries(metricsConfig).map(([metricKey, config]) => {
          const stats = getStatsForMetric(metricKey as MetricType);
          const Icon = config.icon;
          
          return (
            <div key={metricKey} className="space-y-6">
              {/* Metric Header */}
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${config.color}20`, color: config.color }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{config.label}</CardTitle>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCSVExportClick(metricKey as MetricType);
                      }}
                      disabled={isExporting[metricKey]}
                      className="min-h-[44px] min-w-[120px] touch-manipulation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                      data-csv-export="true"
                      data-interactive="true"
                    >
                      <Download className={`h-4 w-4 mr-2 ${isExporting[metricKey] ? 'animate-spin' : ''}`} />
                      {isExporting[metricKey] ? 'Exporting...' : 'Export CSV'}
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Current</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold" style={{ color: config.color }}>
                      {stats.current.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">{config.unit}</p>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Average</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{stats.avg.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{config.unit}</p>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Min</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{stats.min.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{config.unit}</p>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Max</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{stats.max.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{config.unit}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>{config.label} Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <PHChartMetrics 
                    data={stats.chartData} 
                    label={config.label} 
                    unit={config.unit}
                  />
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Metrics;
