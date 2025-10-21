import { offlinePlantModel } from '@/services/offlineML';

// Preload ML model for faster analysis
export const preloadMLModel = async (): Promise<void> => {
  try {
    console.log('Preloading offline ML model...');
    
    // The model is already being loaded when the module is imported
    // This function can be used to check status or force reload
    
    if (!offlinePlantModel.isModelLoaded()) {
      console.log('ML model not loaded yet, waiting...');
      
      // Wait up to 10 seconds for model to load
      let attempts = 0;
      const maxAttempts = 50; // 10 seconds with 200ms intervals
      
      while (!offlinePlantModel.isModelLoaded() && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
      }
      
      if (offlinePlantModel.isModelLoaded()) {
        console.log('✅ Offline ML model loaded successfully');
      } else {
        console.log('⚠️ ML model loading timeout, will use fallback analysis');
      }
    } else {
      console.log('✅ Offline ML model already loaded');
    }
  } catch (error) {
    console.error('❌ Failed to preload ML model:', error);
  }
};

// Auto-preload when this module is imported
preloadMLModel();