import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../../config/axios';
import Router from '../../config/Router';
import { CustomAlert } from '../../components';

const ProfessionalDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { professionalId } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [professionalData, setProfessionalData] = useState(null);
    const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'reviews'
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });

    useEffect(() => {
        if (professionalId) {
            fetchProfessionalDetails();
        }
    }, [professionalId]);

    const fetchProfessionalDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(Router.PROFESSIONAL.GET_PROFILE_DETAILS(professionalId));

            if (response.data.success) {
                setProfessionalData(response.data.data);
            } else {
                throw new Error('Failed to fetch professional details');
            }
        } catch (error) {
            console.error('Error fetching professional details:', error);
            showAlert({
                title: 'Error',
                message: 'Failed to load professional details. Please try again.',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: () => navigation.goBack(), style: 'primary' }],
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const renderStars = (rating) => {
        const numRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
        const fullStars = Math.floor(numRating);
        return '⭐'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        if (Platform.OS === 'android' && imageUrl.includes('localhost')) {
            return imageUrl.replace('localhost', '10.0.2.2');
        }
        if (imageUrl && !imageUrl.startsWith('http')) {
            const base = process.env.EXPO_PUBLIC_API_BASE_URL || '';
            const normalizedBase = base.includes('localhost') && Platform.OS === 'android'
                ? base.replace('localhost', '10.0.2.2')
                : base;
            return `${normalizedBase}${imageUrl.replace(/^\//, '')}`;
        }
        return imageUrl;
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0d9488" />
                    <Text className="text-secondary-600 mt-4">Loading professional details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!professionalData) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
                <View className="flex-1 justify-center items-center px-4">
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                        Professional Not Found
                    </Text>
                    <TouchableOpacity
                        className="bg-primary-600 rounded-lg py-3 px-6 mt-4"
                        onPress={() => navigation.goBack()}
                    >
                        <Text className="text-white font-semibold">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const basicInfo = professionalData.profesBasicDetail || {};
    const projects = professionalData.profesProjectDetail || [];
    const reviews = professionalData.profesReviewDetail || [];
    const avgRating = basicInfo.avgRating || 0;
    const reviewCount = reviews.length;

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
            {/* Header */}
            <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mr-4"
                >
                    <Text className="text-2xl">←</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-900 flex-1">
                    Professional Profile
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Professional Header Card */}
                <View className="bg-white border-b border-gray-200 px-4 py-6">
                    <View className="flex-row items-start">
                        {basicInfo.representativePhoto && (
                            <Image
                                source={{ uri: getImageUrl(basicInfo.representativePhoto) }}
                                className="w-20 h-20 rounded-full mr-4"
                                resizeMode="cover"
                            />
                        )}
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-900 mb-1">
                                {basicInfo.businessName || 'N/A'}
                            </Text>
                            {basicInfo.representativeName && (
                                <Text className="text-base text-gray-600 mb-2">
                                    {basicInfo.representativeName}
                                </Text>
                            )}
                            <View className="flex-row items-center mb-2">
                                {avgRating > 0 && (
                                    <>
                                        <Text className="text-lg font-bold text-gray-900 mr-2">
                                            {avgRating.toFixed(1)}
                                        </Text>
                                        <Text className="text-base mr-2">{renderStars(avgRating)}</Text>
                                        <Text className="text-sm text-gray-500">
                                            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                                        </Text>
                                    </>
                                )}
                            </View>
                            {basicInfo.city && basicInfo.state && (
                                <Text className="text-sm text-gray-600">
                                    📍 {basicInfo.city}, {basicInfo.state}
                                </Text>
                            )}
                            {basicInfo.shortDescription && (
                                <Text className="text-sm text-gray-700 mt-2 leading-5">
                                    {basicInfo.shortDescription}
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Contact Button */}
                    <TouchableOpacity
                        className="bg-primary-600 rounded-lg py-3 px-4 mt-4"
                        onPress={() => {
                            navigation.navigate('CreateRequest', { professionalId });
                        }}
                    >
                        <Text className="text-white text-center font-semibold text-base">
                            Request Quote
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View className="bg-white border-b border-gray-200 flex-row">
                    <TouchableOpacity
                        className={`flex-1 py-4 border-b-2 ${activeTab === 'projects' ? 'border-primary-600' : 'border-transparent'}`}
                        onPress={() => setActiveTab('projects')}
                    >
                        <Text className={`text-center font-semibold ${activeTab === 'projects' ? 'text-primary-600' : 'text-gray-600'}`}>
                            Projects ({projects.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 py-4 border-b-2 ${activeTab === 'reviews' ? 'border-primary-600' : 'border-transparent'}`}
                        onPress={() => setActiveTab('reviews')}
                    >
                        <Text className={`text-center font-semibold ${activeTab === 'reviews' ? 'text-primary-600' : 'text-gray-600'}`}>
                            Reviews ({reviewCount})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="px-4 py-6">
                    {activeTab === 'projects' ? (
                        <>
                            {projects.length === 0 ? (
                                <View className="bg-white rounded-lg p-8 items-center">
                                    <Text className="text-6xl mb-4">📁</Text>
                                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                                        No Projects Yet
                                    </Text>
                                    <Text className="text-base text-gray-600 text-center">
                                        This professional hasn't added any projects yet.
                                    </Text>
                                </View>
                            ) : (
                                projects.map((project) => {
                                    const projectImage = project.projectImage;
                                    const imageUrl = getImageUrl(projectImage);

                                    return (
                                        <View
                                            key={project.id}
                                            className="bg-white rounded-lg mb-4 shadow-sm overflow-hidden"
                                        >
                                            {imageUrl && (
                                                <Image
                                                    source={{ uri: imageUrl }}
                                                    className="w-full h-48"
                                                    resizeMode="cover"
                                                />
                                            )}
                                            <View className="p-4">
                                                <Text className="text-lg font-semibold text-gray-900 mb-2">
                                                    {project.projectBasicDetail?.projectTitle || 'Untitled Project'}
                                                </Text>
                                                <Text className="text-sm text-gray-600 mb-2">
                                                    {project.projectBasicDetail?.projectCategory || 'N/A'}
                                                </Text>
                                                {project.projectBasicDetail?.projectCity && project.projectBasicDetail?.projectState && (
                                                    <Text className="text-xs text-gray-500 mb-2">
                                                        📍 {project.projectBasicDetail.projectCity}, {project.projectBasicDetail.projectState}
                                                    </Text>
                                                )}
                                                {project.projectBasicDetail?.projectYearOfCompletion && (
                                                    <Text className="text-xs text-gray-500 mb-3">
                                                        Completed: {project.projectBasicDetail.projectYearOfCompletion}
                                                    </Text>
                                                )}
                                                {project.projectNarritveAndDesc?.projectHighLights && (
                                                    <Text className="text-sm text-gray-700 leading-5" numberOfLines={3}>
                                                        {project.projectNarritveAndDesc.projectHighLights}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </>
                    ) : (
                        <>
                            {reviews.length === 0 ? (
                                <View className="bg-white rounded-lg p-8 items-center">
                                    <Text className="text-6xl mb-4">⭐</Text>
                                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                                        No Reviews Yet
                                    </Text>
                                    <Text className="text-base text-gray-600 text-center">
                                        This professional hasn't received any reviews yet.
                                    </Text>
                                </View>
                            ) : (
                                reviews.map((review) => {
                                    const clientName = `${review.firstName || ''} ${review.lastName || ''}`.trim() || 'Anonymous';

                                    return (
                                        <View
                                            key={review.id}
                                            className="bg-white rounded-lg p-4 mb-4 shadow-sm"
                                        >
                                            <View className="flex-row justify-between items-start mb-2">
                                                <Text className="text-base font-semibold text-gray-900 flex-1">
                                                    {clientName}
                                                </Text>
                                                <Text className="text-base ml-2">
                                                    {renderStars(review.rating)}
                                                </Text>
                                            </View>
                                            {review.comment && (
                                                <Text className="text-sm text-gray-700 leading-5 mb-2">
                                                    {review.comment}
                                                </Text>
                                            )}
                                            <Text className="text-xs text-gray-500">
                                                {formatDate(review.createdAt)}
                                            </Text>
                                        </View>
                                    );
                                })
                            )}
                        </>
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

export default ProfessionalDetailScreen;
