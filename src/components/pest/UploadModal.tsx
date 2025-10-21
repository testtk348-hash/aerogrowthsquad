import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X, Info, CheckCircle, AlertTriangle, Scan } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    if (file.size > 8 * 1024 * 1024) {
      toast.error("File size must be less than 8MB");
      return;
    }

    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP files are supported");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!preview) return;

    setUploading(true);
    setProgress(0);

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      // Call ML API
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: preview
        })
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        
        if (errorData.inappropriate_image) {
          // Show detailed error message for inappropriate images
          toast.error(errorData.message, {
            duration: 6000,
            description: "Please follow the image guidelines and try again with a clear leaf photo."
          });
          setUploading(false);
          setProgress(0);
          return;
        }
        
        throw new Error(errorData.message || 'Analysis failed');
      }

      const result = await response.json();
      
      // Create analysis result with mock correlated metrics
      const analysisResult: AnalysisResult = {
        prediction: result.prediction,
        confidence: result.confidence,
        is_healthy: result.is_healthy,
        recommendations: result.recommendations,
        imageUrl: preview,
        correlatedMetrics: {
          pH: 6.1 + (Math.random() - 0.5) * 0.4,
          humidity: 78 + (Math.random() - 0.5) * 10,
          tds: 420 + (Math.random() - 0.5) * 40,
        }
      };

      setUploading(false);
      onAnalysisComplete(analysisResult);
      toast.success("Analysis complete!");
      handleClose();

    } catch (error) {
      console.error('Analysis error:', error);
      setUploading(false);
      setProgress(0);
      
      if (error instanceof Error && error.message.includes('fetch')) {
        toast.error("Cannot connect to analysis server. Please ensure the backend is running.");
      } else {
        toast.error(error instanceof Error ? error.message : "Analysis failed. Please try again.");
      }
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
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">Upload Image - {cropName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Important Notice */}
          <Alert className="border-amber-200 bg-amber-50">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-xs sm:text-sm">
              <strong>Important:</strong> Upload only clear, close-up images of plant leaves. 
              The AI model works best with high-quality, well-lit photos showing leaf details.
            </AlertDescription>
          </Alert>

          {/* Upload Area */}
          {preview ? (
            <div className="space-y-4">
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full rounded-lg border" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 shadow-lg"
                  onClick={() => setPreview(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-sm font-medium text-green-600 mb-2">✓ Image ready for analysis</p>
                <p className="text-xs text-muted-foreground">
                  Click "Analyze Now" to start AI detection, or choose a different image
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div
                className="border-2 border-dashed rounded-lg p-4 sm:p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-all duration-200"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-primary/10 p-3 sm:p-4 rounded-full w-fit mx-auto">
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-medium mb-2">Upload Plant Image</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      Click here or drag and drop your image
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <span>JPG, PNG, WebP</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Max 8MB</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Min 224x224px</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Guidelines */}
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 text-xs">
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-600 flex items-center gap-1 text-xs sm:text-sm">
                      <CheckCircle className="h-3 w-3" />
                      Perfect Images Include:
                    </h4>
                    <ul className="space-y-1 text-muted-foreground text-xs">
                      <li>• Single leaf filling most of the frame</li>
                      <li>• Clear, sharp focus on leaf surface</li>
                      <li>• Natural daylight or bright indoor lighting</li>
                      <li>• Both healthy and damaged areas visible</li>
                      <li>• Leaf surface details clearly visible</li>
                      <li>• Minimum 224x224 pixels resolution</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Avoid These Issues:
                    </h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Hands, fingers, or tools in the image</li>
                      <li>• Fruits, flowers, or stems (leaves only!)</li>
                      <li>• Multiple leaves or cluttered background</li>
                      <li>• Blurry, dark, or overexposed images</li>
                      <li>• Images taken from too far away</li>
                      <li>• Pure black/white or very uniform images</li>
                    </ul>
                  </div>
                </div>
                
                {/* Pro Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-800 text-sm mb-2">💡 Pro Tips for Best Results:</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Hold the camera/phone steady and get close to the leaf</li>
                    <li>• Use natural light when possible (near a window)</li>
                    <li>• Focus on areas showing symptoms if plant looks unhealthy</li>
                    <li>• Take the photo straight-on, not at an angle</li>
                    <li>• Make sure the leaf surface is clean and visible</li>
                  </ul>
                </div>
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

          {/* Progress */}
          {uploading && (
            <div className="space-y-3">
              <Progress value={progress} className="h-2" />
              <div className="text-center">
                <p className="text-sm font-medium">Analyzing your image...</p>
                <p className="text-xs text-muted-foreground">
                  AI is detecting pests and diseases • This may take a few seconds
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-11 sm:h-10"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              <span className="text-sm">{preview ? "Change Image" : "Choose File"}</span>
            </Button>
            <Button
              className="flex-1 h-11 sm:h-10"
              disabled={!preview || uploading}
              onClick={analyzeImage}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="text-sm">Analyzing...</span>
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  <span className="text-sm">Analyze Now</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
