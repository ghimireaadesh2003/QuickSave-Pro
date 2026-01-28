import { Dimensions } from "react-native";

// API URLs
// export const BACKEND_URL = "https://manometric-nancie-talismanically.ngrok-free.dev";
// export const BACKEND_URL = "http://192.168.1.8:4000";
export const BACKEND_URL = "http://192.168.18.4:5000";
export const HOME_URL = "https://www.google.com";

// Colors
export const COLORS = {
  // Background
  background: "#000",
  cardBackground: "rgba(17, 24, 39, 0.8)",
  cardBackgroundAlt: "rgba(17, 24, 39, 0.5)",
  inputBackground: "rgba(31, 41, 55, 0.8)",

  // Text
  textPrimary: "white",
  textSecondary: "#D1D5DB",
  textTertiary: "#9CA3AF",
  textMuted: "#6B7280",
  textDark: "#4B5563",

  // Borders
  border: "rgba(31, 41, 55, 0.5)",
  borderAlt: "rgba(55, 65, 81, 0.5)",

  // Status
  success: "#34D399",
  successLight: "#10B981",
  error: "#EF4444",
  errorLight: "#F87171",
  warning: "#FBBF24",
  warningLight: "#FACC15",
  info: "#60A5FA",

  // Gradients
  gradientBlue: "#3B82F6",
  gradientPurple: "#A855F7",
  gradientPink: "#EC4899",
  gradientDarkBlue: "#2563EB",
  gradientViolet: "#9333EA",
  gradientHotPink: "#DB2777",
  gradientIndigo: "#6366F1",
  gradientVioletAlt: "#8B5CF6",
  gradientGreen: "#10B981",
  gradientGreenDark: "#059669",
  gradientYellow: "#EAB308",
};

// Gradient Combinations
export const GRADIENTS = {
  primary: [COLORS.gradientBlue, COLORS.gradientPurple, COLORS.gradientPink],
  mp4: [COLORS.gradientDarkBlue, COLORS.gradientViolet, COLORS.gradientHotPink],
  mp3: [COLORS.gradientViolet, COLORS.gradientPurple, COLORS.gradientPink],
  blue: [COLORS.gradientBlue, COLORS.gradientDarkBlue],
  purple: [COLORS.gradientVioletAlt, COLORS.gradientIndigo],
  green: [COLORS.gradientGreen, COLORS.gradientGreenDark],
  quality: ["rgba(34, 197, 94, 0.15)", "rgba(34, 197, 94, 0.05)"],
  speed: ["rgba(234, 179, 8, 0.15)", "rgba(234, 179, 8, 0.05)"],
  emptyState: ["rgba(59,130,246,0.1)", "rgba(59,130,246,0.05)"],
} as const;

// Dimensions
const { width } = Dimensions.get("window");
export const ITEM_WIDTH = (width - 48) / 2;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

// Platform specific values
export const PLATFORM_VALUES = {
  toastTopIOS: 60,
  toastTopAndroid: 40,
  modalBottomIOS: 40,
  modalBottomAndroid: 20,
  browserBottomIOS: 42,
  browserBottomAndroid: 42,
  browserFabBottomIOS: 100,
  browserFabBottomAndroid: 80,
};

// Storage Keys
export const STORAGE_KEYS = {
  videos: "@videos_v5",
  savePreference: "@save_to_device_v2",
};

// Animation
export const ANIMATION = {
  toastDuration: 2000,
  toastFadeDuration: 300,
  updateThrottleMs: 100,
  scalePressDuration: 100,
};
