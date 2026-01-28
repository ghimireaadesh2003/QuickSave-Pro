import { LinearGradient } from "expo-linear-gradient";
import * as Sharing from "expo-sharing";
import {
    CheckCircle,
    Music,
    Play,
    Save,
    Share2,
    Trash2,
    X,
} from "lucide-react-native";
import React, { memo, useRef } from "react";
import { Alert, Animated, Platform, Pressable, Text, View } from "react-native";
import { useDownloads } from "../../context/DownloadContext";
import { VideoItem } from "../../types";
import { COLORS, GRADIENTS, ITEM_WIDTH } from "../../utils/constants";
import {
    formatDuration,
    formatFileSize,
    getDisplayName,
} from "../../utils/formatters";
import { triggerHaptic, triggerSuccessHaptic } from "../../utils/haptics";
import { CircularProgress } from "./CircularProgress";
import { VideoThumbnail } from "./VideoThumbnail";

type VideoCardProps = {
  item: VideoItem;
  onOpenPlayer: (uri: string) => void;
};

/**
 * Video card component displaying video info and actions
 */
export const VideoCard = memo<VideoCardProps>(({ item, onOpenPlayer }) => {
  const { deleteVideo, saveVideoToDevice } = useDownloads();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePlay = () => {
    if (item.status === "completed" && item.localUri) {
      triggerHaptic("light");
      onOpenPlayer(item.localUri);
    }
  };

  const handleDelete = () => {
    triggerHaptic("medium");
    Alert.alert("Delete Video", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          triggerSuccessHaptic();
          deleteVideo(item.id);
        },
      },
    ]);
  };

  const handleSave = () => {
    if (!canSave) return;
    triggerHaptic("medium");
    saveVideoToDevice(item.id);
  };

  const handleShare = async () => {
    if (!item.localUri) return;

    triggerHaptic("medium");

    try {
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert(
          "Sharing Not Available",
          "Sharing is not available on this device.",
        );
        return;
      }

      await Sharing.shareAsync(item.localUri, {
        mimeType: item.format === "mp4" ? "video/mp4" : "audio/mpeg",
        dialogTitle: `Share ${item.format === "mp4" ? "Video" : "Audio"}`,
        UTI: item.format === "mp4" ? "public.movie" : "public.audio",
      });

      triggerSuccessHaptic();
      console.log("File shared successfully");
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert(
        "Share Failed",
        "Could not share this file. Please make sure the file exists and try again.",
      );
    }
  };

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const isVideo = item.format === "mp4";
  const isAudio = item.format === "mp3";

  const canSave =
    item.status === "completed" &&
    !item.savedToDevice &&
    (isVideo || (isAudio && Platform.OS === "android"));

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        width: ITEM_WIDTH,
        marginBottom: 16,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.cardBackground,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
          overflow: "hidden",
        }}
      >
        {/* Media Preview */}
        <View style={{ aspectRatio: 16 / 9, overflow: "hidden" }}>
          {item.status === "completed" && item.localUri ? (
            <Pressable
              onPress={handlePlay}
              style={{ position: "relative", flex: 1 }}
            >
              {isVideo ? (
                <>
                  <VideoThumbnail uri={item.localUri} />
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <View>
                      <Play size={18} color={COLORS.textPrimary} fill={COLORS.textPrimary} />
                    </View>
                  </View>
                </>
              ) : (
                <LinearGradient
                  colors={GRADIENTS.purple}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Music size={32} color={COLORS.textPrimary} />
                  </View>
                </LinearGradient>
              )}

              {/* Duration Badge */}
              {item.duration && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.textPrimary,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {formatDuration(item.duration)}
                  </Text>
                </View>
              )}
            </Pressable>
          ) : item.status === "downloading" ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                backgroundColor: "rgba(31, 41, 55, 0.5)",
              }}
            >
              <CircularProgress progress={item.progress} size={56} />
              <Text
                style={{
                  color: COLORS.textTertiary,
                  fontSize: 12,
                  marginTop: 12,
                  fontWeight: "500",
                }}
              >
                Saving...
              </Text>
            </View>
          ) : item.status === "error" ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <X size={24} color={COLORS.error} />
              </View>
              <Text
                style={{ color: COLORS.errorLight, fontSize: 12, fontWeight: "500" }}
              >
                Save Failed
              </Text>
            </View>
          ) : null}

          {/* Saved Badge */}
          {item.savedToDevice && (
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: COLORS.successLight,
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <CheckCircle size={12} color={COLORS.textPrimary} />
              <Text
                style={{
                  color: COLORS.textPrimary,
                  fontSize: 12,
                  fontWeight: "bold",
                  marginLeft: 4,
                }}
              >
                Saved
              </Text>
            </View>
          )}

          {/* Format Badge */}
          {item.status !== "downloading" && item.format && (
            <View
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: COLORS.cardBackground,
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: 12,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {item.format}
              </Text>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={{ padding: 12 }}>
          <Text
            style={{
              color: "#E5E7EB",
              fontSize: 12,
              fontWeight: "600",
              marginBottom: 4,
            }}
            numberOfLines={2}
          >
            {getDisplayName(item)}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
              {formatFileSize(item.size)}
            </Text>
            {item.duration && (
              <>
                <View
                  style={{
                    width: 4,
                    height: 4,
                    backgroundColor: COLORS.textDark,
                    borderRadius: 2,
                    marginHorizontal: 8,
                  }}
                />
                <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
                  {formatDuration(item.duration)}
                </Text>
              </>
            )}
            <View
              style={{
                width: 4,
                height: 4,
                backgroundColor: COLORS.textDark,
                borderRadius: 2,
                marginHorizontal: 8,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color:
                  item.status === "completed"
                    ? COLORS.success
                    : item.status === "downloading"
                      ? COLORS.info
                      : item.status === "error"
                        ? COLORS.errorLight
                        : COLORS.textTertiary,
              }}
            >
              {item.status === "completed"
                ? "Done"
                : item.status === "downloading"
                  ? `${Math.round(item.progress * 100)}%`
                  : item.status === "error"
                    ? "Failed"
                    : "Unknown"}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            {canSave && (
              <Pressable
                onPress={() => {
                  animatePress();
                  handleSave();
                }}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={GRADIENTS.green}
                  style={{
                    paddingVertical: 12,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Save size={12} color={COLORS.textPrimary} />
                  <Text
                    style={{
                      color: COLORS.textPrimary,
                      fontSize: 10,
                      fontWeight: "bold",
                      marginLeft: 1,
                    }}
                  >
                    Save
                  </Text>
                </LinearGradient>
              </Pressable>
            )}

            {item.status === "completed" && item.localUri && (
              <Pressable
                onPress={() => {
                  animatePress();
                  handleShare();
                }}
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  padding: 10,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "rgba(59, 130, 246, 0.3)",
                }}
              >
                <Share2 size={14} color={COLORS.gradientBlue} />
              </Pressable>
            )}

            <Pressable
              onPress={() => {
                animatePress();
                handleDelete();
              }}
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                padding: 10,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(239, 68, 68, 0.3)",
              }}
            >
              <Trash2 size={14} color={COLORS.error} />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

VideoCard.displayName = "VideoCard";
