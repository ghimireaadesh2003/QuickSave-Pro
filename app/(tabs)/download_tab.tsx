import React, { useState } from "react";
import {
    FlatList,
    Platform,
    RefreshControl,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import { EmptyState } from "../../components/download/EmptyState";
import { VideoCard } from "../../components/download/VideoCard";
import { VideoPlayer } from "../../components/download/VideoPlayer";

// Context
import { useDownloads } from "../../context/DownloadContext";

// Utils
import { COLORS } from "../../utils/constants";

export default function DownloadTab() {
  const { videos } = useDownloads();
  const [refreshing, setRefreshing] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleOpenPlayer = (uri: string) => {
    setActiveVideo(uri);
  };

  const handleClosePlayer = () => {
    setActiveVideo(null);
  };

  // Sort: downloading first, then by newest
  const sortedVideos = [...videos].sort((a, b) => {
    if (a.status === "downloading" && b.status !== "downloading") return -1;
    if (a.status !== "downloading" && b.status === "downloading") return 1;
    return parseInt(b.id) - parseInt(a.id);
  });

  const stats = {
    total: videos.length,
    downloading: videos.filter((v) => v.status === "downloading").length,
    completed: videos.filter((v) => v.status === "completed").length,
    failed: videos.filter((v) => v.status === "error").length,
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
          {stats.total > 0 && (
            <Text style={{ fontSize: 14, color: COLORS.textMuted }}>
              {stats.total} total • {stats.downloading} saving •{" "}
              {stats.completed} done
              {stats.failed > 0 && ` • ${stats.failed} failed`}
            </Text>
          )}
        </View>

        {/* Video List */}
        <FlatList
          data={sortedVideos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{
            paddingHorizontal: 16,
            gap: 12,
          }}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 100 : 80,
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
          ListEmptyComponent={<EmptyState />}
          renderItem={({ item }) => (
            <VideoCard item={item} onOpenPlayer={handleOpenPlayer} />
          )}
        />

        {/* Video Player Modal */}
        <VideoPlayer videoUri={activeVideo} onClose={handleClosePlayer} />
      </View>
    </SafeAreaView>
  );
}
