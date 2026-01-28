import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";

/**
 * Deletes a video file from the file system
 */
export const deleteVideoFile = async (localUri: string): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(localUri, { idempotent: true });
    }
  } catch (e) {
    console.error("Error deleting file:", e);
    throw e;
  }
};

/**
 * Saves a video to the device gallery
 */
export const saveVideoToGallery = async (
  localUri: string,
  format: "mp4" | "mp3",
): Promise<void> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Cannot save to gallery");
      throw new Error("Permission denied");
    }

    // For MP3 on iOS, use sharing instead
    if (format === "mp3" && Platform.OS === "ios") {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(localUri, {
          mimeType: "audio/mpeg",
          dialogTitle: "Save MP3",
          UTI: "public.mp3",
        });
        return;
      } else {
        throw new Error("Sharing not available");
      }
    }

    // For MP4 or Android MP3, save to media library
    await MediaLibrary.createAssetAsync(localUri);
  } catch (e) {
    console.error("Error saving to gallery:", e);
    throw e;
  }
};

/**
 * Verifies if a file exists at the given URI
 */
export const verifyFileExists = async (
  localUri: string,
): Promise<boolean> => {
  try {
    const info = await FileSystem.getInfoAsync(localUri);
    return info.exists;
  } catch (e) {
    console.error("Error verifying file:", e);
    return false;
  }
};

/**
 * Shares a video file
 */
export const shareVideo = async (localUri: string): Promise<void> => {
  try {
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert("Sharing not available", "Cannot share on this device");
      return;
    }

    await Sharing.shareAsync(localUri);
  } catch (e) {
    console.error("Error sharing file:", e);
    throw e;
  }
};
