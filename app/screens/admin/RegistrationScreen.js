import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const RegistrationScreen = () => {
    const registrations = [
        { id: 1, name: 'John Doe', type: 'Professional', email: 'john@example.com', status: 'Pending' },
        { id: 2, name: 'Jane Smith', type: 'Client', email: 'jane@example.com', status: 'Approved' },
        { id: 3, name: 'Mike Johnson', type: 'Professional', email: 'mike@example.com', status: 'Pending' },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-6">
                        Registrations
                    </Text>

                    {registrations.map((reg) => (
                        <View
                            key={reg.id}
                            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1">
                                    <Text className="text-lg font-semibold text-gray-900">
                                        {reg.name}
                                    </Text>
                                    <Text className="text-sm text-gray-600">
                                        {reg.email}
                                    </Text>
                                </View>
                                <View className={`px-3 py-1 rounded-full ${reg.status === 'Approved' ? 'bg-green-100' : 'bg-yellow-100'
                                    }`}>
                                    <Text className="text-xs font-medium text-gray-800">
                                        {reg.status}
                                    </Text>
                                </View>
                            </View>
                            <Text className="text-sm text-gray-500 mb-3">
                                Type: {reg.type}
                            </Text>
                            <View className="flex-row space-x-2">
                                <TouchableOpacity className="flex-1 bg-blue-600 rounded-lg py-2 px-4">
                                    <Text className="text-white text-center font-medium">
                                        Approve
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

export default RegistrationScreen;

