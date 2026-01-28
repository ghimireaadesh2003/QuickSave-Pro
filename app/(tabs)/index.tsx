import { useRouter } from "expo-router";
import { useShareIntent } from "expo-share-intent";
import { Copy, Download, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import { FeatureCard } from "../../components/ui/FeatureCard";
import { FormatSelector } from "../../components/ui/FormatSelector";
import { GradientButton } from "../../components/ui/GradientButton";
import { Header } from "../../components/ui/Header";
import { SettingsModal } from "../../components/ui/SettingsModal";
import { Toast } from "../../components/ui/Toast";

// Hooks
import { useClipboard } from "../../hooks/useClipboard";
import { useHaptics } from "../../hooks/useHaptics";
import { useToast } from "../../hooks/useToast";

// Context
import { useDownloads } from "../../context/DownloadContext";

// Utils and Types
import { FormatType } from "../../types";
import { COLORS, GRADIENTS } from "../../utils/constants";

export default function App() {
  const router = useRouter();
  const { addVideoAndStartDownload, saveToDevice, setSaveToDevice, videos } =
    useDownloads();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<FormatType>("mp4");

  // Custom hooks
  const { showToast, toastMessage, toastOpacity, displayToast } = useToast();
  const { triggerLight, triggerMedium, triggerError } = useHaptics();
  const { pasteFromClipboard } = useClipboard();

  // Intent handling
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent();

  useEffect(() => {
    if (hasShareIntent && shareIntent) {
      let url =
        typeof shareIntent.webUrl === "string" ? shareIntent.webUrl : "";

      if (!url && typeof shareIntent.text === "string") {
        url = shareIntent.text;
      }

      const sharedText = url.trim();

      if (sharedText) {
        setText(sharedText);
        triggerMedium();
        displayToast("🔗 Link received from Share");
        resetShareIntent();
      }
    }
  }, [hasShareIntent, shareIntent, displayToast, resetShareIntent, triggerMedium]);

  const handlePaste = async () => {
    try {
      triggerLight();
      const clipboardText = await pasteFromClipboard();
      setText(clipboardText);
      displayToast("📋 URL pasted");
    } catch (error) {
      console.error("Clipboard error:", error);
    }
  };

  const handlePress = async () => {
    Keyboard.dismiss();
    if (!text.trim()) {
      triggerError();
      displayToast("⚠️ Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      triggerMedium();

      setTimeout(() => {
        router.push("/download_tab");
      }, 2000);

      await addVideoAndStartDownload(text.trim(), selectedFormat);

      displayToast(`✅ ${selectedFormat.toUpperCase()} download started!`);
      setText("");
    } catch {
      triggerError();
      displayToast("❌ Failed to start Saving");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: videos.length,
    downloading: videos.filter((v) => v.status === "downloading").length,
    completed: videos.filter((v) => v.status === "completed").length,
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 25,
                paddingBottom: 40,
                flexGrow: 1,
              }}
            >
              {/* Header */}
              <Header
                onSettingsPress={() => {
                  triggerLight();
                  setModalVisible(true);
                }}
              />

              {/* Ad content*/}
              <View className="mb-[35px] bg-gray-800 rounded-lg p-4">
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: COLORS.textSecondary,
                    padding: 18,
                  }}
                >
                  Ads Goes here:
                </Text>
              </View>

              {/* Main Input Card */}
              <View
                style={{
                  backgroundColor: COLORS.cardBackgroundAlt,
                  borderRadius: 24,
                  paddingVertical: 15,
                  paddingHorizontal: 8,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: COLORS.textSecondary,
                    marginBottom: 12,
                  }}
                >
                  Video URL
                </Text>

                <View style={{ position: "relative", marginBottom: 16 }}>
                  <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="https://example.com/watch?v=..."
                    placeholderTextColor={COLORS.textMuted}
                    style={{
                      width: "100%",
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      paddingRight: 56,
                      backgroundColor: COLORS.inputBackground,
                      borderWidth: 1,
                      borderColor: COLORS.borderAlt,
                      borderRadius: 16,
                      color: COLORS.textPrimary,
                      fontSize: 14,
                      minHeight: 56,
                    }}
                    multiline
                    numberOfLines={2}
                    textAlignVertical="top"
                  />
                  <Pressable
                    onPress={handlePaste}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 12,
                      padding: 10,
                      borderRadius: 12,
                      backgroundColor: "rgba(55, 65, 81, 0.7)",
                    }}
                    android_ripple={{
                      color: "rgba(156, 163, 175, 0.3)",
                      borderless: false,
                    }}
                  >
                    <Copy size={18} color={COLORS.textTertiary} />
                  </Pressable>
                </View>

                {/* Format Selection */}
                <FormatSelector
                  selectedFormat={selectedFormat}
                  onFormatChange={setSelectedFormat}
                  onPress={triggerLight}
                />

                <GradientButton
                  onPress={handlePress}
                  disabled={!text || loading}
                  loading={loading}
                  colors={
                    selectedFormat === "mp4" ? GRADIENTS.mp4 : GRADIENTS.mp3
                  }
                  icon={<Download size={18} color={COLORS.textPrimary} />}
                  text={`Save ${selectedFormat.toUpperCase()}`}
                  loadingText="Started Saving..."
                />
              </View>

              {/* Features Grid */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  marginBottom: 15,
                }}
              >
                <FeatureCard
                  title="4K"
                  subtitle="Max Quality"
                  colors={GRADIENTS.quality}
                  borderColor="rgba(34, 197, 94, 0.3)"
                />
                <FeatureCard
                  title="Fast"
                  subtitle="Quick Save"
                  colors={GRADIENTS.speed}
                  borderColor="rgba(234, 179, 8, 0.3)"
                  icon={<Zap size={20} color="#FACC15" />}
                />
              </View>

              {/* Quick Stats */}
              {stats.completed > 0 && (
                <View
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    borderWidth: 1,
                    borderColor: "rgba(34, 197, 94, 0.3)",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 24,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: COLORS.success,
                        borderRadius: 4,
                        marginRight: 8,
                      }}
                    />
                    <Text
                      style={{
                        color: COLORS.success,
                        fontWeight: "600",
                        flex: 1,
                        fontSize: 14,
                      }}
                    >
                      {stats.completed} Save{stats.completed !== 1 ? "s" : ""}{" "}
                      completed
                    </Text>
                    <Pressable
                      onPress={() => router.push("/download_tab")}
                      style={{
                        backgroundColor: "rgba(34, 197, 94, 0.2)",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.success,
                          fontSize: 12,
                          fontWeight: "500",
                        }}
                      >
                        View
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

        {/* Toast Notification */}
        <Toast visible={showToast} message={toastMessage} opacity={toastOpacity} />

        {/* Settings Modal */}
        <SettingsModal
          visible={modalVisible}
          onClose={() => {
            triggerLight();
            setModalVisible(false);
          }}
          saveToDevice={saveToDevice}
          setSaveToDevice={setSaveToDevice}
          onOptionPress={triggerLight}
        />
      </SafeAreaView>
    </View>
  );
}
