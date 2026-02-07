import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const tickets = [
    { id: 'SUP-1203', subject: 'Delayed quotation', priority: 'High' },
    { id: 'SUP-1200', subject: 'Payment clarification', priority: 'Medium' },
];

const priorityColor = {
    High: 'text-red-500',
    Medium: 'text-orange-500',
    Low: 'text-green-600',
};

const AdminSupportScreen = () => {
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                <Text className="text-2xl font-bold text-gray-900 mb-2">Support & Complaints</Text>
                <Text className="text-base text-gray-600 mb-6">Track escalations and ticket queues</Text>

                {tickets.map((ticket) => (
                    <View key={ticket.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900">{ticket.subject}</Text>
                        <Text className="text-sm text-gray-500 mb-2">Ticket ID: {ticket.id}</Text>
                        <Text className={`text-sm font-semibold ${priorityColor[ticket.priority]}`}>
                            Priority: {ticket.priority}
                        </Text>
                        <TouchableOpacity className="mt-3 rounded-lg border border-gray-200 py-2">
                            <Text className="text-center text-blue-600 font-medium">View Conversation</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default AdminSupportScreen;


