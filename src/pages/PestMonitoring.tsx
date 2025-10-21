import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Camera, Scan, History, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { CropCard } from "@/components/pest/CropCard";
import { UploadModal, AnalysisResult } from "@/components/pest/UploadModal";
import { ResultsModal } from "@/components/pest/ResultsModal";
import { cropData } from "@/lib/mockData";

type ViewState = 'crops' | 'upload' | 'results' | 'history';

const PestMonitoring = () => {
  const [currentView, setCurrentView] = useState<ViewState>('crops');
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<(AnalysisResult & { cropName: string; timestamp: Date })[]>([]);

  const selectedCropData = cropData.find((c) => c.id === selectedCrop);

  const handleCropSelect = (cropId: string) => {
    setSelectedCrop(cropId);
    setAnalysisResult(null);
    setCurrentView('upload');
  };

  const handleStartUpload = () => {
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
    setCurrentView('upload');
  };

  const renderBreadcrumb = () => {
    const steps = [
      { key: 'crops', label: 'Select Crop', active: currentView === 'crops' },
      { key: 'upload', label: 'Upload Image', active: currentView === 'upload' },
      { key: 'results', label: 'View Results', active: currentView === 'results' }
    ];

    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center gap-2">
            <span className={step.active ? 'text-primary font-medium' : ''}>
              {step.label}
            </span>
            {index < steps.length - 1 && <span>→</span>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-4 sm:py-6 max-w-6xl pb-20 sm:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Pest Monitoring</h1>
            <p className="text-sm sm:text-base text-muted-foreground">AI-powered pest and disease detection</p>
          </div>
          
          {currentView !== 'crops' && (
            <Button variant="outline" onClick={handleBackToCrops} className="gap-2 self-start sm:self-auto">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Back to Crops</span>
              <span className="xs:hidden">Back</span>
            </Button>
          )}
        </div>

        {/* Navigation Tabs - Mobile Optimized */}
        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as ViewState)} className="mb-4 sm:mb-6">
          <TabsList className="grid w-full grid-cols-3 h-12 sm:h-10 lg:w-[500px]">
            <TabsTrigger value="crops" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
              <Scan className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:hidden">Crops</span>
              <span className="hidden sm:inline">Select Crop</span>
            </TabsTrigger>
            <TabsTrigger value="upload" disabled={!selectedCrop} className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
              <Upload className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:hidden">Upload</span>
              <span className="hidden sm:inline">Upload Image</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
              <History className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">History</span>
            </TabsTrigger>
          </TabsList>

          {/* Crop Selection View */}
          <TabsContent value="crops" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Quick Start Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">Select Your Crop</p>
                      <p className="text-muted-foreground text-xs sm:text-sm">Choose the crop type you want to analyze</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">Upload Clear Image</p>
                      <p className="text-muted-foreground text-xs sm:text-sm">Take a close-up photo of the leaf or affected area</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">Get AI Analysis</p>
                      <p className="text-muted-foreground text-xs sm:text-sm">Receive instant pest/disease detection results</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Choose Your Crop</h2>
                {selectedCrop && (
                  <Button 
                    onClick={() => setCurrentView('upload')} 
                    className="gap-2"
                    size="sm"
                  >
                    <Upload className="h-4 w-4" />
                    Continue to Upload
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {cropData.map((crop) => (
                  <CropCard
                    key={crop.id}
                    {...crop}
                    isSelected={selectedCrop === crop.id}
                    onClick={() => handleCropSelect(crop.id)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Upload View */}
          <TabsContent value="upload" className="space-y-6">
            {selectedCropData && (
              <>
                {renderBreadcrumb()}
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Upload Image for {selectedCropData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Best Practices
                        </h3>
                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                          <li>• Use good lighting (natural light preferred)</li>
                          <li>• Focus on leaf surfaces showing symptoms</li>
                          <li>• Keep image sharp and clear</li>
                          <li>• Fill the frame with the leaf/affected area</li>
                          <li>• Minimum 224x224 pixels resolution</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          Common Issues to Avoid
                        </h3>
                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                          <li>• Blurry or out-of-focus images</li>
                          <li>• Too dark or overexposed photos</li>
                          <li>• Images with hands or tools visible</li>
                          <li>• Multiple leaves or cluttered background</li>
                          <li>• Images of fruits or flowers (leaves only)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-center pt-2">
                      <Button size="lg" onClick={handleStartUpload} className="gap-2 w-full sm:w-auto">
                        <Upload className="h-5 w-5" />
                        <span className="hidden xs:inline">Upload Image for Analysis</span>
                        <span className="xs:hidden">Upload Image</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* History View */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Analysis History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No analysis history yet</p>
                    <p className="text-sm">Start by analyzing some crops to see your history here</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {analysisHistory.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                        <img 
                          src={item.imageUrl} 
                          alt="Analysis" 
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <span className="font-medium text-sm sm:text-base truncate">{item.cropName}</span>
                            <Badge variant={item.is_healthy ? "default" : "destructive"} className="self-start text-xs">
                              {item.is_healthy ? "Healthy" : "Affected"}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {item.confidence}% confidence • {item.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs px-2 sm:px-3"
                          onClick={() => {
                            setAnalysisResult(item);
                            setSelectedCrop(cropData.find(c => c.name === item.cropName)?.id || null);
                            setCurrentView('results');
                          }}
                        >
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results View */}
        {currentView === 'results' && analysisResult && selectedCropData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Analysis Results - {selectedCropData.name}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleNewAnalysis}>
                    Analyze Another
                  </Button>
                  <Button onClick={handleBackToCrops}>
                    Done
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Image */}
                <div className="order-2 md:order-1">
                  <h3 className="font-medium mb-3 text-sm sm:text-base">Analyzed Image</h3>
                  <img
                    src={analysisResult.imageUrl}
                    alt="Analyzed"
                    className="w-full rounded-lg border max-h-64 sm:max-h-none object-cover"
                  />
                </div>

                {/* Results */}
                <div className="space-y-3 sm:space-y-4 order-1 md:order-2">
                  {/* Health Status */}
                  <div>
                    <h3 className="font-medium mb-3 text-sm sm:text-base">Health Analysis</h3>
                    <div className="p-3 sm:p-4 bg-muted rounded-lg border">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <p className="font-semibold text-sm sm:text-base">{analysisResult.prediction}</p>
                        <Badge variant={analysisResult.is_healthy ? "default" : "destructive"} className="self-start">
                          {analysisResult.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Status: {analysisResult.is_healthy ? "Healthy" : "Requires Attention"}
                      </p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="font-medium mb-3 text-sm sm:text-base">Recommendations</h3>
                    <div className={`text-xs sm:text-sm p-3 sm:p-4 rounded-lg border ${
                      analysisResult.is_healthy 
                        ? "bg-green-50 border-green-200 text-green-800" 
                        : "bg-orange-50 border-orange-200 text-orange-800"
                    }`}>
                      {analysisResult.recommendations}
                    </div>
                  </div>

                  {/* ML Model Info */}
                  {analysisResult.model_info && (
                    <div>
                      <h3 className="font-medium mb-3">AI Analysis Details</h3>
                      <div className="p-3 bg-muted rounded-lg border text-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-muted-foreground">ML Model Score:</span>
                          <span className="font-mono">{analysisResult.model_info.raw_prediction_value.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Threshold:</span>
                          <span className="font-mono">{analysisResult.model_info.model_threshold}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {analysisResult.model_info.interpretation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Sensor Metrics */}
                  {analysisResult.correlatedMetrics && (
                    <div>
                      <h3 className="font-medium mb-3">Current Sensor Metrics</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-muted rounded-lg text-center border">
                          <p className="text-xs text-muted-foreground mb-1">pH</p>
                          <p className="font-semibold">{analysisResult.correlatedMetrics.pH.toFixed(1)}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg text-center border">
                          <p className="text-xs text-muted-foreground mb-1">Humidity</p>
                          <p className="font-semibold">{analysisResult.correlatedMetrics.humidity.toFixed(0)}%</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg text-center border">
                          <p className="text-xs text-muted-foreground mb-1">TDS</p>
                          <p className="font-semibold">{analysisResult.correlatedMetrics.tds.toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Modal */}
        {selectedCropData && (
          <UploadModal
            open={uploadOpen}
            onClose={() => setUploadOpen(false)}
            cropName={selectedCropData.name}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {/* Floating Action Button for Mobile */}
        {currentView === 'crops' && selectedCrop && (
          <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
            <Button 
              size="lg" 
              onClick={() => setCurrentView('upload')}
              className="w-full rounded-full shadow-lg gap-2 h-12"
            >
              <Upload className="h-5 w-5" />
              Continue to Upload
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PestMonitoring;
