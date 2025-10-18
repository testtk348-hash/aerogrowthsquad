import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  cropName: string;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export interface AnalysisResult {
  detections: {
    pest: string;
    confidence: number;
    bbox: [number, number, number, number];
  }[];
  suggestedAction: string;
  correlatedMetrics: {
    pH: number;
    humidity: number;
    tds: number;
  };
  imageUrl: string;
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

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Only JPG and PNG files are supported");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const simulateAnalysis = async () => {
    setUploading(true);
    setProgress(0);

    // Simulate upload and analysis
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock result
    const mockResult: AnalysisResult = {
      detections: [
        {
          pest: "Aphids",
          confidence: 0.93,
          bbox: [120, 80, 200, 150],
        },
      ],
      suggestedAction: "Apply insecticidal soap; isolate affected plants. Monitor daily for 5-7 days.",
      correlatedMetrics: {
        pH: 6.1,
        humidity: 80,
        tds: 430,
      },
      imageUrl: preview || "",
    };

    setUploading(false);
    onAnalysisComplete(mockResult);
    toast.success("Analysis complete!");
    handleClose();
  };

  const handleClose = () => {
    setPreview(null);
    setProgress(0);
    setUploading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image - {cropName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a close-up image of the affected plant area (leaf/fruit/stem). Maximum 8MB.
          </p>

          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full rounded-lg" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setPreview(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-2">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">JPG, PNG (max 8MB)</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-center text-muted-foreground">Analyzing image...</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            <Button
              className="flex-1"
              disabled={!preview || uploading}
              onClick={simulateAnalysis}
            >
              Analyze
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
