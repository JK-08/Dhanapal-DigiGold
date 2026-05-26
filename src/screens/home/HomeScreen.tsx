// src/screens/home/HomeScreen.tsx

import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { useTheme } from "../../theme";

import MainHeader from "../../components/ui/MainHeader";
import AppGoldPriceCard from "../../components/ui/appcomponents/AppGoldPriceCard";
import AppText from "../../components/ui/appcomponents/AppText";
import AppIcon from "../../components/ui/appcomponents/AppIcons";
import { useToast } from "../../components/ui/Toast";
import Sidebar from "../../components/Sidebar";
import HomeBanner from "../../components/HomeBanner";

export default function HomeScreen() {
  const { COLORS, SIZES } = useTheme();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <MainHeader
        onMenuPress={() => setSidebarOpen(true)}
        onNotificationPress={() => toast.info("No new notifications")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding.container,
          paddingBottom: 40,
          gap: 24,
        }}
      >
        {/* Home Banner */}
        <HomeBanner />

        {/* Gold Price Card */}
        <AppGoldPriceCard
          style={{ marginTop: 16 }}
          rates={{ "24K": 6325, "22K": 5798, "18K": 4744 }}
          change={{ "24K": 1.2, "22K": -0.4, "18K": 0.9 }}
          sparkline={{
            "24K": [6100, 6150, 6080, 6200, 6280, 6310, 6325],
            "22K": [5860, 5840, 5880, 5820, 5800, 5810, 5798],
            "18K": [4580, 4610, 4570, 4640, 4700, 4730, 4744],
          }}
          updatedAt="Today, 10:32 AM"
          onBuy={(k) =>
            toast.success(`Buy ${k} Gold`, {
              message: `₹${k === "24K" ? "6,325" : k === "22K" ? "5,798" : "4,744"}/gram`,
            })
          }
          onSell={(k) =>
            toast.warning(`Sell ${k} Gold`, {
              message: "Confirm in next step.",
            })
          }
          onRefresh={() => {
            setTimeout(() => toast.success("Rates updated"), 1000);
          }}
          showActions={false}
        />

        {/* Referral / Offer Banner */}
        <TouchableOpacity
          onPress={() =>
            toast.gold("Refer & Earn", {
              message: "Share code GOLD2026 and get 1g free!",
            })
          }
          style={{
            backgroundColor: "#FFF3E0",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: COLORS.secondary,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <AppIcon name="gift-outline" variant="gold" size={28} />
          <View style={{ flex: 1 }}>
            <AppText variant="bodyMedium" style={{ fontWeight: "bold" }}>
              Refer a Friend, Get 1g Gold Free!
            </AppText>
            <AppText variant="caption">
              Share your code and earn rewards.
            </AppText>
          </View>
          <AppIcon name="chevron-forward-outline" variant="ghost" />
        </TouchableOpacity>
      </ScrollView>

      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  );
}
