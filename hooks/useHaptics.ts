import { triggerHaptic } from "../utils/haptics";

/**
 * Custom hook for haptic feedback
 * Provides convenient wrapper functions around the haptics utility
 */
export const useHaptics = () => {
  const triggerLight = () => triggerHaptic("light");
  const triggerMedium = () => triggerHaptic("medium");
  const triggerError = () => triggerHaptic("error");

  return {
    triggerLight,
    triggerMedium,
    triggerError,
    triggerHaptic, // Also expose the main function
  };
};
