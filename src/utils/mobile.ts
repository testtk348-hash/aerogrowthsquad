import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';

export const isMobile = () => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = () => {
  return Capacitor.getPlatform();
};

export const takePicture = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    return image.dataUrl;
  } catch (error) {
    console.error('Error taking picture:', error);
    throw error;
  }
};

export const selectFromGallery = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    return image.dataUrl;
  } catch (error) {
    console.error('Error selecting from gallery:', error);
    throw error;
  }
};

export const shareContent = async (title: string, text: string, url?: string) => {
  try {
    await Share.share({
      title,
      text,
      url,
    });
  } catch (error) {
    console.error('Error sharing content:', error);
    throw error;
  }
};

export const saveFile = async (data: string, fileName: string) => {
  try {
    // First try to save to Documents directory
    await Filesystem.writeFile({
      path: fileName,
      data: data,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    console.log(`File saved successfully to Documents/${fileName}`);
    return true;
  } catch (error) {
    console.error('Error saving file to Documents:', error);

    // Fallback: try External directory (Android Downloads)
    try {
      await Filesystem.writeFile({
        path: fileName,
        data: data,
        directory: Directory.External,
        encoding: Encoding.UTF8,
      });

      console.log(`File saved successfully to External/${fileName}`);
      return true;
    } catch (fallbackError) {
      console.error('Error saving file to External:', fallbackError);
      return false;
    }
  }
};

export const saveAndShareCSV = async (csvContent: string, fileName: string, title: string, description: string) => {
  try {
    // Save the file first
    const saved = await saveFile(csvContent, fileName);

    if (!saved) {
      throw new Error('Failed to save file');
    }

    // Get the file URI for sharing
    let fileUri: string;
    try {
      const fileInfo = await Filesystem.getUri({
        directory: Directory.Documents,
        path: fileName
      });
      fileUri = fileInfo.uri;
    } catch (error) {
      // Try External directory if Documents failed
      const fileInfo = await Filesystem.getUri({
        directory: Directory.External,
        path: fileName
      });
      fileUri = fileInfo.uri;
    }

    // Share the file
    await Share.share({
      title: title,
      text: description,
      url: fileUri,
    });

    return { success: true, message: 'CSV exported and shared successfully!' };
  } catch (error) {
    console.error('Error in saveAndShareCSV:', error);
    return { success: false, message: 'Failed to export CSV. Please try again.' };
  }
};

export const getNetworkStatus = async () => {
  try {
    const status = await Network.getStatus();
    return status;
  } catch (error) {
    console.error('Error getting network status:', error);
    return null;
  }
};

export const getDeviceInfo = async () => {
  try {
    const info = await Device.getInfo();
    return info;
  } catch (error) {
    console.error('Error getting device info:', error);
    return null;
  }
};

export const exportCSVMobile = async (csvContent: string, fileName: string, title: string, description: string) => {
  // Enhanced mobile detection
  const isMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 'opera mini'];
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      Capacitor.isNativePlatform();
  };

  // For web browsers (desktop), use traditional download
  if (!isMobileDevice()) {
    try {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { success: true, message: 'CSV downloaded successfully!' };
    } catch (error) {
      console.error('Desktop download failed:', error);
      return { success: false, message: 'Failed to download CSV file.' };
    }
  }

  // Mobile device handling - prioritize native Capacitor methods for APK
  if (Capacitor.isNativePlatform()) {
    try {
      // Method 1: Native Capacitor file save and share (most reliable for APK)
      const saved = await saveFile(csvContent, fileName);

      if (saved) {
        // Get the file URI for sharing
        let fileUri: string;
        try {
          const fileInfo = await Filesystem.getUri({
            directory: Directory.Documents,
            path: fileName
          });
          fileUri = fileInfo.uri;
        } catch (error) {
          // Try External directory if Documents failed
          const fileInfo = await Filesystem.getUri({
            directory: Directory.External,
            path: fileName
          });
          fileUri = fileInfo.uri;
        }

        // Share the file using Capacitor Share plugin
        await Share.share({
          title: title,
          text: description,
          url: fileUri,
        });

        return { success: true, message: 'CSV saved and shared successfully!' };
      }
    } catch (error) {
      console.error('Native Capacitor export failed:', error);
      // Continue to fallback methods
    }
  }

  // Fallback for mobile web browsers or if native methods fail
  try {
    // Method 2: Web Share API with File (modern mobile browsers)
    if (navigator.share && navigator.canShare) {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const file = new File([blob], fileName, { type: 'text/csv' });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title,
          text: description
        });
        return { success: true, message: 'CSV shared successfully!' };
      }
    }

    // Method 3: Direct download link (universal fallback)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    // Create a more reliable download trigger for mobile
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';

    // Add to DOM, trigger click, and clean up
    document.body.appendChild(link);

    // Use setTimeout to ensure the link is properly added to DOM
    setTimeout(() => {
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    }, 10);

    return { success: true, message: 'CSV download initiated!' };
  } catch (error) {
    console.error('All CSV export methods failed:', error);
    return { success: false, message: 'Failed to export CSV. Please try again or check app permissions.' };
  }
};

export const checkFilePermissions = async () => {
  if (!isMobile()) {
    return { granted: true, message: 'Web platform - no permissions needed' };
  }

  try {
    // Test write permission by attempting to write a small test file
    const testContent = 'test';
    const testFileName = 'permission_test.txt';

    await Filesystem.writeFile({
      path: testFileName,
      data: testContent,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    // Clean up test file
    try {
      await Filesystem.deleteFile({
        path: testFileName,
        directory: Directory.Documents,
      });
    } catch (cleanupError) {
      console.log('Test file cleanup failed (not critical):', cleanupError);
    }

    return { granted: true, message: 'File permissions are working' };
  } catch (error) {
    console.error('File permission check failed:', error);
    return { granted: false, message: 'File permissions may be restricted. Please check app settings.' };
  }
};