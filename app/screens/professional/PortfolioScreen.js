import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Image,
    Platform,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../config/axios';
import Router from '../../config/Router';
import { InputField, ErrorText, CustomAlert } from '../../components';

const PortfolioScreen = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Create form state
    const [isAdding, setIsAdding] = useState(false);
    const [portfolioTitle, setPortfolioTitle] = useState('');
    const [buildingType, setBuildingType] = useState('');
    const [portfolioLocation, setPortfolioLocation] = useState('');
    const [portfolioDescription, setPortfolioDescription] = useState('');
    const [projectCompletionYear, setProjectCompletionYear] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Alert state
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    // Refresh when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchPortfolios();
        }, [])
    );

    const fetchPortfolios = async () => {
        try {
            setLoading(true);
            const response = await api.get(Router.PROFESSIONAL.FETCH_PORTFOLIOS);

            if (response.data.success) {
                const data = response.data.data || [];
                // Sort by createdAt (newest first) if available
                const sorted = data.sort((a, b) => {
                    const dateA = new Date(a.createdAt || 0);
                    const dateB = new Date(b.createdAt || 0);
                    return dateB - dateA;
                });
                setPortfolios(sorted);
            } else {
                setPortfolios([]);
            }
        } catch (error) {
            console.error('Error fetching portfolios:', error);
            showAlert({
                title: 'Error',
                message: 'Failed to load portfolio items. Please try again.',
                icon: 'close-circle',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
            setPortfolios([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchPortfolios();
    };

    const getPortfolioImageUrl = (portfolio) => {
        let imageUrl = portfolio?.portfolioImage || '';
        if (!imageUrl) return null;

        // Fix localhost for Android emulator
        if (Platform.OS === 'android' && imageUrl.includes('localhost')) {
            imageUrl = imageUrl.replace('localhost', '10.0.2.2');
        }

        return imageUrl;
    };

    const formatYear = (year) => {
        if (!year) return 'N/A';
        return `${year}`;
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            showAlert({
                title: 'Permission Required',
                message: 'We need access to your photo library to upload portfolio images.',
                icon: '📷',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const selected = result.assets[0];
            setSelectedImage(selected);
            // Clear previous image error
            if (errors.portfolioImage) {
                setErrors((prev) => ({ ...prev, portfolioImage: '' }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!portfolioTitle.trim()) {
            newErrors.portfolioTitle = 'Title is required';
        }

        if (!buildingType.trim()) {
            newErrors.buildingType = 'Building type is required';
        }

        if (!portfolioLocation.trim()) {
            newErrors.portfolioLocation = 'Location is required';
        }

        if (!portfolioDescription.trim()) {
            newErrors.portfolioDescription = 'Description is required';
        }

        if (!projectCompletionYear.trim()) {
            newErrors.projectCompletionYear = 'Completion year is required';
        } else if (!/^\d{4}$/.test(projectCompletionYear.trim())) {
            newErrors.projectCompletionYear = 'Enter a valid 4-digit year';
        }

        if (!selectedImage?.uri) {
            newErrors.portfolioImage = 'Portfolio image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearForm = () => {
        setPortfolioTitle('');
        setBuildingType('');
        setPortfolioLocation('');
        setPortfolioDescription('');
        setProjectCompletionYear('');
        setIsFeatured(false);
        setSelectedImage(null);
        setErrors({});
    };

    const handleCreatePortfolio = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append('portfolioTitle', portfolioTitle.trim());
            formData.append('buildingType', buildingType.trim());
            formData.append('portfolioLocation', portfolioLocation.trim());
            formData.append('portfolioDescription', portfolioDescription.trim());
            formData.append('projectCompletionYear', projectCompletionYear.trim());
            formData.append('isFeatured', isFeatured ? 'true' : 'false');

            if (selectedImage?.uri) {
                formData.append('portfolioImage', {
                    uri: selectedImage.uri,
                    type: selectedImage.mimeType || 'image/jpeg',
                    name: selectedImage.fileName || selectedImage.name || 'portfolio.jpg',
                });
            }

            const response = await api.post(
                Router.PROFESSIONAL.CREATE_PORTFOLIO,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                showAlert({
                    title: 'Success',
                    message: 'Portfolio item created successfully.',
                    icon: 'checkmark-circle',
                    buttons: [
                        {
                            text: 'OK',
                            onPress: () => {
                                hideAlert();
                                clearForm();
                                setIsAdding(false);
                                fetchPortfolios();
                            },
                            style: 'primary',
                        },
                    ],
                });
            } else {
                throw new Error(response.data.message || 'Failed to create portfolio');
            }
        } catch (error) {
            console.error('Error creating portfolio:', error);
            let errorMessage = 'Failed to create portfolio item. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            showAlert({
                title: 'Error',
                message: errorMessage,
                icon: 'close-circle',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !refreshing && portfolios.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0d9488" />
                    <Text className="text-secondary-600 mt-4">Loading portfolio...</Text>
                </View>
            </SafeAreaView>
        );
    }

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
                    {/* Header */}
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1 mr-3">
                            <Text className="text-2xl font-bold text-gray-900">
                                My Portfolio
                            </Text>
                            <Text className="text-xs text-gray-500 mt-1">
                                Showcase your best work to attract more clients
                            </Text>
                        </View>
                        <TouchableOpacity
                            className="bg-primary-600 rounded-lg px-3 py-2 self-start"
                            onPress={() => setIsAdding((prev) => !prev)}
                        >
                            <Text className="text-white font-semibold">
                                {isAdding ? 'Close' : '+ Add'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Create Portfolio Form */}
                    {isAdding && (
                        <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                            <Text className="text-base font-semibold text-gray-900 mb-4">
                                Add Portfolio Item
                            </Text>

                            <InputField
                                label="Title"
                                value={portfolioTitle}
                                onChangeText={setPortfolioTitle}
                                placeholder="e.g. 3BHK Apartment in Bangalore"
                                error={errors.portfolioTitle}
                                leftIcon="briefcase"
                            />

                            <InputField
                                label="Building Type"
                                value={buildingType}
                                onChangeText={setBuildingType}
                                placeholder="e.g. Residential, Commercial"
                                error={errors.buildingType}
                                leftIcon="home"
                            />

                            <InputField
                                label="Location"
                                value={portfolioLocation}
                                onChangeText={setPortfolioLocation}
                                placeholder="City, State"
                                error={errors.portfolioLocation}
                                leftIcon="location"
                            />

                            <InputField
                                label="Completion Year"
                                value={projectCompletionYear}
                                onChangeText={setProjectCompletionYear}
                                placeholder="e.g. 2024"
                                keyboardType="number-pad"
                                error={errors.projectCompletionYear}
                                leftIcon="calendar"
                            />

                            <InputField
                                label="Description"
                                value={portfolioDescription}
                                onChangeText={setPortfolioDescription}
                                placeholder="Describe the project, highlights, and your role"
                                multiline
                                numberOfLines={4}
                                error={errors.portfolioDescription}
                                leftIcon="document"
                            />

                            {/* Image Picker */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-secondary-800 mb-2">
                                    Portfolio Image
                                </Text>
                                <TouchableOpacity
                                    className="border border-dashed border-secondary-300 rounded-xl p-3 bg-secondary-50 flex-row items-center"
                                    onPress={handlePickImage}
                                >
                                    {selectedImage?.uri ? (
                                        <View className="flex-row items-center">
                                            <Image
                                                source={{ uri: selectedImage.uri }}
                                                className="w-16 h-16 rounded-lg mr-3"
                                                resizeMode="cover"
                                            />
                                            <View className="flex-1">
                                                <Text className="text-sm font-medium text-secondary-900">
                                                    Change Image
                                                </Text>
                                                <Text className="text-xs text-secondary-500 mt-1">
                                                    Tap to select a different image
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View className="flex-row items-center">
                                            <Text className="text-2xl mr-3">📷</Text>
                                            <View>
                                                <Text className="text-sm font-medium text-secondary-900">
                                                    Upload Image
                                                </Text>
                                                <Text className="text-xs text-secondary-500 mt-1">
                                                    Tap to choose a cover image for this project
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <ErrorText error={errors.portfolioImage} />
                            </View>

                            {/* Featured Toggle */}
                            <View className="flex-row items-center mb-4">
                                <Text className="text-sm text-secondary-800 mr-2">
                                    Mark as Featured
                                </Text>
                                <Switch
                                    value={isFeatured}
                                    onValueChange={setIsFeatured}
                                    thumbColor={isFeatured ? '#0f766e' : '#f9fafb'}
                                    trackColor={{ false: '#e5e7eb', true: '#99f6e4' }}
                                />
                            </View>

                            <View className="flex-row justify-end mt-2">
                                <TouchableOpacity
                                    className="px-4 py-2 rounded-lg border border-secondary-300 mr-3"
                                    onPress={() => {
                                        clearForm();
                                        setIsAdding(false);
                                    }}
                                    disabled={submitting}
                                >
                                    <Text className="text-secondary-700 font-medium">
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`px-5 py-2 rounded-lg ${submitting ? 'bg-primary-300' : 'bg-primary-600'}`}
                                    onPress={handleCreatePortfolio}
                                    disabled={submitting}
                                >
                                    <Text className="text-white font-semibold">
                                        {submitting ? 'Saving...' : 'Save'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Portfolio List */}
                    {portfolios.length === 0 ? (
                        <View className="bg-white rounded-lg p-8 items-center">
                            <Text className="text-6xl mb-4">🖼️</Text>
                            <Text className="text-xl font-semibold text-gray-900 mb-2">
                                No Portfolio Items Yet
                            </Text>
                            <Text className="text-base text-gray-600 text-center mb-6">
                                Start building trust with clients by showcasing your best
                                completed projects.
                            </Text>
                            <TouchableOpacity
                                className="bg-primary-600 rounded-lg px-6 py-3"
                                onPress={() => setIsAdding(true)}
                            >
                                <Text className="text-white font-semibold">
                                    Add Your First Portfolio Item
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        portfolios.map((item) => {
                            const imageUrl = getPortfolioImageUrl(item);
                            return (
                                <View
                                    key={item.id || item._id}
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
                                        <View className="flex-row justify-between items-start mb-2">
                                            <View className="flex-1 mr-2">
                                                <Text className="text-lg font-semibold text-gray-900 mb-1">
                                                    {item.portfolioTitle || 'Untitled Portfolio'}
                                                </Text>
                                                <Text className="text-sm text-gray-600 mb-1">
                                                    {item.buildingType || 'Building type not specified'}
                                                </Text>
                                                <Text className="text-xs text-gray-500">
                                                    📍 {item.portfolioLocation || 'Location not specified'}
                                                </Text>
                                            </View>
                                            {item.isFeatured && (
                                                <View className="px-3 py-1 rounded-full bg-yellow-100">
                                                    <Text className="text-xs font-medium text-yellow-800">
                                                        ⭐ Featured
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        {item.projectCompletionYear && (
                                            <Text className="text-xs text-gray-500 mb-2">
                                                Completed: {formatYear(item.projectCompletionYear)}
                                            </Text>
                                        )}

                                        {item.portfolioDescription && (
                                            <Text className="text-sm text-gray-700 mt-1">
                                                {item.portfolioDescription}
                                            </Text>
                                        )}
                                    </View>
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

export default PortfolioScreen;

