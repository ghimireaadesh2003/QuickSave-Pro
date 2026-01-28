import * as FileSystem from "expo-file-system/legacy";
import { VideoItem } from "../types";
import { BACKEND_URL } from "./constants";

/**
 * Extracts filename from Content-Disposition header
 */
export const getFilenameFromContentDisposition = (
  header: string | null,
): string | null => {
  if (!header) return null;
  const match = /filename="?(.+?)"?(\s*;|$)/i.exec(header);
  return match ? match[1] : null;
};

/**
 * Removes hash characters from filename
 */
export const removeHashFromFilename = (name: string): string => {
  return name.replace(/#/g, "");
};

/**
 * Extracts video duration from response headers
 */
export const extractDurationFromHeaders = (
  headers: Headers,
): number | undefined => {
  try {
    const durationStr = headers.get("X-Video-Duration");
    if (durationStr) {
      const parsed = parseFloat(durationStr);
      return isNaN(parsed) ? undefined : parsed * 1000; // Convert to ms
    }
  } catch (e) {
    console.warn("Failed to parse duration:", e);
  }
  return undefined;
};

/**
 * Progress callback type
 */
export type ProgressCallback = (progress: number) => void;

/**
 * Completion callback type
 */
export type CompletionCallback = (result: {
  localUri: string;
  size?: number;
  duration?: number;
}) => void;

/**
 * Error callback type
 */
export type ErrorCallback = (error: any) => void;

/**
 * Downloads a video file with progress tracking
 */
export const downloadFile = async (
  video: VideoItem,
  onProgress: ProgressCallback,
  onComplete: CompletionCallback,
  onError: ErrorCallback,
): Promise<void> => {
  const safeUrl = encodeURIComponent(video.url);
  const downloadUrl = `${BACKEND_URL}/api/download?url=${safeUrl}&format=${video.format}`;

  // Determine filename from backend headers
  let filename: string;
  let duration: number | undefined;
  let size: number | undefined;

  try {
    const headResponse = await fetch(downloadUrl, { method: "HEAD" });
    const contentDisposition = headResponse.headers.get("Content-Disposition");
    const parsedFilename =
      getFilenameFromContentDisposition(contentDisposition);

    filename = removeHashFromFilename(
      parsedFilename ?? `${video.format}_${video.id}.${video.format}`,
    );

    // Extract duration from headers
    duration = extractDurationFromHeaders(headResponse.headers);

    // Get content length for size
    const contentLength = headResponse.headers.get("Content-Length");
    if (contentLength) {
      size = parseInt(contentLength, 10);
    }

    console.log("Download headers:", headResponse.headers);
    console.log("Content-Disposition:", contentDisposition);
  } catch (e) {
    console.warn("Failed to fetch filename from headers, using default:", e);
    filename = `${video.format}_${video.id}.${video.format}`;
  }

  const localUri = `${FileSystem.documentDirectory}${filename}`;
  let lastUpdateTime = 0;
  const UPDATE_THROTTLE_MS = 100;

  try {
    const resumable = FileSystem.createDownloadResumable(
      downloadUrl,
      localUri,
      {},
      (p) => {
        const now = Date.now();
        const totalBytes = p.totalBytesExpectedToWrite || 1;
        if (totalBytes <= 0) return;

        const pct = Math.min(Math.max(p.totalBytesWritten / totalBytes, 0), 1);

        if (now - lastUpdateTime >= UPDATE_THROTTLE_MS || pct >= 0.99) {
          lastUpdateTime = now;
          onProgress(Math.round(pct * 100) / 100);
        }
      },
    );

    const result = await resumable.downloadAsync();
    if (!result) {
      throw new Error("Download failed: no result");
    }

    // If size wasn't in headers, get it from file info
    if (!size) {
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (fileInfo.exists && "size" in fileInfo) {
        size = fileInfo.size;
      }
    }

    onComplete({
      localUri: result.uri,
      size,
      duration,
    });
  } catch (error) {
    console.error("Download error:", error);
    onError(error);
  }
};
