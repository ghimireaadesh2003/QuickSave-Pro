import { LinearGradient } from "expo-linear-gradient";
import { Download, Settings } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { COLORS, GRADIENTS } from "../../utils/constants";

type HeaderProps = {
  onSettingsPress: () => void;
};

/**
 * App header component with logo and settings button
 */
export const Header: React.FC<HeaderProps> = ({ onSettingsPress }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 16,
        paddingBottom: 24,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <LinearGradient
          colors={GRADIENTS.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Download size={24} color={COLORS.textPrimary} />
        </LinearGradient>
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: COLORS.textPrimary,
            }}
          >
            QuickSave Pro
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
            Fast & Secure
          </Text>
        </View>
      </View>
      <Pressable
        onPress={onSettingsPress}
        style={{
          padding: 12,
          backgroundColor: COLORS.cardBackgroundAlt,
          borderRadius: 12,
        }}
        android_ripple={{ color: "rgba(156, 163, 175, 0.3)" }}
      >
        <Settings size={20} color={COLORS.textTertiary} />
      </Pressable>
    </View>
  );
};
