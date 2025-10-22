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
      <DialogContent className="w-[90vw] max-w-md mx-auto bg-white rounded-2xl border-0 p-0 overflow-hidden">
        
        {/* Centered Modal Layout */}
        <div className="relative">
          
          {/* Close Button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg z-10"
          >
            <X className="h-4 w-4 text-gray-600" />
          </Button>

          {/* Content */}
          <div className="p-6">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">AI Plant Analysis</h2>
              <p className="text-sm text-primary font-medium">{cropName}</p>
            </div>

            {result ? (
              /* Analysis Results */
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={result.imageUrl} 
                    alt="Analyzed" 
                    className="w-full h-32 object-cover rounded-xl border border-gray-200" 
                  />
                </div>
                
                {/* Health Status */}
                <div className={`p-4 rounded-xl border ${
                  result.is_healthy 
                    ? "bg-green-50 border-green-200" 
                    : "bg-orange-50 border-orange-200"
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    {result.is_healthy ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-orange-600" />
                    )}
                    <div>
                      <p className="font-bold text-lg">{result.prediction}</p>
                      <p className="text-sm opacity-80">{result.confidence}% confidence</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">
                    Status: {result.is_healthy ? "Healthy Plant" : "Requires Attention"}
                  </p>
                </div>

                {/* Recommendations */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold mb-2 text-sm">Recommendations</h4>
                  <p className="text-sm text-gray-700">{result.recommendations}</p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setResult(null);
                      setPreview(null);
                    }}
                    className="h-12 rounded-xl"
                  >
                    Analyze Another
                  </Button>
                  <Button 
                    onClick={handleDone}
                    className="h-12 rounded-xl bg-gradient-to-r from-primary to-secondary"
                  >
                    Done
                  </Button>
                </div>
              </div>
            ) : uploading ? (
              /* Analysis Progress */
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent"></div>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-2">Analyzing...</p>
                  <p className="text-gray-600 text-sm mb-4">Detecting plant health</p>
                  <Progress value={progress} className="h-2 bg-gray-200 rounded-full" />
                  <p className="text-xs text-gray-500 mt-2">{progress}% complete</p>
                </div>
              </div>
            ) : preview ? (
              /* Image Preview & Analysis */
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-xl border border-gray-200" 
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg"
                    onClick={() => setPreview(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800 text-sm">Ready for Analysis</p>
                      <p className="text-xs text-green-600">Tap analyze to get results</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                  onClick={analyzeImage}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Analyze with AI
                </Button>
              </div>
            ) : (
              /* Upload Interface */
              <div className="space-y-4">
                
                {/* Upload Zone */}
                <div
                  className="border-2 border-dashed border-primary/40 rounded-xl p-6 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all duration-200"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-bold text-gray-900 mb-1">Upload Plant Image</p>
                  <p className="text-sm text-gray-600 mb-2">Select from device storage</p>
                  <p className="text-xs text-gray-500">JPG, PNG, WebP • Max 8MB</p>
                </div>

                {/* Camera & Gallery Buttons */}
                {isMobile() && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-12 border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 rounded-xl"
                      onClick={handleTakePicture}
                    >
                      <Camera className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-semibold">Camera</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 rounded-xl"
                      onClick={handleSelectFromGallery}
                    >
                      <ImageIcon className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-semibold">Gallery</span>
                    </Button>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-800 text-sm">Best Results</p>
                      <p className="text-xs text-amber-700">Clear, well-lit leaf photos work best</p>
                    </div>
                  </div>
                </div>
              </div>
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
