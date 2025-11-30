import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const role = user?.role?.toLowerCase() || 'user';

    const getDashboardContent = () => {
        switch (role) {
            case 'provider':
                return {
                    title: 'Provider Dashboard',
                    stats: [
                        { label: 'Active Leads', value: '12', color: 'text-blue-600' },
                        { label: 'Projects', value: '8', color: 'text-green-600' },
                        { label: 'Avg Rating', value: '4.8', color: 'text-purple-600' },
                        { label: 'Subscription', value: 'Active', color: 'text-orange-600' },
                    ],
                };
            case 'client':
            default:
                return {
                    title: 'Client Dashboard',
                    stats: [
                        { label: 'My Requests', value: '5', color: 'text-blue-600' },
                        { label: 'Active Projects', value: '3', color: 'text-green-600' },
                        { label: 'Completed', value: '12', color: 'text-purple-600' },
                        { label: 'Pending', value: '2', color: 'text-orange-600' },
                    ],
                };
        }
    };

    const content = getDashboardContent();

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-2">
                        {content.title}
                    </Text>
                    <Text className="text-base text-gray-600 mb-6">
                        Welcome to your dashboard
                    </Text>

                    <View className="flex-row flex-wrap justify-between mb-4">
                        {content.stats.map((stat, index) => (
                            <View
                                key={index}
                                className="bg-white rounded-lg p-4 w-[48%] mb-4 shadow-sm"
                            >
                                <Text className={`text-2xl font-bold ${stat.color} mb-1`}>
                                    {stat.value}
                                </Text>
                                <Text className="text-sm text-gray-600">{stat.label}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="bg-white rounded-lg p-4 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900 mb-2">
                            Recent Activity
                        </Text>
                        <Text className="text-base text-gray-600">
                            View and manage your activities from here
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default Dashboard;

