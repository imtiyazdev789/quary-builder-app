import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const SubscriptionScreen = () => {
    const plans = [
        { id: 1, name: 'Basic', price: '$29/month', features: ['5 Projects', 'Basic Support', 'Standard Features'] },
        { id: 2, name: 'Professional', price: '$79/month', features: ['Unlimited Projects', 'Priority Support', 'Advanced Features'], current: true },
        { id: 3, name: 'Enterprise', price: '$199/month', features: ['Unlimited Everything', '24/7 Support', 'All Features'] },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-6">
                        Subscription
                    </Text>

                    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border-2 border-blue-600">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-lg font-semibold text-gray-900">
                                Current Plan
                            </Text>
                            <View className="bg-green-100 px-3 py-1 rounded-full">
                                <Text className="text-xs font-medium text-green-800">
                                    Active
                                </Text>
                            </View>
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 mb-1">
                            Professional
                        </Text>
                        <Text className="text-base text-gray-600">
                            $79/month - Renews on Feb 15, 2024
                        </Text>
                    </View>

                    <Text className="text-xl font-semibold text-gray-900 mb-4">
                        Available Plans
                    </Text>

                    {plans.map((plan) => (
                        <View
                            key={plan.id}
                            className={`bg-white rounded-lg p-4 mb-4 shadow-sm ${plan.current ? 'border-2 border-blue-600' : ''
                                }`}
                        >
                            <View className="flex-row justify-between items-start mb-3">
                                <View>
                                    <Text className="text-xl font-bold text-gray-900">
                                        {plan.name}
                                    </Text>
                                    <Text className="text-lg text-gray-600">
                                        {plan.price}
                                    </Text>
                                </View>
                                {plan.current && (
                                    <View className="bg-blue-100 px-3 py-1 rounded-full">
                                        <Text className="text-xs font-medium text-blue-800">
                                            Current
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View className="mb-4">
                                {plan.features.map((feature, index) => (
                                    <View key={index} className="flex-row items-center mb-2">
                                        <Text className="text-green-600 mr-2">✓</Text>
                                        <Text className="text-base text-gray-700">{feature}</Text>
                                    </View>
                                ))}
                            </View>
                            {!plan.current && (
                                <TouchableOpacity className="bg-blue-600 rounded-lg py-3 px-4">
                                    <Text className="text-white text-center font-semibold">
                                        Upgrade
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default SubscriptionScreen;

