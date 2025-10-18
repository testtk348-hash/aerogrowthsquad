import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { CropCard } from "@/components/pest/CropCard";
import { UploadModal, AnalysisResult } from "@/components/pest/UploadModal";
import { ResultsModal } from "@/components/pest/ResultsModal";
import { cropData } from "@/lib/mockData";

const PestMonitoring = () => {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const selectedCropData = cropData.find((c) => c.id === selectedCrop);

  const handleCropSelect = (cropId: string) => {
    setSelectedCrop(cropId);
    setAnalysisResult(null);
    setUploadOpen(true);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setUploadOpen(false);
    setResultsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="mb-2">Pest Monitoring</h1>
          <p className="text-muted-foreground">
            AI-powered pest and disease detection
          </p>
        </div>

        {/* Instructions */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Select a crop card, then upload a close-up leaf/fruit image (JPG/PNG ≤ 8MB). 
            The system will detect pests/diseases and provide confidence scores with recommended actions.
          </AlertDescription>
        </Alert>

        {/* Crop Cards Grid */}
        <div>
          <h2 className="mb-4">Select Crop</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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


        {/* Upload Modal */}
        {selectedCropData && (
          <>
            <UploadModal
              open={uploadOpen}
              onClose={() => setUploadOpen(false)}
              cropName={selectedCropData.name}
              onAnalysisComplete={handleAnalysisComplete}
            />
            
            <ResultsModal
              open={resultsOpen}
              onClose={() => {
                setResultsOpen(false);
                setAnalysisResult(null);
              }}
              result={analysisResult}
              cropName={selectedCropData.name}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PestMonitoring;
