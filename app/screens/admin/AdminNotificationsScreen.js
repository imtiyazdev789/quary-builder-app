import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const notifications = [
    { id: 1, title: 'New provider registration', time: '2 min ago' },
    { id: 2, title: 'Payment captured ₹35,000', time: '15 min ago' },
    { id: 3, title: 'Ticket SUP-1203 escalated', time: '1 hr ago' },
];

const AdminNotificationsScreen = () => {
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                <Text className="text-2xl font-bold text-gray-900 mb-2">Notifications Center</Text>
                <Text className="text-base text-gray-600 mb-6">Stay on top of critical events</Text>

                {notifications.map((notification) => (
                    <View key={notification.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                        <Text className="text-base font-semibold text-gray-900">{notification.title}</Text>
                        <Text className="text-xs text-gray-500 mt-1">{notification.time}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default AdminNotificationsScreen;


