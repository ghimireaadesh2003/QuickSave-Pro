import * as MediaLibrary from "expo-media-library";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Types
import { FormatType, VideoItem } from "../types";

// Utilities
import { downloadFile } from "../utils/downloadManager";
import {
  deleteVideoFile,
  saveVideoToGallery,
  verifyFileExists,
} from "../utils/fileOperations";
import {
  loadSavePreference,
  loadVideos,
  saveSavePreference,
  saveVideos,
} from "../utils/storageManager";

// Hooks
import { useToast } from "@/hooks/useToast";
import { useAudioSetup } from "../hooks/useAudioSetup";

type DownloadContextType = {
  videos: VideoItem[];
  saveToDevice: boolean;
  setSaveToDevice: (v: boolean) => void;
  addVideoAndStartDownload: (url: string, format: FormatType) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  saveVideoToDevice: (id: string) => Promise<void>;
  retryDownload: (id: string) => Promise<void>;
  updateResumePosition: (id: string, pos: number) => void;
};

const DownloadContext = createContext<DownloadContextType | null>(null);

export function DownloadProvider({ children }: { children: ReactNode }) {
  const { showToast, toastMessage, toastOpacity, displayToast } = useToast();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [saveToDevice, setSaveToDevice] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Setup audio mode
  useAudioSetup();

  // ------------------------
  // Initialization
  // ------------------------
  useEffect(() => {
    (async () => {
      try {
        // Request permissions
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          displayToast(
            "Permission Required: Media library access is needed to save downloads.",
          );
          // Alert.alert(
          //   "Permission Required",
          //   "Media library access is needed to save downloads.",
          // );
        }

        // Load saved videos
        const loadedVideos = await loadVideos();

        // Verify files still exist
        const verifiedVideos = await Promise.all(
          loadedVideos.map(async (v) => {
            if (v.localUri && v.status === "completed") {
              const exists = await verifyFileExists(v.localUri);
              return exists ? v : { ...v, status: "error" as const };
            }
            return v.status === "downloading"
              ? { ...v, status: "error" as const }
              : v;
          }),
        );

        setVideos(verifiedVideos);

        // Load save preference
        const pref = await loadSavePreference();
        setSaveToDevice(pref);

        setIsInitialized(true);
      } catch (e) {
        console.error("Initialization error:", e);
        setIsInitialized(true);
      }
    })();
  }, []);

  // ------------------------
  // Auto-save on changes
  // ------------------------
  useEffect(() => {
    if (isInitialized) {
      saveVideos(videos).catch((e) =>
        console.error("Failed to save videos:", e),
      );
      saveSavePreference(saveToDevice);
    }
  }, [videos, saveToDevice, isInitialized]);

  // ------------------------
  // Helper: Update video
  // ------------------------
  const updateVideo = (id: string, updates: Partial<VideoItem>) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    );
  };

  // ------------------------
  // Update resume position
  // ------------------------
  const updateResumePosition = (id: string, pos: number) => {
    updateVideo(id, { resumePosition: pos });
  };

  // ------------------------
  // Add video & start download
  // ------------------------
  const addVideoAndStartDownload = useCallback(
    async (url: string, format: FormatType) => {
      const { granted } = await MediaLibrary.requestPermissionsAsync();
      if (!granted) {
        displayToast(
          "Permission denied: Cannot download without media library access.",
        );
        // Alert.alert(
        //   "Permission denied",
        //   "Cannot download without media library access.",
        // );
        return;
      }

      const newVideo: VideoItem = {
        id: Date.now().toString(),
        url,
        format,
        progress: 0,
        status: "downloading",
        savedToDevice: false,
      };

      setVideos((prev) => [newVideo, ...prev]);

      // Start download
      await downloadFile(
        newVideo,
        (progress) => {
          updateVideo(newVideo.id, { progress });
        },
        async (result) => {
          // Auto-save to gallery if enabled
          let saved = false;
          if (saveToDevice) {
            try {
              await saveVideoToGallery(result.localUri, format);
              saved = true;
            } catch (e) {
              console.warn("Failed to save to gallery:", e);
            }
          }

          updateVideo(newVideo.id, {
            progress: 1,
            localUri: result.localUri,
            status: "completed",
            savedToDevice: saved,
            size: result.size,
            duration: result.duration,
          });

          console.log(`🎉 Download completed: ${result.localUri}`);
        },
        (error) => {
          console.error("Download error:", error);
          updateVideo(newVideo.id, { status: "error", progress: 0 });
        },
      );
    },
    [saveToDevice],
  );

  // ------------------------
  // Delete video
  // ------------------------
  const deleteVideo = useCallback(
    async (id: string) => {
      const video = videos.find((v) => v.id === id);
      if (!video) return;

      if (video.localUri) {
        try {
          await deleteVideoFile(video.localUri);
        } catch (e) {
          console.error("Failed to delete file:", e);
        }
      }

      setVideos((prev) => prev.filter((v) => v.id !== id));
    },
    [videos],
  );

  // ------------------------
  // Save to device
  // ------------------------
  const saveVideoToDevice = useCallback(
    async (id: string) => {
      const video = videos.find((v) => v.id === id);
      if (!video?.localUri || video.savedToDevice) return;

      try {
        await saveVideoToGallery(video.localUri, video.format);
        updateVideo(id, { savedToDevice: true });
        displayToast("Success: Saved to gallery!");
        // Alert.alert("Success", "Saved to gallery!");
      } catch (e) {
        displayToast("Error: Failed to save to gallery");
        // Alert.alert("Error", "Failed to save to gallery");
      }
    },
    [videos],
  );

  // ------------------------
  // Retry download
  // ------------------------
  const retryDownload = useCallback(
    async (id: string) => {
      const video = videos.find((v) => v.id === id);
      if (!video) return;

      updateVideo(id, { status: "downloading", progress: 0 });

      await downloadFile(
        video,
        (progress) => {
          updateVideo(id, { progress });
        },
        async (result) => {
          let saved = false;
          if (saveToDevice) {
            try {
              await saveVideoToGallery(result.localUri, video.format);
              saved = true;
            } catch (e) {
              console.warn("Failed to save to gallery:", e);
            }
          }

          updateVideo(id, {
            progress: 1,
            localUri: result.localUri,
            status: "completed",
            savedToDevice: saved,
            size: result.size,
            duration: result.duration,
          });
        },
        (error) => {
          console.error("Retry download error:", error);
          updateVideo(id, { status: "error", progress: 0 });
        },
      );
    },
    [videos, saveToDevice],
  );

  return (
    <DownloadContext.Provider
      value={{
        videos,
        saveToDevice,
        setSaveToDevice,
        addVideoAndStartDownload,
        deleteVideo,
        saveVideoToDevice,
        retryDownload,
        updateResumePosition,
      }}
    >
      {children}
    </DownloadContext.Provider>
  );
}

export function useDownloads() {
  const ctx = useContext(DownloadContext);
  if (!ctx) {
    throw new Error("useDownloads must be used within DownloadProvider");
  }
  return ctx;
}
