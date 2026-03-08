import { Music, Play } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import { EmptyState } from "../../components/download/EmptyState";
import { MiniPlayer } from "../../components/download/MiniPlayer";
import { MusicCard } from "../../components/download/MusicCard";
import { MusicPlayer } from "../../components/download/MusicPlayer";
import { VideoCard } from "../../components/download/VideoCard";
import { VideoPlayer } from "../../components/download/VideoPlayer";

// Context
import { useDownloads } from "../../context/DownloadContext";

// Types
import { VideoItem } from "../../types";

// Utils
import { COLORS } from "../../utils/constants";

export default function DownloadTab() {
  const { 
    videos,
    activeMusicItem,
    setActiveMusicItem,
    setIsPlayerVisible,
    audioPlayer,
  } = useDownloads();
  const [refreshing, setRefreshing] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"video" | "music">("video");

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleOpenPlayer = (uri: string, item: VideoItem) => {
    if (item.format === "mp3") {
      setActiveMusicItem(item);
      setIsPlayerVisible(true);
    } else {
      // Pause music if a video is started
      try { audioPlayer.pause(); } catch {}
      setActiveVideo(uri);
    }
  };

  const handleClosePlayer = () => {
    setActiveVideo(null);
  };


  // Filtered lists for each tab
  const videoItems = useMemo(() => {
    return [...videos]
      .filter((v) => v.format === "mp4")
      .sort((a, b) => parseInt(b.id) - parseInt(a.id));
  }, [videos]);

  const musicItems = useMemo(() => {
    return [...videos]
      .filter((v) => v.format === "mp3")
      .sort((a, b) => parseInt(b.id) - parseInt(a.id));
  }, [videos]);

  // Silence non-active media on tab switch
  React.useEffect(() => {
    if (activeTab === "music") {
      setActiveVideo(null);
    } else {
      setActiveMusicItem(null);
    }
  }, [activeTab, setActiveMusicItem]);

  const stats = {
    videoCount: videoItems.length,
    musicCount: musicItems.length,
    downloading: videos.filter((v) => v.status === "downloading").length,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: Platform.OS === "android" ? 16 : 8,
            paddingBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: COLORS.textPrimary,
              marginBottom: 4,
            }}
          >
            My Saves
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.textMuted }}>
            {stats.videoCount} videos • {stats.musicCount} songs
            {stats.downloading > 0 && ` • ${stats.downloading} saving`}
          </Text>
        </View>

        {/* Tab Selector */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            marginBottom: 16,
            gap: 12,
          }}
        >
          <Pressable
            onPress={() => setActiveTab("video")}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                activeTab === "video"
                  ? COLORS.gradientBlue
                  : "rgba(31, 41, 55, 0.5)",
              paddingVertical: 12,
              borderRadius: 12,
              gap: 8,
              borderWidth: 1,
              borderColor:
                activeTab === "video" ? COLORS.gradientBlue : COLORS.border,
            }}
          >
            <Play
              size={20}
              color={activeTab === "video" ? "white" : COLORS.textMuted}
            />
            <Text
              style={{
                color: activeTab === "video" ? "white" : COLORS.textMuted,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Videos
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("music")}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                activeTab === "music"
                  ? COLORS.gradientPurple
                  : "rgba(31, 41, 55, 0.5)",
              paddingVertical: 12,
              borderRadius: 12,
              gap: 8,
              borderWidth: 1,
              borderColor:
                activeTab === "music" ? COLORS.gradientPurple : COLORS.border,
            }}
          >
            <Music
              size={20}
              color={activeTab === "music" ? "white" : COLORS.textMuted}
            />
            <Text
              style={{
                color: activeTab === "music" ? "white" : COLORS.textMuted,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Music
            </Text>
          </Pressable>
        </View>

        {/* Content List */}
        <FlatList
          key={activeTab}
          data={activeTab === "video" ? videoItems : musicItems}
          keyExtractor={(item) => item.id}
          numColumns={activeTab === "video" ? 2 : 1}
          columnWrapperStyle={
            activeTab === "video"
              ? {
                  paddingHorizontal: 16,
                  gap: 12,
                }
              : undefined
          }
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 100 : 80,
            paddingTop: activeTab === "music" ? 8 : 0,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.textTertiary}
            />
          }
          ListEmptyComponent={
            <View style={{ flex: 1, marginTop: 40 }}>
              <EmptyState />
              <Text
                style={{
                  color: COLORS.textMuted,
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 14,
                }}
              >
                No {activeTab === "video" ? "videos" : "music"} yet
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            activeTab === "video" ? (
              <VideoCard
                item={item}
                onOpenPlayer={(uri) => handleOpenPlayer(uri, item)}
              />
            ) : (
              <MusicCard
                item={item}
                isActive={activeMusicItem?.id === item.id}
                onOpenPlayer={(uri) => handleOpenPlayer(uri, item)}
              />
            )
          )}
        />

        {/* Video Player Modal */}
        <VideoPlayer videoUri={activeVideo} onClose={handleClosePlayer} />

        {/* Local Music Players (Step 1144) */}
        <MiniPlayer />
        <MusicPlayer playlist={musicItems} />
      </View>
    </SafeAreaView>
  );
}
