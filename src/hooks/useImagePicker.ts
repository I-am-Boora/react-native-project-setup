// src/hooks/useImagePicker.ts

import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
  CameraOptions,
  Asset,
} from 'react-native-image-picker';

// Define the shape of a single image/video asset
export type PickerAsset = Asset;

// Define the return type of the hook
interface UseImagePicker {
  assets: PickerAsset[] | null;
  error: string | null;
  loading: boolean;
  clearAssets: () => void;
  pickImage: (type: 'camera' | 'gallery') => Promise<void>;
}

// Configuration options for the library (you can make this customizable)
const commonOptions = {
  mediaType: 'photo' as const, // Only allow photos for now
  includeBase64: false,
  maxHeight: 1024,
  maxWidth: 1024,
  quality: 0.8,
  // Custom text for Android permissions/alerts (iOS uses system defaults)
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const cameraOptions: CameraOptions = {
  ...commonOptions,
  cameraType: 'back', // Specify default camera
};

const galleryOptions: ImageLibraryOptions = {
  ...commonOptions,
  selectionLimit: 1, // Allow only one image selection
};

export const useImagePicker = (): UseImagePicker => {
  const [assets, setAssets] = useState<PickerAsset[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const clearAssets = useCallback(() => {
    setAssets(null);
    setError(null);
  }, []);

  const pickImage = useCallback(async (type: 'camera' | 'gallery') => {
    setLoading(true);
    setError(null);

    try {
      let result;
      if (type === 'camera') {
        result = await launchCamera(cameraOptions);
      } else {
        result = await launchImageLibrary(galleryOptions);
      }

      if (result.didCancel) {
        // User cancelled the operation
        setError('Image selection cancelled.');
      } else if (result.errorCode) {
        // Handle specific errors like 'camera_unavailable', 'permission', or 'others'
        const errorMessage = `Error code: ${result.errorCode}. Message: ${result.errorMessage}`;
        setError(errorMessage);
        console.error('Image Picker Error:', result.errorCode, result.errorMessage);

        // Optional: Provide better user feedback for permissions
        if (result.errorCode === 'permission' && Platform.OS === 'ios') {
            // For iOS, the user must go to settings manually.
            // Consider showing an alert here to guide the user.
        }
      } else if (result.assets && result.assets.length > 0) {
        // Success: set the selected assets
        setAssets(result.assets);
      } else {
        setError('No assets were selected.');
      }
    } catch (e) {
      console.error('Unexpected Image Picker Error:', e);
      setError('An unexpected error occurred during image selection.');
    } finally {
     setLoading(false); 
    }
  }, []);

  return { assets, error, loading, clearAssets, pickImage };
};