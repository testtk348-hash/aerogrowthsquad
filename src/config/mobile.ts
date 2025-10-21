import { isMobile } from '@/utils/mobile';

export const getMobileConfig = () => {
  const isNativeMobile = isMobile();
  
  return {
    // API Configuration
    apiBaseUrl: isNativeMobile 
      ? 'https://your-backend-url.com' // Replace with your actual backend URL
      : 'http://localhost:5000',
    
    // ML Model Configuration
    mlConfig: {
      timeout: isNativeMobile ? 30000 : 15000, // 30s for mobile, 15s for web
      retryAttempts: isNativeMobile ? 2 : 1,
      useFallback: isNativeMobile, // Enable fallback for mobile
      maxImageSize: 8 * 1024 * 1024, // 8MB max
      supportedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      minResolution: { width: 224, height: 224 },
    },
    
    // UI Configuration
    ui: {
      fastLoading: isNativeMobile,
      compactMode: isNativeMobile,
      touchOptimized: isNativeMobile,
    },
    
    // Performance Configuration
    performance: {
      lazyLoading: isNativeMobile,
      imageCompression: isNativeMobile,
      reducedAnimations: isNativeMobile,
    }
  };
};

export const MOBILE_CONFIG = getMobileConfig();