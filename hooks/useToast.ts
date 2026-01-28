import { useRef, useState } from "react";
import { Animated } from "react-native";
import { ANIMATION } from "../utils/constants";

/**
 * Custom hook for managing toast notifications
 * @returns Toast state and display function
 */
export const useToast = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: ANIMATION.toastFadeDuration,
        useNativeDriver: true,
      }),
      Animated.delay(ANIMATION.toastDuration),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: ANIMATION.toastFadeDuration,
        useNativeDriver: true,
      }),
    ]).start(() => setShowToast(false));
  };

  return {
    showToast,
    toastMessage,
    toastOpacity,
    displayToast,
  };
};
