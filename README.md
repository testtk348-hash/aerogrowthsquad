# Plant Health Monitoring System

An AI-powered plant health monitoring system with real-time pest and disease detection using machine learning.

## Features

- **AI Plant Health Analysis**: Upload plant leaf images for automated health assessment
- **Multi-Crop Support**: Supports Tomato, Strawberry, and Corn analysis
- **Real-time Results**: Get instant health predictions with confidence scores
- **Image Validation**: Automatic validation to ensure appropriate plant images
- **Responsive UI**: Modern, mobile-friendly interface built with React and Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

## Quick Start

1. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   npm run setup
   ```

2. **Add ML Model** (Required for Pest Monitoring):
   - Place your `plant_health_classifier.h5` file in the project root directory
   - The model file is not included in the repository due to size limitations (127MB)
   - Contact the project maintainer for the trained model file

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

This will start both the frontend (React) and backend (Flask) servers concurrently.

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
├── src/                    # React frontend
│   ├── components/pest/    # Pest monitoring components
│   ├── pages/             # Application pages
│   └── lib/               # Utilities and mock data
├── backend/               # Flask backend
│   ├── app.py            # Main Flask application
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend documentation
├── plant_health_classifier.h5  # ML model file
└── package.json          # Node.js dependencies
```

## Usage

1. **Navigate to Pest Monitoring**: Go to the pest monitoring page
2. **Select Crop Type**: Choose from Tomato, Strawberry, or Corn
3. **Upload Image**: Follow the guidelines and upload a clear leaf image
4. **Get Results**: Receive AI-powered health analysis with recommendations

### Image Upload Guidelines

For best results:
- ✅ Clear, well-lit leaf images
- ✅ Focus on leaf surfaces (top/bottom)
- ✅ Minimum 224x224 pixels resolution
- ✅ JPG, PNG, or WebP format (max 8MB)

Avoid:
- ❌ Blurry or low-quality images
- ❌ Images with hands or tools visible
- ❌ Fruits or flowers (leaves only)
- ❌ Very dark or overexposed images

## API Endpoints

- `GET /health` - Backend health check
- `POST /analyze` - Analyze plant image

## Development

### Frontend Only
```bash
npm run dev:frontend
```

### Backend Only
```bash
npm run dev:backend
```

### Build for Production
```bash
npm run build
```

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Flask, TensorFlow/Keras, PIL
- **ML Model**: Custom trained plant health classifier
- **UI Components**: Radix UI, Lucide React

## Troubleshooting

1. **Backend not starting**: Ensure Python and pip are installed, run `npm run setup`
2. **Model not loading**: Verify `plant_health_classifier.h5` is in the root directory
3. **Analysis failing**: Check that the backend server is running on port 5000

---

## Original Lovable Project Info

**URL**: https://lovable.dev/projects/86b7e374-b0ca-41b0-94a4-45504c03fee4

This project was built with Vite, TypeScript, React, shadcn-ui, and Tailwind CSS.