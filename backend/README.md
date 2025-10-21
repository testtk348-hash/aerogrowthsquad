# Plant Health Classifier Backend

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure the `plant_health_classifier.h5` model file is in the parent directory

3. Run the Flask server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /analyze` - Analyze plant image

### Analyze Endpoint

Send a POST request with JSON body:
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

Response:
```json
{
  "prediction": "Healthy Plant",
  "confidence": 85.2,
  "is_healthy": true,
  "recommendations": "Plant looks healthy. Monitor regularly..."
}
```