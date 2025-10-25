// API service for fetching real sensor data
export interface SensorReading {
  ts: string;
  value: number;
}

export interface LatestMetrics {
  timestamp: string;
  pH: number;
  airTemp: number;
  waterTemp: number;
  tds: number;
  humidity: number;
  dissolved_oxygen_mg_l?: number;
  pump_status?: "on" | "off";
}

export interface Last30Data {
  pH: SensorReading[];
  airTemp: SensorReading[];
  waterTemp: SensorReading[];
  tds: SensorReading[];
  humidity: SensorReading[];
  dissolved_oxygen_mg_l?: SensorReading[];
}

const API_BASE_URL = 'https://iit-project.vercel.app';

class SensorApiService {
  private cache: {
    last30Data?: { data: any[]; timestamp: number };
    latestData?: { data: any; timestamp: number };
  } = {};
  
  private readonly CACHE_DURATION = 5000; // 5 seconds cache
  private rollingData: any[] = []; // Maintain rolling window of last 30 data points

  // Efficient method: Fetch only latest record (1 read instead of 30)
  async getLatestRecord(): Promise<any> {
    try {
      // Check cache first
      const now = Date.now();
      if (this.cache.latestData && (now - this.cache.latestData.timestamp) < this.CACHE_DURATION) {
        console.log(`📋 Using cached latest data`);
        return this.cache.latestData.data;
      }

      console.log(`🌐 Fetching latest record from ${API_BASE_URL}/data/latest`);
      const response = await fetch(`${API_BASE_URL}/data/latest`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      console.log(`📡 Latest API Response Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const apiResponse = await response.json();
      console.log(`📦 Latest Record Response:`, {
        hasData: !!apiResponse.data,
        timestamp: apiResponse.data?.timestamp || null
      });
      
      const latestRecord = apiResponse.data;
      
      if (!latestRecord) {
        console.warn('⚠️ No latest data available');
        throw new Error('No latest data available');
      }
      
      console.log(`✅ Successfully fetched latest record from /data/latest endpoint`);
      console.log(`📊 Latest record:`, latestRecord);
      
      // Cache the result
      this.cache.latestData = { data: latestRecord, timestamp: now };
      
      return latestRecord;
    } catch (error) {
      console.error('❌ Failed to fetch latest sensor data:', error);
      throw error;
    }
  }

  // Efficient method: Fetch last 30 records only once on page load
  async getLast30Records(): Promise<any[]> {
    try {
      // Check cache first
      const now = Date.now();
      if (this.cache.last30Data && (now - this.cache.last30Data.timestamp) < this.CACHE_DURATION) {
        console.log(`📋 Using cached last30 data (${this.cache.last30Data.data.length} points)`);
        return this.cache.last30Data.data;
      }

      console.log(`🌐 Fetching last 30 records from ${API_BASE_URL}/data/last30`);
      const response = await fetch(`${API_BASE_URL}/data/last30`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      console.log(`📡 Last30 API Response Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const apiResponse = await response.json();
      console.log(`📦 Last30 Records Response:`, {
        hasData: !!apiResponse.data,
        dataLength: apiResponse.data?.length || 0,
        firstItem: apiResponse.data?.[0] || null
      });
      
      const rawData = apiResponse.data || [];
      
      if (rawData.length === 0) {
        console.warn('⚠️ API returned empty last30 data array');
      } else {
        console.log(`✅ Successfully fetched ${rawData.length} data points from /data/last30 endpoint`);
        console.log(`📊 Most recent data point:`, rawData[0]);
      }
      
      // Cache the result
      this.cache.last30Data = { data: rawData, timestamp: now };
      
      // Initialize rolling data
      this.rollingData = [...rawData];
      
      return rawData;
    } catch (error) {
      console.error('❌ Failed to fetch last30 sensor data:', error);
      throw error;
    }
  }

  // Method to add new latest data to rolling window
  addToRollingData(newRecord: any): void {
    if (!newRecord) return;
    
    // Check if this record is newer than the most recent one
    const lastRecord = this.rollingData[0]; // Most recent is first (descending order)
    if (lastRecord && newRecord.timestamp === lastRecord.timestamp) {
      console.log('🔄 Skipping duplicate record');
      return;
    }
    
    // Add new record to the beginning (newest first)
    this.rollingData.unshift(newRecord);
    
    // Keep only last 30 records
    if (this.rollingData.length > 30) {
      this.rollingData = this.rollingData.slice(0, 30);
    }
    
    console.log(`📈 Added new record to rolling data. Total: ${this.rollingData.length} records`);
  }

  // Get current rolling data (for charts)
  getRollingData(): any[] {
    return [...this.rollingData];
  }

  // Legacy method for backward compatibility (now uses efficient approach)
  async getAllData(): Promise<any[]> {
    console.log('🔄 getAllData() called - redirecting to efficient approach');
    
    // If rolling data is empty, fetch last30 first
    if (this.rollingData.length === 0) {
      return await this.getLast30Records();
    }
    
    // Return current rolling data
    return this.getRollingData();
  }

  async getLatestData(): Promise<LatestMetrics> {
    try {
      const latestRecord = await this.getLatestRecord();
      
      console.log(`🔍 Processing latest data point:`, latestRecord);
      
      // Enhanced pump status detection based on single record age
      const pumpStatus = this.determinePumpStatusFromLatest(latestRecord);
      
      // Transform API response to match our interface
      const transformedData: LatestMetrics = {
        timestamp: latestRecord.timestamp,
        pH: latestRecord.pH,
        airTemp: latestRecord.airTemp,
        waterTemp: latestRecord.waterTemp,
        tds: latestRecord.tds,
        humidity: latestRecord.humidity,
        dissolved_oxygen_mg_l: 0, // Not provided by API
        pump_status: pumpStatus
      };
      
      console.log(`✅ Latest data processed:`, {
        timestamp: transformedData.timestamp,
        pH: transformedData.pH,
        pump: transformedData.pump_status
      });
      
      // Add to rolling data for charts
      this.addToRollingData(latestRecord);
      
      return transformedData;
    } catch (error) {
      console.error('❌ Failed to get latest sensor data:', error);
      throw error;
    }
  }

  // New method: Optimized pump status detection from single latest record
  private determinePumpStatusFromLatest(latestRecord: any): "on" | "off" {
    try {
      if (!latestRecord) {
        console.log('🔧 Pump Status: OFF (no latest record available)');
        return "off";
      }

      // Parse timestamp and check age
      const parseTimestamp = (timestamp: string) => {
        const parts = timestamp.split(' ');
        const datePart = parts[0].replace(/:/g, '-');
        const timePart = parts[1];
        return new Date(`${datePart}T${timePart}`).getTime();
      };

      const dataTimestamp = parseTimestamp(latestRecord.timestamp);
      const currentTime = Date.now();
      const timeDifferenceMinutes = (currentTime - dataTimestamp) / (1000 * 60);
      
      console.log(`🕐 Latest data age: ${timeDifferenceMinutes.toFixed(2)} minutes`);
      
      // If data is older than 2 minutes, pump is likely off
      const isPumpOn = timeDifferenceMinutes <= 2;
      
      const status = isPumpOn ? "on" : "off";
      console.log(`🔧 Pump Status: ${status.toUpperCase()} (age: ${timeDifferenceMinutes.toFixed(1)} min)`);
      
      return status;
    } catch (error) {
      console.error('❌ Error determining pump status from latest:', error);
      return "off";
    }
  }

  // Legacy method for backward compatibility - simplified for efficiency
  private determinePumpStatus(allData: any[]): "on" | "off" {
    try {
      if (allData.length === 0) {
        console.log('🔧 Pump Status: OFF (no data available)');
        return "off";
      }

      // Use the latest record for pump status determination
      const latestData = allData[0];
      return this.determinePumpStatusFromLatest(latestData);
    } catch (error) {
      console.error('❌ Error determining pump status:', error);
      return "off";
    }
  }

  async getLast30Data(): Promise<Last30Data> {
    try {
      // Use efficient rolling data if available, otherwise fetch last30
      let dataToUse = this.getRollingData();
      
      if (dataToUse.length === 0) {
        console.log('📈 No rolling data available, fetching last30 records');
        dataToUse = await this.getLast30Records();
      }
      
      if (dataToUse.length === 0) {
        throw new Error('No data available');
      }
      
      // Take last 30 data points and reverse for ascending order (oldest to newest)
      const last30 = dataToUse.slice(0, 30).reverse();
      
      // Helper function to parse API timestamp format
      const parseApiTimestamp = (timestamp: string) => {
        // Convert "2025:10:23 12:43:57" to proper ISO format
        const parts = timestamp.split(' ');
        const datePart = parts[0].replace(/:/g, '-'); // "2025-10-23"
        const timePart = parts[1]; // "12:43:57"
        const isoFormat = `${datePart}T${timePart}`;
        return isoFormat;
      };
      
      console.log(`📈 Processing ${last30.length} data points for charts (using ${dataToUse === this.rollingData ? 'rolling' : 'fresh'} data)`);
      
      // Transform API response to match our interface
      const transformedData: Last30Data = {
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
        dissolved_oxygen_mg_l: [] // Not provided by API
      };
      
      return transformedData;
    } catch (error) {
      console.error('Failed to get chart data:', error);
      throw error;
    }
  }

  async getEnhancedPumpStatus(): Promise<"on" | "off"> {
    try {
      const latestRecord = await this.getLatestRecord();
      
      if (!latestRecord) {
        return "off";
      }
      
      // Helper function to parse API timestamp format
      const parseApiTimestamp = (timestamp: string) => {
        const parts = timestamp.split(' ');
        const datePart = parts[0].replace(/:/g, '-');
        const timePart = parts[1];
        return new Date(`${datePart}T${timePart}`).getTime();
      };
      
      const dataTimestamp = parseApiTimestamp(latestRecord.timestamp);
      const currentTime = Date.now();
      const timeDifferenceSeconds = (currentTime - dataTimestamp) / 1000;
      
      const pumpStatus = timeDifferenceSeconds <= 15 ? "on" : "off";
      
      console.log(`🔧 Enhanced Pump Status: Latest data ${timeDifferenceSeconds.toFixed(1)}s old → Pump ${pumpStatus.toUpperCase()}`);
      
      return pumpStatus;
    } catch (error) {
      console.error('Failed to get enhanced pump status:', error);
      return "off";
    }
  }

  // Test API endpoint health - now using /data/latest for efficiency
  async testApiHealth(): Promise<{ success: boolean; message: string; dataCount: number }> {
    try {
      console.log('🔍 Testing API endpoint health...');
      
      const response = await fetch(`${API_BASE_URL}/data/latest`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        return {
          success: false,
          message: `API returned ${response.status}: ${response.statusText}`,
          dataCount: 0
        };
      }

      const data = await response.json();
      const hasData = !!data.data;

      if (!hasData) {
        return {
          success: false,
          message: 'API is responding but no latest data available',
          dataCount: 0
        };
      }

      const latestTimestamp = data.data?.timestamp;
      return {
        success: true,
        message: `API healthy - Latest data available: ${latestTimestamp}`,
        dataCount: 1
      };

    } catch (error) {
      console.error('API health check failed:', error);
      return {
        success: false,
        message: `API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        dataCount: 0
      };
    }
  }

  // Clear cache manually if needed
  clearCache(): void {
    this.cache = {};
    this.rollingData = [];
    console.log('🗑️ Cache and rolling data cleared');
  }
}

// Export singleton instance
export const sensorApi = new SensorApiService();