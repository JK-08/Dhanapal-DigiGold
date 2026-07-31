import baseTheme from "./theme";

const darkTheme = {
  ...baseTheme,
  mode: "dark",
  COLORS: {
    ...baseTheme.COLORS,
    background: "#14161F",
    surfacePage: "#14161F",
    backgroundSecondary: "#1E2029",
    surfaceMuted: "#1E2029",
    backgroundTertiary: "#272A35",
    surfaceSunken: "#272A35",
    card: "#1E2029",
    surface: "#1E2029",
    surfaceInverse: "#F8F9FC",

    textPrimary: "#FFFFFF",
    contentPrimary: "#FFFFFF",
    textSecondary: "#D2D6DE",
    contentSecondary: "#D2D6DE",
    textTertiary: "#9CA3AF",
    contentMuted: "#9CA3AF",

    border: "#3C4152",
    borderSubtle: "#272A35",
    divider: "#3C4152",

    inputBackground: "#1E2029",
    inputBorder: "#3C4152",
    inputPlaceholder: "rgba(210, 214, 222, 0.6)",
  },
};

export default darkTheme;