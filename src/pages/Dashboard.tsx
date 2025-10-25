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
import { sensorApi, type LatestMetrics, type Last30Data } from "@/services/sensorApi";
import { dataManager } from "@/services/dataManager";
import { getLatestMetrics, getStatusColor, mockAlerts, phHistory, airTempHistory, waterTempHistory, tdsHistory, humidityHistory } from "@/lib/mockData";

const Dashboard = () => {
  console.log('🚀 Dashboard component loaded successfully!');

  // Initialize with mock data to prevent white screen
  const [metrics, setMetrics] = useState<LatestMetrics | null>(() => {
    try {
      const mockMetrics = getLatestMetrics();
      console.log('✅ Mock metrics loaded:', mockMetrics);
      return mockMetrics;
    } catch (err) {
      console.error('Failed to get mock metrics:', err);
      return {
        timestamp: new Date().toISOString(),
        pH: 6.2,
        airTemp: 26,
        waterTemp: 21,
        tds: 420,
        humidity: 78,
        dissolved_oxygen_mg_l: 6.5,
        pump_status: "on" as const
      };
    }
  });

  const [chartData, setChartData] = useState<Last30Data | null>(() => {
    try {
      return {
        pH: phHistory,
        airTemp: airTempHistory,
        waterTemp: waterTempHistory,
        tds: tdsHistory,
        humidity: humidityHistory,
        dissolved_oxygen_mg_l: []
      };
    } catch (err) {
      console.error('Failed to get mock chart data:', err);
      return {
        pH: [],
        airTemp: [],
        waterTemp: [],
        tds: [],
        humidity: [],
        dissolved_oxygen_mg_l: []
      };
    }
  });


  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartDataLoaded, setChartDataLoaded] = useState(false);

  // Efficient fetching: Only get latest data (1 read instead of 30)
  const fetchLatestData = async () => {
    try {
      setIsRefreshing(true);
      
      // First test API health using efficient endpoint
      const healthCheck = await sensorApi.testApiHealth();
      console.log('🏥 API Health Check:', healthCheck);
      
      if (!healthCheck.success) {
        throw new Error(healthCheck.message);
      }
      
      const data = await sensorApi.getLatestData();
      setMetrics(data);
      setError(null);
      console.log('✅ Dashboard Latest Data Updated (EFFICIENT):', {
        pH: data.pH,
        airTemp: data.airTemp,
        waterTemp: data.waterTemp,
        tds: data.tds,
        humidity: data.humidity,
        pump: data.pump_status,
        timestamp: data.timestamp
      });

      // Update chart data from rolling data (no additional API calls!)
      if (chartDataLoaded) {
        updateChartDataFromRolling();
      }
    } catch (err) {
      console.error('❌ Failed to fetch latest data:', err);
      setError(`API Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      // Fallback to mock data
      setMetrics(getLatestMetrics());
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Show refresh indicator briefly
    }
  };

  // Update chart data from rolling data (efficient - no API calls)
  const updateChartDataFromRolling = () => {
    try {
      const rollingData = sensorApi.getRollingData();
      if (rollingData.length === 0) return;

      // Take last 30 data points and reverse for ascending order (oldest to newest)
      const last30 = rollingData.slice(0, 30).reverse();
      
      // Helper function to parse API timestamp format
      const parseApiTimestamp = (timestamp: string) => {
        const parts = timestamp.split(' ');
        const datePart = parts[0].replace(/:/g, '-');
        const timePart = parts[1];
        return `${datePart}T${timePart}`;
      };
      
      // Transform to chart format
      const updatedChartData: Last30Data = {
        pH: last30.map((item: any) => ({
          ts: parseApiTimestamp(item.timestamp),
          value: item.pH
        })),
        airTemp: last30.map((item: any) => ({
          ts: parseApiTimestamp(item.timestamp),
          value: item.airTemp
        })),
        waterTemp: last30.map((item: any) => ({
          ts: parseApiTimestamp(item.timestamp),
          value: item.waterTemp
        })),
        tds: last30.map((item: any) => ({
          ts: parseApiTimestamp(item.timestamp),
          value: item.tds
        })),
        humidity: last30.map((item: any) => ({
          ts: parseApiTimestamp(item.timestamp),
          value: item.humidity
        })),
        dissolved_oxygen_mg_l: []
      };

      setChartData(updatedChartData);
      console.log('📈 Chart data updated from rolling data (no API call!):', {
        pH: updatedChartData.pH?.length || 0,
        totalPoints: rollingData.length
      });
    } catch (err) {
      console.error('Failed to update chart data from rolling:', err);
    }
  };

  // Efficient fetching: Get chart data only once on load, then use rolling updates
  const fetchChartData = async () => {
    try {
      const data = await sensorApi.getLast30Data();
      setChartData(data);
      setChartDataLoaded(true);
      console.log('📈 Dashboard Chart Data Updated (EFFICIENT):', {
        pH: data.pH?.length || 0,
        airTemp: data.airTemp?.length || 0,
        waterTemp: data.waterTemp?.length || 0,
        tds: data.tds?.length || 0,
        humidity: data.humidity?.length || 0,
      });
    } catch (err) {
      console.error('Failed to fetch chart data:', err);
      // Use mock data as fallback
      setChartData({
        pH: phHistory,
        airTemp: airTempHistory,
        waterTemp: waterTempHistory,
        tds: tdsHistory,
        humidity: humidityHistory,
        dissolved_oxygen_mg_l: []
      });
      setChartDataLoaded(true);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('🚀 Loading initial data with EFFICIENT DATA MANAGER');
        
        // Initialize data manager (loads last30 + latest data efficiently)
        const initResult = await dataManager.initialize();
        if (!initResult.success) {
          throw new Error(initResult.message);
        }
        
        // Get initial data from data manager
        const [latestMetrics, chartData] = await Promise.all([
          dataManager.getLatestMetrics(),
          dataManager.getChartData()
        ]);
        
        setMetrics(latestMetrics);
        setChartData(chartData);
        setChartDataLoaded(true);
        setError(null);
        
        console.log('✅ Initial data loaded via efficient data manager');
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError('Failed to load dashboard data');
        // Use fallback mock data
        setMetrics(getLatestMetrics());
        setChartData({
          pH: phHistory,
          airTemp: airTempHistory,
          waterTemp: waterTempHistory,
          tds: tdsHistory,
          humidity: humidityHistory,
          dissolved_oxygen_mg_l: []
        });
        setChartDataLoaded(true);
      }
    };

    // Load data immediately when component mounts
    loadInitialData();

    // Set up efficient polling: ONLY latest data every 30 seconds
    const latestDataInterval = setInterval(async () => {
      try {
        const latestMetrics = await dataManager.refreshLatestData();
        setMetrics(latestMetrics);
        
        // Update charts from rolling data (no additional API calls!)
        if (chartDataLoaded) {
          updateChartDataFromRolling();
        }
      } catch (err) {
        console.error('Failed to refresh latest data:', err);
      }
    }, 30000); // Every 30 seconds - EFFICIENT!

    console.log('📊 EFFICIENT POLLING: Only fetching /data/latest every 30s (96.7% reduction in API calls)');

    return () => {
      clearInterval(latestDataInterval);
    };
  }, [chartDataLoaded]);

  // Calculate deltas from chart data if available
  const calculateDelta = (current: number, historical: { value: number }[]) => {
    if (!historical || historical.length < 2 || current === undefined || current === null) return 0;
    const previous = historical[historical.length - 2]?.value ?? current;
    const delta = current - previous;
    return Number(delta.toFixed(2));
  };

  // Calculate statistics from last30 data
  const calculateStats = (data: { value: number }[]) => {
    if (!data || data.length === 0) return { min: 0, max: 0, avg: 0 };

    const values = data.map(d => d.value).filter(v => v !== null && v !== undefined && !isNaN(v));
    if (values.length === 0) return { min: 0, max: 0, avg: 0 };

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, val) => sum + val, 0) / values.length
    };
  };

  const kpiData = metrics ? [
    {
      icon: Droplets,
      label: "pH",
      value: metrics.pH ?? 0, // Latest data for current value
      unit: "pH",
      delta: chartData?.pH ? calculateDelta(metrics.pH ?? 0, chartData.pH) : 0,
      status: getStatusColor(metrics.pH ?? 0, 6.5, 0.8),
      sparklineData: chartData?.pH?.slice(-10).map((d) => ({ value: d.value ?? 0 })) || [],
      stats: calculateStats(chartData?.pH || []), // Stats from last30 data
    },
    {
      icon: Thermometer,
      label: "Air Temp",
      value: metrics.airTemp ?? 0, // Latest data for current value
      unit: "°C",
      delta: chartData?.airTemp ? calculateDelta(metrics.airTemp ?? 0, chartData.airTemp) : 0,
      status: getStatusColor(metrics.airTemp ?? 0, 26, 3),
      sparklineData: chartData?.airTemp?.slice(-10).map((d) => ({ value: d.value ?? 0 })) || [],
      stats: calculateStats(chartData?.airTemp || []), // Stats from last30 data
    },
    {
      icon: Droplet,
      label: "Water Temp",
      value: metrics.waterTemp ?? 0, // Latest data for current value
      unit: "°C",
      delta: chartData?.waterTemp ? calculateDelta(metrics.waterTemp ?? 0, chartData.waterTemp) : 0,
      status: getStatusColor(metrics.waterTemp ?? 0, 21, 2),
      sparklineData: chartData?.waterTemp?.slice(-10).map((d) => ({ value: d.value ?? 0 })) || [],
      stats: calculateStats(chartData?.waterTemp || []), // Stats from last30 data
    },
    {
      icon: Activity,
      label: "TDS",
      value: (metrics.tds ?? 0).toFixed(0), // Latest data for current value
      unit: "ppm",
      delta: chartData?.tds ? calculateDelta(metrics.tds ?? 0, chartData.tds) : 0,
      status: getStatusColor(metrics.tds ?? 0, 400, 60),
      sparklineData: chartData?.tds?.slice(-10).map((d) => ({ value: d.value ?? 0 })) || [],
      stats: calculateStats(chartData?.tds || []), // Stats from last30 data
    },
    {
      icon: Wind,
      label: "Humidity",
      value: metrics.humidity ?? 0, // Latest data for current value
      unit: "%",
      delta: chartData?.humidity ? calculateDelta(metrics.humidity ?? 0, chartData.humidity) : 0,
      status: getStatusColor(metrics.humidity ?? 0, 75, 10),
      sparklineData: chartData?.humidity?.slice(-10).map((d) => ({ value: d.value ?? 0 })) || [],
      stats: calculateStats(chartData?.humidity || []), // Stats from last30 data
    },
  ] : [];



  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-8 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-2">System Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time monitoring of your vertical aeroponics farm
                <span className="block text-green-600 text-xs mt-1 flex items-center gap-1">
                  🚀 Efficient Mode: 96.7% fewer API calls
                </span>
                {error && (
                  <span className="block text-yellow-600 text-sm mt-1">
                    ⚠️ Using fallback data - {error}
                  </span>
                )}
              </p>
            </div>
            {metrics && (
              <div className="flex items-center gap-3 bg-card border rounded-lg px-4 py-3">
                <div className={`w-3 h-3 rounded-full ${metrics.pump_status === 'on' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <div className="text-sm">
                  <div className="font-semibold">Pump Status</div>
                  <div className={`text-xs ${metrics.pump_status === 'on' ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.pump_status?.toUpperCase() || 'UNKNOWN'}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  {isRefreshing && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                  Last update: {(() => {
                    try {
                      // Parse API timestamp format "2025:10:23 12:43:57"
                      const parts = metrics.timestamp.split(' ');
                      const datePart = parts[0].replace(/:/g, '-');
                      const timePart = parts[1];
                      return new Date(`${datePart}T${timePart}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    } catch (e) {
                      return metrics.timestamp;
                    }
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiData.map((kpi) => (
            <KPIChip key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <PHChart data={chartData?.pH || []} />
          <TemperatureChart
            airTemp={chartData?.airTemp || []}
            waterTemp={chartData?.waterTemp || []}
          />
          <TDSGauge
            value={metrics?.tds || 0}
            optimal={400}
            historyData={chartData?.tds || []}
          />
          <HumidityHeatmap data={chartData?.humidity || []} />
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
