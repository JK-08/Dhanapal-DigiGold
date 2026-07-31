import baseTheme from "./theme";

const lightTheme = {
  ...baseTheme,
  mode: "light",
  COLORS: {
    ...baseTheme.COLORS,
    // Aligned to the magenta/cream palette in theme.js (slate050 / white / ink / slate700 / slate200)
    backgroundSecondary: "#F8F9FC",
    surfaceMuted: "#F8F9FC",
    card: "#FFFFFF",
    surface: "#FFFFFF",
    textPrimary: "#14161F",
    contentPrimary: "#14161F",
    textSecondary: "#3C4152",
    contentSecondary: "#3C4152",
    border: "#E6E9EF",
  },
};

export default lightTheme;