import React from "react";
import { Animated, Platform, Text, View } from "react-native";
import { COLORS, PLATFORM_VALUES } from "../../utils/constants";

type ToastProps = {
  visible: boolean;
  message: string;
  opacity: Animated.Value;
};

/**
 * Toast notification component
 * Displays temporary messages at the top of the screen
 */
export const Toast: React.FC<ToastProps> = ({ visible, message, opacity }) => {
  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: Platform.OS === "ios" ? PLATFORM_VALUES.toastTopIOS : PLATFORM_VALUES.toastTopAndroid,
        left: 20,
        right: 20,
        opacity: opacity,
        transform: [
          {
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: "#111827",
          borderWidth: 1,
          borderColor: "#374151",
          borderRadius: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text
          style={{
            color: COLORS.textPrimary,
            fontWeight: "500",
            textAlign: "center",
            fontSize: 14,
          }}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};
