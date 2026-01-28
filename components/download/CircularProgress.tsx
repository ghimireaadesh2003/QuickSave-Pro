import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

type CircularProgressProps = {
  progress: number;
  size?: number;
};

/**
 * Circular progress indicator component
 * Shows download progress with a circular animation
 */
export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 48,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const prevProgress = useRef(0);

  useEffect(() => {
    if (Math.abs(progress - prevProgress.current) > 0.001) {
      prevProgress.current = progress;

      Animated.timing(animatedProgress, {
        toValue: progress,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, animatedProgress]);

  const rotation = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const strokeWidth = 4;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background circle */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: "rgba(59,130,246,0.2)",
        }}
      />

      {/* Progress arc */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
        }}
      >
        <Animated.View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: "transparent",
            borderTopColor: "#3B82F6",
            borderRightColor: "#3B82F6",
            transform: [{ rotate: rotation }],
          }}
        />
      </View>

      {/* Percentage text */}
      <Text
        style={{
          color: "white",
          fontSize: 12,
          fontWeight: "bold",
          position: "absolute",
        }}
      >
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
};
