from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import io
from PIL import Image
import base64
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the model
MODEL_PATH = "../plant_health_classifier.h5"
model = None

def load_ml_model():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = load_model(MODEL_PATH)
            logger.info(f"Model loaded successfully from {MODEL_PATH}")
            logger.info(f"Model input shape: {model.input_shape}")
            logger.info(f"Model output shape: {model.output_shape}")
        else:
            logger.error(f"Model file not found at {MODEL_PATH}")
            logger.info(f"Current working directory: {os.getcwd()}")
            logger.info(f"Files in parent directory: {os.listdir('..')}")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")

def preprocess_image_for_model(img_data):
    """Preprocess image exactly as required by the plant health classifier model"""
    try:
        # Convert base64 to PIL Image
        img = Image.open(io.BytesIO(img_data))
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to model input size (224, 224) as specified in the model requirements
        img = img.resize((224, 224))
        
        # Convert to array and normalize pixel values to 0-1 range
        img_array = image.img_to_array(img) / 255.0
        
        # Add batch dimension (model expects batch input)
        img_array = np.expand_dims(img_array, axis=0)
        
        logger.info(f"Preprocessed image shape: {img_array.shape}")
        logger.info(f"Image value range: {img_array.min():.3f} to {img_array.max():.3f}")
        
        return img_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        return None

def validate_plant_image(img_data):
    """Validate if image is appropriate for plant health analysis"""
    try:
        img = Image.open(io.BytesIO(img_data))
        
        # Convert to RGB
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Basic checks for image quality
        width, height = img.size
        
        # Check minimum resolution
        if width < 100 or height < 100:
            return False, "Image resolution too low. Please upload a higher quality image (minimum 100x100 pixels)."
        
        # Check maximum file size (already handled by frontend, but double-check)
        if len(img_data) > 8 * 1024 * 1024:  # 8MB
            return False, "Image file too large. Please upload an image smaller than 8MB."
        
        # Convert to numpy array for analysis
        img_array = np.array(img)
        mean_brightness = np.mean(img_array)
        
        # Check if image is too dark or too bright
        if mean_brightness < 20:
            return False, "Image is too dark. Please ensure good lighting when taking the photo."
        elif mean_brightness > 235:
            return False, "Image is overexposed. Please reduce lighting or adjust camera settings."
        
        # Check for plant/leaf content
        green_channel = img_array[:, :, 1]
        red_channel = img_array[:, :, 0]
        blue_channel = img_array[:, :, 2]
        
        # Calculate color ratios
        green_ratio = np.mean(green_channel) / 255.0
        red_ratio = np.mean(red_channel) / 255.0
        blue_ratio = np.mean(blue_channel) / 255.0
        
        # Check for sufficient green content (indicating plant material)
        if green_ratio < 0.1:
            return False, "No significant plant content detected. Please upload a clear image of a plant leaf."
        
        # Check for color variation (avoid pure color images)
        color_std = np.std(img_array)
        if color_std < 15:
            return False, "Image appears to lack detail. Please upload a clear, detailed image of a plant leaf."
        
        # Check for skin tones (to detect hands in image)
        skin_pixels = np.sum(
            (red_channel > green_channel) & 
            (red_channel > blue_channel) & 
            (red_channel > 95) & 
            (green_channel > 40) & 
            (blue_channel > 20) &
            (red_channel - green_channel > 15) &
            (np.abs(red_channel - green_channel) > np.abs(red_channel - blue_channel))
        )
        skin_ratio = skin_pixels / (width * height)
        
        if skin_ratio > 0.15:  # More than 15% skin-like pixels
            return False, "Hands or skin detected in image. Please upload an image showing only the plant leaf."
        
        # Check aspect ratio (avoid very thin or very wide images)
        aspect_ratio = max(width, height) / min(width, height)
        if aspect_ratio > 4:
            return False, "Image aspect ratio is too extreme. Please upload a more square-shaped image of the leaf."
        
        logger.info(f"Image validation passed - Size: {width}x{height}, Brightness: {mean_brightness:.1f}, Green ratio: {green_ratio:.3f}")
        return True, "Image validation passed"
        
    except Exception as e:
        logger.error(f"Error validating image: {str(e)}")
        return False, "Error processing image. Please try uploading a different image."

@app.route('/health', methods=['GET'])
def health_check():
    model_info = {}
    if model is not None:
        try:
            # Get model information
            model_info = {
                'input_shape': model.input_shape,
                'output_shape': model.output_shape,
                'layers': len(model.layers)
            }
        except Exception as e:
            model_info = {'error': str(e)}
    
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_info': model_info
    })

@app.route('/test-prediction', methods=['GET'])
def test_prediction():
    """Test endpoint to verify model is working with sample data"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        # Create two test images: one "healthy" looking and one "affected" looking
        
        # Healthy-looking image (more green)
        healthy_image = np.random.rand(1, 224, 224, 3) * 0.3 + 0.2
        healthy_image[:, :, :, 1] += 0.3  # Boost green channel
        
        # Affected-looking image (more brown/yellow)
        affected_image = np.random.rand(1, 224, 224, 3) * 0.3 + 0.2
        affected_image[:, :, :, 0] += 0.3  # Boost red channel
        affected_image[:, :, :, 1] += 0.1  # Slight green
        
        # Test both images
        healthy_pred = model.predict(healthy_image, verbose=0)
        affected_pred = model.predict(affected_image, verbose=0)
        
        return jsonify({
            'model_status': 'working',
            'model_input_shape': model.input_shape,
            'model_output_shape': model.output_shape,
            'test_results': {
                'healthy_sample': {
                    'prediction': healthy_pred.tolist(),
                    'interpretation': 'Healthy' if healthy_pred[0][0] > 0.5 else 'Affected'
                },
                'affected_sample': {
                    'prediction': affected_pred.tolist(),
                    'interpretation': 'Healthy' if affected_pred[0][0] > 0.5 else 'Affected'
                }
            },
            'threshold_info': 'Values > 0.5 = Healthy, Values ≤ 0.5 = Affected'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def classify_leaf_health(img_array):
    """Use the trained model to classify leaf health - core ML prediction function"""
    try:
        if model is None:
            raise Exception("Model not loaded")
        
        # Make prediction using the loaded model
        prediction = model.predict(img_array, verbose=0)
        
        logger.info(f"Raw model prediction: {prediction}")
        logger.info(f"Prediction shape: {prediction.shape}")
        
        # Extract the prediction value
        if len(prediction.shape) == 2:
            prediction_value = prediction[0][0]
        else:
            prediction_value = prediction[0]
        
        logger.info(f"Prediction value: {prediction_value}")
        
        # Interpret the prediction based on the model's training
        # According to your code: if prediction > 0.5: Healthy, else: Affected
        if prediction_value > 0.5:
            is_healthy = True
            health_status = "Healthy Plant"
            confidence = float(prediction_value)
        else:
            is_healthy = False
            health_status = "Affected Plant (Pest/Disease detected)"
            confidence = float(1 - prediction_value)  # Confidence in the "affected" prediction
        
        # Ensure confidence is reasonable (between 0.5 and 1.0)
        confidence = max(0.5, min(1.0, confidence))
        
        logger.info(f"Final classification: {health_status}, Confidence: {confidence:.3f}")
        
        return is_healthy, confidence, health_status, prediction_value
        
    except Exception as e:
        logger.error(f"Error in ML prediction: {str(e)}")
        raise e

@app.route('/analyze', methods=['POST'])
def analyze_plant():
    """Main endpoint for plant health analysis using the trained ML model"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'error': 'ML Model not available',
                'message': 'Plant health classifier model could not be loaded. Please check if plant_health_classifier.h5 exists.'
            }), 500
        
        # Get image data from request
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image
        try:
            image_data = base64.b64decode(data['image'].split(',')[1])
        except Exception as e:
            logger.error(f"Error decoding image: {str(e)}")
            return jsonify({'error': 'Invalid image format. Please upload a valid image file.'}), 400
        
        # Validate image content for plant analysis
        is_valid, validation_message = validate_plant_image(image_data)
        if not is_valid:
            return jsonify({
                'error': 'Inappropriate image',
                'message': validation_message,
                'inappropriate_image': True
            }), 400
        
        # Preprocess image for the ML model
        processed_image = preprocess_image_for_model(image_data)
        if processed_image is None:
            return jsonify({'error': 'Error processing image for analysis'}), 400
        
        # Perform ML prediction
        try:
            is_healthy, confidence, health_status, raw_prediction = classify_leaf_health(processed_image)
            
            # Generate detailed recommendations
            recommendations = get_detailed_recommendations(is_healthy, confidence)
            
            # Prepare response
            result = {
                'prediction': health_status,
                'confidence': round(confidence * 100, 1),
                'is_healthy': is_healthy,
                'recommendations': recommendations,
                'model_info': {
                    'raw_prediction_value': float(raw_prediction),
                    'model_threshold': 0.5,
                    'interpretation': 'Values > 0.5 indicate healthy plant, values ≤ 0.5 indicate affected plant'
                }
            }
            
            logger.info(f"Analysis complete: {health_status} (confidence: {confidence:.3f})")
            return jsonify(result)
            
        except Exception as e:
            logger.error(f"ML model prediction failed: {str(e)}")
            return jsonify({
                'error': 'Model prediction failed',
                'message': 'The ML model encountered an error during prediction. Please try with a different image.'
            }), 500
        
    except Exception as e:
        logger.error(f"Error in analysis endpoint: {str(e)}")
        return jsonify({
            'error': 'Analysis failed',
            'message': 'An unexpected error occurred during analysis. Please try again.'
        }), 500

def get_detailed_recommendations(is_healthy, confidence):
    """Generate detailed recommendations based on ML model prediction"""
    if is_healthy:
        if confidence > 0.9:
            return "Excellent! Your plant appears very healthy. Continue your current care routine including proper watering, lighting, and nutrition."
        elif confidence > 0.8:
            return "Plant looks healthy overall. Maintain current growing conditions and monitor regularly for any changes."
        elif confidence > 0.7:
            return "Plant appears mostly healthy. Keep monitoring and ensure optimal growing conditions (proper light, water, and nutrients)."
        else:
            return "Plant seems healthy but with some uncertainty. Monitor closely for any signs of stress, pests, or disease."
    else:
        if confidence > 0.9:
            return "High confidence detection of pest/disease issues. Immediate action recommended: isolate plant, inspect thoroughly for pests or disease symptoms, and apply appropriate treatment."
        elif confidence > 0.8:
            return "Likely pest or disease detected. Inspect plant carefully for signs of damage, discoloration, or pests. Consider preventive treatment."
        elif confidence > 0.7:
            return "Possible plant health issues detected. Check for common problems: overwatering, underwatering, nutrient deficiency, or early pest signs."
        else:
            return "Some concerns detected but with lower confidence. Monitor plant closely and check growing conditions (light, water, soil, temperature)."

if __name__ == '__main__':
    load_ml_model()
    app.run(debug=True, host='0.0.0.0', port=5000)