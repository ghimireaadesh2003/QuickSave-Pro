import { Music, Video, X } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface FormatPickerDialogProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  onSelectMP3: () => void;
  onSelectMP4: () => void;
  onCancel: () => void;
}

export const FormatPickerDialog = ({
  visible,
  title = "Save",
  subtitle,
  onSelectMP3,
  onSelectMP4,
  onCancel,
}: FormatPickerDialogProps) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={onCancel}
      >
        <Pressable
          className="bg-white rounded-2xl p-6 w-11/12 max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">{title}</Text>
            <Pressable onPress={onCancel}>
              <X size={20} color="#6B7280" />
            </Pressable>
          </View>

          {subtitle && <Text className="text-gray-600 mb-5">{subtitle}</Text>}

          {/* MP3 */}
          <Pressable
            className="flex-row items-center gap-3 p-4 rounded-xl bg-gray-100 mb-3"
            onPress={onSelectMP3}
          >
            <Music size={22} color="#10B981" />
            <Text className="text-base font-semibold text-gray-900">
              Save MP3 (Audio)
            </Text>
          </Pressable>

          {/* MP4 */}
          <Pressable
            className="flex-row items-center gap-3 p-4 rounded-xl bg-gray-100"
            onPress={onSelectMP4}
          >
            <Video size={22} color="#3B82F6" />
            <Text className="text-base font-semibold text-gray-900">
              Save MP4 (Video)
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
