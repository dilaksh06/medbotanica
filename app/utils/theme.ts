// theme.ts - Comprehensive MedBotanica Theme System

const theme = {
  colors: {
    // Primary Brand Colors - Updated to match your original preference
    primary: "#2E7D32",        // Herbal green (main brand color)
    primaryLight: "#4CAF50",   // Lighter primary
    primaryDark: "#1B5E20",    // Darker primary
    
    // Secondary & Accent Colors
    secondary: "#81C784",      // Light healing green
    secondaryLight: "#A5D6A7", // Very light secondary
    secondaryDark: "#66BB6A",  // Darker secondary
    accent: "#C8E6C9",         // Accent for borders/cards
    accentLight: "#E8F5E9",    // Very light accent
    
    // Background & Surface Colors
    background: "#F1F8F5",     // Soft light background
    backgroundAlt: "#FAFAFA",  // Alternative background
    surface: "#FFFFFF",        // Card/section backgrounds  
    surfaceElevated: "#FEFEFE", // Slightly elevated surfaces
    
    // Text Colors
    textPrimary: "#1B5E20",    // Dark text (titles/headings)
    textSecondary: "#4E6E5D",  // Subtext or body text
    textTertiary: "#757575",   // Light text for subtle elements
    textMuted: "#BDBDBD",      // Muted/disabled text
    textInverse: "#FFFFFF",    // White text on dark backgrounds
    textPlaceholder: "#9E9E9E", // Placeholder text color
    
    // Semantic Colors
    success: "#388E3C",        // Confirmation or verified
    successLight: "#4CAF50",   // Light success
    successDark: "#2E7D32",    // Dark success
    
    warning: "#FF9800",        // Warning orange
    warningLight: "#FFB74D",   // Light warning
    warningDark: "#F57C00",    // Dark warning
    
    error: "#D32F2F",          // Red for validation errors
    errorLight: "#F44336",     // Light error
    errorDark: "#C62828",      // Dark error
    
    info: "#2196F3",           // Info blue
    infoLight: "#64B5F6",      // Light info
    infoDark: "#1976D2",       // Dark info
    
    // Border & Shadow Colors
    border: "#C8E6C9",         // Light border
    borderLight: "#E8F5E9",    // Very light border
    borderMedium: "#A5D6A7",   // Medium border
    borderDark: "#81C784",     // Dark border
    shadow: "rgba(0, 0, 0, 0.1)", // Soft shadows
    shadowMedium: "rgba(0, 0, 0, 0.15)",
    shadowStrong: "rgba(0, 0, 0, 0.2)",
    
    // Interactive States
    focus: "#2E7D32",          // Focus color
    focusLight: "rgba(46, 125, 50, 0.1)", // Light focus background
    hover: "rgba(46, 125, 50, 0.08)", // Hover background
    pressed: "rgba(46, 125, 50, 0.12)", // Pressed state
    selected: "rgba(46, 125, 50, 0.16)", // Selected state
    disabled: "#F5F5F5",       // Disabled background
    
    // Overlay Colors
    overlay: "rgba(0, 0, 0, 0.4)",
    overlayLight: "rgba(0, 0, 0, 0.2)",
    overlayDark: "rgba(0, 0, 0, 0.6)",
    backdropBlur: "rgba(241, 248, 245, 0.85)",
    
    // Gradient Definitions
    gradients: {
      primary: ["#2E7D32", "#4CAF50"],
      secondary: ["#81C784", "#A5D6A7"],
      success: ["#388E3C", "#4CAF50"],
      header: ["#1B5E20", "#2E7D32", "#4CAF50"],
      card: ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 1)"],
    }
  },

  typography: {
    // Font Families
    fontFamily: {
      regular: "System",     // Default system font
      medium: "System",      // Medium weight
      semibold: "System",    // Semibold weight
      bold: "System",        // Bold weight
      // Alternative font options:
      // primary: "Inter",   // Modern clean font
      // secondary: "Roboto", // Google's font
      // heading: "Poppins",  // For headings
    },
    
    // Font Sizes
    fontSize: {
      xs: 12,    // Extra small
      sm: 14,    // Small  
      base: 16,  // Base/medium - your original 'medium'
      lg: 18,    // Large
      xl: 20,    // Extra large - your original 'large'
      "2xl": 24, // 2X large - your original 'title'
      "3xl": 28, // 3X large
      "4xl": 30, // 4X large - your original 'header'
      "5xl": 36, // 5X large
      "6xl": 42, // 6X large
      
      // Semantic aliases for backward compatibility
      small: 12,  // maps to xs
      medium: 16, // maps to base
      large: 20,  // maps to xl
      title: 24,  // maps to 2xl
      header: 30, // maps to 4xl
    },
    
    // Line Heights
    lineHeight: {
      none: 1,
      tight: 1.2,
      snug: 1.3,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
      
      // Specific line heights for font sizes
      xs: 16,    // 12px font
      sm: 20,    // 14px font
      base: 24,  // 16px font
      lg: 26,    // 18px font
      xl: 28,    // 20px font
      "2xl": 32, // 24px font
      "3xl": 36, // 28px font
      "4xl": 40, // 30px font
      "5xl": 44, // 36px font
    },
    
    // Letter Spacing
    letterSpacing: {
      tighter: -1,
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
      widest: 1.5,
    },
    
    // Font Weights
    fontWeight: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
  },

  // Spacing System
  spacing: {
    // Numeric scale
    0: 0,
    1: 4,   
    2: 8,   
    3: 12,  
    4: 16,  
    5: 20,  
    6: 24,  
    7: 28,
    8: 32,  
    9: 36,
    10: 40, 
    11: 44,
    12: 48, 
    14: 56,
    16: 64, 
    20: 80, 
    24: 96,
    28: 112,
    32: 128,
    
    // Semantic aliases for backward compatibility
    xs: 4,   // maps to 1
    sm: 8,   // maps to 2  
    md: 16,  // maps to 4
    lg: 24,  // maps to 6
    xl: 32,  // maps to 8
    "2xl": 40, // maps to 10
    "3xl": 48, // maps to 12
    "4xl": 64, // maps to 16
    "5xl": 80, // maps to 20
  },

  // Border Radius System
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,    // your original sm
    base: 6,
    md: 8,    // your original md
    lg: 12,
    xl: 16,   // your original lg
    "2xl": 20,
    "3xl": 24,
    "4xl": 32,
    full: 999, // your original full
    
    // Component-specific radius
    button: 8,
    card: 12,
    modal: 16,
    avatar: 999,
  },

  // Comprehensive Shadow System
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 6,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    "2xl": {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 10,
    },
  },

  // Animation System
  animation: {
    duration: {
      fastest: 100,
      fast: 150,
      normal: 200,
      medium: 250,
      slow: 300,
      slower: 400,
      slowest: 500,
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      // Custom bezier curves
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },

  // Breakpoints for Responsive Design
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    "2xl": 1400,
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Opacity Scale
  opacity: {
    0: 0,
    5: 0.05,
    10: 0.1,
    20: 0.2,
    25: 0.25,
    30: 0.3,
    40: 0.4,
    50: 0.5,
    60: 0.6,
    70: 0.7,
    75: 0.75,
    80: 0.8,
    90: 0.9,
    95: 0.95,
    100: 1,
  },

  // Component-Specific Styles
  components: {
    button: {
      height: {
        xs: 28,
        sm: 32,
        base: 40,
        md: 44,
        lg: 48,
        xl: 52,
      },
      padding: {
        xs: { paddingHorizontal: 12, paddingVertical: 6 },
        sm: { paddingHorizontal: 16, paddingVertical: 8 },
        base: { paddingHorizontal: 20, paddingVertical: 10 },
        md: { paddingHorizontal: 24, paddingVertical: 12 },
        lg: { paddingHorizontal: 28, paddingVertical: 14 },
        xl: { paddingHorizontal: 32, paddingVertical: 16 },
      },
    },
    card: {
      padding: {
        sm: 12,
        base: 16,
        md: 20,
        lg: 24,
        xl: 32,
      },
      borderRadius: {
        sm: 8,
        base: 12,
        md: 16,
        lg: 20,
        xl: 24,
      },
    },
    input: {
      height: {
        sm: 36,
        base: 40,
        md: 44,
        lg: 48,
        xl: 52,
      },
      padding: {
        horizontal: 16,
        vertical: 12,
      },
    },
    avatar: {
      size: {
        xs: 24,
        sm: 32,
        base: 40,
        md: 48,
        lg: 56,
        xl: 64,
        "2xl": 80,
        "3xl": 96,
        "4xl": 128,
      },
    },
  },
};

export default theme;

// Helper functions for theme usage
export const getColor = (colorPath: string) => {
  const keys = colorPath.split('.');
  let result: any = theme.colors;
  
  for (const key of keys) {
    result = result[key];
  }
  
  return result;
};

export const getSpacing = (size: keyof typeof theme.spacing) => {
  return theme.spacing[size];
};

export const getShadow = (size: keyof typeof theme.shadows) => {
  return theme.shadows[size];
};

export const getFontSize = (size: keyof typeof theme.typography.fontSize) => {
  return theme.typography.fontSize[size];
};

// Usage example:
// backgroundColor: getColor('primary')
// marginTop: getSpacing(4)
// ...getShadow('md')