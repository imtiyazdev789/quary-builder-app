import React from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';

/**
 * Custom Splash Screen Component
 * 
 * This component can be used as a fallback or custom splash screen
 * The native splash screen from app.json is used by default,
 * but this can be shown during app initialization if needed.
 */
const CustomSplashScreen = () => {
    return (
        <View className="flex-1 bg-white justify-center items-center">
            {/* You can add your logo/image here */}
            {/* <Image 
        source={require('../../assets/splash-icon.png')} 
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      /> */}

            <Text className="text-3xl font-bold text-blue-600 mb-4">
                Query Builder
            </Text>

            <ActivityIndicator
                size="large"
                color="#3B82F6"
                className="mt-8"
            />

            <Text className="text-gray-600 mt-4">
                Loading...
            </Text>
        </View>
    );
};

export default CustomSplashScreen;

