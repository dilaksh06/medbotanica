// theme.ts

const theme = {
  colors: {
    primary: "#2E7D32",      // Herbal green (main brand color)
    secondary: "#81C784",    // Light healing green
    accent: "#A5D6A7",       // Accent for borders/cards

    background: "#F1F8F5",   // Soft light background
    surface: "#FFFFFF",      // Card/section backgrounds

    textPrimary: "#1B5E20",  // Dark text (titles/headings)
    textSecondary: "#4E6E5D",// Subtext or body text
    muted: "#BDBDBD",        // Muted/disabled text

    error: "#D32F2F",        // Red for validation errors
    success: "#388E3C",      // Confirmation or verified

    border: "#C8E6C9",       // Light border
    shadow: "rgba(0, 0, 0, 0.1)", // Soft shadows
  },

  typography: {
    fontFamily: "System", // or custom like "Poppins", "Roboto"
    fontSize: {
      small: 12,
      medium: 16,
      large: 20,
      title: 24,
      header: 30,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 999,
  },
};

export default theme;
