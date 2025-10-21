# AeroGrowthSquad Mobile App Build Guide

This guide explains how to build the AeroGrowthSquad React web application into an Android APK.

## Prerequisites

### Required Software:
1. **Node.js** (v16 or higher) - Already installed
2. **Android Studio** - Download from https://developer.android.com/studio
3. **Java Development Kit (JDK)** - JDK 11 or higher
4. **Android SDK** - Installed via Android Studio

### Android Studio Setup:
1. Install Android Studio
2. Open Android Studio and install the Android SDK
3. Set up an Android Virtual Device (AVD) for testing
4. Add Android SDK to your PATH environment variable

## Build Process

### Option 1: Quick Build (Debug APK)
```bash
# Run the automated build script
build-apk.bat
```

### Option 2: Manual Build Steps
```bash
# 1. Build the React app
npm run build

# 2. Sync with Capacitor
npx cap sync android

# 3. Build the APK
cd android
gradlew assembleDebug
```

### Option 3: Release Build (Production APK)
```bash
# Run the release build script
build-release-apk.bat
```

## APK Locations

- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## Mobile Features

### Enhanced Mobile Functionality:
- **Native Camera**: Take photos directly from the app
- **Gallery Access**: Select images from device gallery
- **File Sharing**: Native sharing capabilities for CSV exports
- **Offline Support**: Basic offline functionality
- **Mobile-Optimized UI**: Touch-friendly interface

### App Permissions:
- **Camera**: For taking plant photos in pest monitoring
- **Storage**: For saving CSV exports and images
- **Internet**: For ML model analysis and data sync
- **Network State**: For connectivity checking

### Mobile-Specific Features:
- **Splash Screen**: Custom AeroGrowthSquad splash screen
- **Status Bar**: Branded status bar with app colors
- **Back Button**: Proper Android back button handling
- **Safe Area**: Handles device notches and safe areas

## Testing

### On Device:
1. Enable "Developer Options" on your Android device
2. Enable "USB Debugging"
3. Connect device via USB
4. Install the APK: `adb install android/app/build/outputs/apk/debug/app-debug.apk`

### On Emulator:
1. Start Android Studio
2. Open AVD Manager
3. Start an Android emulator
4. Drag and drop the APK file onto the emulator

## Troubleshooting

### Common Issues:

1. **Gradle Build Failed**:
   - Ensure Android Studio is properly installed
   - Check that ANDROID_HOME environment variable is set
   - Update Android SDK tools

2. **Camera Not Working**:
   - Check camera permissions in device settings
   - Ensure camera hardware is available

3. **Network Issues**:
   - Check internet connectivity
   - Ensure backend server is accessible from mobile network

4. **APK Installation Failed**:
   - Enable "Install from Unknown Sources" in device settings
   - Check APK file integrity

## App Configuration

The app is configured with:
- **App ID**: com.aerogrowthsquad.app
- **App Name**: AeroGrowthSquad
- **Version**: 1.0.0
- **Target SDK**: Latest Android SDK

## Features Working in APK:

✅ **Authentication**: Login with demo credentials
✅ **Dashboard**: Real-time metrics and monitoring
✅ **Pest Monitoring**: ML-powered plant health analysis
✅ **Camera Integration**: Native camera for plant photos
✅ **CSV Export**: Mobile-optimized data export
✅ **Blog**: Full blog functionality with images
✅ **Contact Form**: Complete contact form with validation
✅ **Consultation**: Service information and details
✅ **Responsive Design**: Optimized for mobile screens
✅ **Offline Capabilities**: Basic offline functionality

## Next Steps

1. Test the APK on various Android devices
2. Optimize performance for different screen sizes
3. Add app signing for Play Store distribution
4. Implement push notifications (if needed)
5. Add app analytics and crash reporting

## Support

For build issues or questions, contact the development team at aerogrowthsquad@gmail.com