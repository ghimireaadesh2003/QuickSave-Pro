import { useAudioPlayerStatus } from "expo-audio";
import { Music, Pause, Play, X } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { COLORS } from "../../utils/constants";
import { getDisplayName } from "../../utils/formatters";

import { useDownloads } from "../../context/DownloadContext";

export const MiniPlayer: React.FC = () => {
    const { 
        activeMusicItem, 
        isPlayerVisible, 
        setIsPlayerVisible, 
        setActiveMusicItem,
        audioPlayer: player 
    } = useDownloads();
    const status = useAudioPlayerStatus(player);
    const hasStartedPlayback = useRef(false);
    const mediaUri = activeMusicItem?.localUri || "";

    // Sync playback flag if item changes
    useEffect(() => {
        if (activeMusicItem) {
            hasStartedPlayback.current = false;
        }
    }, [activeMusicItem]);

    // Auto-play when track loads/changes in MiniPlayer
    useEffect(() => {
        try {
            if (activeMusicItem && player && mediaUri && !isPlayerVisible) {
                if (!status.playing && !hasStartedPlayback.current) {
                    player.play();
                    hasStartedPlayback.current = true;
                }
            }
        } catch (e) {
            console.warn("MiniPlayer autoplay error:", e);
        }
    }, [mediaUri, player, activeMusicItem, isPlayerVisible, status.playing, activeMusicItem?.id]);

    if (!activeMusicItem || isPlayerVisible) return null;

    const togglePlayback = () => {
        try {
            if (player.playing) {
                player.pause();
            } else {
                player.play();
            }
        } catch (e) {
            console.warn("MiniPlayer playback error:", e);
        }
    };
    const handleClose = () => {
        try {
            player.pause();
        } catch {} // Silence pause errors on closure
        setActiveMusicItem(null);
    };

    const progress = status.duration > 0 ? (status.currentTime / status.duration) : 0;

    return (
        <Pressable 
            style={styles.container} 
            onPress={() => setIsPlayerVisible(true)}
        >
            <View style={styles.content}>
                <View style={styles.infoContainer}>
                    <View style={styles.iconContainer}>
                        <Music size={20} color="white" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title} numberOfLines={1}>
                            {getDisplayName(activeMusicItem)}
                        </Text>
                        <Text style={styles.artist}>
                            {activeMusicItem.format.toUpperCase()} • {status.playing ? "Playing" : "Paused"}
                        </Text>
                    </View>
                </View>

                <View style={styles.controls}>
                    <Pressable onPress={togglePlayback} style={styles.controlButton}>
                        {status.playing ? (
                            <Pause size={24} color="white" fill="white" />
                        ) : (
                            <Play size={24} color="white" fill="white" />
                        )}
                    </Pressable>
                    <Pressable onPress={handleClose} style={styles.controlButton}>
                        <X size={20} color="rgba(255,255,255,0.6)" />
                    </Pressable>
                </View>
            </View>
            
            {/* Tiny progress bar at the bottom */}
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: Platform.OS === "ios" ? 90 : 80, // Adjust based on tab bar height
        left: 12,
        right: 12,
        height: 64,
        backgroundColor: "rgba(31, 41, 55, 0.98)",
        borderRadius: 16,
        paddingHorizontal: 8,
        flexDirection: "column",
        justifyContent: "center",
        // Glassmorphism effect
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: COLORS.gradientPurple,
        justifyContent: "center",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: "white",
        fontSize: 14,
        fontWeight: "700",
    },
    artist: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 11,
        fontWeight: "500",
        marginTop: 2,
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    controlButton: {
        padding: 8,
    },
    progressBarBg: {
        height: 2,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 1,
        overflow: "hidden",
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: COLORS.gradientBlue,
    },
});
