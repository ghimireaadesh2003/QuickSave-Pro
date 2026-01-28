import React from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";
import { COLORS, PLATFORM_VALUES } from "../../utils/constants";

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
  saveToDevice: boolean;
  setSaveToDevice: (value: boolean) => void;
  onOptionPress?: () => void;
};

/**
 * Settings modal component for save preferences
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  saveToDevice,
  setSaveToDevice,
  onOptionPress,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={false}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: "#111827",
            marginHorizontal: 24,
            marginBottom: Platform.OS === "ios" ? PLATFORM_VALUES.modalBottomIOS : PLATFORM_VALUES.modalBottomAndroid,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: "#1F2937",
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text
            style={{
              color: COLORS.textPrimary,
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 24,
            }}
          >
            Save Settings
          </Text>

          <Text
            style={{
              color: COLORS.textTertiary,
              fontSize: 14,
              marginBottom: 12,
              fontWeight: "500",
            }}
          >
            Save Preference
          </Text>

          {/* Auto-save option */}
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              borderRadius: 16,
              marginBottom: 12,
              borderWidth: 1,
              backgroundColor: saveToDevice
                ? "rgba(59, 130, 246, 0.15)"
                : "rgba(55, 65, 81, 0.5)",
              borderColor: saveToDevice
                ? "rgba(59, 130, 246, 0.5)"
                : "transparent",
            }}
            onPress={() => {
              onOptionPress?.();
              setSaveToDevice(true);
            }}
            android_ripple={{ color: "rgba(59, 130, 246, 0.3)" }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                marginRight: 12,
                alignItems: "center",
                justifyContent: "center",
                borderColor: saveToDevice ? COLORS.gradientBlue : COLORS.textMuted,
                backgroundColor: saveToDevice ? COLORS.gradientBlue : "transparent",
              }}
            >
              {saveToDevice && (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: COLORS.textPrimary,
                    borderRadius: 6,
                  }}
                />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: COLORS.textPrimary, fontWeight: "600", fontSize: 15 }}
              >
                Auto-save to gallery
              </Text>
              <Text
                style={{ color: COLORS.textTertiary, fontSize: 12, marginTop: 2 }}
              >
                Automatically add after Saving
              </Text>
            </View>
          </Pressable>

          {/* Manual save option */}
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              backgroundColor: !saveToDevice
                ? "rgba(59, 130, 246, 0.15)"
                : "rgba(55, 65, 81, 0.5)",
              borderColor: !saveToDevice
                ? "rgba(59, 130, 246, 0.5)"
                : "transparent",
            }}
            onPress={() => {
              onOptionPress?.();
              setSaveToDevice(false);
            }}
            android_ripple={{ color: "rgba(59, 130, 246, 0.3)" }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                marginRight: 12,
                alignItems: "center",
                justifyContent: "center",
                borderColor: !saveToDevice ? COLORS.gradientBlue : COLORS.textMuted,
                backgroundColor: !saveToDevice ? COLORS.gradientBlue : "transparent",
              }}
            >
              {!saveToDevice && (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: COLORS.textPrimary,
                    borderRadius: 6,
                  }}
                />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: COLORS.textPrimary, fontWeight: "600", fontSize: 15 }}
              >
                Manual save only
              </Text>
              <Text
                style={{ color: COLORS.textTertiary, fontSize: 12, marginTop: 2 }}
              >
                Save manually when needed
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
