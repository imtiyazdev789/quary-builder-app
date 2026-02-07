import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../../config/axios';
import Router from '../../config/Router';
import { CustomAlert, ErrorText } from '../../components';
import { useAuth } from '../../context/AuthContext';

const CreateReviewScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { user } = useAuth();
    const { request, professionalId } = route.params || {};

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });

    const handleStarPress = (starValue) => {
        setRating(starValue);
        setErrors(prev => ({ ...prev, rating: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!rating || rating < 1 || rating > 5) {
            newErrors.rating = 'Please select a rating';
        }
        
        if (comment.trim() && comment.trim().length < 10) {
            newErrors.comment = 'Comment must be at least 10 characters';
        }
        
        if (comment.trim().length > 400) {
            newErrors.comment = 'Comment must not exceed 400 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        if (!professionalId || !request?.id) {
            showAlert({
                title: 'Error',
                message: 'Missing required information. Please go back and try again.',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: () => navigation.goBack(), style: 'primary' }],
            });
            return;
        }

        try {
            setLoading(true);
            const payload = {
                professionalId,
                rating,
                requestId: request.id,
            };

            if (comment.trim()) {
                payload.comment = comment.trim();
            }

            const response = await api.post(Router.REVIEW.CREATE_REVIEW, payload);

            if (response.data.success) {
                showAlert({
                    title: 'Success',
                    message: 'Your review has been submitted successfully!',
                    icon: '✅',
                    buttons: [
                        {
                            text: 'OK',
                            onPress: () => {
                                hideAlert();
                                navigation.goBack();
                            },
                            style: 'primary',
                        },
                    ],
                });
            } else {
                throw new Error(response.data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error creating review:', error);
            let errorMessage = 'Failed to submit review. Please try again.';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
                // Handle duplicate review error
                if (errorMessage.includes('One Time') || errorMessage.includes('duplicate')) {
                    errorMessage = 'You have already reviewed this professional for this request.';
                }
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            showAlert({
                title: 'Error',
                message: errorMessage,
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
                className="mx-1"
            >
                <Text className="text-5xl">
                    {star <= rating ? '⭐' : '☆'}
                </Text>
            </TouchableOpacity>
        ));
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header */}
                <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4"
                    >
                        <Text className="text-2xl">←</Text>
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-gray-900 flex-1">
                        Write a Review
                    </Text>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="px-4 py-6">
                        {/* Professional Info */}
                        {request?.providerName && (
                            <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                                <Text className="text-sm text-gray-500 mb-1">Reviewing</Text>
                                <Text className="text-xl font-bold text-gray-900">
                                    {request.providerName}
                                </Text>
                                {request.clientProjectCategory && (
                                    <Text className="text-base text-gray-600 mt-1">
                                        {request.clientProjectCategory}
                                    </Text>
                                )}
                            </View>
                        )}

                        {/* Rating Section */}
                        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                            <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
                                How would you rate this professional?
                            </Text>
                            <View className="flex-row justify-center items-center mb-2">
                                {renderStars()}
                            </View>
                            {rating > 0 && (
                                <Text className="text-center text-gray-600 mt-2">
                                    {rating} {rating === 1 ? 'star' : 'stars'}
                                </Text>
                            )}
                            {errors.rating && (
                                <ErrorText text={errors.rating} className="mt-2 text-center" />
                            )}
                        </View>

                        {/* Comment Section */}
                        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                            <Text className="text-base font-semibold text-gray-900 mb-2">
                                Your Review (Optional)
                            </Text>
                            <Text className="text-xs text-gray-500 mb-2">
                                Share your experience with this professional. Minimum 10 characters if provided.
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-3 text-base text-gray-900 min-h-[120px]"
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                                placeholder="Write your review here..."
                                value={comment}
                                onChangeText={(text) => {
                                    setComment(text);
                                    setErrors(prev => ({ ...prev, comment: '' }));
                                }}
                                maxLength={400}
                            />
                            <View className="flex-row justify-between items-center mt-2">
                                <View className="flex-1">
                                    {errors.comment && <ErrorText text={errors.comment} />}
                                </View>
                                <Text className="text-xs text-gray-500">
                                    {comment.length}/400
                                </Text>
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            className={`bg-primary-600 rounded-lg py-4 px-6 ${loading ? 'opacity-50' : ''}`}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <Text className="text-white text-center text-lg font-semibold">
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </Text>
                        </TouchableOpacity>

                        <Text className="text-xs text-gray-500 text-center mt-4">
                            Your review will help other clients make informed decisions.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

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

export default CreateReviewScreen;
