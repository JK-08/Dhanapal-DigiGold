
// theme.js
import { Dimensions, PixelRatio, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// ============================================
// 📏 RESPONSIVE SCALING SYSTEM
// ============================================
const guidelineBaseWidth = 375; // iPhone 11 Pro base
const guidelineBaseHeight = 812;

// Scale based on device width
const scale = (size) => (width / guidelineBaseWidth) * size;

// Scale based on device height
const verticalScale = (size) => (height / guidelineBaseHeight) * size;

// Moderate scale with configurable factor (prevents extreme scaling)
const moderateScale = (size, factor = 0.25) => {
  return size + (scale(size) - size) * factor;
};

// Font scale with pixel ratio consideration
const fontScale = (size) => {
  const scaled = moderateScale(size, 0.2);
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

// ============================================
// 🎨 COLOR PALETTE - 
// ============================================
export const COLORS = {
  // ===== PRIMARY BRAND COLORS (CHERRY RED) =====
  primary: "#C2185B",           // Cherry Red (Main Brand)
  primaryLight: "#D8467F",      // Medium Cherry Red
  primaryDark: "#8E0F42",       // Deep Cherry Red
  primaryLighter: "#F3AFC9",    // Soft Pink
  primaryPale: "#FFF8F5",       // Soft Cream (very light)

  secondary: "#A8CFA8",         // Sage Green
  secondaryLight: "#C3DFC3",    // Light Sage
  secondaryDark: "#7FAF7F",     // Dark Sage
  secondaryLighter: "#E3EFE3",  // Pale Sage

  accent: "#A8CFA8",             // Sage Green
  accentLight: "#E3EFE3",        // Pale Sage
  accentDark: "#7FAF7F",         // Dark Sage
  bottomGlow: "rgb(194, 24, 91)",

  // ===== NEUTRAL COLORS =====
  white: "#FFFFFF",
  black: "#000000",
  background: "#FAFAF8",         // Off White (page background)
  backgroundSecondary: "#F2F2EE", // Deeper off-white
  backgroundTertiary: "#E8E8E2",  // Deepest off-white
  backgroundDark: "#1A1A1A",      // Near-black (dark surfaces)
  backgroundOrange: "#FAFAF8",    // Reuse off white
  backgroundGold: "#EDF5ED",      // Light sage tint
  surface: "#FFFFFF",             // White surface
  card: "#FFFFFF",
  softCard: "#F2F2EE",
  overlay: "rgba(194, 24, 91, 0.7)",    // Cherry red overlay
  overlayDark: "rgba(0, 0, 0, 0.7)",
  overlayGold: "rgba(168, 207, 168, 0.1)",
  overlayOrange: "rgba(194, 24, 91, 0.1)",

  // ===== TEXT COLORS =====
  textPrimary: "#2D2D2D",        // Charcoal (readable)
  textSecondary: "#5C5C5C",      // Medium gray
  textTertiary: "#8C8C8C",       // Light gray
  textDisabled: "#C7C7C7",       // Muted gray
  textInverse: "#FFFFFF",        // White on dark
  textOrange: "#C2185B",         // Reuse primary cherry red
  textOrangeDark: "#8E0F42",     // Deep cherry red text
  textGold: "#A8CFA8",           // Sage green text (secondary)
  textGoldDark: "#7FAF7F",       // Dark sage text

  // ===== GRAY SCALE =====
  gray50: "#FAFAFA",
  gray100: "#F0F0F0",
  gray200: "#E0E0E0",
  gray300: "#C7C7C7",
  gray400: "#9E9E9E",
  gray500: "#757575",
  gray600: "#5C5C5C",
  gray700: "#424242",
  gray800: "#2D2D2D",
  gray900: "#1A1A1A",

  // ===== BRAND VARIATIONS =====
  orangeLight: "#FFF8F5",         // Soft Cream
  orangeMedium: "#C2185B",        // Cherry Red
  orangeDark: "#8E0F42",          // Deep Cherry Red
  orangeVivid: "#D8467F",         // Medium vivid Cherry Red
  orangeIce: "#FBE0D6",           // Deep Cream
  orangeSoft: "#F3AFC9",          // Soft Pink
  orangeDeep: "#6B0930",          // Darkest Cherry Red

  // ===== BORDER & DIVIDER =====
  border: "#E0E0E0",
  borderLight: "#F0F0F0",
  borderMedium: "#C7C7C7",
  borderDark: "#5C5C5C",
  borderOrange: "#C2185B",
  borderGold: "#A8CFA8",
  divider: "#E0E0E0",

  // ===== INPUT COLORS =====
  inputBackground: "#FFFFFF",
  inputBorder: "#E0E0E0",
  inputPlaceholder: "rgba(92, 92, 92, 0.5)",
  inputFocused: "#C2185B",        // Cherry red focus ring
  inputFocusedAlt: "#A8CFA8",     // Sage green alternative

  // ===== STATUS COLORS =====
  success: "#2E7D32",
  successLight: "#4CAF50",
  successDark: "#1B5E20",
  error: "#C62828",
  errorLight: "#E53935",
  errorDark: "#8E0000",
  warning: "#D97706",
  warningLight: "#F59E0B",
  warningDark: "#B45309",
  info: "#1565C0",
  infoLight: "#42A5F5",
  infoDark: "#0D47A1",
  disabled: "#F0F0F0",

  // ===== GOLD VARIATIONS (mapped to secondary sage green) =====
  goldPrimary: "#A8CFA8",         // Sage Green
  goldSecondary: "#C3DFC3",       // Light Sage
  goldTertiary: "#E3EFE3",        // Pale Sage
  goldBronze: "#5F8F5F",          // Deep Sage
  goldRose: "#C2185B",            // Rose tint (cherry red)
  goldLight: "#EDF5ED",           // Very light sage
  goldMedium: "#A8CFA8",          // Medium sage
  goldDark: "#7FAF7F",            // Dark sage

  // ===== TRANSPARENT COLORS =====
  transparent: "transparent",
  // Cherry red (primary) opacity
  orangeOpacity10: "rgba(194, 24, 91, 0.1)",
  orangeOpacity20: "rgba(194, 24, 91, 0.2)",
  orangeOpacity30: "rgba(194, 24, 91, 0.3)",
  orangeOpacity40: "rgba(194, 24, 91, 0.4)",
  orangeOpacity50: "rgba(194, 24, 91, 0.5)",
  orangeOpacity60: "rgba(194, 24, 91, 0.6)",
  orangeOpacity70: "rgba(194, 24, 91, 0.7)",
  orangeOpacity80: "rgba(194, 24, 91, 0.8)",
  orangeOpacity90: "rgba(194, 24, 91, 0.9)",
  // Black opacity
  blackOpacity10: "rgba(0, 0, 0, 0.1)",
  blackOpacity20: "rgba(0, 0, 0, 0.2)",
  blackOpacity30: "rgba(0, 0, 0, 0.3)",
  blackOpacity40: "rgba(0, 0, 0, 0.4)",
  blackOpacity50: "rgba(0, 0, 0, 0.5)",
  blackOpacity60: "rgba(0, 0, 0, 0.6)",
  blackOpacity70: "rgba(0, 0, 0, 0.7)",
  blackOpacity80: "rgba(0, 0, 0, 0.8)",
  blackOpacity90: "rgba(0, 0, 0, 0.9)",
  // White opacity
  whiteOpacity10: "rgba(255, 255, 255, 0.1)",
  whiteOpacity20: "rgba(255, 255, 255, 0.2)",
  whiteOpacity30: "rgba(255, 255, 255, 0.3)",
  whiteOpacity50: "rgba(255, 255, 255, 0.5)",
  whiteOpacity70: "rgba(255, 255, 255, 0.7)",
  whiteOpacity80: "rgba(255, 255, 255, 0.8)",
  whiteOpacity90: "rgba(255, 255, 255, 0.9)",
  // Gold opacity (sage green)
  goldOpacity10: "rgba(168, 207, 168, 0.1)",
  goldOpacity20: "rgba(168, 207, 168, 0.2)",
  goldOpacity30: "rgba(168, 207, 168, 0.3)",
  goldOpacity50: "rgba(168, 207, 168, 0.5)",

  // ===== SHADOW & EFFECTS =====
  shadow: "rgba(45, 45, 45, 0.08)",
  shadowMedium: "rgba(45, 45, 45, 0.15)",
  shadowStrong: "rgba(45, 45, 45, 0.25)",
  shadowOrange: "rgba(194, 24, 91, 0.2)",
  shadowGold: "rgba(168, 207, 168, 0.25)",

  // ===== GRADIENT COLORS =====
  gradient: {
    // Primary cherry red gradients
    orangePrimary: ["#C2185B", "#D8467F"],       // Cherry red to medium cherry red
    orangeDeep: ["#8E0F42", "#C2185B"],          // Deep to medium cherry red
    orangeLight: ["#D8467F", "#F3AFC9"],         // Cherry red to soft pink
    orangeVivid: ["#8E0F42", "#D8467F"],         // Deep vivid cherry red
    orangeToWhite: ["#C2185B", "#FAFAF8"],       // Cherry red to off white
    orangeToRed: ["#C2185B", "#A8CFA8E0"],       // Cherry red to sage green

    // Sage green gradients
    goldLight: ["#A8CFA8", "#C3DFC3"],           // Sage gradient
    goldDark: ["#7FAF7F", "#A8CFA8"],            // Dark to light sage
    luxuryGold: ["#A8CFA8", "#C3DFC3", "#E3EFE3"], // Full sage range
    shimmer: ["#A8CFA8", "#E3EFE3", "#A8CFA8"],    // Shimmer effect

    // Cherry Red & Sage Green combinations
    orangeToGold: ["#C2185B", "#A8CFA8"],        // Cherry red to sage green
    goldToOrange: ["#A8CFA8", "#C2185B"],        // Sage green to cherry red
    elegance: ["#8E0F42", "#A8CFA8"],            // Deep cherry red to sage
    luxury: ["#C2185B", "#A8CFA8", "#C3DFC3"],   // Full brand palette
    premium: ["#8E0F42", "#C2185B", "#A8CFA8"],  // Deep to sage

    // Neutral surfaces
    surface: ["#F2F2EE", "#FAFAF8"],             // Off-white surface
    surfaceWarm: ["#E8E8E2", "#FAFAF8"],          // Deeper off-white surface
    darkSurface: ["#1A1A1A", "#2D2D2D"],          // Dark charcoal surface
  },
};

// ============================================
// 📐 SIZING SYSTEM
// ============================================
export const SIZES = {
  // ===== BASE SIZE =====
  base: 16,

  // ===== SPACING SCALE =====
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(48),
  xxxl: moderateScale(64),

  // ===== PADDING & MARGIN =====
  padding: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(32),
    container: moderateScale(5), // Standard container padding
  },

  margin: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(32),
  },

  // ===== BORDER RADIUS =====
  radius: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(32),
    full: 9999,
    card: moderateScale(16),
    button: moderateScale(12),
    input: moderateScale(10),
  },

  // ===== FONT SIZES =====
  font: {
    xxs: fontScale(8),
    xs: fontScale(10),
    sm: fontScale(12),
    md: fontScale(14),
    lg: fontScale(16),
    xl: fontScale(18),
    xxl: fontScale(20),
    xxxl: fontScale(24),
  },

  // ===== HEADING SIZES =====
  heading: {
    h1: fontScale(32),
    h2: fontScale(28),
    h3: fontScale(24),
    h4: fontScale(20),
    h5: fontScale(18),
    h6: fontScale(16),
  },

  // ===== ICON SIZES =====
  icon: {
    xs: moderateScale(12),
    sm: moderateScale(16),
    md: moderateScale(20),
    lg: moderateScale(24),
    xl: moderateScale(28),
    xxl: moderateScale(32),
    xxxl: moderateScale(48),
    xxxxl: moderateScale(64),
  },

  // ===== DIMENSIONS =====
  screen: {
    width,
    height,
    isSmallDevice: width < 375,
    isMediumDevice: width >= 375 && width < 414,
    isLargeDevice: width >= 414,
    isTablet: width >= 768,
  },

  // ===== COMPONENT SIZES =====
  button: {
    sm: moderateScale(36),
    md: moderateScale(44),
    lg: moderateScale(52),
    xl: moderateScale(60),
    height: {
      sm: moderateScale(36),
      md: moderateScale(48),
      lg: moderateScale(56),
    },
  },

  input: {
    sm: moderateScale(36),
    md: moderateScale(44),
    lg: moderateScale(52),
    height: moderateScale(48),
  },

  card: {
    padding: moderateScale(16),
    paddingLg: moderateScale(20),
  },

  header: {
    height: Platform.OS === "ios" ? moderateScale(88) : moderateScale(56),
  },

  tabBar: {
    height: Platform.OS === "ios" ? moderateScale(84) : moderateScale(60),
  },
};

// ============================================
// 🔤 TYPOGRAPHY SYSTEM (POPPINS)
// ============================================
export const FONTS = {
  // ===== FONT FAMILIES =====
  family: {
    // Poppins weights
    thin:       "Poppins-Thin",
    extraLight: "Poppins-ExtraLight",
    light:      "Poppins-Light",
    regular:    "Poppins-Regular",
    medium:     "Poppins-Medium",
    semiBold:   "Poppins-SemiBold",
    bold:       "Poppins-Bold",
    extraBold:  "Poppins-ExtraBold",
    black:      "Poppins-Black",

    // Poppins italics
    thinItalic:       "Poppins-ThinItalic",
    extraLightItalic: "Poppins-ExtraLightItalic",
    lightItalic:      "Poppins-LightItalic",
    italic:           "Poppins-Italic",
    mediumItalic:     "Poppins-MediumItalic",
    semiBoldItalic:   "Poppins-SemiBoldItalic",
    boldItalic:       "Poppins-BoldItalic",
    extraBoldItalic:  "Poppins-ExtraBoldItalic",
    blackItalic:      "Poppins-BlackItalic",

    // Other fonts
    dancing:        "DancingScript",
    dmSerif:        "DMSerif",
    domineBold:     "Domine-Bold",
    fancy:          "Fancy",
    garamond:       "Garamond",
    lato:           "Lato-Regular",
    playfair:       "PlayfairDisplay-Medium",
    trajanRegular:  "TrajanPro-Regular",
    trajanBold:     "TrajanPro-Bold",
    inter:          "InterDisplay-Medium",

    // Aliases
    heading:  "Poppins-Bold",
    body:     "Poppins-Regular",
    bodyBold: "Poppins-SemiBold",
  },

  // ===== FONT WEIGHTS =====
  weight: {
    thin: "100",
    light: "300",
    regular: "400",
    medium: "500",
    semiBold: "600",
    bold: "700",
    extraBold: "800",
  },

  // ===== HEADING STYLES =====
  h1: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.heading.h1,
    lineHeight: SIZES.heading.h1 * 1.2,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.heading.h2,
    lineHeight: SIZES.heading.h2 * 1.25,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.heading.h3,
    lineHeight: SIZES.heading.h3 * 1.3,
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.heading.h4,
    lineHeight: SIZES.heading.h4 * 1.3,
    color: COLORS.textPrimary,
  },
  h5: {
    fontFamily: "Poppins-Medium",
    fontSize: SIZES.heading.h5,
    lineHeight: SIZES.heading.h5 * 1.4,
    color: COLORS.textPrimary,
  },
  h6: {
    fontFamily: "Poppins-Medium",
    fontSize: SIZES.heading.h6,
    lineHeight: SIZES.heading.h6 * 1.4,
    color: COLORS.textPrimary,
  },

  // ===== BODY TEXT STYLES =====
  bodyLarge: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.font.lg,
    lineHeight: SIZES.font.lg * 1.5,
    color: COLORS.textPrimary,
  },
  body: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.textPrimary,
  },
  bodyMedium: {
    fontFamily: "Poppins-Medium",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.textPrimary,
  },
  bodySmall: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.font.sm,
    lineHeight: SIZES.font.sm * 1.5,
    color: COLORS.textSecondary,
  },
  bodyBold: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.textPrimary,
  },

  // ===== LABEL & CAPTION =====
  label: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.sm,
    lineHeight: SIZES.font.sm * 1.4,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  labelUppercase: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.sm,
    lineHeight: SIZES.font.sm * 1.4,
    color: COLORS.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  caption: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.font.xs,
    lineHeight: SIZES.font.xs * 1.4,
    color: COLORS.textSecondary,
  },
  captionBold: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.xs,
    lineHeight: SIZES.font.xs * 1.4,
    color: COLORS.textPrimary,
  },

  // ===== BUTTON TEXT =====
  button: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.3,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  buttonLarge: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.font.lg,
    lineHeight: SIZES.font.lg * 1.3,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  buttonSmall: {
    fontFamily: "Poppins-Medium",
    fontSize: SIZES.font.sm,
    lineHeight: SIZES.font.sm * 1.3,
    color: COLORS.white,
  },

  // ===== SPECIAL STYLES (ORANGE & GOLD TEXT) =====
  orangeHeading: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.heading.h2,
    lineHeight: SIZES.heading.h2 * 1.25,
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  orangeText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.primary,
  },
  goldHeading: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.heading.h2,
    lineHeight: SIZES.heading.h2 * 1.25,
    color: COLORS.goldPrimary,
    letterSpacing: -0.3,
  },
  goldText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.goldPrimary,
  },
};

// ============================================
// 🎭 SHADOWS
// ============================================
export const SHADOWS = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  // Orange shadow for brand feel
  orange: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  orangeStrong: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  // Gold shadow for accents
  gold: {
    shadowColor: COLORS.goldPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  goldStrong: {
    shadowColor: COLORS.goldPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ============================================
// 📱 DEVICE BREAKPOINTS
// ============================================
export const BREAKPOINTS = {
  small: width < 375,
  medium: width >= 375 && width < 768,
  large: width >= 768,
  tablet: width >= 768,
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
  isTablet: width >= 768,
};


// ============================================
// 🎯 EXPORT DEFAULT THEME
// ============================================
const theme = {
  COLORS,
  SIZES,
  FONTS,
  SHADOWS,
  BREAKPOINTS,
  scale,
  verticalScale,
  moderateScale,
  fontScale,
};

export default theme;