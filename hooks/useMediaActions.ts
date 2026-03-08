import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import { useDownloads } from "../context/DownloadContext";
import { VideoItem } from "../types";
import { triggerHaptic, triggerSuccessHaptic } from "../utils/haptics";

/**
 * Custom hook to handle common media actions: Delete, Share, Save
 */
export const useMediaActions = () => {
    const { deleteVideo, saveVideoToDevice } = useDownloads();

    const handleDelete = (item: VideoItem) => {
        triggerHaptic("medium");
        Alert.alert("Delete Item", `Are you sure you want to delete this ${item.format === "mp4" ? "video" : "music"}?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    triggerSuccessHaptic();
                    deleteVideo(item.id);
                },
            },
        ]);
    };

    const handleSave = (item: VideoItem) => {
        const isVideo = item.format === "mp4";
        const isAudio = item.format === "mp3";
        const canSave = item.status === "completed" && !item.savedToDevice && (isVideo || (isAudio && Platform.OS === "android"));

        if (!canSave) return;
        
        triggerHaptic("medium");
        saveVideoToDevice(item.id);
    };

    const handleShare = async (item: VideoItem) => {
        if (!item.localUri) return;

        triggerHaptic("medium");

        try {
            const isAvailable = await Sharing.isAvailableAsync();

            if (!isAvailable) {
                Alert.alert(
                    "Sharing Not Available",
                    "Sharing is not available on this device.",
                );
                return;
            }

            await Sharing.shareAsync(item.localUri, {
                mimeType: item.format === "mp4" ? "video/mp4" : "audio/mpeg",
                dialogTitle: `Share ${item.format === "mp4" ? "Video" : "Audio"}`,
                UTI: item.format === "mp4" ? "public.movie" : "public.audio",
            });

            triggerSuccessHaptic();
        } catch (error) {
            console.error("Error sharing:", error);
            Alert.alert(
                "Share Failed",
                "Could not share this file. Please make sure the file exists and try again.",
            );
        }
    };

    return {
        handleDelete,
        handleSave,
        handleShare,
    };
};
