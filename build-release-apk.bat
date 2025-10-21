@echo off
echo Building AeroGrowthSquad Release APK...
echo.

echo Step 1: Building React app for production...
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
echo Step 3: Building Android Release APK...
cd android
call gradlew assembleRelease
if %errorlevel% neq 0 (
    echo Error: Failed to build release APK
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ Release APK built successfully!
echo Location: android\app\build\outputs\apk\release\app-release-unsigned.apk
echo.

echo Note: This is an unsigned APK. For distribution, you'll need to sign it.
echo.
pause