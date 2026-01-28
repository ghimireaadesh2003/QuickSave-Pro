import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { HapticStyle } from "../types";

/**
 * Unified haptic feedback for both platforms
 * @param style - The style of haptic feedback: 'light', 'medium', or 'error'
 */
export const triggerHaptic = (style: HapticStyle = "light") => {
  if (Platform.OS === "ios") {
    if (style === "light") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (style === "medium") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (style === "error") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  } else {
    // Android - use consistent light haptic for all
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

/**
 * Trigger success haptic notification
 */
export const triggerSuccessHaptic = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};
