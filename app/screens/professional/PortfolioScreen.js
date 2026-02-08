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
import { InputField, ErrorText, CustomAlert, Icon, IconNames, FadeInView, AnimatedCard } from '../../components';

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
                icon: 'camera',
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
                <View className="px-6 pt-8 pb-4">
                    {/* Header */}
                    <FadeInView delay={100} className="flex-row justify-between items-center mb-10">
                        <Text className="text-3xl font-bold text-secondary-900">
                            Portfolio
                        </Text>
                        <TouchableOpacity
                            className={`${isAdding ? 'bg-secondary-200' : 'bg-primary-600'} rounded-xl px-4 py-2.5 shadow-sm flex-row items-center`}
                            onPress={() => setIsAdding((prev) => !prev)}
                        >
                            <Icon
                                name={isAdding ? IconNames.close : IconNames.add}
                                size="xs"
                                color={isAdding ? '#475569' : 'white'}
                                style={{ marginRight: 6 }}
                            />
                            <Text className={`${isAdding ? 'text-secondary-700' : 'text-white'} font-bold text-sm tracking-wide`}>
                                {isAdding ? 'Cancel' : 'Add'}
                            </Text>
                        </TouchableOpacity>
                    </FadeInView>

                    {/* Create Portfolio Form */}
                    {isAdding && (
                        <FadeInView delay={200} className="bg-white rounded-[32px] p-6 mb-8 shadow-sm border border-secondary-100">
                            <View className="flex-row items-center mb-6 pb-2 border-b border-secondary-50">
                                <Icon name={IconNames.add} size="sm" color="#0d9488" style={{ marginRight: 8 }} />
                                <Text className="text-xl font-bold text-secondary-900">
                                    New Portfolio Item
                                </Text>
                            </View>

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
                                            <View className="bg-secondary-200 p-3 rounded-2xl mr-4">
                                                <Icon name={IconNames.camera} size="md" color="#64748b" />
                                            </View>
                                            <View>
                                                <Text className="text-sm font-bold text-secondary-900">
                                                    Upload Cover Image
                                                </Text>
                                                <Text className="text-xs text-secondary-500 mt-1">
                                                    PNG, JPG up to 5MB
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

                            <View className="flex-row gap-3 mt-4">
                                <TouchableOpacity
                                    className="flex-1 px-6 py-4 rounded-2xl bg-secondary-50 items-center"
                                    onPress={() => {
                                        clearForm();
                                        setIsAdding(false);
                                    }}
                                    disabled={submitting}
                                >
                                    <Text className="text-secondary-600 font-bold">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`flex-2 px-8 py-4 rounded-2xl items-center ${submitting ? 'bg-primary-300' : 'bg-primary-600'}`}
                                    onPress={handleCreatePortfolio}
                                    disabled={submitting}
                                >
                                    <View className="flex-row items-center">
                                        {submitting && <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />}
                                        <Text className="text-white font-bold tracking-wide">
                                            {submitting ? 'Saving Item...' : 'Add to Portfolio'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </FadeInView>
                    )}

                    {/* Portfolio List */}
                    {portfolios.length === 0 ? (
                        <FadeInView delay={300} className="flex-1 justify-center items-center py-32">
                            <Text className="text-base text-secondary-400 text-center font-medium">
                                No portfolio items yet.
                            </Text>
                        </FadeInView>
                    ) : (
                        portfolios.map((item, index) => {
                            const imageUrl = getPortfolioImageUrl(item);
                            return (
                                <FadeInView key={item.id || item._id} delay={200 + index * 100}>
                                    <AnimatedCard
                                        className="bg-white rounded-[24px] mb-6 shadow-sm border border-secondary-100 overflow-hidden"
                                    >
                                        <View className="relative">
                                            {imageUrl ? (
                                                <Image
                                                    source={{ uri: imageUrl }}
                                                    className="w-full h-56"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View className="w-full h-56 bg-secondary-100 items-center justify-center">
                                                    <Icon name={IconNames.image} size="xl" color="#94a3b8" />
                                                </View>
                                            )}
                                            {item.isFeatured && (
                                                <View className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-amber-400 shadow-sm flex-row items-center">
                                                    <Icon name={IconNames.starFilled} size="xxs" color="white" style={{ marginRight: 4 }} />
                                                    <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
                                                        Featured
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        <View className="p-5">
                                            <View className="flex-row justify-between items-start mb-2">
                                                <View className="flex-1">
                                                    <Text className="text-xl font-bold text-secondary-900 mb-1">
                                                        {item.portfolioTitle || 'Untitled Project'}
                                                    </Text>
                                                    <Text className="text-sm font-semibold text-primary-600 uppercase tracking-tight">
                                                        {item.buildingType}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View className="flex-row items-center mb-4">
                                                <Icon name={IconNames.location} size="xs" color="#64748b" style={{ marginRight: 4 }} />
                                                <Text className="text-xs text-secondary-500 font-medium">
                                                    {item.portfolioLocation} • {item.projectCompletionYear}
                                                </Text>
                                            </View>

                                            <Text className="text-sm text-secondary-600 leading-5" numberOfLines={3}>
                                                {item.portfolioDescription}
                                            </Text>
                                        </View>
                                    </AnimatedCard>
                                </FadeInView>
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

