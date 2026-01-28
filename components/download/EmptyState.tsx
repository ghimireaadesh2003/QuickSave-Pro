import { LinearGradient } from "expo-linear-gradient";
import { Download } from "lucide-react-native";
import React, { memo } from "react";
import { Text, View } from "react-native";
import { COLORS, GRADIENTS } from "../../utils/constants";

/**
 * Empty state component for when no videos are downloaded
 */
export const EmptyState = memo(() => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingVertical: 80,
    }}
  >
    <LinearGradient
      colors={GRADIENTS.emptyState}
      style={{
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}
    >
      <Download size={32} color="#60A5FA" />
    </LinearGradient>
    <Text
      style={{
        color: COLORS.textSecondary,
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
      }}
    >
      No Savings yet
    </Text>
    <Text style={{ color: COLORS.textMuted, fontSize: 14, textAlign: "center" }}>
      Add videos from the home tab to start Saving
    </Text>
  </View>
));

EmptyState.displayName = "EmptyState";
