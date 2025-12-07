/**
 * Theme Configuration
 * 
 * This file contains all theme-related configurations including colors and fonts.
 * Modify these values to change the app's appearance globally.
 */

export const theme = {
    // Color Palette - Build Query Brand Colors
    colors: {
        // Primary Colors - Teal (Brand Color)
        primary: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6', // Main primary color
            600: '#0d9488', // Brand teal
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
        },

        // Secondary Colors - Dark Navy (Cards, Headers)
        secondary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b', // Dark navy for cards
            900: '#0f172a', // Deepest navy
        },

        // Accent Colors - Teal variations for highlights
        accent: {
            50: '#ecfeff',
            100: '#cffafe',
            200: '#a5f3fc',
            300: '#67e8f9',
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63',
        },

        // Success Colors
        success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
        },

        // Warning Colors
        warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
        },

        // Error/Danger Colors
        error: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
        },

        // Neutral Colors
        neutral: {
            white: '#ffffff',
            black: '#000000',
            gray: {
                50: '#f9fafb',
                100: '#f3f4f6',
                200: '#e5e7eb',
                300: '#d1d5db',
                400: '#9ca3af',
                500: '#6b7280',
                600: '#4b5563',
                700: '#374151',
                800: '#1f2937',
                900: '#111827',
            },
        },

        // Background Colors
        background: {
            light: '#ffffff',
            dark: '#0f172a',      // Dark navy
            gray: '#f8fafc',      // Light gray background
            muted: '#f1f5f9',     // Slightly darker gray sections
            card: '#ffffff',      // Card backgrounds
            cardDark: '#1e293b',  // Dark card backgrounds
        },

        // Text Colors
        text: {
            primary: '#1e293b',   // Dark navy for headlines
            secondary: '#64748b', // Muted for body text
            tertiary: '#94a3b8',  // Light for captions
            inverse: '#ffffff',   // White text on dark
            disabled: '#cbd5e1',
            brand: '#0d9488',     // Teal for links/accents
        },

        // Border Colors
        border: {
            light: '#e2e8f0',
            medium: '#cbd5e1',
            dark: '#94a3b8',
        },
    },

    // Typography Configuration
    typography: {
        // Font Families
        // Add your custom fonts here when you install them
        fontFamily: {
            // Default system fonts - replace with custom fonts later
            sans: ['System'], // iOS: San Francisco, Android: Roboto
            serif: ['System'],
            mono: ['System'],

            // Custom font examples (uncomment and configure when fonts are added):
            // primary: ['YourPrimaryFont', 'System'],
            // secondary: ['YourSecondaryFont', 'System'],
            // heading: ['YourHeadingFont', 'System'],
            // body: ['YourBodyFont', 'System'],
        },

        // Font Sizes
        fontSize: {
            xs: 12,
            sm: 14,
            base: 16,
            lg: 18,
            xl: 20,
            '2xl': 24,
            '3xl': 30,
            '4xl': 36,
            '5xl': 48,
            '6xl': 60,
        },

        // Font Weights
        fontWeight: {
            thin: '100',
            extralight: '200',
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800',
            black: '900',
        },

        // Line Heights
        lineHeight: {
            none: 1,
            tight: 1.25,
            snug: 1.375,
            normal: 1.5,
            relaxed: 1.625,
            loose: 2,
        },

        // Letter Spacing
        letterSpacing: {
            tighter: -0.5,
            tight: -0.25,
            normal: 0,
            wide: 0.25,
            wider: 0.5,
            widest: 1,
        },
    },

    // Spacing Scale
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64,
    },

    // Border Radius
    borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        '2xl': 24,
        full: 9999,
    },

    // Shadows
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
    },
};

// Helper function to get color value
export const getColor = (colorPath) => {
    const keys = colorPath.split('.');
    let value = theme.colors;

    for (const key of keys) {
        value = value[key];
        if (value === undefined) {
            console.warn(`Color path "${colorPath}" not found`);
            return theme.colors.primary[500]; // Fallback color
        }
    }

    return value;
};

// Helper function to get font size
export const getFontSize = (size) => {
    return theme.typography.fontSize[size] || theme.typography.fontSize.base;
};

// Export default theme
export default theme;

