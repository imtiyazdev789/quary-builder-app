import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';


const ClientProfile = () => {
    const { user } = useAuth();

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <View className="items-center mb-6">
                        <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4">
                            <Text className="text-4xl text-white">👤</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 mb-1">
                            {user?.name || 'Client Name'}
                        </Text>
                        <Text className="text-base text-gray-600">
                            {user?.email || 'client@example.com'}
                        </Text>
                    </View>

                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900 mb-4">
                            Personal Information
                        </Text>
                        <View className="space-y-3">
                            <View className="py-2 border-b border-gray-200">
                                <Text className="text-sm text-gray-500 mb-1">Phone</Text>
                                <Text className="text-base text-gray-900">+1 234 567 8900</Text>
                            </View>
                            <View className="py-2 border-b border-gray-200">
                                <Text className="text-sm text-gray-500 mb-1">Address</Text>
                                <Text className="text-base text-gray-900">123 Main St, City</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ClientProfile;

