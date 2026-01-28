import { VideoItem } from "../types";

/**
 * Format duration from milliseconds to MM:SS format
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string (e.g., "3:45")
 */
export const formatDuration = (ms?: number): string => {
  if (!ms) return "";
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Format file size from bytes to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size (e.g., "3.5 MB")
 */
export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

/**
 * Get a clean display name from video item
 * Extracts filename from localUri or URL and decodes it
 * @param item - Video item
 * @returns Clean display name
 */
export const getDisplayName = (item: VideoItem): string => {
  // 1. If we have a localUri (downloaded file), extract and decode filename
  if (item.localUri) {
    const uri = item.localUri;
    const fileNameWithExt = uri.split("/").pop() || "";
    // Remove extension
    let nameWithoutExt = fileNameWithExt.replace(/\.[^/.]+$/, "");
    // Decode %20 and other URL-encoded characters (like %C3%A9 → é)
    try {
      nameWithoutExt = decodeURIComponent(nameWithoutExt);
    } catch (e) {
      // If decoding fails, keep as-is (rare)
    }
    return nameWithoutExt || "Media";
  }

  // 2. Fallback: extract from URL (no decoding needed here for YouTube)
  const lastPart = item.url.split("/").pop() || "Media";
  const cleanPart = lastPart.split("?")[0].split("&")[0];
  return cleanPart.replace(/\.[^/.]+$/, "") || "Media";
};
