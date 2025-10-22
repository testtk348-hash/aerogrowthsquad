import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X, CheckCircle, Image as ImageIcon, Sparkles, Zap, ArrowRight, Leaf, AlertTriangle } from "lucide-react";
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
        onAnalysisComplete(analysisResult);
        handleClose();
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
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[100vw] h-[100vh] max-w-none max-h-none m-0 p-0 rounded-none border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
        
        {/* Full Screen Layout - No Scrolling */}
        <div className="h-full flex flex-col">
          
          {/* Header - Fixed */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 bg-white/95 backdrop-blur-xl border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">AI Analysis</h2>
                <p className="text-sm text-primary font-medium">{cropName}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleClose}
              className="h-10 w-10 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all duration-200"
            >
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          {/* Main Content - Flexible */}
          <div className="flex-1 flex flex-col p-4">
            
            {uploading ? (
              /* Analysis Progress - Full Screen */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-6 max-w-sm">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-2xl mb-2">AI Analyzing</p>
                    <p className="text-gray-600 mb-4">Detecting plant health...</p>
                    <Progress value={progress} className="h-3 bg-gray-200 rounded-full" />
                  </div>
                  <p className="text-sm text-gray-500">Processing offline</p>
                </div>
              </div>
            ) : preview ? (
              /* Image Preview - Full Screen */
              <div className="flex-1 flex flex-col">
                <div className="flex-1 relative bg-white rounded-3xl p-4 shadow-lg border border-gray-200/50 mb-4">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-2xl" 
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg active:scale-95 transition-all duration-200"
                    onClick={() => setPreview(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800">Ready for Analysis</p>
                      <p className="text-sm text-green-600">Tap analyze to get results</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Upload Interface - Full Screen */
              <div className="flex-1 flex flex-col">
                
                {/* AI Status */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-blue-800">Offline AI Ready</p>
                      <p className="text-sm text-blue-600">No internet required</p>
                    </div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Upload Zone */}
                <div className="flex-1 flex items-center justify-center mb-6">
                  <div
                    className="border-3 border-dashed border-primary/40 rounded-3xl p-8 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 active:scale-[0.98] w-full max-w-sm bg-white/60 backdrop-blur-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center mx-auto">
                        <Upload className="h-10 w-10 text-primary" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-900 mb-2">Upload Plant Image</p>
                        <p className="text-gray-600 mb-3">Select from device storage</p>
                        <p className="text-sm text-gray-500">JPG, PNG, WebP • Max 8MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-800 text-sm">Best Results</p>
                      <p className="text-xs text-amber-700">Clear, well-lit leaf photos work best</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions - Fixed */}
          <div className="flex-shrink-0 p-4 bg-white/95 backdrop-blur-xl border-t border-gray-200/50">
            {!preview && !uploading && isMobile() && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Button
                  variant="outline"
                  className="h-14 border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 active:scale-[0.98] rounded-2xl"
                  onClick={handleTakePicture}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="h-6 w-6 text-primary" />
                    <span className="text-sm font-semibold">Camera</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-14 border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 active:scale-[0.98] rounded-2xl"
                  onClick={handleSelectFromGallery}
                >
                  <div className="flex flex-col items-center gap-1">
                    <ImageIcon className="h-6 w-6 text-primary" />
                    <span className="text-sm font-semibold">Gallery</span>
                  </div>
                </Button>
              </div>
            )}
            
            {preview && !uploading && (
              <Button
                className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-[0.98] rounded-2xl"
                onClick={analyzeImage}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6" />
                  <span className="text-lg">Analyze with AI</span>
                </div>
              </Button>
            )}
          </div>

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
