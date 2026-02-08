import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../config/axios';
import Router from '../../config/Router';
import { CustomAlert } from '../../components';

const ReviewsScreen = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    // Refresh when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchReviews();
        }, [])
    );

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get(Router.REVIEW.GET_PROFESSIONAL_REVIEWS);

            if (response.data.success) {
                const reviewsData = response.data.data || [];
                // Sort by createdAt (newest first)
                const sortedReviews = reviewsData.sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateB - dateA;
                });
                setReviews(sortedReviews);
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            showAlert({
                title: 'Error',
                message: 'Failed to load reviews. Please try again.',
                icon: 'close-circle',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
            setReviews([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchReviews();
    };

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderStars = (rating) => {
        const numRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
        const fullStars = Math.floor(numRating);
        const hasHalfStar = numRating % 1 >= 0.5;
        return '⭐'.repeat(fullStars) + (hasHalfStar ? '⭐' : '') + '☆'.repeat(Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0)));
    };

    // Calculate average rating
    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getClientName = (review) => {
        const client = review.clientId;
        if (!client) return 'Anonymous';
        const firstName = client.firstName || '';
        const lastName = client.lastName || '';
        const name = `${firstName} ${lastName}`.trim();
        return name || client.email || 'Anonymous';
    };

    const getProjectInfo = (review) => {
        const request = review.requestId;
        if (!request) return null;
        const type = request.clientProjectType || '';
        const category = request.clientProjectCategory || '';
        if (type || category) {
            return `${type}${type && category ? ' • ' : ''}${category}`;
        }
        return null;
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0d9488" />
                    <Text className="text-secondary-600 mt-4">Loading reviews...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const averageRating = calculateAverageRating();

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="px-4 py-6">
                    {/* Average Rating Card */}
                    <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                        <View className="items-center">
                            <Text className="text-5xl font-bold text-gray-900 mb-2">
                                {averageRating}
                            </Text>
                            <Text className="text-2xl mb-3">{renderStars(parseFloat(averageRating))}</Text>
                            <Text className="text-base text-gray-600">
                                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                            </Text>
                        </View>
                    </View>

                    <Text className="text-xl font-semibold text-gray-900 mb-4">
                        {reviews.length > 0 ? 'Recent Reviews' : 'Reviews'}
                    </Text>

                    {reviews.length === 0 ? (
                        <View className="bg-white rounded-lg p-8 items-center">
                            <Text className="text-6xl mb-4">⭐</Text>
                            <Text className="text-xl font-semibold text-gray-900 mb-2">
                                No Reviews Yet
                            </Text>
                            <Text className="text-base text-gray-600 text-center">
                                You haven't received any reviews yet. Keep providing great service to get reviews from clients!
                            </Text>
                        </View>
                    ) : (
                        reviews.map((review) => {
                            const clientName = getClientName(review);
                            const projectInfo = getProjectInfo(review);

                            return (
                                <View
                                    key={review._id || review.id}
                                    className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                                >
                                    <View className="flex-row justify-between items-start mb-2">
                                        <View className="flex-1 mr-2">
                                            <Text className="text-lg font-semibold text-gray-900 mb-1">
                                                {clientName}
                                            </Text>
                                            {projectInfo && (
                                                <Text className="text-xs text-gray-500 mb-1">
                                                    {projectInfo}
                                                </Text>
                                            )}
                                        </View>
                                        <View className="items-end">
                                            <Text className="text-lg mb-1">{renderStars(review.rating)}</Text>
                                            <Text className="text-xs text-gray-500">
                                                {formatDate(review.createdAt)}
                                            </Text>
                                        </View>
                                    </View>
                                    {review.comment && (
                                        <Text className="text-base text-gray-700 leading-6 mt-2">
                                            {review.comment}
                                        </Text>
                                    )}
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                icon={alertConfig.icon}
                buttons={alertConfig.buttons}
                onClose={hideAlert}
            />
        </SafeAreaView>
    );
};

export default ReviewsScreen;
