# API Integration Guide

## Overview
The dashboard has been updated to use real sensor data from the API endpoints instead of mock data.

## API Endpoints Used

### 1. Main Data Endpoint
- **URL**: `https://iit-project.vercel.app/data`
- **Purpose**: Fetches all sensor data (used for both current values and charts)
- **Update Frequency**: Every 2 seconds
- **Data Order**: Descending (newest first)
- **Data Structure**:
```typescript
interface LatestMetrics {
  timestamp: string;
  pH: number;
  airTemp: number;
  waterTemp: number;
  tds: number;
  humidity: number;
  dissolved_oxygen_mg_l?: number;
  pump_status?: "on" | "off";
}
```

### 2. Data Processing
- **Latest Value**: First item from `/data` endpoint (newest)
- **Chart Data**: First 30 items reversed for ascending trends
- **Pump Status**: Based on timestamp age analysis
- **Data Structure**:
```typescript
interface Last30Data {
  pH: SensorReading[];
  airTemp: SensorReading[];
  waterTemp: SensorReading[];
  tds: SensorReading[];
  humidity: SensorReading[];
  dissolved_oxygen_mg_l?: SensorReading[];
}

interface SensorReading {
  ts: string;  // ISO timestamp
  value: number;
}
```

## Updated Components

### Dashboard (`src/pages/Dashboard.tsx`)
- Now fetches real-time data from API endpoints for KPI cards
- Uses latest data for current values and historical data for sparklines
- Falls back to mock data if API fails
- Shows loading state and error messages
- Auto-refreshes data at regular intervals

### Metrics Page (`src/pages/Metrics.tsx`)
- Uses real latest data for current values in cards
- Uses real historical data for all charts and statistics
- Shows system overview with current status
- Displays performance summary with overall statistics
- Calculates system health score based on optimal ranges
- Maintains CSV export functionality with real data
- Shows loading state while fetching data

### Chart Components
- **PHChart**: Updated to use real pH data
- **TemperatureChart**: Uses real air and water temperature data
- **HumidityHeatmap**: Uses real humidity data to generate rack variations
- **TDSGauge**: Shows real TDS values

## Features

### Caching
- API responses are cached for 2 seconds to reduce server load
- Single endpoint caching for better performance
- Cache can be manually cleared if needed

### Error Handling
- Graceful fallback to mock data if API fails
- User-friendly error messages
- Automatic retry on subsequent requests
- Intelligent fallback system maintains functionality

### Real-time Updates
- All data refreshes every 2 seconds from single `/data` endpoint
- Latest values: First item from descending data array
- Chart data: First 30 items reversed for proper ascending trends
- Visual indicators for data freshness
- Last updated timestamp shown in Metrics page

### Enhanced Metrics Features
- **System Overview**: Real-time status of all key parameters
- **Performance Summary**: Overall statistics from historical data
- **System Health Score**: Calculated based on optimal parameter ranges
- **Data Quality Indicators**: Shows total data points and time span
- **Current vs Historical**: Uses latest API data for current values, historical data for trends

## Testing
- API endpoints are automatically tested in development mode
- Check browser console for API test results
- Error states can be tested by temporarily changing API URLs

## Files Modified
- `src/pages/Dashboard.tsx` - Main dashboard with real data integration
- `src/pages/Metrics.tsx` - Metrics page with real data
- `src/services/sensorApi.ts` - New API service (created)
- `src/components/charts/PHChart.tsx` - Updated imports
- `src/components/charts/TemperatureChart.tsx` - Updated imports
- `src/components/charts/HumidityHeatmap.tsx` - Updated to accept real data
- `src/utils/apiTest.ts` - API testing utility (created)

## Usage
The integration is automatic. When you load the dashboard:
1. Loading spinner appears while fetching data
2. Real data populates the cards and charts
3. If API fails, fallback mock data is used with a warning message
4. Data automatically refreshes at regular intervals

## Monitoring
- Check browser console for API request logs
- Error messages appear in the UI if API fails
- Success/failure status is logged for debugging