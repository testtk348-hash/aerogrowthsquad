@echo off
echo Building AeroGrowthSquad APK...
echo.

echo Step 1: Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build React app
    pause
    exit /b 1
)

echo.
echo Step 2: Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Error: Failed to sync with Capacitor
    pause
    exit /b 1
)

echo.
echo Step 3: Building Android APK...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo Error: Failed to build APK
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ APK built successfully!
echo Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.

echo You can install this APK on your Android device.
echo.
pause