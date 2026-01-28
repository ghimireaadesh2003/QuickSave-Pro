import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { COLORS } from "../../utils/constants";

type GradientButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  colors: readonly [string, string, ...string[]];
  icon?: React.ReactNode;
  text: string;
  loadingText?: string;
};

/**
 * Reusable gradient button component
 */
export const GradientButton: React.FC<GradientButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
  colors,
  icon,
  text,
  loadingText = "Loading...",
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={{ overflow: "hidden", borderRadius: 16 }}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingVertical: 16,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          opacity: disabled || loading ? 0.5 : 1,
        }}
      >
        {loading ? (
          <>
            <ActivityIndicator
              color={COLORS.textPrimary}
              size="small"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: COLORS.textPrimary,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              {loadingText}
            </Text>
          </>
        ) : (
          <>
            {icon}
            <Text
              style={{
                color: COLORS.textPrimary,
                fontWeight: "600",
                fontSize: 16,
                marginLeft: icon ? 8 : 0,
              }}
            >
              {text}
            </Text>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
};
