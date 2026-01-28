import { Video } from "expo-av";
import { FileVideo } from "lucide-react-native";
import React, { memo, useState } from "react";
import { View } from "react-native";

type VideoThumbnailProps = {
  uri: string;
};

/**
 * Video thumbnail component
 * Displays a video preview or fallback icon
 */
export const VideoThumbnail = memo<VideoThumbnailProps>(({ uri }) => {
  const [thumbnailError, setThumbnailError] = useState(false);

  if (thumbnailError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(31, 41, 55, 0.7)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FileVideo size={32} color="#9CA3AF" />
      </View>
    );
  }

  return (
    <Video
      source={{ uri }}
      style={{ flex: 1 }}
      shouldPlay={false}
      isLooping={false}
      isMuted={true}
      onError={() => setThumbnailError(true)}
    />
  );
});

VideoThumbnail.displayName = "VideoThumbnail";
