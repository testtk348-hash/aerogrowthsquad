import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X, CheckCircle, Image as ImageIcon, Sparkles, Leaf, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { isMobile, takePicture, selectFromGallery } from "@/utils/mobile";
import { MOBILE_CONFIG } from "@/config/mobile";
import { offlinePlantModel } from "@/services/offlineML";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  cropName: string;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

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

export const UploadModal = ({ open, onClose, cropName, onAnalysisComplete }: UploadModalProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > MOBILE_CONFIG.mlConfig.maxImageSize) {
      return;
    }

    if (!MOBILE_CONFIG.mlConfig.supportedFormats.includes(file.type)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTakePicture = async () => {
    try {
      const imageData = await takePicture();
      if (imageData) {
        setPreview(imageData);
      }
    } catch (error) {
      console.log('Camera access failed');
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      const imageData = await selectFromGallery();
      if (imageData) {
        setPreview(imageData);
      }
    } catch (error) {
      console.log('Gallery access failed');
    }
  };

  const analyzeImage = async () => {
    if (!preview) return;

    setUploading(true);
    setProgress(0);

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 80) {
            clearInterval(progressInterval);
            return 80;
          }
          return prev + 20;
        });
      }, 300);

      // Use offline ML model
      const result = await offlinePlantModel.analyzeImage(preview);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Create analysis result
      const analysisResult: AnalysisResult = {
        prediction: result.prediction,
        confidence: result.confidence,
        is_healthy: result.is_healthy,
        recommendations: result.recommendations,
        imageUrl: preview,
        model_info: result.model_info,
        correlatedMetrics: {
          pH: 6.1 + (Math.random() - 0.5) * 0.4,
          humidity: 78 + (Math.random() - 0.5) * 10,
          tds: 420 + (Math.random() - 0.5) * 40,
        }
      };

      setTimeout(() => {
        setUploading(false);
        setResult(analysisResult);
      }, 500);

    } catch (error) {
      console.error('Analysis failed:', error);
      setUploading(false);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setPreview(null);
    setProgress(0);
    setUploading(false);
    setResult(null);
    onClose();
  };

  const handleDone = () => {
    if (result) {
      onAnalysisComplete(result);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 p-0 rounded-none border-0 bg-white overflow-hidden md:w-[90vw] md:max-w-md md:h-auto md:rounded-2xl md:fixed md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2">
        
        {/* Mobile-First Full Screen Layout */}
        <div className="relative w-full h-full flex flex-col">
          
          {/* Header with Close Button */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 bg-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">AI Plant Analysis</h2>
                <p className="text-xs text-primary font-medium">{cropName}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleClose}
              className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {result ? (
              /* Analysis Results - Mobile Optimized */
              <div className="space-y-6">
                <div className="relative">
                  <img 
                    src={result.imageUrl} 
                    alt="Analyzed" 
                    className="w-full h-48 md:h-32 object-cover rounded-2xl border border-gray-200 shadow-sm" 
                  />
                </div>
                
                {/* Health Status */}
                <div className={`p-6 rounded-2xl border-2 ${
                  result.is_healthy 
                    ? "bg-green-50 border-green-200" 
                    : "bg-orange-50 border-orange-200"
                }`}>
                  <div className="flex items-center gap-4 mb-4">
                    {result.is_healthy ? (
                      <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-orange-600 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-xl mb-1">{result.prediction}</p>
                      <p className="text-sm opacity-80">{result.confidence}% confidence</p>
                    </div>
                  </div>
                  <p className="text-base font-medium">
                    Status: {result.is_healthy ? "Healthy Plant" : "Requires Attention"}
                  </p>
                </div>

                {/* Recommendations */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                  <h4 className="font-bold mb-3 text-base">Recommendations</h4>
                  <p className="text-base text-gray-700 leading-relaxed">{result.recommendations}</p>
                </div>
              </div>
            ) : uploading ? (
              /* Analysis Progress - Mobile Optimized */
              <div className="text-center space-y-6 py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-2xl mb-3">Analyzing...</p>
                  <p className="text-gray-600 text-lg mb-6">Detecting plant health</p>
                  <Progress value={progress} className="h-3 bg-gray-200 rounded-full max-w-xs mx-auto" />
                  <p className="text-sm text-gray-500 mt-3 font-medium">{progress}% complete</p>
                </div>
              </div>
            ) : preview ? (
              /* Image Preview & Analysis - Mobile Optimized */
              <div className="space-y-6">
                <div className="relative">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-64 md:h-48 object-cover rounded-2xl border-2 border-gray-200 shadow-sm" 
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/95 hover:bg-white shadow-lg border border-gray-200"
                    onClick={() => setPreview(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-green-800 text-base">Ready for Analysis</p>
                      <p className="text-sm text-green-600">Tap analyze to get results</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Upload Interface - Mobile Optimized */
              <div className="space-y-6">
                
                {/* Upload Zone */}
                <div
                  className="border-3 border-dashed border-primary/40 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all duration-200 active:scale-[0.98]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-bold text-gray-900 text-lg mb-2">Upload Plant Image</p>
                  <p className="text-base text-gray-600 mb-3">Select from device storage</p>
                  <p className="text-sm text-gray-500">JPG, PNG, WebP • Max 8MB</p>
                </div>

                {/* Camera & Gallery Buttons */}
                {isMobile() && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-16 border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 rounded-2xl active:scale-[0.98]"
                      onClick={handleTakePicture}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Camera className="h-6 w-6 text-primary" />
                        <span className="font-bold text-base">Camera</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16 border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 rounded-2xl active:scale-[0.98]"
                      onClick={handleSelectFromGallery}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-6 w-6 text-primary" />
                        <span className="font-bold text-base">Gallery</span>
                      </div>
                    </Button>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-amber-800 text-base">Best Results</p>
                      <p className="text-sm text-amber-700">Clear, well-lit leaf photos work best</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar - Fixed */}
          {(preview && !uploading) && (
            <div className="flex-shrink-0 p-4 bg-white border-t border-gray-100">
              <Button
                className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl active:scale-[0.98]"
                onClick={analyzeImage}
              >
                <Sparkles className="h-6 w-6 mr-3" />
                <span className="text-lg">Analyze with AI</span>
              </Button>
            </div>
          )}

          {/* Bottom Action Bar for Results */}
          {result && (
            <div className="flex-shrink-0 p-4 bg-white border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setResult(null);
                    setPreview(null);
                  }}
                  className="h-14 rounded-2xl border-2 font-bold text-base active:scale-[0.98]"
                >
                  Analyze Another
                </Button>
                <Button 
                  onClick={handleDone}
                  className="h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary font-bold text-base active:scale-[0.98]"
                >
                  Done
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};