// Centralized type definitions

export type VideoItem = {
  id: string;
  url: string;
  localUri?: string;
  progress: number;
  status: "downloading" | "completed" | "error";
  savedToDevice: boolean;
  format: "mp4" | "mp3";
  size?: number;
  duration?: number;
};

export type FormatType = "mp4" | "mp3";

export type HapticStyle = "light" | "medium" | "error";

export type ToastConfig = {
  message: string;
  duration?: number;
};
