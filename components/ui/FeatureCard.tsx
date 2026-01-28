import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

type FeatureCardProps = {
  title: string;
  subtitle: string;
  colors: readonly [string, string, ...string[]];
  borderColor: string;
  icon?: React.ReactNode;
};

/**
 * Feature card component for displaying app features
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  subtitle,
  colors,
  borderColor,
  icon,
}) => {
  return (
    <LinearGradient
      colors={colors}
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: borderColor,
        height: 80,
      }}
    >
      {icon ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#FBBF24",
              marginLeft: 4,
            }}
          >
            {title}
          </Text>
        </View>
      ) : (
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#34D399",
          }}
        >
          {title}
        </Text>
      )}
      <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
        {subtitle}
      </Text>
    </LinearGradient>
  );
};
