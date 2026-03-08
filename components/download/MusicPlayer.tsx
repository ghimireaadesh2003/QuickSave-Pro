import { Slider } from "@miblanchard/react-native-slider";
import { useAudioPlayerStatus } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import {
  Heart,
  List,
  Music,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDownloads } from "../../context/DownloadContext";
import { VideoItem } from "../../types";
import { formatDuration, getDisplayName } from "../../utils/formatters";

const { width } = Dimensions.get("window");

type MusicPlayerProps = {
  playlist: VideoItem[];
};

/**
 * Advanced full-screen music player with playlist and background support
 */
export const MusicPlayer: React.FC<MusicPlayerProps> = ({ playlist }) => {
  const {
    activeMusicItem: activeItem,
    isPlayerVisible,
    setIsPlayerVisible,
    setActiveMusicItem,
    audioPlayer,
  } = useDownloads();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const hasStartedPlayback = useRef(false);
  const lastAdvancedId = useRef<string | null>(null);
  const mediaUri = activeItem?.localUri || "";

  const audioStatus = useAudioPlayerStatus(audioPlayer);

  // Removed automatic effect-based synchronization to prevent infinite loops.
  // Updates are now handled discretely in navigation functions.

  // Sync index and reset playback flag if item changes
  useEffect(() => {
    if (activeItem) {
      const index = playlist.findIndex((v) => v.id === activeItem.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
      // Reset playback flag and arm the lock for the new track
      hasStartedPlayback.current = false;
      lastAdvancedId.current = activeItem.id;
    }
  }, [activeItem?.id, playlist]);

  // Sync play state with audio status
  useEffect(() => {
    setIsPlaying(audioStatus.playing);
  }, [audioStatus.playing]);

  // Update volume when changed
  useEffect(() => {
    if (audioPlayer) {
      audioPlayer.volume = volume;
    }
  }, [volume, audioPlayer]);

  // Auto-play when track loads/changes
  useEffect(() => {
    try {
      if (activeItem && audioPlayer && mediaUri && isPlayerVisible) {
        // Only trigger if we haven't started or if we're not playing
        if (!audioStatus.playing && !hasStartedPlayback.current) {
          audioPlayer.play();
          hasStartedPlayback.current = true;
        }
      }
    } catch (e) {
      console.warn("Autoplay safety guard triggered:", e);
    }
  }, [mediaUri, audioPlayer, activeItem, isPlayerVisible, audioStatus.playing]);

  const handleNext = useCallback(() => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextItem = playlist[nextIndex];
      setCurrentIndex(nextIndex);
      if (nextItem) {
        setActiveMusicItem(nextItem);
      }
    }
  }, [currentIndex, playlist, setActiveMusicItem]);

  const handlePrevious = useCallback(() => {
    if (audioStatus.currentTime > 3) {
      try {
        audioPlayer.seekTo(0);
      } catch {}
    } else if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevItem = playlist[prevIndex];
      setCurrentIndex(prevIndex);
      if (prevItem) {
        setActiveMusicItem(prevItem);
      }
    }
  }, [
    currentIndex,
    audioStatus.currentTime,
    audioPlayer,
    playlist,
    setActiveMusicItem,
  ]);

  // Auto-advance to next track when current finishes
  useEffect(() => {
    try {
      if (
        audioStatus.isLoaded &&
        audioStatus.duration > 0 &&
        audioStatus.playing
      ) {
        const remaining = audioStatus.duration - audioStatus.currentTime;
        // Use a wider threshold (1s) to avoid race conditions
        if (remaining < 1.0 && remaining > 0) {
          if (activeItem && lastAdvancedId.current !== activeItem.id) {
            lastAdvancedId.current = activeItem.id; // LOCK
            if (isLooping) {
              audioPlayer.seekTo(0);
              audioPlayer.play();
            } else if (currentIndex < playlist.length - 1) {
              handleNext();
            }
          }
        } else if (audioStatus.currentTime > 2.0 && lastAdvancedId.current !== null) {
          // Unlock once track has successfully progressed
          lastAdvancedId.current = null;
        }
      }
    } catch (e) {
      console.warn("Auto-advance safety guard triggered:", e);
    }
  }, [
    audioStatus.currentTime,
    audioStatus.duration,
    audioStatus.isLoaded,
    audioStatus.playing,
    isLooping,
    currentIndex,
    playlist.length,
    audioPlayer,
    handleNext,
    activeItem?.id,
  ]);

  const togglePlayback = useCallback(() => {
    try {
      if (audioPlayer.playing) {
        audioPlayer.pause();
      } else {
        hasStartedPlayback.current = true;
        audioPlayer.play();
      }
    } catch (e) {
      console.warn("Toggle playback safety guard triggered:", e);
    }
  }, [audioPlayer]);

  const handleClose = () => {
    setIsPlayerVisible(false);
  };

  const progress =
    activeItem && audioStatus.duration > 0
      ? audioStatus.currentTime / audioStatus.duration
      : 0;

  return (
    <Modal
      visible={isPlayerVisible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Main Player View */}
          <View style={styles.header}>
            <Pressable onPress={handleClose} style={styles.iconButton}>
              <X size={28} color="white" />
            </Pressable>
            <Pressable
              onPress={() => setShowVolumeControl(!showVolumeControl)}
              style={styles.iconButton}
            >
              <Volume2 size={24} color="white" />
            </Pressable>
          </View>

          {/* Volume Control */}
          {showVolumeControl && (
            <View style={styles.volumeContainer}>
              <Volume2 size={16} color="rgba(255,255,255,0.6)" />
              <Slider
                value={volume}
                onValueChange={(val) => {
                  const newVolume = Array.isArray(val) ? val[0] : val;
                  setVolume(newVolume);
                }}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="white"
                maximumTrackTintColor="rgba(255,255,255,0.3)"
                thumbTintColor="white"
                containerStyle={styles.volumeSlider}
                trackStyle={styles.volumeTrack}
                thumbStyle={styles.volumeThumb}
              />
              <Text style={styles.volumeText}>{Math.round(volume * 100)}%</Text>
            </View>
          )}

          {/* Track Info */}
          <View style={styles.trackInfoContainer}>
            <Text style={styles.trackTitle} numberOfLines={2}>
              {activeItem ? getDisplayName(activeItem) : "No Track Selected"}
            </Text>
            <View style={styles.artistContainer}>
              <Text style={styles.trackArtist}>
                {activeItem?.format?.toUpperCase() || "N/A"}
              </Text>
              <View style={styles.qualityBadge}>
                <Text style={styles.qualityText}>HQ</Text>
              </View>
            </View>
          </View>

          {/* Album Art */}
          <View style={styles.artworkContainer}>
            <LinearGradient
              colors={["#FF6B9D", "#FFA5A5"]}
              style={styles.artwork}
            >
              <Music
                size={width * 0.4}
                color="rgba(255,255,255,0.9)"
                strokeWidth={1.5}
              />
            </LinearGradient>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Slider
              value={progress}
              onSlidingComplete={(val) => {
                const seekTime =
                  (Array.isArray(val) ? val[0] : val) * audioStatus.duration;
                audioPlayer.seekTo(seekTime);
              }}
              minimumTrackTintColor="white"
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor="white"
              containerStyle={styles.slider}
              trackStyle={styles.sliderTrack}
              thumbStyle={styles.sliderThumb}
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatDuration(audioStatus.currentTime * 1000)}
              </Text>
              <Text style={styles.timeText}>
                {formatDuration(audioStatus.duration * 1000)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable
              onPress={() => setIsLooping(!isLooping)}
              style={styles.actionButton}
            >
              <Repeat
                size={24}
                color={isLooping ? "#EF4444" : "white"}
                fill={isLooping ? "#EF4444" : "transparent"}
              />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Heart size={24} color="white" />
            </Pressable>
            <Pressable onPress={handleClose} style={styles.actionButton}>
              <List size={24} color="white" />
            </Pressable>
          </View>

          {/* Playback Controls */}
          <View style={styles.controls}>
            <Pressable
              onPress={handlePrevious}
              style={styles.navControl}
              disabled={currentIndex === 0 && audioStatus.currentTime < 3}
            >
              <SkipBack size={36} color="white" fill="white" />
            </Pressable>

            <Pressable onPress={togglePlayback} style={styles.playButton}>
              {isPlaying ? (
                <Pause size={32} color="#1a1a1a" fill="#1a1a1a" />
              ) : (
                <Play
                  size={32}
                  color="#1a1a1a"
                  fill="#1a1a1a"
                  style={{ marginLeft: 3 }}
                />
              )}
            </Pressable>

            <Pressable
              onPress={handleNext}
              style={styles.navControl}
              disabled={currentIndex === playlist.length - 1}
            >
              <SkipForward size={36} color="white" fill="white" />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    paddingBottom: 20,
  },
  iconButton: {
    padding: 8,
  },
  volumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  volumeSlider: {
    flex: 1,
    height: 30,
  },
  volumeTrack: {
    height: 3,
    borderRadius: 1.5,
  },
  volumeThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
  },
  volumeText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "500",
    width: 40,
    textAlign: "right",
  },
  trackInfoContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  trackTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 28,
  },
  artistContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trackArtist: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "500",
  },
  qualityBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  qualityText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
  artworkContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  artwork: {
    width: width * 0.75,
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  slider: {
    height: 40,
  },
  sliderTrack: {
    height: 3,
    borderRadius: 1.5,
  },
  sliderThumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "white",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  timeText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  actionButton: {
    padding: 12,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  navControl: {
    padding: 12,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
