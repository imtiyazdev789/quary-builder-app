import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';


const MyRequestScreen = () => {
    const requests = [
        { id: 1, title: 'Website Development', status: 'In Progress', date: '2024-01-15' },
        { id: 2, title: 'Mobile App Design', status: 'Pending', date: '2024-01-20' },
        { id: 3, title: 'SEO Optimization', status: 'Completed', date: '2024-01-10' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-6">
                        My Requests
                    </Text>

                    {requests.map((request) => (
                        <View
                            key={request.id}
                            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <Text className="text-lg font-semibold text-gray-900 flex-1">
                                    {request.title}
                                </Text>
                                <View className={`px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                                    <Text className="text-xs font-medium">
                                        {request.status}
                                    </Text>
                                </View>
                            </View>
                            <Text className="text-sm text-gray-500 mb-3">
                                Date: {request.date}
                            </Text>
                            <TouchableOpacity className="bg-blue-600 rounded-lg py-2 px-4">
                                <Text className="text-white text-center font-medium">
                                    View Details
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default MyRequestScreen;

