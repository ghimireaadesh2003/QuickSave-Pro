import { Music, Video } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { FormatType } from "../../types";
import { COLORS } from "../../utils/constants";

type FormatSelectorProps = {
  selectedFormat: FormatType;
  onFormatChange: (format: FormatType) => void;
  onPress?: (format: FormatType) => void;
};

/**
 * Format selector component for choosing between MP3 and MP4
 */
export const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
  onPress,
}) => {
  const handlePress = (format: FormatType) => {
    onPress?.(format);
    onFormatChange(format);
  };

  return (
    <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
      {/* MP4 Option */}
      <Pressable onPress={() => handlePress("mp4")} style={{ flex: 1 }}>
        <View
          style={{
            padding: 16,
            borderRadius: 16,
            borderWidth: 2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              selectedFormat === "mp4"
                ? "rgba(59, 130, 246, 0.15)"
                : "rgba(55, 65, 81, 0.5)",
            borderColor:
              selectedFormat === "mp4" ? COLORS.gradientBlue : "transparent",
          }}
        >
          <Video
            size={18}
            color={selectedFormat === "mp4" ? COLORS.gradientBlue : COLORS.textTertiary}
          />
          <Text
            style={{
              marginLeft: 8,
              fontWeight: "600",
              fontSize: 14,
              color: selectedFormat === "mp4" ? "#60A5FA" : COLORS.textTertiary,
            }}
          >
            MP4 Video
          </Text>
        </View>
      </Pressable>

      {/* MP3 Option */}
      <Pressable onPress={() => handlePress("mp3")} style={{ flex: 1 }}>
        <View
          style={{
            padding: 16,
            borderRadius: 16,
            borderWidth: 2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              selectedFormat === "mp3"
                ? "rgba(168, 85, 247, 0.15)"
                : "rgba(55, 65, 81, 0.5)",
            borderColor:
              selectedFormat === "mp3" ? COLORS.gradientPurple : "transparent",
          }}
        >
          <Music
            size={18}
            color={selectedFormat === "mp3" ? COLORS.gradientPurple : COLORS.textTertiary}
          />
          <Text
            style={{
              marginLeft: 8,
              fontWeight: "600",
              fontSize: 14,
              color: selectedFormat === "mp3" ? "#C084FC" : COLORS.textTertiary,
            }}
          >
            MP3 Audio
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
