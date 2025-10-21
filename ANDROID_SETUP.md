# Android Development Setup Guide

To build the AeroGrowthSquad app into an APK, you need to set up Android development environment.

## Step 1: Install Android Studio

1. Download Android Studio from: https://developer.android.com/studio
2. Install Android Studio with default settings
3. Launch Android Studio and complete the setup wizard
4. Install the latest Android SDK (API level 33 or higher)

## Step 2: Set Environment Variables

### Windows:
1. Open System Properties → Advanced → Environment Variables
2. Add new system variable:
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`
3. Add to PATH:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

### Verify Installation:
```bash
# Check if Android SDK is properly installed
adb version
```

## Step 3: Build the APK

Once Android Studio is set up:

```bash
# Option 1: Use the automated script
build-apk.bat

# Option 2: Manual build
npm run build:mobile
cd android
gradlew assembleDebug
```

## Step 4: Install APK

The APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### Install on Device:
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run: `adb install android/app/build/outputs/apk/debug/app-debug.apk`

### Install on Emulator:
1. Start Android emulator from Android Studio
2. Drag and drop the APK file onto the emulator

## App Features in APK

All web features are fully functional in the mobile app:

✅ **Authentication System**
- Login with demo credentials
- Session persistence
- Secure logout

✅ **Dashboard & Metrics**
- Real-time data visualization
- Interactive charts and graphs
- Mobile-optimized CSV export

✅ **Pest Monitoring**
- Native camera integration
- Gallery image selection
- ML-powered plant analysis
- Mobile-optimized UI

✅ **Blog & Content**
- Full blog functionality
- Image galleries
- Responsive reading experience

✅ **Contact & Consultation**
- Complete contact forms
- Service information
- Mobile-friendly layouts

✅ **Mobile Optimizations**
- Touch-friendly interface
- Native mobile features
- Offline capabilities
- Performance optimizations

## Troubleshooting

### Common Issues:

1. **"SDK location not found"**:
   - Install Android Studio
   - Set ANDROID_HOME environment variable
   - Restart command prompt/terminal

2. **"gradlew command not found"**:
   - Ensure you're in the android directory
   - Use `.\gradlew` on Windows

3. **Build fails with dependency errors**:
   - Update Android SDK tools
   - Clean and rebuild: `gradlew clean assembleDebug`

4. **APK won't install**:
   - Enable "Install from Unknown Sources"
   - Check device compatibility (Android 7.0+)

## Next Steps

After successful APK build:
1. Test all features on physical device
2. Optimize performance for mobile
3. Add app signing for distribution
4. Submit to Google Play Store (optional)

For support, contact: aerogrowthsquad@gmail.com