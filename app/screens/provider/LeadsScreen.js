import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const LeadsScreen = () => {
    const leads = [
        { id: 1, name: 'ABC Corp', service: 'Website Development', status: 'New', date: '2024-01-20' },
        { id: 2, name: 'XYZ Ltd', service: 'Mobile App', status: 'Contacted', date: '2024-01-19' },
        { id: 3, name: 'Tech Inc', service: 'SEO Services', status: 'Qualified', date: '2024-01-18' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'New':
                return 'bg-blue-100 text-blue-800';
            case 'Contacted':
                return 'bg-yellow-100 text-yellow-800';
            case 'Qualified':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-6">
                        Leads
                    </Text>

                    {leads.map((lead) => (
                        <View
                            key={lead.id}
                            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1">
                                    <Text className="text-lg font-semibold text-gray-900">
                                        {lead.name}
                                    </Text>
                                    <Text className="text-sm text-gray-600">
                                        {lead.service}
                                    </Text>
                                </View>
                                <View className={`px-3 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                                    <Text className="text-xs font-medium">
                                        {lead.status}
                                    </Text>
                                </View>
                            </View>
                            <Text className="text-sm text-gray-500 mb-3">
                                Date: {lead.date}
                            </Text>
                            <View className="flex-row space-x-2">
                                <TouchableOpacity className="flex-1 bg-blue-600 rounded-lg py-2 px-4">
                                    <Text className="text-white text-center font-medium">
                                        Contact
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-gray-200 rounded-lg py-2 px-4">
                                    <Text className="text-gray-800 text-center font-medium">
                                        View Details
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default LeadsScreen;

