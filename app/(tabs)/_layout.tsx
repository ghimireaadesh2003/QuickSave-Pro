import { Tabs } from "expo-router";
import { Download, Home, Search } from "lucide-react-native";
import { Platform, View } from "react-native";
import { DownloadProvider } from "../../context/DownloadContext";

export default function Layout() {
  return (
    <DownloadProvider>
      <Tabs
        screenOptions={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "rgba(31, 41, 55, 0.85)",
            borderTopWidth: -1,
            borderTopColor: "rgba(55, 65, 81, 0.6)",
            borderRadius: 18,
            height: Platform.OS === "ios" ? 75 : 70,
            paddingTop: 6,
            paddingBottom: Platform.OS === "ios" ? 28 : 14,
            position: "absolute",
            elevation: 0,
            shadowColor: "transparent",
          },
          tabBarActiveTintColor: "#60A5FA",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 0,
          },
        }}
      >
        {/* HOME TAB */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <View
                className={`${focused ? "bg-blue-600/20" : ""} p-2 rounded-2xl`}
              >
                <Home size={24} color={color} />
              </View>
            ),
            tabBarBackground: () => (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(31, 41, 55, 0.9)",
                  borderRadius: 18,
                }}
              />
            ),
          }}
        />
        {/* Search TAB */}
        <Tabs.Screen
          name="browser"
          options={{
            title: "Search",
            tabBarIcon: ({ color, focused }) => (
              <View
                className={`${focused ? "bg-blue-600/20" : ""} p-2 rounded-2xl`}
              >
                <Search size={24} color={color} />
              </View>
            ),
            tabBarBackground: () => (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(31, 41, 55, 0.9)",
                  borderRadius: 18,
                }}
              />
            ),
          }}
        />

        {/* DOWNLOADS TAB */}
        <Tabs.Screen
          name="download_tab"
          options={{
            title: "Saved files",
            tabBarIcon: ({ color, focused }) => (
              <View
                className={`${focused ? "bg-blue-600/20" : ""} p-2 rounded-2xl`}
              >
                <Download size={24} color={color} />
              </View>
            ),
            tabBarBackground: () => (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(31, 41, 55, 0.9)",
                  borderRadius: 18,
                }}
              />
            ),
          }}
        />
      </Tabs>
    </DownloadProvider>
  );
}
