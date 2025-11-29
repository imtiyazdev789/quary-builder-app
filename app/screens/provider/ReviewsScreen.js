import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const ReviewsScreen = () => {
    const reviews = [
        { id: 1, client: 'ABC Corp', rating: 5, comment: 'Excellent work! Very professional.', date: '2024-01-15' },
        { id: 2, client: 'XYZ Ltd', rating: 4, comment: 'Good service, would recommend.', date: '2024-01-10' },
        { id: 3, client: 'Tech Inc', rating: 5, comment: 'Outstanding quality and communication.', date: '2024-01-05' },
    ];

    const renderStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="px-4 py-6">
                    <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                        <View className="items-center">
                            <Text className="text-4xl font-bold text-gray-900 mb-1">4.8</Text>
                            <Text className="text-lg text-gray-600 mb-2">{renderStars(5)}</Text>
                            <Text className="text-sm text-gray-500">Based on {reviews.length} reviews</Text>
                        </View>
                    </View>

                    <Text className="text-xl font-semibold text-gray-900 mb-4">
                        Recent Reviews
                    </Text>

                    {reviews.map((review) => (
                        <View
                            key={review.id}
                            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <Text className="text-lg font-semibold text-gray-900">
                                    {review.client}
                                </Text>
                                <Text className="text-base">{renderStars(review.rating)}</Text>
                            </View>
                            <Text className="text-base text-gray-700 mb-2">
                                {review.comment}
                            </Text>
                            <Text className="text-sm text-gray-500">
                                {review.date}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default ReviewsScreen;

