import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
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

const { width, height } = Dimensions.get('window');

const LOCAL_SLIDES = [
  {
    id: 'slide1',
    image: require('../../assets/onboard/onboard1.jpg'),
    title: 'Your Digital\nGold Vault',
    tag: 'SMART INVESTING',
    description: 'Buy, sell and grow 24K digital gold from the comfort of your home.',
  },
  {
    id: 'slide2',
    image: require('../../assets/onboard/onboard2.jpg'),
    title: 'Secured &\nInsured Gold',
    tag: 'TRUST & SAFETY',
    description: 'Every gram you own is 100% insured and stored in certified vaults.',
  },
  {
    id: 'slide3',
    image: require('../../assets/onboard/onboard3.jpg'),
    title: 'Start With\nJust ₹100',
    tag: 'FOR EVERYONE',
    description: 'No minimum investment. Build your gold portfolio at your own pace.',
  },
];

/* ─── Full-screen image slide ─── */
function Slide({
  item,
  index,
  scrollX,
}: {
  item: typeof LOCAL_SLIDES[0];
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
      {/* Deep cinematic gradient — dark top + very dark bottom */}
      <LinearGradient
        colors={[
          COLORS.blackOpacity50,
          COLORS.transparent,
          COLORS.blackOpacity10,
          COLORS.blackOpacity90,
        ]}
        locations={[0, 0.3, 0.55, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
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

/* ─── Scroll-driven text block for one slide ─── */
function SlideText({
  item,
  index,
  scrollX,
}: {
  item: typeof LOCAL_SLIDES[0];
  index: number;
  scrollX: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const range = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      opacity: interpolate(scrollX.value, range, [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(
            scrollX.value,
            range,
            [16, 0, -16],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style, s.textBlock]}>
      <View style={s.tagRow}>
        <View style={s.tagLine} />
        <Text style={s.tagTxt}>{item.tag}</Text>
      </View>
      <Text style={s.title}>{item.title}</Text>
      <Text style={s.desc}>{item.description}</Text>
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
  const { banners, getImageUrl } = useOnboardingBanners();

  // Build slides: prefer API banners, fall back to local
  const slides = LOCAL_SLIDES;

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
          <Image
            source={require('../../assets/company/logo.png')}
            style={s.logo}
            resizeMode="contain"
          />
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
        {/* Scroll-driven text — all slides stacked, driven by scrollX */}
        <View style={s.textHost}>
          {slides.map((item, i) => (
            <SlideText key={item.id} item={item} index={i} scrollX={scrollX} />
          ))}
        </View>

        {/* Dots + Buttons — static, no remount */}
        <View style={s.ctaRow}>
          <View style={s.dots}>
            {slides.map((_, i) => <Dot key={i} active={i === idx} />)}
          </View>
          <View style={s.btnGroup}>
            <TouchableOpacity
              style={s.outlineBtn}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={s.outlineTxt}>Sign In</Text>
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

const BOTTOM_H = height * 0.38;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.black },

  /* top bar — top offset applied dynamically via insets */
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
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.blackOpacity30,
    padding: 6,
  },
  logo: { width: 110, height: 34 },
  skipBtn: { borderRadius: 20, overflow: 'hidden',backgroundColor:COLORS.surfacePage },
  skipBlur: { paddingHorizontal: 16, paddingVertical: 8 },
  skipTxt: {
    fontFamily: FONTS.family.medium,
    fontSize: SIZES.font.md,
    color: COLORS.black,
    letterSpacing: 0.4,
    fontWeight:"bold"
  },

  /* slide number badge */
  slideBadge: {
    position: 'absolute',
    top: height * 0.44,
    right: 22,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  slideBadgeNum: {
    fontFamily: FONTS.family.extraBold,
    fontSize: 36,
    color: COLORS.secondary,
    lineHeight: 38,
    letterSpacing: -1,
  },
  slideBadgeSep: {
    fontFamily: FONTS.family.light,
    fontSize: 18,
    color: COLORS.whiteOpacity30,
  },
  slideBadgeTotal: {
    fontFamily: FONTS.family.regular,
    fontSize: 16,
    color: COLORS.whiteOpacity30,
  },

  /* bottom panel — paddingBottom applied dynamically via insets */
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_H,
    paddingHorizontal: 26,
    justifyContent: 'flex-end',
  },

  textHost: {
    height: 160,
    marginBottom: 20,
  },
  textBlock: {
    justifyContent: 'flex-end',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  tagLine: {
    width: 28,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.secondary,
  },
  tagTxt: {
    fontFamily: FONTS.family.semiBold,
    fontSize: 11,
    color: COLORS.secondary,
    letterSpacing: 2.5,
  },

  title: {
    fontFamily: FONTS.family.extraBold,
    fontSize: 36,
    color: COLORS.white,
    lineHeight: 42,
    letterSpacing: -0.8,
    marginBottom: 10,
  },
  desc: {
    fontFamily: FONTS.family.regular,
    fontSize: SIZES.font.md,
    color: COLORS.whiteOpacity50,
    lineHeight: SIZES.font.md * 1.65,
  },

  ctaRow: { gap: 16 },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 7, borderRadius: 4 },

  btnGroup: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  outlineBtn: {
    flex: 0.75,
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.whiteOpacity20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineTxt: {
    fontFamily: FONTS.family.semiBold,
    fontSize: SIZES.font.md,
    color: COLORS.whiteOpacity80,
    letterSpacing: 0.3,
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
