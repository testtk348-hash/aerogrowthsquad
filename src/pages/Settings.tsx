import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Settings = () => {
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your system preferences and notifications
          </p>
        </div>

        <div className="space-y-6">
          {/* System Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>
                Customize your dashboard and monitoring preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch id="dark-mode" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">Auto Refresh</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically update metrics every 10 seconds
                  </p>
                </div>
                <Switch id="auto-refresh" defaultChecked />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="temp-unit">Temperature Unit</Label>
                <Select defaultValue="celsius">
                  <SelectTrigger id="temp-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">Celsius (°C)</SelectItem>
                    <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage how you receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive critical alerts via email
                  </p>
                </div>
                <Switch id="email-alerts" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get instant notifications on your device
                  </p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="critical-only">Critical Alerts Only</Label>
                  <p className="text-sm text-muted-foreground">
                    Only receive notifications for critical issues
                  </p>
                </div>
                <Switch id="critical-only" />
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Thresholds */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Thresholds</CardTitle>
              <CardDescription>
                Configure when you want to be alerted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>pH Threshold</Label>
                  <p className="text-sm text-muted-foreground">Current: 6.5 ± 0.8</p>
                </div>
                <div className="space-y-2">
                  <Label>Temperature Threshold</Label>
                  <p className="text-sm text-muted-foreground">Current: 26°C ± 3°C</p>
                </div>
                <div className="space-y-2">
                  <Label>TDS Threshold</Label>
                  <p className="text-sm text-muted-foreground">Current: 400 ± 60 ppm</p>
                </div>
                <div className="space-y-2">
                  <Label>Humidity Threshold</Label>
                  <p className="text-sm text-muted-foreground">Current: 75% ± 10%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">Reset to Defaults</Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
