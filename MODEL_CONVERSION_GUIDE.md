# Plant Health Classifier Model Conversion Guide

This guide explains how to convert your `plant_health_classifier.h5` Keras model to TensorFlow.js format for frontend deployment.

## Prerequisites

1. Python 3.7+ with TensorFlow and TensorFlow.js converter
2. Your trained `plant_health_classifier.h5` model file

## Installation

```bash
pip install tensorflow tensorflowjs numpy==1.21.0
```

Note: Use numpy 1.21.0 to avoid compatibility issues with tensorflowjs.

## Conversion Steps

### Method 1: Command Line (Recommended)

```bash
# Install tensorflowjs converter
pip install tensorflowjs

# Convert the model
tensorflowjs_converter --input_format=keras \
                      --output_format=tfjs_layers_model \
                      plant_health_classifier.h5 \
                      public/models/plant_health_classifier
```

### Method 2: Python Script

Create a file `convert_model.py`:

```python
import tensorflowjs as tfjs
from tensorflow.keras.models import load_model
import os

# Load the Keras model
model = load_model("plant_health_classifier.h5")

# Create output directory
os.makedirs("public/models/plant_health_classifier", exist_ok=True)

# Convert and save
tfjs.converters.save_keras_model(model, "public/models/plant_health_classifier")

print("Model converted successfully!")
```

Run the script:
```bash
python convert_model.py
```

## Expected Output

After conversion, you should have these files in `public/models/plant_health_classifier/`:

```
public/models/plant_health_classifier/
├── model.json          # Model architecture
├── group1-shard1of1.bin # Model weights
└── (additional weight files if large model)
```

## Model Integration

The converted model is automatically integrated into the app:

1. **Real Model Loading**: The app tries to load from `/models/plant_health_classifier/model.json`
2. **Fallback Simulation**: If the real model isn't found, it uses intelligent simulation
3. **Binary Classification**: Expects single output value (0-1) for healthy/unhealthy classification

## Model Requirements

Your `plant_health_classifier.h5` should:

- Accept 224x224x3 RGB images as input
- Output a single value between 0 and 1 (sigmoid activation)
- Use binary classification (0 = affected/unhealthy, 1 = healthy)

## Troubleshooting

### Common Issues

1. **Numpy Compatibility Error**:
   ```bash
   pip install numpy==1.21.0
   ```

2. **Model Not Loading**:
   - Check file paths in `public/models/plant_health_classifier/`
   - Verify model.json exists and is valid
   - Check browser console for loading errors

3. **Large Model Size**:
   - Consider model quantization for faster loading
   - Use model pruning to reduce size

### Verification

To verify the conversion worked:

1. Check browser console for "✅ Plant health classifier loaded successfully!"
2. Upload an image and check if it uses "Real TensorFlow.js Model"
3. Model info should show actual prediction values

## Current Status

- ✅ Frontend integration complete
- ✅ Intelligent simulation fallback working
- ⏳ Waiting for model conversion (due to numpy compatibility)
- ✅ Binary classification logic implemented

## Next Steps

1. Fix numpy compatibility and convert the model
2. Test with real model predictions
3. Optimize model loading for mobile devices
4. Add model caching for offline use

## Performance Notes

- Model loads asynchronously on app start
- First prediction may take longer (model initialization)
- Subsequent predictions are faster (model cached)
- Works offline once loaded (perfect for Vercel deployment)