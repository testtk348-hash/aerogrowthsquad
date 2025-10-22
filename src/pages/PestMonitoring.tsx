import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Scan, History, Sparkles, CheckCircle, AlertTriangle, Leaf } from "lucide-react";
import { CropCard } from "@/components/pest/CropCard";
import { UploadModal, AnalysisResult } from "@/components/pest/UploadModal";
import { cropData } from "@/lib/mockData";

type ViewState = 'crops' | 'upload' | 'results' | 'history';

const PestMonitoring = () => {
  const [currentView, setCurrentView] = useState<ViewState>('crops');
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<(AnalysisResult & { cropName: string; timestamp: Date })[]>([]);

  const selectedCropData = cropData.find((c) => c.id === selectedCrop);

  const handleCropSelect = (cropId: string) => {
    setSelectedCrop(cropId);
    setUploadOpen(true);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setUploadOpen(false);
    setCurrentView('results');
    
    // Add to history
    if (selectedCropData) {
      setAnalysisHistory(prev => [{
        ...result,
        cropName: selectedCropData.name,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]); // Keep last 10 results
    }
  };

  const handleBackToCrops = () => {
    setCurrentView('crops');
    setSelectedCrop(null);
    setAnalysisResult(null);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setCurrentView('crops');
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
            
            {currentView !== 'crops' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBackToCrops} 
                className="gap-2 h-10 px-4 rounded-xl border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200 active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            )}
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
          <div className="grid grid-cols-3 h-12 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-1 shadow-sm">
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
              onClick={() => setCurrentView('upload')}
              disabled={!selectedCrop}
              className={`flex items-center justify-center gap-2 text-sm font-medium px-4 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                currentView === 'upload' 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>Scan</span>
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
                    isSelected={selectedCrop === crop.id}
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
                          setAnalysisResult(item);
                          setSelectedCrop(cropData.find(c => c.name === item.cropName)?.id || null);
                          setCurrentView('results');
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

          {/* Results View */}
          {currentView === 'results' && analysisResult && selectedCropData && (
            <div className="p-4 space-y-4">
              {/* Result Header */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200/50 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Analysis Results</h3>
                  <Badge variant={analysisResult.is_healthy ? "default" : "destructive"}>
                    {analysisResult.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{selectedCropData.name}</p>
                
                {/* Image */}
                <img
                  src={analysisResult.imageUrl}
                  alt="Analyzed"
                  className="w-full h-48 rounded-xl object-cover mb-4"
                />

                {/* Health Status */}
                <div className={`p-3 rounded-xl border ${
                  analysisResult.is_healthy 
                    ? "bg-green-50 border-green-200" 
                    : "bg-orange-50 border-orange-200"
                }`}>
                  <p className="font-semibold mb-1">{analysisResult.prediction}</p>
                  <p className="text-sm text-gray-600">
                    Status: {analysisResult.is_healthy ? "Healthy Plant" : "Requires Attention"}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200/50 shadow-sm">
                <h4 className="font-semibold mb-3">Recommendations</h4>
                <div className={`text-sm p-3 rounded-xl ${
                  analysisResult.is_healthy 
                    ? "bg-green-50 text-green-800" 
                    : "bg-orange-50 text-orange-800"
                }`}>
                  {analysisResult.recommendations}
                </div>
              </div>

              {/* Sensor Metrics */}
              {analysisResult.correlatedMetrics && (
                <div className="bg-white rounded-2xl p-4 border border-gray-200/50 shadow-sm">
                  <h4 className="font-semibold mb-3">Current Conditions</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">pH Level</p>
                      <p className="font-bold">{analysisResult.correlatedMetrics.pH.toFixed(1)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Humidity</p>
                      <p className="font-bold">{analysisResult.correlatedMetrics.humidity.toFixed(0)}%</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">TDS</p>
                      <p className="font-bold">{analysisResult.correlatedMetrics.tds.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleNewAnalysis} className="h-12 rounded-xl">
                  Analyze Another
                </Button>
                <Button onClick={handleBackToCrops} className="h-12 rounded-xl bg-gradient-to-r from-primary to-secondary">
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {selectedCropData && (
          <UploadModal
            open={uploadOpen}
            onClose={() => setUploadOpen(false)}
            cropName={selectedCropData.name}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}
      </div>
    </div>
  );
};

export default PestMonitoring;
