import { toast as sonnerToast } from "sonner";
import { isMobile } from "./mobile";
import { Capacitor } from '@capacitor/core';

// Mobile-optimized toast configuration
const getMobileToastConfig = () => {
  const mobile = isMobile();
  const isNativeApp = Capacitor.isNativePlatform();
  
  return {
    duration: mobile ? 3000 : 4000, // Optimal duration on mobile
    position: mobile ? 'top-center' as const : 'bottom-right' as const, // Top center for mobile
    style: mobile ? {
      fontSize: '14px',
      padding: '12px 16px',
      maxWidth: '90vw',
      margin: '0 auto',
      borderRadius: '12px',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      color: '#1f2937',
    } : undefined,
    className: mobile ? 'mobile-toast-optimized' : undefined,
    // Custom positioning for mobile to avoid header overlap
    ...(mobile && isNativeApp ? {
      style: {
        fontSize: '14px',
        padding: '12px 16px',
        maxWidth: '90vw',
        margin: '0 auto',
        borderRadius: '12px',
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        color: '#1f2937',
        position: 'fixed',
        top: '80px', // Below header and status bar
        left: '50%',
        transform: 'translateX(-50%)',
      }
    } : {})
  };
};

export const toast = {
  success: (message: string, options?: any) => {
    // Silent - no notifications
    console.log('Success:', message);
  },
  
  error: (message: string, options?: any) => {
    // Silent - no notifications
    console.log('Error:', message);
  },
  
  info: (message: string, options?: any) => {
    // Silent - no notifications
    console.log('Info:', message);
  },
  
  warning: (message: string, options?: any) => {
    // Silent - no notifications
    console.log('Warning:', message);
  },
};