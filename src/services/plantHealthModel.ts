import * as tf from '@tensorflow/tfjs';

export class PlantHealthModel {
  private model: tf.LayersModel | null = null;
  private isLoaded = false;

  async loadModel(): Promise<void> {
    try {
      // For now, we'll create a simple mock model that works with the existing interface
      // In production, you would load the actual converted TensorFlow.js model
      console.log('Loading plant health classification model...');
      
      // Mock model loading - replace with actual model loading when converted
      this.isLoaded = true;
      console.log('Plant health model loaded successfully');
    } catch (error) {
      console.error('Failed to load plant health model:', error);
      throw error;
    }
  }

  async classifyImage(imageData: string): Promise<{
    prediction: string;
    confidence: number;
    is_healthy: boolean;
    recommendations: string;
    model_info: {
      raw_prediction_value: number;
      model_threshold: number;
      interpretation: string;
    };
  }> {
    if (!this.isLoaded) {
      await this.loadModel();
    }

    try {
      // Convert base64 image to tensor
      const img = await this.preprocessImage(imageData);
      
      // For now, we'll simulate the model prediction
      // Replace this with actual model.predict(img) when the model is converted
      const mockPrediction = Math.random();
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const threshold = 0.5;
      const isHealthy = mockPrediction > threshold;
      const confidence = Math.round((isHealthy ? mockPrediction : (1 - mockPrediction)) * 100);
      
      return {
        prediction: isHealthy ? "Healthy Plant" : "Affected Plant (Pest/Disease detected)",
        confidence: confidence,
        is_healthy: isHealthy,
        recommendations: isHealthy 
          ? "Your plant appears healthy! Continue with regular care routine. Monitor for any changes in leaf color or texture."
          : "Plant shows signs of pest or disease. Consider: 1) Isolate the plant, 2) Check for pests on leaves and stems, 3) Adjust watering schedule, 4) Apply appropriate treatment if needed.",
        model_info: {
          raw_prediction_value: mockPrediction,
          model_threshold: threshold,
          interpretation: `Prediction value ${mockPrediction.toFixed(3)} ${isHealthy ? '>' : '<='} threshold ${threshold}`
        }
      };
    } catch (error) {
      console.error('Error during image classification:', error);
      throw error;
    }
  }

  private async preprocessImage(imageData: string): Promise<tf.Tensor> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Create canvas and resize image to 224x224 (standard input size)
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          canvas.width = 224;
          canvas.height = 224;
          
          // Draw and resize image
          ctx.drawImage(img, 0, 0, 224, 224);
          
          // Convert to tensor
          const tensor = tf.browser.fromPixels(canvas)
            .expandDims(0) // Add batch dimension
            .div(255.0); // Normalize to [0, 1]
          
          resolve(tensor);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = imageData;
    });
  }

  isModelLoaded(): boolean {
    return this.isLoaded;
  }
}

// Export singleton instance
export const plantHealthModel = new PlantHealthModel();