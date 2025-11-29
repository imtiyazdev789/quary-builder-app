import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const CampaignScreen = () => {
    const campaigns = [
        { id: 1, name: 'Summer Sale 2024', status: 'Active', budget: '$5,000' },
        { id: 2, name: 'New Product Launch', status: 'Draft', budget: '$10,000' },
        { id: 3, name: 'Holiday Campaign', status: 'Completed', budget: '$8,000' },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-3xl font-bold text-gray-900">
                            Campaigns
                        </Text>
                        <TouchableOpacity className="bg-blue-600 rounded-lg px-4 py-2">
                            <Text className="text-white font-medium">+ New</Text>
                        </TouchableOpacity>
                    </View>

                    {campaigns.map((campaign) => (
                        <View
                            key={campaign.id}
                            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                        >
                            <Text className="text-lg font-semibold text-gray-900 mb-2">
                                {campaign.name}
                            </Text>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-sm text-gray-600">
                                    Budget: {campaign.budget}
                                </Text>
                                <View className={`px-3 py-1 rounded-full ${campaign.status === 'Active' ? 'bg-green-100' :
                                        campaign.status === 'Completed' ? 'bg-gray-100' : 'bg-yellow-100'
                                    }`}>
                                    <Text className="text-xs font-medium text-gray-800">
                                        {campaign.status}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default CampaignScreen;

