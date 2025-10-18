import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Progress } from "@/components/ui/progress";
import growthAnimation from "@/assets/growth-animation.json";

export const LoadingScreen = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setShowWelcome(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(progressTimer);
  }, []);

  if (!showWelcome) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-500" 
      style={{ 
        backgroundColor: '#043002',
        opacity: progress === 100 ? 0 : 1
      }}
    >
      <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-2xl">
        <div className="w-72 h-72 sm:w-96 sm:h-96">
          <Lottie animationData={growthAnimation} loop={true} />
        </div>
        <div className="text-center space-y-4 w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Aero Growth Squad</h1>
          <div className="space-y-3 w-full max-w-md mx-auto">
            <Progress value={progress} className="h-2" />
            <p className="text-base sm:text-lg text-white/90">Loading {progress}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
