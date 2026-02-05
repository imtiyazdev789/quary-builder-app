export default ({ config }) => ({
    ...config,
    ios: {
        ...config.ios,
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
    },
    android: {
        ...config.android,
        googleMaps: {
            apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
        },
    },
});
