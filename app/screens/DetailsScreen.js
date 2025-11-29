import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const DetailsScreen = () => {
    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-4">
                        Details Screen
                    </Text>

                    <View className="bg-blue-50 p-4 rounded-lg mb-4">
                        <Text className="text-lg font-semibold text-blue-900 mb-2">
                            Information
                        </Text>
                        <Text className="text-base text-gray-700">
                            This is the details screen of your Query Builder App.
                        </Text>
                    </View>

                    <View className="bg-green-50 p-4 rounded-lg mb-4">
                        <Text className="text-lg font-semibold text-green-900 mb-2">
                            Features
                        </Text>
                        <Text className="text-base text-gray-700">
                            • React Native with Expo{'\n'}
                            • Tailwind CSS via NativeWind{'\n'}
                            • Navigation with React Navigation{'\n'}
                            • Modern UI Components
                        </Text>
                    </View>

                    <View className="bg-purple-50 p-4 rounded-lg">
                        <Text className="text-lg font-semibold text-purple-900 mb-2">
                            Tech Stack
                        </Text>
                        <Text className="text-base text-gray-700">
                            JavaScript, React Native, Tailwind CSS, Expo
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default DetailsScreen;

