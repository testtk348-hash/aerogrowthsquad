#!/usr/bin/env python3
"""
Test script to load and analyze the plant health classifier model
"""

import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os

def test_model():
    try:
        print("🔄 Loading plant_health_classifier.h5...")
        model = load_model("plant_health_classifier.h5")
        
        print("✅ Model loaded successfully!")
        print(f"📊 Input shape: {model.input_shape}")
        print(f"📊 Output shape: {model.output_shape}")
        print(f"📊 Number of parameters: {model.count_params()}")
        
        print("\n📋 Model Summary:")
        model.summary()
        
        # Test with a dummy image
        print("\n🧪 Testing with dummy image...")
        dummy_image = np.random.random((1, 224, 224, 3))
        prediction = model.predict(dummy_image, verbose=0)
        
        print(f"🎯 Dummy prediction: {prediction[0][0]:.6f}")
        print(f"🎯 Interpretation: {'Healthy' if prediction[0][0] > 0.5 else 'Affected'}")
        
        # Analyze model architecture
        print("\n🏗️ Model Architecture:")
        for i, layer in enumerate(model.layers):
            print(f"  {i+1}. {layer.name} ({layer.__class__.__name__}) - Output: {layer.output_shape}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    if not os.path.exists("plant_health_classifier.h5"):
        print("❌ plant_health_classifier.h5 not found!")
        exit(1)
    
    test_model()