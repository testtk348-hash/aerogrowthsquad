import { useState, useEffect } from "react";
import { Droplets, Thermometer, Wind, Activity, Droplet } from "lucide-react";
import { KPIChip } from "@/components/dashboard/KPIChip";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { QuickActionsPanel } from "@/components/dashboard/QuickActionsPanel";
import { PHChart } from "@/components/charts/PHChart";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import { TDSGauge } from "@/components/charts/TDSGauge";
import { HumidityHeatmap } from "@/components/charts/HumidityHeatmap";
import { CurrentlyGrownCrops } from "@/components/dashboard/CurrentlyGrownCrops";
import { WhatCanBeGrown } from "@/components/dashboard/WhatCanBeGrown";
import {
  getLatestMetrics,
  getStatusColor,
  phHistory,
  airTempHistory,
  waterTempHistory,
  mockAlerts,
} from "@/lib/mockData";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(getLatestMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(getLatestMetrics());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const kpiData = [
    {
      icon: Droplets,
      label: "pH",
      value: metrics.pH,
      unit: "pH",
      delta: -0.2,
      status: getStatusColor(metrics.pH, 6.5, 0.8),
      sparklineData: phHistory.slice(-10).map((d) => ({ value: d.value })),
    },
    {
      icon: Thermometer,
      label: "Air Temp",
      value: metrics.air_temp_c,
      unit: "°C",
      delta: 0.3,
      status: getStatusColor(metrics.air_temp_c, 26, 3),
      sparklineData: airTempHistory.slice(-10).map((d) => ({ value: d.value })),
    },
    {
      icon: Droplet,
      label: "Water Temp",
      value: metrics.water_temp_c,
      unit: "°C",
      delta: -0.1,
      status: getStatusColor(metrics.water_temp_c, 21, 2),
      sparklineData: waterTempHistory.slice(-10).map((d) => ({ value: d.value })),
    },
    {
      icon: Activity,
      label: "TDS",
      value: metrics.tds_ppm.toFixed(0),
      unit: "ppm",
      delta: 5,
      status: getStatusColor(metrics.tds_ppm, 400, 60),
      sparklineData: [],
    },
    {
      icon: Wind,
      label: "Humidity",
      value: metrics.humidity_pct,
      unit: "%",
      delta: -2.1,
      status: getStatusColor(metrics.humidity_pct, 75, 10),
      sparklineData: [],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="mb-2">System Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of your vertical aeroponics farm
          </p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiData.map((kpi) => (
            <KPIChip key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <PHChart data={phHistory} />
          <TemperatureChart airTemp={airTempHistory} waterTemp={waterTempHistory} />
          <TDSGauge value={metrics.tds_ppm} optimal={400} />
          <HumidityHeatmap />
        </div>

        {/* Currently Grown Crops */}
        <CurrentlyGrownCrops />

        {/* What Can Be Grown */}
        <WhatCanBeGrown />

        {/* Alerts and Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <AlertsPanel alerts={mockAlerts} />
          <QuickActionsPanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
