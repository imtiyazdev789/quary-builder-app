const theme = require('./app/config/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Custom Colors - Accessible via className like "bg-primary-500", "text-primary-600"
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
        success: theme.colors.success,
        warning: theme.colors.warning,
        error: theme.colors.error,
        neutral: theme.colors.neutral,
        background: theme.colors.background,
        text: theme.colors.text,
        border: theme.colors.border,
      },
      // Custom Font Sizes
      fontSize: theme.typography.fontSize,
      // Custom Font Families - Update when custom fonts are added
      fontFamily: {
        sans: theme.typography.fontFamily.sans,
        serif: theme.typography.fontFamily.serif,
        mono: theme.typography.fontFamily.mono,
        // Add custom fonts here when ready:
        // primary: theme.typography.fontFamily.primary,
        // secondary: theme.typography.fontFamily.secondary,
      },
      // Custom Spacing
      spacing: theme.spacing,
      // Custom Border Radius
      borderRadius: theme.borderRadius,
    },
  },
  plugins: [],
}

