import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const metrics = [
    { label: 'Pending Providers', value: '24', accent: 'text-orange-600' },
    { label: 'Active Projects', value: '112', accent: 'text-blue-600' },
    { label: 'Open Tickets', value: '8', accent: 'text-red-500' },
    { label: 'Today\'s Payments', value: '₹2.8L', accent: 'text-green-600' },
];

const AdminDashboard = () => {
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                <Text className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</Text>
                <Text className="text-base text-gray-600 mb-6">High-level overview of the network health</Text>

                <View className="flex-row flex-wrap justify-between">
                    {metrics.map((metric) => (
                        <View key={metric.label} className="w-[48%] bg-white p-4 rounded-xl mb-4 shadow-sm">
                            <Text className={`text-2xl font-bold ${metric.accent}`}>{metric.value}</Text>
                            <Text className="text-sm text-gray-600 mt-1">{metric.label}</Text>
                        </View>
                    ))}
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
                    <Text className="text-lg font-semibold text-gray-900 mb-2">Latest Activities</Text>
                    {['Provider KYC approved', 'Payment of ₹56,000 captured', 'Request #BQ-234 escalated'].map((activity) => (
                        <Text key={activity} className="text-base text-gray-600 mb-1">
                            • {activity}
                        </Text>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default AdminDashboard;


