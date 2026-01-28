import { Audio } from "expo-av";
import { VideoView, useVideoPlayer } from "expo-video";
import { X } from "lucide-react-native";
import React, { useEffect } from "react";
import { Modal, Platform, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../utils/constants";

type VideoPlayerProps = {
  videoUri: string | null;
  onClose: () => void;
};

/**
 * Full-screen video player modal
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUri,
  onClose,
}) => {
  const videoPlayer = useVideoPlayer(videoUri || "", (player) => {
    player.loop = false;
    player.volume = 1.0;
    player.muted = false;
    player.audioMixingMode = "mixWithOthers";
  });

  useEffect(() => {
    if (videoUri) {
      (async () => {
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
            interruptionModeIOS: 2,
            interruptionModeAndroid: 1,
          });
        } catch (e) {
          console.warn("Audio mode setup error:", e);
        }
      })();
    }
  }, [videoUri]);

  useEffect(() => {
    if (videoUri && videoPlayer) {
      videoPlayer.replace(videoUri);
      videoPlayer.play();
    }
  }, [videoUri, videoPlayer]);

  const handleClose = async () => {
    if (videoPlayer) {
      videoPlayer.pause();
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (e) {
      console.warn("Audio mode reset error:", e);
    }

    onClose();
  };

  if (!videoUri) return null;

  return (
    <Modal visible={!!videoUri} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={handleClose}
            style={{
              position: "absolute",
              top: Platform.OS === "ios" ? 60 : 20,
              right: 20,
              zIndex: 10,
              backgroundColor: "rgba(0,0,0,0.7)",
              borderRadius: 20,
              padding: 8,
            }}
          >
            <X size={24} color={COLORS.textPrimary} />
          </Pressable>

          <VideoView
            player={videoPlayer}
            style={{ flex: 1 }}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
