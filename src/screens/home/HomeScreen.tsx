// src/screens/home/HomeScreen.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ViewToken,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootStackParamList } from '../../navigation/RootNavigator';
import { useSchemes } from '../../api/hooks/Schemes/useSchemes';
import { useMySchemes } from '../../api/hooks/Account/useMySchemes';
import { useTheme } from '../../theme';
import MainHeader from '../../components/ui/MainHeader';
import PoweredByFooter from '../../components/ui/PoweredByFooter';
import HomeBanner from '../../components/HomeBanner';
import InAppMessageModal from '../../components/InAppMessageModal';
import GlassSchemeCard from '../../components/ui/GlassSchemeCard';
import SchemeListCard from '../../components/ui/SchemeListCard';

const { width: SCREEN_W } = Dimensions.get('window');
type NavProps = NativeStackNavigationProp<RootStackParamList>;



// ── Section Header ────────────────────────────────────────────────
function SectionHeader({ title, subtitle, onViewAll }: { title: string; subtitle?: string; onViewAll?: () => void }) {
  const { COLORS, FONTS } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <View>
        <Text style={{ color: COLORS.contentPrimary, fontFamily: FONTS.family.bold, fontSize: 17 }}>{title}</Text>
        {subtitle ? <Text style={{ color: COLORS.contentMuted, fontFamily: FONTS.family.regular, fontSize: 12, marginTop: 2 }}>{subtitle}</Text> : null}
      </View>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Text style={{ color: COLORS.brand, fontFamily: FONTS.family.semiBold, fontSize: 13 }}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Dot Indicator Component ──────────────────────────────────────
function DotIndicator({
  total,
  activeIndex,
  color,
  dotSize = 8,
  activeDotSize = 20,
  dotGap = 6,
}: {
  total: number;
  activeIndex: number;
  color?: string;
  dotSize?: number;
  activeDotSize?: number;
  dotGap?: number;
}) {
  const { COLORS } = useTheme();
  const activeColor = color ?? COLORS.secondary;

  if (total === 0) return null;

  const maxDots = 10;
  const displayTotal = Math.min(total, maxDots);
  const remaining = total - maxDots;

  return (
    <View style={[dotsStyles.container, { gap: dotGap }]}>
      {Array.from({ length: displayTotal }).map((_, i) => (
        <View
          key={i}
          style={[
            dotsStyles.dot,
            {
              backgroundColor: i === activeIndex ? activeColor : COLORS.borderSubtle,
              width: i === activeIndex ? activeDotSize : dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
            },
          ]}
        />
      ))}
      {remaining > 0 && (
        <Text style={[dotsStyles.count, { color: COLORS.contentMuted }]}>
          +{remaining}
        </Text>
      )}
    </View>
  );
}

const dotsStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dot: {},
  count: {
    fontSize: 12,
    fontFamily: 'System',
    marginLeft: 4,
  },
});

// ── Main Screen ───────────────────────────────────────────────────
export default function HomeScreen() {
  const { COLORS, FONTS, SIZES, SHADOWS } = useTheme();
  const navigation = useNavigation<NavProps>();

  const { schemes, loading: schemesLoading } = useSchemes();
  const { mySchemes, loading: mySchemesLoading } = useMySchemes();

  const activeSchemes = schemes.filter(s => s.ACTIVE === 'Y');

  // Friendly section greetings
  const mySchemesGreeting = mySchemesLoading
    ? 'Loading your gold portfolio…'
    : mySchemes.length > 0
      ? `Great job staying consistent! ${mySchemes.length} active enrolment${mySchemes.length !== 1 ? 's' : ''} 🌟`
      : 'Ready to start your gold journey? 💰';

  const allSchemesGreeting = 'Find a savings plan that fits your goals ✨';

  // State for dot indicators
  const [mySchemesIndex, setMySchemesIndex] = useState(0);
  const [allSchemesIndex, setAllSchemesIndex] = useState(0);

  // Refs for FlatList
  const mySchemesFlatListRef = useRef<FlatList>(null);
  const allSchemesFlatListRef = useRef<FlatList>(null);

  // Handle scroll for My Schemes
  const handleMySchemesScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_W);
    setMySchemesIndex(index);
  };

  // Handle scroll for All Schemes
  const handleAllSchemesScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_W);
    setAllSchemesIndex(index);
  };

  // Viewable items changed handler for My Schemes
  const onMySchemesViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index || 0;
      setMySchemesIndex(index);
    }
  }).current;

  // Viewable items changed handler for All Schemes
  const onAllSchemesViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index || 0;
      setAllSchemesIndex(index);
    }
  }).current;

  // Full-width slider geometry: each "page" advances by the full screen width.
  const PAD = SIZES.padding.container;
  const SLIDE_W = SCREEN_W - PAD * 2;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surfacePage }}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header — inside scroll so it scrolls away */}
        <MainHeader onProfilePress={() => navigation.navigate('Profile' as any)} />


        {/* Banner */}
        <View style={{ paddingHorizontal: SIZES.padding.container, marginTop: 24 }}>
          <HomeBanner />
        </View>


        {/* ── My Joined Schemes ── */}
        <View style={{ marginTop: 24 }}>
          <View style={{ paddingHorizontal: SIZES.padding.container }}>
            <SectionHeader
              title="My Schemes"
              subtitle={mySchemesGreeting}
              onViewAll={() => (navigation as any).navigate('Scheme')}
            />
          </View>

          {mySchemesLoading ? (
            <View style={{ paddingVertical: 28, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={COLORS.brand} />
            </View>
          ) : (
            <>
              <FlatList
                ref={mySchemesFlatListRef}
                horizontal
                data={mySchemes}
                keyExtractor={(item, index) => `${item.regNo ?? 'scheme'}-${index}`}
                renderItem={({ item }) => (
                  <View
                    style={{
                      width: SCREEN_W,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <GlassSchemeCard
                      item={item}
                      width={SCREEN_W - 32}
                    />
                  </View>
                )}
                pagingEnabled
                snapToAlignment="center"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={handleMySchemesScroll}
                onViewableItemsChanged={onMySchemesViewableItemsChanged}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 50,
                }}
                contentContainerStyle={{
                  alignItems: 'center',
                }}
                ListEmptyComponent={
                  <View
                    style={[
                      pageS.emptyBox,
                      {
                        width: SCREEN_W,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: COLORS.borderSubtle,
                      },
                    ]}
                  >
                    <Ionicons
                      name="diamond-outline"
                      size={28}
                      color={COLORS.contentMuted}
                    />
                    <Text
                      style={[
                        pageS.emptyTxt,
                        {
                          color: COLORS.contentMuted,
                          fontFamily: FONTS.family.regular,
                        },
                      ]}
                    >
                      No schemes joined yet
                    </Text>
                  </View>
                }
              />

              {/* Dots for My Schemes */}
              {mySchemes.length > 0 && (
                <DotIndicator
                  total={mySchemes.length}
                  activeIndex={mySchemesIndex}
                />
              )}
            </>
          )}
        </View>

        {/* ── All Schemes (full-width slider) ── */}
        <View style={{ marginTop: 24 }}>
          <View style={{ paddingHorizontal: SIZES.padding.container }}>
            <SectionHeader
              title="All Schemes"
              subtitle={allSchemesGreeting}
              onViewAll={() => (navigation as any).navigate('Scheme')}
            />
          </View>
          {schemesLoading ? (
            <View style={{ paddingVertical: 28, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={COLORS.brand} />
            </View>
          ) : (
            <>
              <FlatList
                ref={allSchemesFlatListRef}
                horizontal
                data={activeSchemes}
                keyExtractor={(item, index) => `${item.SchemeId ?? 'scheme'}-${index}`}
                renderItem={({ item }) => (
                  <SchemeListCard
                    item={item}
                    width={SLIDE_W}
                    onJoin={(s) => (navigation as any).navigate('SchemeDetails', { scheme: s })}
                  />
                )}
                contentContainerStyle={{ paddingHorizontal: PAD }}
                ItemSeparatorComponent={() => <View style={{ width: PAD * 2 }} />}
                snapToInterval={SCREEN_W}
                snapToAlignment="start"
                decelerationRate="fast"
                disableIntervalMomentum
                showsHorizontalScrollIndicator={false}
                onScroll={handleAllSchemesScroll}
                onViewableItemsChanged={onAllSchemesViewableItemsChanged}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 50,
                }}
                ListEmptyComponent={
                  <View style={{ paddingHorizontal: SIZES.padding.container }}>
                    <Text style={{ color: COLORS.contentMuted, fontFamily: FONTS.family.regular }}>
                      No schemes available
                    </Text>
                  </View>
                }
              />

              {/* Dots for All Schemes */}
              {activeSchemes.length > 0 && (
                <DotIndicator
                  total={activeSchemes.length}
                  activeIndex={allSchemesIndex}
                  color={COLORS.brand}
                />
              )}
            </>
          )}
        </View>

        <PoweredByFooter />
      </ScrollView>

      {/* <InAppMessageModal /> */}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const tipS = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  iconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});

const pageS = StyleSheet.create({
  emptyBox: {
    width: SCREEN_W * 0.7,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyTxt: { fontSize: 13 },
});