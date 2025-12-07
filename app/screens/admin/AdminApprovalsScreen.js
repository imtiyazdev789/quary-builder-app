import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const pendingProviders = [
    { id: 'PR-1021', name: 'Studio Axis', docs: ['GST', 'COA'] },
    { id: 'PR-1034', name: 'Design Hive', docs: ['GST', 'Aadhar', 'COA'] },
];

const AdminApprovalsScreen = () => {
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                <Text className="text-2xl font-bold text-gray-900 mb-2">Provider Approvals</Text>
                <Text className="text-base text-gray-600 mb-6">Review and verify KYC submissions</Text>

                {pendingProviders.map((provider) => (
                    <View key={provider.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900">{provider.name}</Text>
                        <Text className="text-sm text-gray-500 mb-2">ID: {provider.id}</Text>
                        <Text className="text-sm text-gray-600">
                            Docs: {provider.docs.join(', ')}
                        </Text>
                        <View className="flex-row gap-3 mt-4">
                            <TouchableOpacity className="flex-1 bg-green-600 rounded-lg py-2">
                                <Text className="text-center text-white font-medium">Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 bg-red-500 rounded-lg py-2">
                                <Text className="text-center text-white font-medium">Reject</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default AdminApprovalsScreen;


