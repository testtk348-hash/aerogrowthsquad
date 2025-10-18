import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AnalysisResult } from "./UploadModal";

interface ResultsModalProps {
  open: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
  cropName: string;
}

export const ResultsModal = ({ open, onClose, result, cropName }: ResultsModalProps) => {
  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Analysis Results - {cropName}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Uploaded Image */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Uploaded Image</h3>
            <img
              src={result.imageUrl}
              alt="Analyzed"
              className="w-full rounded-lg border"
            />
          </div>

          {/* Analysis Details */}
          <div className="space-y-4">
            {/* Detections */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Detections</h3>
              <div className="space-y-3">
                {result.detections.map((detection, i) => (
                  <div key={i} className="p-4 bg-muted rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold">{detection.pest}</p>
                      <Badge variant={detection.confidence > 0.8 ? "default" : "secondary"}>
                        {(detection.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Severity: {detection.confidence > 0.9 ? "High" : detection.confidence > 0.7 ? "Medium" : "Low"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Recommended Actions</h3>
              <div className="text-sm bg-primary/10 p-4 rounded-lg border border-primary/20">
                {result.suggestedAction}
              </div>
            </div>

            {/* Correlated Metrics */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Correlated Sensor Metrics</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-muted rounded-lg text-center border">
                  <p className="text-xs text-muted-foreground mb-1">pH</p>
                  <p className="font-semibold">{result.correlatedMetrics.pH}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center border">
                  <p className="text-xs text-muted-foreground mb-1">Humidity</p>
                  <p className="font-semibold">{result.correlatedMetrics.humidity}%</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center border">
                  <p className="text-xs text-muted-foreground mb-1">TDS</p>
                  <p className="font-semibold">{result.correlatedMetrics.tds}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => {
            onClose();
            // Could trigger new upload here if needed
          }}>
            Analyze Another Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};