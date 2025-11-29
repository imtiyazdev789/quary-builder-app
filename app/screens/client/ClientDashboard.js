import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const ClientDashboard = () => {
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        Client Dashboard
                    </Text>
                    <Text className="text-base text-gray-600 mb-6">
                        Welcome to your dashboard
                    </Text>

                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900 mb-2">
                            My Requests
                        </Text>
                        <Text className="text-base text-gray-600">
                            View and manage your service requests
                        </Text>
                    </View>

                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900 mb-2">
                            Active Projects
                        </Text>
                        <Text className="text-base text-gray-600">
                            Track your ongoing projects
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ClientDashboard;

