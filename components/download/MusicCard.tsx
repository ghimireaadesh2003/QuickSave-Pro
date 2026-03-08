import { MoreVertical, Music, Save, Share2, Trash2, X } from "lucide-react-native";
import React, { memo, useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useMediaActions } from "../../hooks/useMediaActions";
import { VideoItem } from "../../types";
import { COLORS } from "../../utils/constants";
import { getDisplayName } from "../../utils/formatters";


type MusicCardProps = {
    item: VideoItem;
    onOpenPlayer: (uri: string) => void;
    isActive?: boolean;
};

/**
 * List-style card for Music items
 */
export const MusicCard = memo<MusicCardProps>(({ item, onOpenPlayer, isActive }) => {
    const { handleShare, handleDelete, handleSave } = useMediaActions();
    const [menuVisible, setMenuVisible] = useState(false);

    const handlePlay = () => {
        if (item.status === "completed" && item.localUri) {
            onOpenPlayer(item.localUri);
        }
    };

    const isAudio = item.format === "mp3";
    const canSave = item.status === "completed" && !item.savedToDevice && (isAudio && Platform.OS === "android");

    return (
        <View style={[styles.card, isActive && styles.activeCard]}>
            <Pressable onPress={handlePlay} style={styles.content}>
                <View style={[
                    styles.iconContainer, 
                    { backgroundColor: item.status === "error" ? "rgba(239, 68, 68, 0.1)" : isActive ? "rgba(59, 130, 246, 0.2)" : "rgba(139, 92, 246, 0.1)" }
                ]}>
                    <Music size={24} color={item.status === "error" ? COLORS.error : isActive ? COLORS.gradientBlue : "#8B5CF6"} />
                </View>
                
                <View style={styles.info}>
                    <Text style={[styles.title, isActive && { color: COLORS.gradientBlue }]} numberOfLines={1}>
                        {getDisplayName(item)}
                    </Text>
                    <View style={styles.meta}>
                        <View style={[styles.qualityBadge, isActive && { backgroundColor: "rgba(59, 130, 246, 0.2)", borderColor: COLORS.gradientBlue }]}>
                            <Text style={[styles.qualityText, isActive && { color: COLORS.gradientBlue }]}>HQ</Text>
                        </View>
                        <Text style={[styles.metaText, isActive && { color: "rgba(59, 130, 246, 0.7)" }]}>
                            {item.status === "downloading" ? `Saving ${Math.round(item.progress * 100)}%` : "Music • Available"}
                        </Text>
                    </View>
                </View>

                <Pressable onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                    <MoreVertical size={20} color={COLORS.textMuted} />
                </Pressable>
            </Pressable>

            {/* Action Menu Modal */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
                    <View style={styles.menuContainer}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.menuTitle} numberOfLines={1}>
                                {getDisplayName(item)}
                            </Text>
                            <Pressable onPress={() => setMenuVisible(false)} style={styles.closeButton}>
                                <X size={24} color={COLORS.textMuted} />
                            </Pressable>
                        </View>
                        <View style={styles.menuContent}>
                            <View style={styles.menuOptions}>
                                <Pressable 
                                    style={styles.menuOption} 
                                    onPress={() => {
                                        setMenuVisible(false);
                                        handleShare(item);
                                    }}
                                    disabled={item.status !== "completed" || !item.localUri}
                                >
                                    <Share2 size={20} color={item.status === "completed" ? COLORS.gradientBlue : COLORS.textDark} />
                                    <Text style={[styles.menuOptionText, item.status !== "completed" && { color: COLORS.textDark }]}>Share</Text>
                                </Pressable>

                                {canSave && (
                                    <Pressable 
                                        style={styles.menuOption} 
                                        onPress={() => {
                                            setMenuVisible(false);
                                            handleSave(item);
                                        }}
                                    >
                                        <Save size={20} color={COLORS.success} />
                                        <Text style={styles.menuOptionText}>Save to Device</Text>
                                    </Pressable>
                                )}

                                <Pressable 
                                    style={styles.menuOption} 
                                    onPress={() => {
                                        setMenuVisible(false);
                                        handleDelete(item);
                                    }}
                                >
                                    <Trash2 size={20} color={COLORS.error} />
                                    <Text style={[styles.menuOptionText, { color: COLORS.error }]}>Delete</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
});

const styles = StyleSheet.create({
    card: {
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 4,
    },
    activeCard: {
        backgroundColor: "rgba(59, 130, 246, 0.05)",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.05)",
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    title: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
    },
    qualityBadge: {
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "rgba(239, 68, 68, 0.3)",
    },
    qualityText: {
        color: COLORS.errorLight,
        fontSize: 10,
        fontWeight: "bold",
    },
    metaText: {
        color: COLORS.textMuted,
        fontSize: 13,
    },
    menuButton: {
        padding: 8,
        marginRight: -8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "flex-end",
    },
    menuContainer: {
        backgroundColor: "#1F2937",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: Platform.OS === "ios" ? 40 : 24,
        maxHeight: "90%",
    },
    menuHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.05)",
    },
    menuTitle: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
        marginRight: 16,
    },
    closeButton: {
        padding: 4,
    },
    menuContent: {
        paddingTop: 8,
    },
    menuOptions: {
        paddingTop: 8,
    },
    menuOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    menuOptionText: {
        color: COLORS.textPrimary,
        fontSize: 16,
        marginLeft: 16,
        fontWeight: "500",
    },
});

MusicCard.displayName = "MusicCard";
