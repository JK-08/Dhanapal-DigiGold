import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  withDelay,
  interpolate,
  Extrapolation,
  Easing,
  FadeIn,
  type SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { AsyncStorageHelper } from '../../utils/AsyncStorageHelper';
import { FONTS, SIZES, COLORS } from '../../theme/theme';
import { useOnboardingBanners } from '../../api/hooks/Onboard/useOnboardingBanners';
import { useCompanies } from '../../api/hooks/Company/useCompanies';
import CompanyLogo from '../../components/ui/CompanyLogo';

const { width, height } = Dimensions.get('window');

type Slide = {
  id: string;
  image: { uri: string };
};

/* ─── Full-screen image slide ─── */
function Slide({
  item,
  index,
  scrollX,
}: {
  item: Slide;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const imgStyle = useAnimatedStyle(() => {
    const range = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            range,
            [1.08, 1, 1.08],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <View style={sl.container}>
      <Animated.Image
        source={item.image}
        style={[sl.image, imgStyle]}
        resizeMode="cover"
      />
    </View>
  );
}

const sl = StyleSheet.create({
  container: { width, height, overflow: 'hidden' },
  image: { width, height },
});

/* ─── Shimmer gold button ─── */
function GoldButton({ label, onPress }: { label: string; onPress: () => void }) {
  const shimX = useSharedValue(-width);
  const sc = useSharedValue(1);

  useEffect(() => {
    shimX.value = withRepeat(
      withSequence(
        withDelay(1400, withTiming(width, { duration: 950, easing: Easing.out(Easing.cubic) })),
        withTiming(-width, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, []);

  const shimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimX.value }, { rotate: '20deg' }],
  }));
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));

  return (
    <Animated.View style={[pressStyle, { flex: 1 }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => { sc.value = withSpring(0.96, { damping: 14 }); }}
        onPressOut={() => { sc.value = withSpring(1, { damping: 10 }); }}
        onPress={onPress}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={[COLORS.secondaryLight, COLORS.secondary, COLORS.secondaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.goldBtn}
        >
          <View style={s.shimClip} pointerEvents="none">
            <Animated.View style={[s.shimBar, shimStyle]} />
          </View>
          <Text style={s.goldBtnTxt}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ─── Dot indicator ─── */
function Dot({ active }: { active: boolean }) {
  const w = useSharedValue(active ? 24 : 7);
  useEffect(() => {
    w.value = withSpring(active ? 24 : 7, { damping: 14, stiffness: 180 });
  }, [active]);
  const style = useAnimatedStyle(() => ({
    width: w.value,
    opacity: withTiming(active ? 1 : 0.35, { duration: 250 }),
  }));
  return (
    <Animated.View
      style={[
        s.dot,
        style,
        { backgroundColor: active ? COLORS.secondary : COLORS.white },
      ]}
    />
  );
}

/* ─── Main screen ─── */
const OnboardingScreen = ({ navigation }: any) => {
  const flatRef = useRef<any>(null);
  const [idx, setIdx] = useState(0);
  const scrollX = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const { banners, loading, getImageUrl } = useOnboardingBanners();
  const { companies } = useCompanies();
  const company = companies[0];

  const slides: Slide[] = banners.map((b) => ({
    id: String(b.BannerId),
    image: { uri: getImageUrl(b.image_path) },
  }));

  const isLast = idx === slides.length - 1;

  const goTo = (i: number) =>
    flatRef.current?.scrollToIndex({ index: i, animated: true });

  const handleNext = () => {
    if (!isLast) { goTo(idx + 1); return; }
    AsyncStorageHelper.setOnboarded();
    navigation.replace('Register');
  };
  const handleLogin = () => {
    AsyncStorageHelper.setOnboarded();
    navigation.replace('Login');
  };
  const handleSkip = () => {
    AsyncStorageHelper.setOnboarded();
    navigation.replace('Register');
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => { scrollX.value = e.contentOffset.x; },
  });
  const onMomentumEnd = useCallback((e: any) => {
    setIdx(Math.round(e.nativeEvent.contentOffset.x / width));
  }, []);

  if (loading) {
    return (
      <View style={[s.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* ── Full-screen carousel ── */}
      <Animated.FlatList
        ref={flatRef}
        data={slides}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <Slide item={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={onMomentumEnd}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Top bar: logo + skip ── */}
      <Animated.View entering={FadeIn.duration(800)} style={[s.topBar, { top: insets.top + 10 }]}>
        <View style={s.logoWrap}>
          <CompanyLogo company={company} style={s.logo} resizeMode="cover" />
        </View>
        {!isLast && (
          <TouchableOpacity onPress={handleSkip} style={s.skipBtn} activeOpacity={0.7}>
            <BlurView intensity={30} tint="dark" style={s.skipBlur}>
              <Text style={s.skipTxt}>Skip</Text>
            </BlurView>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* ── Bottom content panel ── */}
      <View style={[s.bottomPanel, { paddingBottom: insets.bottom + 16 }]}>
        <View style={s.ctaRow}>
          {/* <View style={s.dots}>
            {slides.map((_, i) => <Dot key={i} active={i === idx} />)}
          </View> */}
          

          <View style={s.btnGroup}>
            <TouchableOpacity style={s.signInWrap} onPress={handleLogin} activeOpacity={0.8}>
              <LinearGradient
                colors={[COLORS.secondaryLight, COLORS.secondary, COLORS.secondaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.outlineBtn}
              >
                <Text style={s.outlineTxt}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>
            <GoldButton
              label={isLast ? 'Get Started' : 'Next →'}
              onPress={handleNext}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const BOTTOM_H = height * 0.2;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.black },

  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  logoWrap: {
    borderRadius: 17,
    overflow: 'hidden',
    // backgroundColor: COLORS.blackOpacity30,
    padding: 6,
  },
  logo: { width: 34, height: 34 },
  skipBtn: { borderRadius: 20, overflow: 'hidden', backgroundColor: COLORS.surfacePage },
  skipBlur: { paddingHorizontal: 16, paddingVertical: 8 },
  skipTxt: {
    fontFamily: FONTS.family.medium,
    fontSize: SIZES.font.md,
    color: COLORS.black,
    letterSpacing: 0.4,
    fontWeight: 'bold',
  },

  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_H,
    paddingHorizontal: 26,
    justifyContent: 'flex-end',
  },

  ctaRow: { gap: 16 },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 7, borderRadius: 4 },

  btnGroup: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  signInWrap: { flex: 0.75 },
  outlineBtn: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  outlineTxt: {
    fontFamily: FONTS.family.semiBold,
    fontSize: SIZES.font.md,
    color: COLORS.backgroundDark,
    letterSpacing: 0.3,
    fontWeight: 'bold',
  },

  goldBtn: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 12,
  },
  shimClip: { ...StyleSheet.absoluteFillObject, overflow: 'hidden', borderRadius: 14 },
  shimBar: {
    position: 'absolute',
    top: -40,
    bottom: -40,
    width: 52,
    backgroundColor: COLORS.whiteOpacity30,
  },
  goldBtnTxt: {
    fontFamily: FONTS.family.bold,
    fontSize: SIZES.font.md,
    color: COLORS.backgroundDark,
    letterSpacing: 0.4,
  },
});
