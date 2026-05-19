import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
  Animated,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../navigation/RootNavigator";

const ONBOARDING_KEY = '@onboarding_complete';
import Svg, {
  Rect,
  Circle,
  Path,
  Ellipse,
  Line,
  Polygon,
  Text as SvgText,
} from "react-native-svg";
import { COLORS, SIZES, FONTS, SHADOWS } from "../../theme/theme";

const { width, height } = Dimensions.get("window");

// ─────────────────────────────────────────
// ILLUSTRATIONS
// ─────────────────────────────────────────

const IllustrationScreen1 = () => (
  <Svg width={200} height={200} viewBox="0 0 200 200" fill="none">
    {/* Jewelry box base */}
    <Rect x={34} y={110} width={132} height={68} rx={10} fill={COLORS.primaryLight} />
    <Rect x={34} y={110} width={132} height={14} rx={6} fill={COLORS.primary} />
    {/* Box lid */}
    <Rect x={28} y={78} width={144} height={44} rx={10} fill={COLORS.primary} />
    <Rect x={28} y={78} width={144} height={14} rx={6} fill={COLORS.primaryDark} />
    {/* Ribbon vertical */}
    <Rect x={96} y={78} width={8} height={96} rx={4} fill={COLORS.secondary} />
    {/* Ribbon horizontal */}
    <Rect x={34} y={108} width={132} height={8} rx={4} fill={COLORS.secondary} />
    {/* Bow */}
    <Ellipse
      cx={100} cy={80} rx={22} ry={10}
      fill={COLORS.secondaryLight}
      transform="rotate(-20 100 80)"
    />
    <Ellipse
      cx={100} cy={80} rx={22} ry={10}
      fill={COLORS.secondaryLighter}
      transform="rotate(20 100 80)"
    />
    <Circle cx={100} cy={78} r={8} fill={COLORS.secondary} />
    <Circle cx={100} cy={78} r={4} fill={COLORS.primary} />
    {/* Gems */}
    <Polygon points="58,72 65,58 72,72" fill={COLORS.primaryLighter} />
    <Polygon points="128,72 135,58 142,72" fill={COLORS.primaryLighter} />
    {/* Sparkles */}
    <Line x1={25} y1={60} x2={25} y2={48} stroke={COLORS.secondary} strokeWidth={2} strokeLinecap="round" />
    <Line x1={19} y1={54} x2={31} y2={54} stroke={COLORS.secondary} strokeWidth={2} strokeLinecap="round" />
    <Line x1={172} y1={45} x2={172} y2={35} stroke={COLORS.primary} strokeWidth={2} strokeLinecap="round" />
    <Line x1={166} y1={40} x2={178} y2={40} stroke={COLORS.primary} strokeWidth={2} strokeLinecap="round" />
    <Circle cx={152} cy={65} r={3} fill={COLORS.secondary} opacity={0.7} />
    <Circle cx={44} cy={44} r={2.5} fill={COLORS.primary} opacity={0.6} />
  </Svg>
);

const IllustrationScreen2 = () => (
  <Svg width={200} height={200} viewBox="0 0 200 200" fill="none">
    {/* Phone card background */}
    <Rect x={44} y={36} width={112} height={148} rx={14} fill={COLORS.white} opacity={0.95} />
    <Rect x={44} y={36} width={112} height={148} rx={14} stroke={COLORS.primaryLight} strokeWidth={1.5} />
    {/* Header */}
    <Rect x={44} y={36} width={112} height={38} rx={14} fill={COLORS.primary} />
    <Rect x={44} y={60} width={112} height={14} fill={COLORS.primary} />
    <SvgText x={100} y={58} textAnchor="middle" fontSize={10} fill={COLORS.white} fontWeight="600">
      My Payments
    </SvgText>
    {/* Balance card */}
    <Rect x={56} y={84} width={88} height={36} rx={8} fill={COLORS.primaryPale} />
    <SvgText x={100} y={97} textAnchor="middle" fontSize={8} fill={COLORS.primaryDark} fontWeight="500">
      Balance Due
    </SvgText>
    <SvgText x={100} y={111} textAnchor="middle" fontSize={12} fill={COLORS.primary} fontWeight="700">
      ₹ 4,500
    </SvgText>
    {/* Progress bar */}
    <Rect x={56} y={130} width={88} height={6} rx={3} fill={COLORS.gray200} />
    <Rect x={56} y={130} width={58} height={6} rx={3} fill={COLORS.primary} />
    <SvgText x={56} y={145} fontSize={7} fill={COLORS.textTertiary}>3 of 5 paid</SvgText>
    <SvgText x={138} y={145} textAnchor="end" fontSize={7} fill={COLORS.success} fontWeight="600">60%</SvgText>
    {/* List items */}
    <Rect x={56} y={152} width={88} height={1} fill={COLORS.gray200} />
    <Circle cx={64} cy={162} r={4} fill={COLORS.success} />
    <SvgText x={72} y={165} fontSize={7.5} fill={COLORS.gray700}>Jan - ₹900</SvgText>
    <SvgText x={138} y={165} textAnchor="end" fontSize={7} fill={COLORS.success}>Paid</SvgText>
    <Circle cx={64} cy={175} r={4} fill={COLORS.primary} />
    <SvgText x={72} y={178} fontSize={7.5} fill={COLORS.gray700}>Feb - ₹900</SvgText>
    <SvgText x={138} y={178} textAnchor="end" fontSize={7} fill={COLORS.primary}>Due</SvgText>
  </Svg>
);

const IllustrationScreen3 = () => (
  <Svg width={200} height={200} viewBox="0 0 200 200" fill="none">
    {/* Bell body */}
    <Path
      d="M100 44 C72 44 56 64 56 86 L56 108 L44 122 L156 122 L144 108 L144 86 C144 64 128 44 100 44Z"
      fill={COLORS.primary}
    />
    <Path d="M56 108 L44 122 L156 122 L144 108Z" fill={COLORS.primaryDark} />
    <Circle cx={100} cy={44} r={8} fill={COLORS.primaryLight} />
    <Ellipse cx={100} cy={132} rx={14} ry={8} fill={COLORS.primaryLight} />
    <Circle cx={100} cy={138} r={6} fill={COLORS.primary} />
    {/* Notification card 1 */}
    <Rect x={110} y={52} width={62} height={26} rx={7} fill={COLORS.white} opacity={0.95} />
    <Rect x={110} y={52} width={62} height={26} rx={7} stroke={COLORS.gray200} strokeWidth={0.8} />
    <Circle cx={120} cy={65} r={5} fill={COLORS.primary} />
    <SvgText x={130} y={61} fontSize={6.5} fill={COLORS.gray700} fontWeight="600">Payment Due</SvgText>
    <SvgText x={130} y={71} fontSize={5.5} fill={COLORS.textTertiary}>₹900 · Tomorrow</SvgText>
    {/* Notification card 2 */}
    <Rect x={28} y={60} width={58} height={24} rx={7} fill={COLORS.white} opacity={0.95} />
    <Rect x={28} y={60} width={58} height={24} rx={7} stroke={COLORS.gray200} strokeWidth={0.8} />
    <Circle cx={38} cy={72} r={5} fill={COLORS.secondary} />
    <SvgText x={47} y={68} fontSize={6.5} fill={COLORS.gray700} fontWeight="600">Reminder</SvgText>
    <SvgText x={47} y={77} fontSize={5.5} fill={COLORS.textTertiary}>3 days left</SvgText>
    {/* Sparkles */}
    <Line x1={165} y1={90} x2={165} y2={82} stroke={COLORS.secondary} strokeWidth={1.8} strokeLinecap="round" />
    <Line x1={161} y1={86} x2={169} y2={86} stroke={COLORS.secondary} strokeWidth={1.8} strokeLinecap="round" />
    <Line x1={36} y1={130} x2={36} y2={124} stroke={COLORS.primary} strokeWidth={1.8} strokeLinecap="round" />
    <Line x1={33} y1={127} x2={39} y2={127} stroke={COLORS.primary} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

const IllustrationScreen4 = () => (
  <Svg width={200} height={200} viewBox="0 0 200 200" fill="none">
    {/* Trophy / Crown */}
    <Path d="M58 142 L58 96 L80 118 L100 76 L120 118 L142 96 L142 142Z" fill={COLORS.primary} />
    <Path d="M58 142 L142 142 L142 152 L58 152Z" fill={COLORS.primaryDark} />
    <Rect x={64} y={152} width={72} height={10} rx={4} fill={COLORS.secondary} />
    {/* Gems */}
    <Circle cx={100} cy={80} r={7} fill={COLORS.primaryLighter} />
    <Circle cx={78} cy={116} r={5} fill={COLORS.secondaryLighter} />
    <Circle cx={122} cy={116} r={5} fill={COLORS.secondaryLighter} />
    {/* Star inside */}
    <Polygon
      points="100,102 102,108 108,108 103,112 105,118 100,114 95,118 97,112 92,108 98,108"
      fill={COLORS.primaryPale}
      opacity={0.9}
    />
    {/* Sparkles */}
    <Line x1={46} y1={76} x2={46} y2={68} stroke={COLORS.secondary} strokeWidth={2} strokeLinecap="round" />
    <Line x1={42} y1={72} x2={50} y2={72} stroke={COLORS.secondary} strokeWidth={2} strokeLinecap="round" />
    <Line x1={156} y1={70} x2={156} y2={62} stroke={COLORS.primary} strokeWidth={2} strokeLinecap="round" />
    <Line x1={152} y1={66} x2={160} y2={66} stroke={COLORS.primary} strokeWidth={2} strokeLinecap="round" />
    <Circle cx={44} cy={120} r={3} fill={COLORS.primaryLight} opacity={0.7} />
    <Circle cx={160} cy={110} r={3} fill={COLORS.secondary} opacity={0.7} />
    <Circle cx={88} cy={54} r={2.5} fill={COLORS.primary} opacity={0.6} />
    <Circle cx={114} cy={50} r={2} fill={COLORS.secondary} opacity={0.5} />
  </Svg>
);

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

interface OnboardingSlide {
  id: string;
  title: string;
  titleHighlight: string;
  description: string;
  badge1Text: string;
  badge2Text: string;
  Illustration: React.FC;
  isLast?: boolean;
}

const slides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Welcome to ",
    titleHighlight: "Dhanapal Scheme",
    description:
      "Easy jewelry savings management at your fingertips. Plan, save, and sparkle!",
    badge1Text: "Gold Scheme",
    badge2Text: "₹ Savings Active",
    Illustration: IllustrationScreen1,
  },
  {
    id: "2",
    title: "Track Your ",
    titleHighlight: "Payments",
    description:
      "Monitor installments and balances in real-time. Never miss a payment again.",
    badge1Text: "5 Schemes",
    badge2Text: "On Track!",
    Illustration: IllustrationScreen2,
  },
  {
    id: "3",
    title: "Smart ",
    titleHighlight: "Notifications",
    description:
      "Get timely reminders and instant updates so you never fall behind on your scheme.",
    badge1Text: "Instant Alerts",
    badge2Text: "Smart Reminders",
    Illustration: IllustrationScreen3,
  },
  {
    id: "4",
    title: "Start ",
    titleHighlight: "Saving Today",
    description:
      "Join thousands managing their jewelry schemes easily. Your golden future begins now.",
    badge1Text: "Premium Schemes",
    badge2Text: "Trusted by 1000+",
    Illustration: IllustrationScreen4,
    isLast: true,
  },
];

// ─────────────────────────────────────────
// FLOATING BADGE
// ─────────────────────────────────────────

interface BadgeProps {
  text: string;
  color?: string;
  dotColor?: string;
  style?: object;
}

const FloatingBadge: React.FC<BadgeProps> = ({
  text,
  color = COLORS.primaryDark,
  dotColor = COLORS.primary,
  style,
}) => (
  <View style={[styles.floatingBadge, SHADOWS.sm, style]}>
    <View style={[styles.badgeDot, { backgroundColor: dotColor }]} />
    <Text style={[styles.badgeText, { color }]}>{text}</Text>
  </View>
);

// ─────────────────────────────────────────
// SINGLE SLIDE
// ─────────────────────────────────────────

interface SlideItemProps {
  item: OnboardingSlide;
  index: number;
  currentIndex: number;
  onSkip: () => void;
}

const SlideItem: React.FC<SlideItemProps> = ({ item, onSkip }) => {
  const { Illustration } = item;

  return (
    <View style={[styles.slide]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {!item.isLast ? (
          <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.brandLabel}>Dhanapal Jewels</Text>
        )}
      </View>

      {/* Illustration */}
      <View style={styles.illustrationArea}>
        {/* Outer ring */}
        <View style={styles.ringOuter} />
        {/* Circle bg */}
        <View style={styles.circleBg} />
        {/* SVG */}
        <View style={styles.svgWrapper}>
          <Illustration />
        </View>
        {/* Badges */}
        <FloatingBadge
          text={item.badge1Text}
          color={COLORS.secondaryDark}
          dotColor={COLORS.secondary}
          style={styles.badge1}
        />
        <FloatingBadge
          text={item.badge2Text}
          color={COLORS.successDark}
          dotColor={COLORS.success}
          style={styles.badge2}
        />
      </View>

      {/* Content */}
      <View style={styles.contentSection}>
        <View style={styles.divider} />
        <Text style={styles.slideTitle}>
          {item.title}
          <Text style={styles.slideTitleHighlight}>{item.titleHighlight}</Text>
        </Text>
        <Text style={styles.slideDesc}>{item.description}</Text>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    flatListRef.current?.scrollToIndex({ index: slides.length - 1 });
    setCurrentIndex(slides.length - 1);
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    navigation.replace('Main');
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item, index }) => (
          <SlideItem
            item={item}
            index={index}
            currentIndex={currentIndex}
            onSkip={handleSkip}
          />
        )}
      />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => {
            const isActive = i === currentIndex;
            const isDone = i < currentIndex;
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  isActive && styles.dotActive,
                  isDone && styles.dotDone,
                  isLastSlide && isActive && styles.dotActiveGold,
                ]}
              />
            );
          })}
        </View>

        {/* Button */}
        {!isLastSlide ? (
          <TouchableOpacity
            style={styles.btnNext}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.btnNextText}>Next  →</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.btnGetStarted}
              onPress={handleGetStarted}
              activeOpacity={0.85}
            >
              <Text style={styles.btnGetStartedText}>✦  Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.signInText}>
                Already a member?{" "}
                <Text style={styles.signInLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────

const CIRCLE_SIZE = 240;
const RING_SIZE = 264;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Slide ──
  slide: {
    width,
    flex: 1,
  },

  // ── Top Bar ──
  topBar: {
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingHorizontal: SIZES.padding.xl,
    alignItems: "flex-end",
  },
  skipBtn: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.full,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  skipText: {
    fontFamily: FONTS.family.medium,
    fontSize: SIZES.font.sm,
    color: COLORS.textSecondary,
  },
  brandLabel: {
    fontFamily: FONTS.family.semiBold,
    fontSize: SIZES.font.sm,
    color: COLORS.primary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // ── Illustration ──
  illustrationArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: SIZES.md,
    height: RING_SIZE + 20,
    position: "relative",
  },
  ringOuter: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 1.5,
    borderColor: COLORS.goldOpacity30,
    borderStyle: "dashed",
  },
  circleBg: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: COLORS.primaryPale,
    borderWidth: 1.5,
    borderColor: COLORS.orangeOpacity20,
  },
  svgWrapper: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingBadge: {
    position: "absolute",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    borderColor: COLORS.orangeOpacity20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  badge1: {
    top: 12,
    right: 20,
  },
  badge2: {
    bottom: 12,
    left: 16,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  badgeText: {
    fontFamily: FONTS.family.semiBold,
    fontSize: 10,
  },

  // ── Content ──
  contentSection: {
    alignItems: "center",
    paddingHorizontal: SIZES.padding.xxl,
    marginTop: SIZES.sm,
  },
  divider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginBottom: SIZES.sm,
  },
  slideTitle: {
    fontFamily: FONTS.family.bold,
    fontSize: SIZES.heading.h3,
    color: COLORS.textPrimary,
    textAlign: "center",
    lineHeight: SIZES.heading.h3 * 1.25,
    marginBottom: SIZES.xs,
    letterSpacing: -0.3,
  },
  slideTitleHighlight: {
    color: COLORS.primary,
  },
  slideDesc: {
    fontFamily: FONTS.family.regular,
    fontSize: SIZES.font.sm,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: SIZES.font.sm * 1.6,
    maxWidth: 290,
  },

  // ── Bottom ──
  bottomSection: {
    paddingHorizontal: SIZES.padding.xl,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
    paddingTop: SIZES.md,
    alignItems: "center",
    gap: SIZES.md,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.gray200,
  },
  dotActive: {
    width: 22,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  dotActiveGold: {
    backgroundColor: COLORS.secondary,
  },
  dotDone: {
    backgroundColor: COLORS.orangeOpacity30,
  },

  // ── Buttons ──
  btnNext: {
    width: "100%",
    height: SIZES.button.height.lg,
    borderRadius: SIZES.radius.lg,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.orange,
  },
  btnNextText: {
    fontFamily: FONTS.family.semiBold,
    fontSize: SIZES.font.lg,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  btnGetStarted: {
    width: "100%",
    height: SIZES.button.height.lg,
    borderRadius: SIZES.radius.lg,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.gold,
  },
  btnGetStartedText: {
    fontFamily: FONTS.family.bold,
    fontSize: SIZES.font.lg,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  signInText: {
    fontFamily: FONTS.family.regular,
    fontSize: SIZES.font.xs,
    color: COLORS.textTertiary,
  },
  signInLink: {
    fontFamily: FONTS.family.semiBold,
    color: COLORS.primary,
  },
});

export default OnboardingScreen;