/**
 * Font Configuration
 * 
 * This file handles font loading and configuration.
 * Add your custom fonts here when you're ready to use them.
 */

import { useFonts } from 'expo-font';
// Uncomment and import your fonts when ready:
// import FontNameRegular from '../assets/fonts/FontName-Regular.ttf';
// import FontNameBold from '../assets/fonts/FontName-Bold.ttf';

/**
 * Custom fonts configuration
 * Add your font files to assets/fonts/ and configure them here
 */
export const customFonts = {
    // Example font configuration (uncomment when fonts are added):
    // 'FontName-Regular': FontNameRegular,
    // 'FontName-Bold': FontNameBold,
    // 'FontName-Medium': FontNameMedium,
    // 'FontName-Light': FontNameLight,
};

/**
 * Hook to load custom fonts
 * Returns [fontsLoaded, fontError]
 * If no custom fonts are configured, returns [true, null] immediately
 */
export const useCustomFonts = () => {
    // If no custom fonts are configured, return immediately
    if (Object.keys(customFonts).length === 0) {
        return [true, null];
    }

    const [fontsLoaded, fontError] = useFonts(customFonts);
    return [fontsLoaded, fontError];
};

/**
 * Font family names for easy reference
 * Update these when you add custom fonts
 */
export const fontFamilies = {
    // System fonts (default)
    system: 'System',

    // Custom fonts (uncomment and update when fonts are added):
    // primary: 'FontName-Regular',
    // primaryBold: 'FontName-Bold',
    // primaryMedium: 'FontName-Medium',
    // primaryLight: 'FontName-Light',

    // secondary: 'SecondaryFont-Regular',
    // heading: 'HeadingFont-Bold',
    // body: 'BodyFont-Regular',
};

export default {
    customFonts,
    useCustomFonts,
    fontFamilies,
};

