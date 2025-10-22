#!/usr/bin/env python3
"""
Manual conversion script for plant health classifier model
This script converts the Keras .h5 model to TensorFlow.js format
"""

import os
import sys

def convert_model():
    try:
        # Import required libraries
        import tensorflow as tf
        from tensorflow import keras
        import tensorflowjs as tfjs
        
        print("Loading Keras model...")
        
        # Load the model
        model = keras.models.load_model("plant_health_classifier.h5")
        
        print("Model loaded successfully!")
        print(f"Model input shape: {model.input_shape}")
        print(f"Model output shape: {model.output_shape}")
        
        # Create output directory
        output_dir = "public/models/plant_health_classifier"
        os.makedirs(output_dir, exist_ok=True)
        
        print(f"Converting model to TensorFlow.js format...")
        
        # Convert to TensorFlow.js
        tfjs.converters.save_keras_model(model, output_dir)
        
        print(f"✅ Model converted successfully!")
        print(f"📁 Saved to: {output_dir}")
        print(f"📊 Model summary:")
        model.summary()
        
        return True
        
    except ImportError as e:
        print(f"❌ Missing required library: {e}")
        print("Please install: pip install tensorflow tensorflowjs")
        return False
    except Exception as e:
        print(f"❌ Conversion failed: {e}")
        return False

if __name__ == "__main__":
    success = convert_model()
    sys.exit(0 if success else 1)