import tensorflowjs as tfjs
from tensorflow.keras.models import load_model
import os

# Load the Keras model
model = load_model("plant_health_classifier.h5")

# Create public/models directory if it doesn't exist
os.makedirs("public/models", exist_ok=True)

# Convert and save the model to TensorFlow.js format
tfjs.converters.save_keras_model(model, "public/models/plant_health_classifier")

print("Model converted successfully to TensorFlow.js format!")
print("Model saved in: public/models/plant_health_classifier/")