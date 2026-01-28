import AsyncStorage from "@react-native-async-storage/async-storage";
import { VideoItem } from "../types";
import { STORAGE_KEYS } from "./constants";

/**
 * Loads videos from AsyncStorage
 */
export const loadVideos = async (): Promise<VideoItem[]> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.videos);
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  } catch (e) {
    console.error("Failed to load videos:", e);
    return [];
  }
};

/**
 * Saves videos to AsyncStorage
 */
export const saveVideos = async (videos: VideoItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.videos, JSON.stringify(videos));
  } catch (e) {
    console.error("Failed to save videos:", e);
    throw e;
  }
};

/**
 * Loads save preference from AsyncStorage
 */
export const loadSavePreference = async (): Promise<boolean> => {
  try {
    const pref = await AsyncStorage.getItem(STORAGE_KEYS.savePreference);
    if (pref !== null) {
      return pref === "true";
    }
    return true; // Default to true
  } catch (e) {
    console.error("Failed to load save preference:", e);
    return true;
  }
};

/**
 * Saves save preference to AsyncStorage
 */
export const saveSavePreference = async (value: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.savePreference, value.toString());
  } catch (e) {
    console.error("Failed to save preference:", e);
    throw e;
  }
};
