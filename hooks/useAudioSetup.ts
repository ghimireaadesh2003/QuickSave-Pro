import { Audio } from "expo-av";
import { useEffect, useState } from "react";

/**
 * Sets up audio mode for the app
 */
export const setupAudioMode = async (): Promise<void> => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (e) {
    console.error("Failed to setup audio mode:", e);
  }
};

/**
 * Hook to setup audio mode on mount
 */
export const useAudioSetup = () => {
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    setupAudioMode().then(() => {
      setAudioReady(true);
    });
  }, []);

  return { audioReady };
};
