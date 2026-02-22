import { useState, useCallback } from 'react';

interface UseImageUploadReturn {
  image: string | null;
  isUploading: boolean;
  error: string | null;
  uploadImage: (file: File) => Promise<string | null>;
  clearImage: () => void;
  setImageUrl: (url: string) => void;
}

// Convert file to base64 for storage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Validate image file
const validateImageFile = (file: File): string | null => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    return 'Please upload a valid image file (JPEG, PNG, WebP, or SVG)';
  }
  if (file.size > 5 * 1024 * 1024) {
    return 'Image size must be less than 5MB';
  }
  return null;
};

export function useImageUpload(): UseImageUploadReturn {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    setError(null);
    
    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return null;
    }

    setIsUploading(true);
    
    try {
      const base64 = await fileToBase64(file);
      setImage(base64);
      return base64;
    } catch (err) {
      setError('Failed to process image. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const clearImage = useCallback(() => {
    setImage(null);
    setError(null);
  }, []);

  const setImageUrl = useCallback((url: string) => {
    setImage(url);
    setError(null);
  }, []);

  return {
    image,
    isUploading,
    error,
    uploadImage,
    clearImage,
    setImageUrl
  };
}
