import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const payouts = [
    { id: 'TXN-88321', amount: '₹45,000', status: 'Captured', provider: 'Studio Axis' },
    { id: 'TXN-88300', amount: '₹18,200', status: 'Pending', provider: 'Design Hive' },
];

const AdminPaymentsScreen = () => {
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                <Text className="text-2xl font-bold text-gray-900 mb-2">Payments & Transactions</Text>
                <Text className="text-base text-gray-600 mb-6">Monitor Razorpay flows and settlements</Text>

                {payouts.map((payout) => (
                    <View key={payout.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-lg font-semibold text-gray-900">{payout.amount}</Text>
                            <Text className="text-sm text-gray-500">{payout.id}</Text>
                        </View>
                        <Text className="text-sm text-gray-600 mb-1">Provider: {payout.provider}</Text>
                        <Text className={`text-sm font-semibold ${payout.status === 'Captured' ? 'text-green-600' : 'text-orange-600'}`}>
                            {payout.status}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default AdminPaymentsScreen;


