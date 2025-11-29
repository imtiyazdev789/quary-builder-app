import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const ProfileScreen = () => {
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <View className="items-center mb-6">
                        <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4">
                            <Text className="text-4xl text-white">👤</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 mb-1">
                            User Profile
                        </Text>
                        <Text className="text-base text-gray-600">
                            Query Builder App
                        </Text>
                    </View>

                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900 mb-2">
                            About
                        </Text>
                        <Text className="text-base text-gray-700">
                            This is your profile screen. You can customize this section with user information and settings.
                        </Text>
                    </View>

                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900 mb-2">
                            Settings
                        </Text>
                        <View className="space-y-2">
                            <View className="py-2 border-b border-gray-200">
                                <Text className="text-base text-gray-700">Notifications</Text>
                            </View>
                            <View className="py-2 border-b border-gray-200">
                                <Text className="text-base text-gray-700">Privacy</Text>
                            </View>
                            <View className="py-2">
                                <Text className="text-base text-gray-700">Account</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;

