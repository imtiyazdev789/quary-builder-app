import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const AdminDashboard = () => {
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        Admin Dashboard
                    </Text>
                    <Text className="text-base text-gray-600 mb-6">
                        Manage your platform
                    </Text>

                    <View className="flex-row flex-wrap justify-between mb-4">
                        <View className="bg-white rounded-lg p-4 w-[48%] mb-4 shadow-sm">
                            <Text className="text-2xl font-bold text-blue-600 mb-1">150</Text>
                            <Text className="text-sm text-gray-600">Total Users</Text>
                        </View>
                        <View className="bg-white rounded-lg p-4 w-[48%] mb-4 shadow-sm">
                            <Text className="text-2xl font-bold text-green-600 mb-1">45</Text>
                            <Text className="text-sm text-gray-600">Active Projects</Text>
                        </View>
                        <View className="bg-white rounded-lg p-4 w-[48%] shadow-sm">
                            <Text className="text-2xl font-bold text-purple-600 mb-1">$12.5K</Text>
                            <Text className="text-sm text-gray-600">Revenue</Text>
                        </View>
                        <View className="bg-white rounded-lg p-4 w-[48%] shadow-sm">
                            <Text className="text-2xl font-bold text-orange-600 mb-1">28</Text>
                            <Text className="text-sm text-gray-600">Campaigns</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default AdminDashboard;

