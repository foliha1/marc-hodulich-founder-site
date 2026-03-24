/**
 * Image optimization utilities for responsive loading and Supabase transformations
 */

/**
 * Generate optimized image URL with Supabase transformations
 * @param url - Original image URL
 * @param width - Target width in pixels
 * @param quality - Image quality (1-100)
 */
export const getOptimizedImageUrl = (url: string, width: number, quality: number = 80): string => {
  if (!url) return url;
  
  // Only apply transformations to Supabase Storage URLs
  if (!url.includes('supabase.co')) return url;
  
  return `${url}?width=${width}&quality=${quality}`;
};

/**
 * Generate responsive image srcSet for multiple breakpoints
 * @param url - Original image URL
 * @param sizes - Array of widths for different breakpoints
 * @param quality - Image quality (1-100)
 */
export const getResponsiveSrcSet = (
  url: string, 
  sizes: number[] = [356, 640, 854, 1280],
  quality: number = 80
): string => {
  if (!url) return '';
  
  return sizes
    .map(width => `${getOptimizedImageUrl(url, width, quality)} ${width}w`)
    .join(', ');
};

/**
 * Extract image dimensions from file
 * @param file - Image file to measure
 * @returns Promise with width and height
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    
    img.src = objectUrl;
  });
};
