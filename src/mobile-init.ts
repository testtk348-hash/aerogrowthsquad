import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { preloadMLModel } from '@/utils/mlPreloader';

export const initializeMobileApp = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Hide splash screen with delay for smooth transition
      setTimeout(async () => {
        await SplashScreen.hide();
      }, 1000);

      // Set status bar style for mobile APK - fix green line issue
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#ffffff' }); // White background to match app
      await StatusBar.setOverlaysWebView({ overlay: false });

      // Add mobile-specific event listeners
      document.addEventListener('deviceready', () => {
        console.log('Device is ready');
      });

      // Handle back button on Android
      if (Capacitor.getPlatform() === 'android') {
        document.addEventListener('backbutton', (e) => {
          e.preventDefault();
          // Handle back button logic here
          if (window.history.length > 1) {
            window.history.back();
          } else {
            // Exit app or show confirmation
            if (confirm('Exit app?')) {
              (navigator as any).app?.exitApp();
            }
          }
        });
      }

      // Add mobile-specific CSS classes
      document.body.classList.add('mobile-app');
      document.body.classList.add(`platform-${Capacitor.getPlatform()}`);
      document.body.classList.add('mobile-scroll');
      
      // Prevent zoom on double tap
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);

      // Optimize for mobile performance
      if ('serviceWorker' in navigator) {
        // Register service worker for offline capabilities
        navigator.serviceWorker.register('/sw.js').catch(() => {
          console.log('Service worker registration failed');
        });
      }

      // Add or update viewport meta tag for optimal mobile experience
      let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no';
      
      // Add theme color meta tag
      let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
      if (!themeColor) {
        themeColor = document.createElement('meta');
        themeColor.name = 'theme-color';
        document.head.appendChild(themeColor);
      }
      themeColor.content = '#ffffff';

      // Preload ML model for offline analysis
      preloadMLModel();

      console.log('Mobile app initialized successfully');
    } catch (error) {
      console.error('Error initializing mobile app:', error);
    }
  }
};