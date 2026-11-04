/**
 * Image optimization utilities for responsive loading and Supabase transformations
 */

import type { SyntheticEvent } from "react";

/**
 * Generate optimized image URL with Supabase image transformations.
 * Rewrites /storage/v1/object/public/ URLs to the /storage/v1/render/image/public/
 * render endpoint so width/quality transforms are actually applied (the object
 * endpoint ignores transform query params and serves full-size originals).
 * @param url - Original image URL
 * @param width - Target width in pixels
 * @param quality - Image quality (1-100)
 */
export const getOptimizedImageUrl = (url: string, width: number, quality: number = 80): string => {
  if (!url) return url;

  const objectPath = "/storage/v1/object/public/";
  if (!url.includes("supabase.co") || !url.includes(objectPath)) return url;

  const base = url.split("?")[0];
  const renderUrl = base.replace(objectPath, "/storage/v1/render/image/public/");
  return `${renderUrl}?width=${width}&quality=${quality}&resize=contain`;
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
 * Build an <img> onError handler that falls back to the original (untransformed)
 * URL if the render endpoint fails. Runs at most once per element.
 * @param originalUrl - The original CMS image URL
 */
export const fallbackToOriginal = (originalUrl: string) => {
  return (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.dataset.fallback === "1") return;
    img.dataset.fallback = "1";
    img.removeAttribute("srcset");
    img.src = originalUrl;
  };
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

/**
 * Props that make an <img> fade in once loaded (pair with the "img-fade" class).
 * Handles images already complete from cache, and re-fades after an onError fallback.
 */
const markLoaded = (img: HTMLImageElement | null) => {
  if (img && img.complete && img.naturalWidth > 0) img.classList.add("is-loaded");
};

export const fadeInProps = {
  ref: markLoaded,
  onLoad: (event: SyntheticEvent<HTMLImageElement>) => event.currentTarget.classList.add("is-loaded"),
};
