
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
// 🎨 PALETTE — raw hex ramps. Never reference these directly from
// components; always go through the semantic COLORS roles below.
// ============================================
const PALETTE = {
  // Magenta ramp (brand)
  magenta900: "#46002A",
  magenta800: "#64003C",
  magenta700: "#80004D", // ← brand / primary
  magenta500: "#A4477F",
  magenta300: "#C68CAF",
  magenta100: "#EBD6E3",
  magenta050: "#F9F4F7",

  // Cream ramp (accent) — SURFACE colours only. Never used as text/icon
  // colour: #FFF2D8-family on white is ~1.1:1 and effectively invisible.
  cream050: "#FFF8E1",
  cream100: "#F8EDC2",
  cream200: "#ECD98A",
  cream400: "#D4AF37", // main gold

  // Neutrals
  ink: "#14161F",
  slate700: "#3C4152",
  slate500: "#6B7280",
  slate400: "#9CA3AF", // decorative only — fails 4.5:1, never use for text
  slate450: "#5E6471", // placeholder/muted text that must clear 4.5:1 on tinted fields
  slate300: "#D2D6DE",
  slate200: "#E6E9EF",
  slate100: "#F1F3F7",
  slate050: "#F8F9FC",
  white: "#FFFFFF",
  black: "#000000",

  // States. The base tone is the FILL colour (icons, borders, chips — needs
  // 3:1). The `*Text` tone is a darker sibling for the same state rendered
  // AS TEXT on a light surface (needs 4.5:1); `*OnDark` is the lighter
  // sibling for text on `surfaceInverse`.
  green: "#128A5E",
  greenSoft: "#E4F5EE",
  greenText: "#0F714D",
  greenOnDark: "#139364",
  red: "#C62828",
  redSoft: "#FCEAEA",
  redText: "#C62828",
  redOnDark: "#DD5353",
  orange: "#B7791F",
  orangeSoft: "#FDF3E2",
  orangeText: "#875A17",
  orangeOnDark: "#B1761E",
  blue: "#1F6FD0",
  blueSoft: "#E8F1FC",
  blueText: "#1C63B9",
  blueOnDark: "#3381E0",
};

/* ============================================================
   ALPHA HELPER
   Every translucent colour below is COMPUTED from a PALETTE hex,
   so changing a hex in PALETTE updates the scrims, shadows and
   overlays too. Never hand-write an rgba() string in this file.
   ============================================================ */
const withAlpha = (hex, alpha) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/* ============================================================
   COLORS — semantic roles. Use these in components.
   ============================================================ */
export const COLORS = {
  /* --- Brand (main identity, headers, primary actions, ALL text & icons) --- */
  brand: PALETTE.magenta700,
  brandStrong: PALETTE.magenta800, // pressed / hover state
  brandDeep: PALETTE.magenta900,   // dark hero sections
  brandMuted: PALETTE.magenta500,  // secondary brand elements
  brandSoft: PALETTE.magenta300,   // disabled brand, illustrations
  brandSubtle: PALETTE.magenta100, // chips, selected rows
  brandTint: PALETTE.magenta050,   // section backgrounds

  /* --- Accent (cream SURFACES only — never text; see PALETTE note) --- */
  accent: PALETTE.cream050,        // filled cream panels, badges
  accentStrong: PALETTE.cream200,  // pressed state
  accentDeep: PALETTE.cream400,    // deepest cream, borders on cream
  accentSoft: PALETTE.cream100,
  accentSubtle: PALETTE.cream200,  // borders, dividers
  accentTint: PALETTE.cream050,    // callout backgrounds

  /* --- Surfaces (anything you place content on) --- */
  surface: PALETTE.white,          // cards, sheets
  surfacePage: PALETTE.white,      // screen background
  surfaceMuted: PALETTE.slate050,  // grouped list background
  surfaceSunken: PALETTE.slate100, // input wells, skeletons
  surfaceBrand: PALETTE.magenta700, // filled brand panels
  surfaceInverse: PALETTE.ink,     // dark panels, toasts

  /* --- Content (text & icons) --- */
  contentPrimary: PALETTE.ink,
  contentSecondary: PALETTE.slate700,
  contentMuted: PALETTE.slate500,
  contentPlaceholder: PALETTE.slate450, // slate400 fails 4.5:1; placeholders are text
  contentDisabled: PALETTE.slate300,
  contentOnBrand: PALETTE.white,   // text sitting on `brand` — 10.4:1
  contentOnAccent: PALETTE.magenta700, // text sitting on cream — 9.4:1
  contentOnInverse: PALETTE.white,
  contentBrand: PALETTE.magenta700, // links, active tab labels
  contentAccent: PALETTE.magenta700, // cream can't be text; accent text = brand

  /* --- Lines --- */
  border: PALETTE.slate200,
  borderSubtle: PALETTE.slate100,
  borderStrong: PALETTE.slate300,
  borderBrand: PALETTE.magenta700,
  borderAccent: PALETTE.cream400,
  divider: PALETTE.slate200,

  /* --- Fields --- */
  fieldBackground: PALETTE.slate050,
  fieldBorder: PALETTE.slate200,
  fieldBorderFocused: PALETTE.magenta700,
  fieldBorderError: PALETTE.red,

  /* --- Feedback states --- */
  success: PALETTE.green,
  successSurface: PALETTE.greenSoft,
  danger: PALETTE.red,
  dangerSurface: PALETTE.redSoft,
  warning: PALETTE.orange,
  warningSurface: PALETTE.orangeSoft,
  info: PALETTE.blue,
  infoSurface: PALETTE.blueSoft,

  /* --- State colours rendered AS TEXT on a light surface. Use these instead
         of `success`/`danger`/`warning`/`info` whenever the colour lands on a
         Text node; the base tones are fills and only guarantee 3:1. --- */
  successText: PALETTE.greenText,
  dangerText: PALETTE.redText,
  warningText: PALETTE.orangeText,
  infoText: PALETTE.blueText,

  /* --- State colours on dark surfaces (toasts, inverse panels). --- */
  successOnInverse: PALETTE.greenOnDark,
  dangerOnInverse: PALETTE.redOnDark,
  warningOnInverse: PALETTE.orangeOnDark,
  infoOnInverse: PALETTE.blueOnDark,

  /* --- Absolute neutrals (use sparingly; prefer surface/content roles) --- */
  white: PALETTE.white,
  black: PALETTE.black,

  /* --- Scrims & transparency --- */
  scrim: withAlpha(PALETTE.ink, 0.55),        // behind modals
  scrimHeavy: withAlpha(PALETTE.ink, 0.78),   // scrims that carry white text/spinners
  scrimBrand: withAlpha(PALETTE.magenta700, 0.72), // brand-tinted image overlay
  scrimLight: withAlpha(PALETTE.white, 0.85),
  transparent: "transparent",

  whiteAlpha10: withAlpha(PALETTE.white, 0.1),
  whiteAlpha20: withAlpha(PALETTE.white, 0.2),
  whiteAlpha50: withAlpha(PALETTE.white, 0.5),
  whiteAlpha70: withAlpha(PALETTE.white, 0.7),
  whiteAlpha80: withAlpha(PALETTE.white, 0.8),
  whiteAlpha90: withAlpha(PALETTE.white, 0.9),

  brandAlpha08: withAlpha(PALETTE.magenta700, 0.08),
  brandAlpha16: withAlpha(PALETTE.magenta700, 0.16),
  brandAlpha32: withAlpha(PALETTE.magenta700, 0.32),
  // Warm tan alphas taken from the deep end of the cream ramp — the cream
  // itself is too light to register as an overlay.
  accentAlpha08: withAlpha(PALETTE.cream400, 0.14),
  accentAlpha16: withAlpha(PALETTE.cream400, 0.26),
  accentAlpha32: withAlpha(PALETTE.cream400, 0.45),
  inkAlpha08: withAlpha(PALETTE.ink, 0.08),
  inkAlpha16: withAlpha(PALETTE.ink, 0.16),
  inkAlpha40: withAlpha(PALETTE.ink, 0.4),

  /* --- Shadow tints --- */
  shadowNeutral: withAlpha(PALETTE.ink, 0.18),
  shadowBrand: withAlpha(PALETTE.magenta700, 0.28),
  shadowAccent: withAlpha(PALETTE.magenta700, 0.18), // cream casts no usable shadow

  /* --- Gradients --- */
  gradient: {
    brand: [PALETTE.magenta700, PALETTE.magenta500],
    brandDeep: [PALETTE.magenta900, PALETTE.magenta700],
    accent: [PALETTE.cream050, PALETTE.cream200],
    accentDeep: [PALETTE.cream100, PALETTE.cream400],
    signature: [PALETTE.magenta700, PALETTE.cream050], // the brand pairing
    signatureDeep: [PALETTE.magenta900, PALETTE.magenta700, PALETTE.cream050],
    pageWash: [PALETTE.white, PALETTE.magenta050],
    accentWash: [PALETTE.white, PALETTE.cream050],
    fadeToDark: [withAlpha(PALETTE.ink, 0), withAlpha(PALETTE.ink, 0.85)], // image captions
    shine: [
      withAlpha(PALETTE.white, 0),
      withAlpha(PALETTE.white, 0.7),
      withAlpha(PALETTE.white, 0),
    ],

    // ── Legacy gradient keys (still used across older screens) ──
    orangePrimary: [PALETTE.magenta700, PALETTE.magenta500],
    orangeDeep: [PALETTE.magenta800, PALETTE.magenta700],
    orangeLight: [PALETTE.magenta500, PALETTE.magenta300],
    orangeVivid: [PALETTE.magenta800, PALETTE.magenta500],
    orangeToWhite: [PALETTE.magenta700, PALETTE.white],
    orangeToRed: [PALETTE.magenta700, PALETTE.red],
    goldLight: [PALETTE.cream400, PALETTE.cream200],
    goldDark: [PALETTE.cream400, PALETTE.cream200],
    luxuryGold: [PALETTE.cream400, PALETTE.cream200, PALETTE.cream100],
    shimmer: [PALETTE.cream400, PALETTE.cream100, PALETTE.cream400],
    orangeToGold: [PALETTE.magenta700, PALETTE.cream400],
    goldToOrange: [PALETTE.cream400, PALETTE.magenta700],
    elegance: [PALETTE.magenta800, PALETTE.cream400],
    luxury: [PALETTE.magenta700, PALETTE.cream400, PALETTE.cream200],
    premium: [PALETTE.magenta800, PALETTE.magenta700, PALETTE.cream400],
    surface: [PALETTE.slate100, PALETTE.white],
    surfaceWarm: [PALETTE.slate200, PALETTE.white],
    darkSurface: [PALETTE.ink, PALETTE.slate700],
  },

  /* ============================================================
     LEGACY COMPATIBILITY — old key names used throughout the app,
     recomputed from PALETTE so the whole project re-themes to the
     new magenta/cream system without every call site needing an
     immediate rename. New code should prefer the semantic roles
     above; these are kept so nothing currently on screen breaks.
     ============================================================ */

  // Old primary/brand family
  primary: PALETTE.magenta700,
  primaryLight: PALETTE.magenta500,
  primaryDark: PALETTE.magenta800,
  primaryLighter: PALETTE.magenta300,
  primaryPale: PALETTE.magenta050,

  // Old secondary/accent family (was sage green) → cream/gold ramp
  secondary: PALETTE.cream400,
  secondaryLight: PALETTE.cream200,
  secondaryDark: PALETTE.cream400,
  secondaryLighter: PALETTE.cream100,
  accentLight: PALETTE.cream100,
  accentDark: PALETTE.cream400,

  bottomGlow: withAlpha(PALETTE.magenta700, 1),

  // Old neutrals / surfaces
  background: PALETTE.white,
  backgroundSecondary: PALETTE.slate050,
  backgroundTertiary: PALETTE.slate100,
  backgroundDark: PALETTE.ink,
  backgroundOrange: PALETTE.white,
  backgroundGold: PALETTE.cream050,
  card: PALETTE.white,
  softCard: PALETTE.slate050,
  overlay: withAlpha(PALETTE.magenta700, 0.7),
  overlayDark: withAlpha(PALETTE.ink, 0.7),
  overlayGold: withAlpha(PALETTE.cream400, 0.1),
  overlayOrange: withAlpha(PALETTE.magenta700, 0.1),

  // Old text roles
  textPrimary: PALETTE.ink,
  textSecondary: PALETTE.slate700,
  textTertiary: PALETTE.slate500,
  textDisabled: PALETTE.slate300,
  textInverse: PALETTE.white,
  textOrange: PALETTE.magenta700,
  textOrangeDark: PALETTE.magenta800,
  textGold: PALETTE.cream400,
  textGoldDark: PALETTE.orangeText,

  // Old gray scale → slate ramp
  gray50: PALETTE.slate050,
  gray100: PALETTE.slate100,
  gray200: PALETTE.slate200,
  gray300: PALETTE.slate300,
  gray400: PALETTE.slate400,
  gray500: PALETTE.slate500,
  gray600: PALETTE.slate700,
  gray700: PALETTE.slate700,
  gray800: PALETTE.ink,
  gray900: PALETTE.ink,

  // Old "orange" brand-variation aliases
  orangeLight: PALETTE.magenta050,
  orangeMedium: PALETTE.magenta700,
  orangeDark: PALETTE.magenta800,
  orangeVivid: PALETTE.magenta500,
  orangeIce: PALETTE.magenta100,
  orangeSoft: PALETTE.magenta300,
  orangeDeep: PALETTE.magenta900,

  // Old border/divider
  borderLight: PALETTE.slate100,
  borderMedium: PALETTE.slate300,
  borderDark: PALETTE.slate700,
  borderOrange: PALETTE.magenta700,
  borderGold: PALETTE.cream400,

  // Old input colours
  inputBackground: PALETTE.white,
  inputBorder: PALETTE.slate200,
  inputPlaceholder: withAlpha(PALETTE.slate500, 0.5),
  inputFocused: PALETTE.magenta700,
  inputFocusedAlt: PALETTE.cream400,

  // Old status colour variants
  error: PALETTE.red,
  successLight: PALETTE.greenOnDark,
  successDark: PALETTE.greenText,
  errorLight: PALETTE.redOnDark,
  errorDark: PALETTE.red,
  warningLight: PALETTE.orangeOnDark,
  warningDark: PALETTE.orangeText,
  infoLight: PALETTE.blueOnDark,
  infoDark: PALETTE.blueText,
  disabled: PALETTE.slate100,

  // Old "gold" variation family → cream ramp
  goldPrimary: PALETTE.cream400,
  goldSecondary: PALETTE.cream200,
  goldTertiary: PALETTE.cream100,
  goldBronze: PALETTE.orangeText,
  goldRose: PALETTE.magenta700,
  goldLight: PALETTE.cream050,
  goldMedium: PALETTE.cream400,
  goldDark: PALETTE.orangeText,

  // Old opacity variants
  orangeOpacity10: withAlpha(PALETTE.magenta700, 0.1),
  orangeOpacity20: withAlpha(PALETTE.magenta700, 0.2),
  orangeOpacity30: withAlpha(PALETTE.magenta700, 0.3),
  orangeOpacity40: withAlpha(PALETTE.magenta700, 0.4),
  orangeOpacity50: withAlpha(PALETTE.magenta700, 0.5),
  orangeOpacity60: withAlpha(PALETTE.magenta700, 0.6),
  orangeOpacity70: withAlpha(PALETTE.magenta700, 0.7),
  orangeOpacity80: withAlpha(PALETTE.magenta700, 0.8),
  orangeOpacity90: withAlpha(PALETTE.magenta700, 0.9),
  blackOpacity10: withAlpha(PALETTE.black, 0.1),
  blackOpacity20: withAlpha(PALETTE.black, 0.2),
  blackOpacity30: withAlpha(PALETTE.black, 0.3),
  blackOpacity40: withAlpha(PALETTE.black, 0.4),
  blackOpacity50: withAlpha(PALETTE.black, 0.5),
  blackOpacity60: withAlpha(PALETTE.black, 0.6),
  blackOpacity70: withAlpha(PALETTE.black, 0.7),
  blackOpacity80: withAlpha(PALETTE.black, 0.8),
  blackOpacity90: withAlpha(PALETTE.black, 0.9),
  whiteOpacity10: withAlpha(PALETTE.white, 0.1),
  whiteOpacity20: withAlpha(PALETTE.white, 0.2),
  whiteOpacity30: withAlpha(PALETTE.white, 0.3),
  whiteOpacity50: withAlpha(PALETTE.white, 0.5),
  whiteOpacity70: withAlpha(PALETTE.white, 0.7),
  whiteOpacity80: withAlpha(PALETTE.white, 0.8),
  whiteOpacity90: withAlpha(PALETTE.white, 0.9),
  goldOpacity10: withAlpha(PALETTE.cream400, 0.1),
  goldOpacity20: withAlpha(PALETTE.cream400, 0.2),
  goldOpacity30: withAlpha(PALETTE.cream400, 0.3),
  goldOpacity50: withAlpha(PALETTE.cream400, 0.5),

  // Old shadow tints
  shadow: withAlpha(PALETTE.ink, 0.08),
  shadowMedium: withAlpha(PALETTE.ink, 0.15),
  shadowStrong: withAlpha(PALETTE.ink, 0.25),
  shadowOrange: withAlpha(PALETTE.magenta700, 0.2),
  shadowGold: withAlpha(PALETTE.cream400, 0.25),
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
    color: COLORS.contentPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.heading.h2,
    lineHeight: SIZES.heading.h2 * 1.25,
    color: COLORS.contentPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.heading.h3,
    lineHeight: SIZES.heading.h3 * 1.3,
    color: COLORS.contentPrimary,
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.heading.h4,
    lineHeight: SIZES.heading.h4 * 1.3,
    color: COLORS.contentPrimary,
  },
  h5: {
    fontFamily: "Poppins-Medium",
    fontSize: SIZES.heading.h5,
    lineHeight: SIZES.heading.h5 * 1.4,
    color: COLORS.contentPrimary,
  },
  h6: {
    fontFamily: "Poppins-Medium",
    fontSize: SIZES.heading.h6,
    lineHeight: SIZES.heading.h6 * 1.4,
    color: COLORS.contentPrimary,
  },

  // ===== BODY TEXT STYLES =====
  bodyLarge: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.font.lg,
    lineHeight: SIZES.font.lg * 1.5,
    color: COLORS.contentPrimary,
  },
  body: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.contentPrimary,
  },
  bodyMedium: {
    fontFamily: "Poppins-Medium",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.contentPrimary,
  },
  bodySmall: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.font.sm,
    lineHeight: SIZES.font.sm * 1.5,
    color: COLORS.contentSecondary,
  },
  bodyBold: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.contentPrimary,
  },

  // ===== LABEL & CAPTION =====
  label: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.sm,
    lineHeight: SIZES.font.sm * 1.4,
    color: COLORS.contentPrimary,
    letterSpacing: 0.5,
  },
  labelUppercase: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.sm,
    lineHeight: SIZES.font.sm * 1.4,
    color: COLORS.contentPrimary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  caption: {
    fontFamily: "Poppins-Regular",
    fontSize: SIZES.font.xs,
    lineHeight: SIZES.font.xs * 1.4,
    color: COLORS.contentSecondary,
  },
  captionBold: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.xs,
    lineHeight: SIZES.font.xs * 1.4,
    color: COLORS.contentPrimary,
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

  // ===== SPECIAL STYLES (BRAND & ACCENT TEXT) =====
  orangeHeading: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.heading.h2,
    lineHeight: SIZES.heading.h2 * 1.25,
    color: COLORS.brand,
    letterSpacing: -0.3,
  },
  orangeText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.brand,
  },
  goldHeading: {
    fontFamily: "Poppins-Bold",
    fontSize: SIZES.heading.h2,
    lineHeight: SIZES.heading.h2 * 1.25,
    color: COLORS.accentDeep,
    letterSpacing: -0.3,
  },
  goldText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: SIZES.font.md,
    lineHeight: SIZES.font.md * 1.5,
    color: COLORS.accentDeep,
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
  // Brand shadow for brand feel
  orange: {
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  orangeStrong: {
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  // Accent (gold) shadow
  gold: {
    shadowColor: COLORS.accentDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  goldStrong: {
    shadowColor: COLORS.accentDeep,
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
