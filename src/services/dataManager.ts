// Efficient Data Management Service
// Reduces Firestore reads from 30 per poll to 1 per poll (30x reduction)

import { sensorApi, type LatestMetrics, type Last30Data } from './sensorApi';

class DataManager {
  private static instance: DataManager;
  private isInitialized = false;
  private lastInitTime = 0;
  private readonly INIT_COOLDOWN = 10000; // 10 seconds cooldown between initializations

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Initialize data manager - call once per page/app load
  async initialize(): Promise<{ success: boolean; message: string }> {
    const now = Date.now();
    
    // Prevent multiple rapid initializations
    if (this.isInitialized && (now - this.lastInitTime) < this.INIT_COOLDOWN) {
      console.log('📋 Data manager already initialized recently');
      return { 
        success: true, 
        message: 'Data manager already initialized' 
      };
    }

    try {
      console.log('🚀 Initializing efficient data manager...');
      
      // Phase 1: Load historical data (last 30 records) - ONE TIME ONLY
      console.log('📊 Phase 1: Loading historical data (last 30 records)...');
      await sensorApi.getLast30Records();
      
      // Phase 2: Get latest data to populate metrics
      console.log('📋 Phase 2: Loading latest metrics...');
      await sensorApi.getLatestRecord();
      
      this.isInitialized = true;
      this.lastInitTime = now;
      
      console.log('✅ Data manager initialized successfully!');
      console.log('💡 EFFICIENCY GAIN: Now using 1 read per 30s instead of 30 reads per 30s');
      
      return { 
        success: true, 
        message: 'Data manager initialized successfully' 
      };
    } catch (error) {
      console.error('❌ Failed to initialize data manager:', error);
      return { 
        success: false, 
        message: `Failed to initialize: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  // Get latest metrics (efficient - uses cached latest record)
  async getLatestMetrics(): Promise<LatestMetrics> {
    if (!this.isInitialized) {
      console.log('⚠️ Data manager not initialized, initializing now...');
      await this.initialize();
    }
    
    return await sensorApi.getLatestData();
  }

  // Get chart data (efficient - uses rolling data)
  async getChartData(): Promise<Last30Data> {
    if (!this.isInitialized) {
      console.log('⚠️ Data manager not initialized, initializing now...');
      await this.initialize();
    }
    
    return await sensorApi.getLast30Data();
  }

  // Refresh latest data only (EFFICIENT: 1 API call instead of 30)
  async refreshLatestData(): Promise<LatestMetrics> {
    try {
      console.log('🔄 Refreshing latest data (EFFICIENT MODE)...');
      return await sensorApi.getLatestData();
    } catch (error) {
      console.error('❌ Failed to refresh latest data:', error);
      throw error;
    }
  }

  // Get API health status
  async getApiHealth(): Promise<{ success: boolean; message: string; dataCount: number }> {
    return await sensorApi.testApiHealth();
  }

  // Get current data summary
  getDataSummary(): {
    rollingDataPoints: number;
    cacheStatus: string;
    isInitialized: boolean;
    lastInitTime: string;
  } {
    const rollingData = sensorApi.getRollingData();
    
    return {
      rollingDataPoints: rollingData.length,
      cacheStatus: rollingData.length > 0 ? 'Active' : 'Empty',
      isInitialized: this.isInitialized,
      lastInitTime: this.lastInitTime > 0 ? new Date(this.lastInitTime).toLocaleString() : 'Never'
    };
  }

  // Clear all data and reset
  reset(): void {
    console.log('🗑️ Resetting data manager...');
    sensorApi.clearCache();
    this.isInitialized = false;
    this.lastInitTime = 0;
    console.log('✅ Data manager reset complete');
  }

  // Export data for CSV (efficient - uses rolling data)
  async getExportData(metricType: 'pH' | 'airTemp' | 'waterTemp' | 'tds' | 'humidity'): Promise<{
    data: { ts: string; value: number }[];
    isRealData: boolean;
    totalPoints: number;
  }> {
    try {
      // Use rolling data if available, otherwise fetch fresh
      let allData = sensorApi.getRollingData();
      
      if (allData.length === 0) {
        console.log('📤 No rolling data for export, fetching fresh last30...');
        allData = await sensorApi.getLast30Records();
      }
      
      if (allData.length === 0) {
        throw new Error('No data available for export');
      }
      
      // Take last 30 entries and reverse for chronological order
      const last30 = allData.slice(0, 30).reverse();
      
      // Parse and extract metric data
      const exportData = last30.map((item: any) => {
        const parts = item.timestamp.split(' ');
        const datePart = parts[0].replace(/:/g, '-');
        const timePart = parts[1];
        const isoTimestamp = `${datePart}T${timePart}`;
        
        let value = 0;
        switch (metricType) {
          case 'pH': value = item.pH; break;
          case 'airTemp': value = item.airTemp; break;
          case 'waterTemp': value = item.waterTemp; break;
          case 'tds': value = item.tds; break;
          case 'humidity': value = item.humidity; break;
        }
        
        return {
          ts: isoTimestamp,
          value: value
        };
      });
      
      console.log(`📤 Prepared export data for ${metricType}: ${exportData.length} points`);
      
      return {
        data: exportData,
        isRealData: true,
        totalPoints: exportData.length
      };
    } catch (error) {
      console.error('❌ Failed to get export data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const dataManager = DataManager.getInstance();

// Export efficiency metrics
export const EFFICIENCY_METRICS = {
  OLD_READS_PER_POLL: 30,
  NEW_READS_PER_POLL: 1,
  REDUCTION_FACTOR: 30,
  POLL_INTERVAL_SECONDS: 30,
  READS_PER_HOUR_OLD: (30 * 60 * 60) / 30, // 3600 reads/hour
  READS_PER_HOUR_NEW: (1 * 60 * 60) / 30,  // 120 reads/hour
  SAVINGS_PER_HOUR: 3600 - 120, // 3480 reads saved per hour
  SAVINGS_PERCENTAGE: ((3600 - 120) / 3600) * 100 // 96.67% reduction
};

console.log('📊 FIRESTORE EFFICIENCY METRICS:');
console.log(`   Old Strategy: ${EFFICIENCY_METRICS.READS_PER_HOUR_OLD} reads/hour`);
console.log(`   New Strategy: ${EFFICIENCY_METRICS.READS_PER_HOUR_NEW} reads/hour`);
console.log(`   💰 Savings: ${EFFICIENCY_METRICS.SAVINGS_PER_HOUR} reads/hour (${EFFICIENCY_METRICS.SAVINGS_PERCENTAGE.toFixed(1)}% reduction)`);