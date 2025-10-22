#!/usr/bin/env python3
"""
Improved model conversion script with compatibility fixes
"""

import os
import sys
import subprocess

def install_compatible_versions():
    """Install compatible versions of required packages"""
    print("Installing compatible versions...")
    
    packages = [
        "numpy==1.21.6",
        "tensorflow==2.10.0", 
        "tensorflowjs==3.21.0",
        "h5py==3.7.0"
    ]
    
    for package in packages:
        print(f"Installing {package}...")
        subprocess.run([sys.executable, "-m", "pip", "install", package], 
                      capture_output=True, text=True)

def convert_model():
    """Convert the Keras model to TensorFlow.js format"""
    try:
        print("🔄 Starting model conversion...")
        
        # Import after installing compatible versions
        import tensorflow as tf
        import tensorflowjs as tfjs
        import numpy as np
        
        print(f"✅ TensorFlow version: {tf.__version__}")
        print(f"✅ TensorFlow.js version: {tfjs.__version__}")
        print(f"✅ NumPy version: {np.__version__}")
        
        # Load the model
        print("📂 Loading plant_health_classifier.h5...")
        model = tf.keras.models.load_model("plant_health_classifier.h5")
        
        print("✅ Model loaded successfully!")
        print(f"📊 Input shape: {model.input_shape}")
        print(f"📊 Output shape: {model.output_shape}")
        
        # Print model summary
        print("\n📋 Model Summary:")
        model.summary()
        
        # Create output directory
        output_dir = "public/models/plant_health_classifier"
        os.makedirs(output_dir, exist_ok=True)
        
        print(f"\n🔄 Converting to TensorFlow.js format...")
        
        # Convert with optimizations for web deployment
        tfjs.converters.save_keras_model(
            model, 
            output_dir,
            quantization_bytes=2,  # Quantize to reduce size
            split_weights_by_layer=False
        )
        
        print(f"✅ Model converted successfully!")
        print(f"📁 Output directory: {output_dir}")
        
        # List generated files
        print(f"\n📄 Generated files:")
        for file in os.listdir(output_dir):
            file_path = os.path.join(output_dir, file)
            size = os.path.getsize(file_path) / 1024  # KB
            print(f"  - {file} ({size:.1f} KB)")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("💡 Try installing compatible versions first")
        return False
    except Exception as e:
        print(f"❌ Conversion failed: {e}")
        return False

def main():
    print("🚀 Plant Health Classifier - Model Conversion Tool")
    print("=" * 50)
    
    # Check if model file exists
    if not os.path.exists("plant_health_classifier.h5"):
        print("❌ plant_health_classifier.h5 not found!")
        print("💡 Make sure the model file is in the current directory")
        return False
    
    # Option to install compatible versions
    install_deps = input("Install compatible package versions? (y/n): ").lower().strip()
    if install_deps == 'y':
        install_compatible_versions()
    
    # Convert the model
    success = convert_model()
    
    if success:
        print("\n🎉 Conversion completed successfully!")
        print("💡 Your model is now ready for web deployment")
        print("🔄 Restart your development server to load the new model")
    else:
        print("\n❌ Conversion failed")
        print("💡 Check the error messages above for troubleshooting")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)