import { Capacitor } from '@capacitor/core';

export const isMobileDevice = (): boolean => {
  // If running in Capacitor, always consider it mobile unless in tablet landscape
  if (Capacitor.isNativePlatform()) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Only show desktop layout on tablets in landscape mode
    const isTabletLandscape = screenWidth >= 1024 && screenWidth > screenHeight;
    return !isTabletLandscape;
  }
  
  // For web browsers, use standard detection
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 'opera mini'];
  const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));
  
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 1024;
  
  return isMobileUserAgent || (hasTouch && isSmallScreen);
};

export const shouldUseMobileLayout = (): boolean => {
  return isMobileDevice() || window.innerWidth < 1024;
};

export const forceMenuVisibility = (): void => {
  if (Capacitor.isNativePlatform()) {
    // Force mobile menu button visibility
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    if (mobileMenuButton) {
      (mobileMenuButton as HTMLElement).style.display = 'flex !important';
      (mobileMenuButton as HTMLElement).style.visibility = 'visible !important';
      (mobileMenuButton as HTMLElement).style.opacity = '1 !important';
    }
    
    // Hide desktop navigation
    const desktopNav = document.querySelector('nav:not(.mobile-menu-panel nav)');
    if (desktopNav) {
      (desktopNav as HTMLElement).style.display = 'none !important';
    }
  }
};

export const preventAccidentalNavigation = (): void => {
  if (Capacitor.isNativePlatform()) {
    // Add event listener to prevent accidental navigation on empty areas only
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Skip all prevention if CSV export is active
      if (document.body.classList.contains('csv-export-active')) {
        console.log('CSV export active - allowing all clicks');
        return;
      }
      
      // Always allow clicks on interactive elements - comprehensive list
      const isInteractive = target.closest(`
        button, 
        a, 
        input, 
        textarea, 
        select, 
        [role="button"], 
        [role="menuitem"],
        [role="option"],
        [tabindex], 
        .card, 
        .modal, 
        nav, 
        [onclick], 
        .mobile-menu-button,
        [data-radix-dropdown-trigger],
        [data-radix-dropdown-content],
        [data-radix-dropdown-item],
        [data-radix-select-trigger],
        [data-radix-select-content],
        [data-radix-select-item],
        [data-radix-dialog-trigger],
        [data-radix-dialog-content],
        [data-state],
        [data-interactive],
        [data-csv-export],
        [data-csv-menu],
        [data-csv-item],
        .dropdown-menu,
        .select-content,
        .select-item,
        .dropdown-item,
        .csv-export-button,
        .csv-export-menu,
        .csv-export-item
      `.replace(/\s+/g, ' ').trim());
      
      if (isInteractive) {
        console.log('Interactive element clicked - allowing');
        return; // Let the click proceed normally
      }
      
      // Also check if the target itself has interactive classes or attributes
      const hasInteractiveClass = target.classList.contains('mobile-menu-button') || 
                                  target.classList.contains('csv-export-button') ||
                                  target.classList.contains('csv-export-item') ||
                                  target.closest('.mobile-menu-button') ||
                                  target.closest('.csv-export-button') ||
                                  target.closest('.csv-export-menu') ||
                                  target.closest('.csv-export-item') ||
                                  target.tagName === 'BUTTON' ||
                                  target.tagName === 'A' ||
                                  target.hasAttribute('data-radix-dropdown-trigger') ||
                                  target.hasAttribute('data-radix-dropdown-item') ||
                                  target.hasAttribute('data-radix-select-trigger') ||
                                  target.hasAttribute('data-radix-select-item') ||
                                  target.hasAttribute('data-state') ||
                                  target.hasAttribute('data-interactive') ||
                                  target.hasAttribute('data-csv-export') ||
                                  target.hasAttribute('data-csv-menu') ||
                                  target.hasAttribute('data-csv-item') ||
                                  target.getAttribute('role') === 'button' ||
                                  target.getAttribute('role') === 'menuitem' ||
                                  target.getAttribute('role') === 'option';
      
      if (hasInteractiveClass) {
        console.log('Interactive class detected - allowing');
        return; // Let the click proceed normally
      }
      
      // Check if click is inside any dropdown or select component
      const isInsideDropdown = target.closest('[data-radix-dropdown-content]') ||
                              target.closest('[data-radix-select-content]') ||
                              target.closest('[data-csv-menu]') ||
                              target.closest('.dropdown-menu') ||
                              target.closest('.select-content') ||
                              target.closest('.csv-export-menu');
      
      if (isInsideDropdown) {
        console.log('Inside dropdown - allowing');
        return; // Let the click proceed normally
      }
      
      // Only check for double-clicks on truly empty areas
      const isEmptyArea = target.tagName === 'BODY' || 
                         target.tagName === 'MAIN' ||
                         (target.tagName === 'DIV' && 
                          !target.className.includes('card') &&
                          !target.className.includes('button') &&
                          !target.className.includes('interactive') &&
                          !target.className.includes('content') &&
                          !target.className.includes('container') &&
                          !target.className.includes('flex') &&
                          !target.className.includes('grid') &&
                          !target.className.includes('dropdown') &&
                          !target.className.includes('select') &&
                          !target.className.includes('menu'));
      
      // Only prevent double-clicks on truly empty areas
      if (isEmptyArea) {
        const now = Date.now();
        const lastClick = parseInt(target.dataset.lastClick || '0');
        
        if (now - lastClick < 300) {
          event.preventDefault();
          event.stopPropagation();
          console.log('Prevented double-tap navigation on empty area');
          return false;
        }
        
        target.dataset.lastClick = now.toString();
      }
    }, false); // Use capture: false to let events bubble normally
  }
};