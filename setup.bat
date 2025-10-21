@echo off
echo Setting up Plant Health Classifier...
echo.

echo Installing Node.js dependencies...
npm install
echo.

echo Installing Python dependencies...
cd backend
pip install -r requirements.txt
cd ..
echo.

echo Setup complete! You can now run 'npm run dev' to start both frontend and backend.
pause