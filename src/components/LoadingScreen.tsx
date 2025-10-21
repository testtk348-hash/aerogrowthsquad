import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Progress } from "@/components/ui/progress";
import { isMobile } from "@/utils/mobile";
import growthAnimation from "@/assets/growth-animation.json";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Faster loading for mobile devices
    const incrementValue = isMobile() ? 4 : 2;
    const intervalTime = isMobile() ? 30 : 50;
    
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            setShowWelcome(false);
            onLoadingComplete();
          }, 300); // Shorter delay for mobile
          return 100;
        }
        return prev + incrementValue;
      });
    }, intervalTime);

    return () => clearInterval(progressTimer);
  }, [onLoadingComplete]);

  if (!showWelcome) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center px-3 sm:px-4 transition-opacity duration-300" 
      style={{ 
        backgroundColor: '#043002',
        opacity: progress === 100 ? 0 : 1
      }}
    >
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 lg:gap-8 w-full max-w-2xl">
        <div className="w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96">
          <Lottie 
            animationData={growthAnimation} 
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="text-center space-y-3 sm:space-y-4 w-full">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Aero Growth Squad</h1>
          <p className="text-sm sm:text-base text-white/80 px-4">Vertical Farming Dashboard</p>
          <div className="space-y-2 sm:space-y-3 w-full max-w-xs sm:max-w-md mx-auto px-4">
            <Progress value={progress} className="h-1.5 sm:h-2" />
            <p className="text-sm sm:text-base lg:text-lg text-white/90">Loading {progress}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
