import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Scan, History, Sparkles, CheckCircle, Leaf } from "lucide-react";
import { CropCard } from "@/components/pest/CropCard";
import { cropData } from "@/lib/mockData";

export interface AnalysisResult {
  prediction: string;
  confidence: number;
  is_healthy: boolean;
  recommendations: string;
  imageUrl: string;
  model_info?: {
    raw_prediction_value: number;
    model_threshold: number;
    interpretation: string;
  };
  correlatedMetrics?: {
    pH: number;
    humidity: number;
    tds: number;
  };
}

type ViewState = 'crops' | 'history';

const PestMonitoring = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewState>('crops');
  const [analysisHistory, setAnalysisHistory] = useState<(AnalysisResult & { cropName: string; timestamp: Date })[]>([]);

  const handleCropSelect = (cropId: string) => {
    navigate(`/plant-analysis?crop=${cropId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="h-screen flex flex-col">
        
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 bg-white/90 backdrop-blur-xl border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pest Monitoring</h1>
                <p className="text-sm text-primary font-medium">AI Plant Health Analysis</p>
              </div>
            </div>
          </div>
          
          {/* AI Status */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-3 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-800 text-sm">Offline AI Ready</p>
                <p className="text-xs text-green-600">No internet connection required</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Fixed */}
        <div className="flex-shrink-0 p-4 bg-white/50">
          <div className="grid grid-cols-2 h-12 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => setCurrentView('crops')}
              className={`flex items-center justify-center gap-2 text-sm font-medium px-4 rounded-xl transition-all duration-200 active:scale-95 ${
                currentView === 'crops' 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Scan className="h-4 w-4" />
              <span>Crops</span>
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`flex items-center justify-center gap-2 text-sm font-medium px-4 rounded-xl transition-all duration-200 active:scale-95 ${
                currentView === 'history' 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </button>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Crop Selection View */}
          {currentView === 'crops' && (
            <div className="p-4 space-y-4">
              {/* Quick Guide */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-900">How It Works</h3>
                </div>
                <p className="text-sm text-blue-700">Select your crop → Take a photo → Get instant AI analysis</p>
              </div>

              {/* Crop Grid - Only 4 Cards */}
              <div className="grid grid-cols-2 gap-4">
                {cropData.slice(0, 4).map((crop) => (
                  <CropCard
                    key={crop.id}
                    {...crop}
                    isSelected={false}
                    onClick={() => handleCropSelect(crop.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* History View */}
          {currentView === 'history' && (
            <div className="p-4">
              {analysisHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Analysis History</p>
                  <p className="text-sm">Start analyzing crops to see your history here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisHistory.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-200/50 shadow-sm">
                      <img 
                        src={item.imageUrl} 
                        alt="Analysis" 
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">{item.cropName}</span>
                          <Badge variant={item.is_healthy ? "default" : "destructive"} className="text-xs">
                            {item.is_healthy ? "Healthy" : "Issue"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.confidence}% • {item.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs px-3 rounded-xl"
                        onClick={() => {
                          const crop = cropData.find(c => c.name === item.cropName);
                          if (crop) {
                            navigate(`/plant-analysis?crop=${crop.id}`);
                          }
                        }}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PestMonitoring;