import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

export const useNavigationGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lastNavigationTime = useRef(0);
  const navigationHistory = useRef<string[]>([]);
  const rapidNavigationCount = useRef(0);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const now = Date.now();
    const currentPath = location.pathname;
    
    // Add current path to history
    navigationHistory.current.push(currentPath);
    
    // Keep only last 5 navigations
    if (navigationHistory.current.length > 5) {
      navigationHistory.current = navigationHistory.current.slice(-5);
    }
    
    // Check for rapid navigation (less than 500ms between navigations - more restrictive)
    if (now - lastNavigationTime.current < 500) {
      rapidNavigationCount.current++;
      
      // Increase threshold to 5 rapid navigations to be less aggressive
      if (rapidNavigationCount.current > 5) {
        console.warn('Excessive rapid navigation detected, showing warning only...');
        
        // Don't automatically redirect - just show warning
        // The UI will show a warning message but won't redirect
        
        // Reset counter after delay
        setTimeout(() => {
          rapidNavigationCount.current = 0;
        }, 2000);
      }
    } else {
      // Reset rapid navigation counter if enough time has passed
      rapidNavigationCount.current = 0;
    }
    
    lastNavigationTime.current = now;
  }, [location, navigate]);

  return {
    isRapidNavigation: rapidNavigationCount.current > 5
  };
};