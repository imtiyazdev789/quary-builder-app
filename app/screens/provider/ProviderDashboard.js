import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const ProviderDashboard = () => {
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        Provider Dashboard
                    </Text>
                    <Text className="text-base text-gray-600 mb-6">
                        Manage your services
                    </Text>

                    <View className="flex-row flex-wrap justify-between mb-4">
                        <View className="bg-white rounded-lg p-4 w-[48%] mb-4 shadow-sm">
                            <Text className="text-2xl font-bold text-blue-600 mb-1">12</Text>
                            <Text className="text-sm text-gray-600">Active Leads</Text>
                        </View>
                        <View className="bg-white rounded-lg p-4 w-[48%] mb-4 shadow-sm">
                            <Text className="text-2xl font-bold text-green-600 mb-1">8</Text>
                            <Text className="text-sm text-gray-600">Projects</Text>
                        </View>
                        <View className="bg-white rounded-lg p-4 w-[48%] shadow-sm">
                            <Text className="text-2xl font-bold text-purple-600 mb-1">4.8</Text>
                            <Text className="text-sm text-gray-600">Avg Rating</Text>
                        </View>
                        <View className="bg-white rounded-lg p-4 w-[48%] shadow-sm">
                            <Text className="text-2xl font-bold text-orange-600 mb-1">Active</Text>
                            <Text className="text-sm text-gray-600">Subscription</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProviderDashboard;

