#!/usr/bin/env python3
"""
Manual TensorFlow.js conversion using older compatible versions
"""

import os
import json
import numpy as np
from tensorflow.keras.models import load_model

def create_tfjs_model_manually():
    """Create TensorFlow.js model files manually"""
    try:
        print("🔄 Loading Keras model...")
        model = load_model("plant_health_classifier.h5")
        
        print("✅ Model loaded successfully!")
        print(f"📊 Input shape: {model.input_shape}")
        print(f"📊 Output shape: {model.output_shape}")
        
        # Create output directory
        output_dir = "public/models/plant_health_classifier"
        os.makedirs(output_dir, exist_ok=True)
        
        # Create model.json with correct architecture
        model_json = {
            "format": "layers-model",
            "generatedBy": "keras v2.12.0",
            "convertedBy": "Manual Conversion v1.0.0",
            "modelTopology": {
                "keras_version": "2.12.0",
                "backend": "tensorflow",
                "model_config": {
                    "class_name": "Sequential",
                    "config": {
                        "name": "plant_health_classifier",
                        "layers": [
                            {
                                "class_name": "InputLayer",
                                "config": {
                                    "batch_input_shape": [None, 224, 224, 3],
                                    "dtype": "float32",
                                    "sparse": False,
                                    "name": "input_1"
                                }
                            },
                            {
                                "class_name": "Conv2D",
                                "config": {
                                    "name": "conv2d",
                                    "trainable": True,
                                    "dtype": "float32",
                                    "filters": 32,
                                    "kernel_size": [3, 3],
                                    "strides": [1, 1],
                                    "padding": "valid",
                                    "activation": "relu",
                                    "use_bias": True
                                }
                            },
                            {
                                "class_name": "MaxPooling2D",
                                "config": {
                                    "name": "max_pooling2d",
                                    "trainable": True,
                                    "dtype": "float32",
                                    "pool_size": [2, 2],
                                    "padding": "valid",
                                    "strides": [2, 2]
                                }
                            },
                            {
                                "class_name": "Conv2D",
                                "config": {
                                    "name": "conv2d_1",
                                    "trainable": True,
                                    "dtype": "float32",
                                    "filters": 64,
                                    "kernel_size": [3, 3],
                                    "strides": [1, 1],
                                    "padding": "valid",
                                    "activation": "relu",
                                    "use_bias": True
                                }
                            },
                            {
                                "class_name": "MaxPooling2D",
                                "config": {
                                    "name": "max_pooling2d_1",
                                    "trainable": True,
                                    "dtype": "float32",
                                    "pool_size": [2, 2],
                                    "padding": "valid",
                                    "strides": [2, 2]
                                }
                            },
                            {
                                "class_name": "Conv2D",
                                "config": {
                                    "name": "conv2d_2",
                                    "trainable": True,
                                    "dtype": "float32",
                                    "filters": 128,
                                    "kernel_size": [3, 3],
                                    "strides": [1, 1],
                                    "padding": "valid",
                                    "activation": "relu",
                                    "use_bias": True
                                }
                            },
                            {
                                "class_name": "MaxPooling2D",
                                "config": {
                                    "name": "max_pooling2d_2",
                                    "trainable": True,
                                    "dtype": "float32",
                                    "pool_size": [2, 2],
                                    "padding": "valid",
                                    "strides": [2, 2]
                                }
                            },
                            {
                                "class_name": "Flatten",
                                "config": {
                                    "name": "flatten",
                                    "trainable": True,
                                    "dtype": "float32"
                                }
                            },
                            {
                                "class_name": "Dense",
                                "config": {
                                    "name": "dense",
                                    "trainable": True,
                                    "dtype": "float32",
                                    "units": 128,
                                    "activation": "relu",
                                    "use_bias": True
                                }
                            },
                            {
                                "class_name": "Dropout",
                                "config": {
                                    "name": "dropout",
                                    "trainable": True,
                                    "dtype": "float32",
                                    "rate": 0.5
                                }
                            },
                            {
                                "class_name": "Dense",
                                "config": {
                                    "name": "dense_1",
                                    "trainable": True,
                                    "dtype": "float32",
                                    "units": 1,
                                    "activation": "sigmoid",
                                    "use_bias": True
                                }
                            }
                        ]
                    }
                }
            },
            "weightsManifest": [
                {
                    "paths": ["weights.bin"],
                    "weights": [
                        {"name": "conv2d/kernel", "shape": [3, 3, 3, 32], "dtype": "float32"},
                        {"name": "conv2d/bias", "shape": [32], "dtype": "float32"},
                        {"name": "conv2d_1/kernel", "shape": [3, 3, 32, 64], "dtype": "float32"},
                        {"name": "conv2d_1/bias", "shape": [64], "dtype": "float32"},
                        {"name": "conv2d_2/kernel", "shape": [3, 3, 64, 128], "dtype": "float32"},
                        {"name": "conv2d_2/bias", "shape": [128], "dtype": "float32"},
                        {"name": "dense/kernel", "shape": [86528, 128], "dtype": "float32"},
                        {"name": "dense/bias", "shape": [128], "dtype": "float32"},
                        {"name": "dense_1/kernel", "shape": [128, 1], "dtype": "float32"},
                        {"name": "dense_1/bias", "shape": [1], "dtype": "float32"}
                    ]
                }
            ]
        }
        
        # Save model.json
        model_json_path = os.path.join(output_dir, "model.json")
        with open(model_json_path, 'w') as f:
            json.dump(model_json, f, indent=2)
        
        print(f"✅ Created model.json")
        
        # Extract and save weights
        weights_data = []
        for layer in model.layers:
            if hasattr(layer, 'get_weights') and layer.get_weights():
                layer_weights = layer.get_weights()
                for weight in layer_weights:
                    weights_data.append(weight.flatten().astype(np.float32))
        
        # Concatenate all weights
        all_weights = np.concatenate(weights_data)
        
        # Save weights as binary file
        weights_path = os.path.join(output_dir, "weights.bin")
        all_weights.tobytes()
        with open(weights_path, 'wb') as f:
            f.write(all_weights.tobytes())
        
        print(f"✅ Created weights.bin ({len(all_weights)} parameters)")
        
        # Test the model with a sample
        print("\n🧪 Testing model behavior...")
        test_samples = [
            np.random.random((1, 224, 224, 3)),  # Random
            np.ones((1, 224, 224, 3)) * 0.3,     # Dark
            np.ones((1, 224, 224, 3)) * 0.7,     # Bright
        ]
        
        for i, sample in enumerate(test_samples):
            pred = model.predict(sample, verbose=0)[0][0]
            print(f"  Sample {i+1}: {pred:.6f} ({'Healthy' if pred > 0.5 else 'Affected'})")
        
        print(f"\n✅ Manual conversion completed!")
        print(f"📁 Files created in: {output_dir}")
        
        return True
        
    except Exception as e:
        print(f"❌ Manual conversion failed: {e}")
        return False

if __name__ == "__main__":
    create_tfjs_model_manually()