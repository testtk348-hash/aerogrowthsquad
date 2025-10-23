import { Droplets, Thermometer, Wind, Zap, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sensorApi } from "@/services/sensorApi";
import { exportCSVMobile } from "@/utils/mobile";

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

  const handleExportCSV = async () => {
    try {
      toast.loading("Preparing CSV export...");
      
      // Fetch all data from the API
      const allData = await sensorApi.getAllData();
      
      if (allData.length === 0) {
        toast.error("No data available for export");
        return;
      }

      // Get last 30 entries (minutes of data) and reverse for chronological order
      const last30Data = allData.slice(0, 30).reverse();
      
      console.log(`📤 Exporting ${last30Data.length} data points from last 30 minutes`);
      
      // Create CSV headers with proper formatting
      const headers = [
        'Timestamp',
        'Time',
        'pH',
        'Air Temperature (°C)',
        'Water Temperature (°C)',
        'TDS (ppm)',
        'Humidity (%)'
      ];
      
      // Create CSV content with BOM for Excel compatibility and proper formatting
      const csvRows = [
        '# AeroGrowth Sensor Data Export - Last 30 Minutes',
        `# Generated: ${new Date().toLocaleString()}`,
        `# Data Points: ${last30Data.length}`,
        `# Source: /data endpoint (last 30 entries)`,
        '',
        headers.join(',')
      ];
      
      // Add data rows with proper timestamp parsing
      last30Data.forEach((row: any) => {
        // Parse API timestamp format "2025:10:23 12:43:57"
        const parts = row.timestamp.split(' ');
        const datePart = parts[0].replace(/:/g, '-');
        const timePart = parts[1];
        const fullTimestamp = new Date(`${datePart}T${timePart}`).toLocaleString();
        const timeOnly = new Date(`${datePart}T${timePart}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const csvRow = [
          `"${fullTimestamp}"`,
          `"${timeOnly}"`,
          (row.pH ?? 0).toFixed(2),
          (row.airTemp ?? 0).toFixed(1),
          (row.waterTemp ?? 0).toFixed(1),
          (row.tds ?? 0).toFixed(0),
          (row.humidity ?? 0).toFixed(1)
        ];
        csvRows.push(csvRow.join(','));
      });
      
      // Add BOM for proper Excel UTF-8 handling
      const csvContent = '\uFEFF' + csvRows.join('\n');
      
      // Generate filename with current timestamp
      const now = new Date();
      const timestamp = now.toISOString().split('T')[0];
      const filename = `AeroGrowth_SensorData_${timestamp}.csv`;
      const title = 'AeroGrowth Sensor Data Export';
      const description = `Complete sensor data from last 30 minutes (${last30Data.length} data points) - AeroGrowth Vertical Farming`;
      
      // Use the mobile-optimized CSV export function
      const result = await exportCSVMobile(csvContent, filename, title, description);
      
      if (result.success) {
        console.log('CSV export successful:', result.message);
        toast.success(`Exported ${last30Data.length} data points successfully!`);
      } else {
        console.error('CSV export failed:', result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('CSV export failed:', error);
      toast.error("Failed to export CSV data. Please try again.");
    }
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
          
          {/* CSV Export Button */}
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-4 col-span-2"
            onClick={handleExportCSV}
          >
            <Download className="h-6 w-6 text-green-500" />
            <span className="text-xs font-medium text-center">Export CSV (Last 30 min)</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
