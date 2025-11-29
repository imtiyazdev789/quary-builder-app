import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const PaymentScreen = () => {
    const payments = [
        { id: 1, user: 'John Doe', amount: '$500', date: '2024-01-15', status: 'Completed' },
        { id: 2, user: 'Jane Smith', amount: '$1,200', date: '2024-01-18', status: 'Pending' },
        { id: 3, user: 'Mike Johnson', amount: '$800', date: '2024-01-20', status: 'Completed' },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-6">
                        Payments
                    </Text>

                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold text-gray-900">
                                Total Revenue
                            </Text>
                            <Text className="text-2xl font-bold text-green-600">
                                $12,500
                            </Text>
                        </View>
                    </View>

                    {payments.map((payment) => (
                        <View
                            key={payment.id}
                            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1">
                                    <Text className="text-lg font-semibold text-gray-900">
                                        {payment.user}
                                    </Text>
                                    <Text className="text-sm text-gray-600">
                                        {payment.date}
                                    </Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-lg font-bold text-gray-900 mb-1">
                                        {payment.amount}
                                    </Text>
                                    <View className={`px-3 py-1 rounded-full ${payment.status === 'Completed' ? 'bg-green-100' : 'bg-yellow-100'
                                        }`}>
                                        <Text className="text-xs font-medium text-gray-800">
                                            {payment.status}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default PaymentScreen;

