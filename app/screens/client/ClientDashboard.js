import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ClientDashboard = () => {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 pt-10 pb-6">
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

