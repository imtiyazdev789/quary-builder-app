import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { CustomAlert } from '../../components';
import api from '../../config/axios';
import { useAuth } from '../../context/AuthContext';
import { SERVICE_TYPES } from './request-creation/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const NearbyProfessionalsScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [professionals, setProfessionals] = useState([]);
    const [filteredProfessionals, setFilteredProfessionals] = useState([]);
    const [radiusOptions, setRadiusOptions] = useState([]);
    const [selectedRadius, setSelectedRadius] = useState(5);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [region, setRegion] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });
    const [listExpanded, setListExpanded] = useState(false);

    // Category options
    const categoryOptions = [
        { key: '', label: 'All Categories', value: '' },
        { key: 'ArchitectureConsultant', label: 'Architecture', value: 'ArchitectureConsultant' },
        { key: 'InteriorDesigner', label: 'Interior Design', value: 'InteriorDesigner' },
        { key: 'StructuralConsultant', label: 'Structural Engineering', value: 'StructuralConsultant' },
        { key: 'MEPConsultant', label: 'MEP', value: 'MEPConsultant' },
        { key: 'Contractor', label: 'Contractor', value: 'Contractor' },
    ];

    // Use service types from constants
    const serviceOptions = SERVICE_TYPES;

    useEffect(() => {
        fetchRadiusOptions();
        getCurrentLocation();
    }, []);

    useEffect(() => {
        if (userLocation) {
            fetchNearbyProfessionals();
        }
    }, [userLocation, selectedRadius]);

    useEffect(() => {
        applyFilters();
    }, [professionals, selectedCategory, selectedServices]);

    const applyFilters = () => {
        let filtered = [...professionals];

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(prof => prof.category === selectedCategory);
        }

        // Filter by services - professionals are matched by category if service matches category type
        // Since services might not be directly in professional data, we'll filter based on category mapping
        if (selectedServices.length > 0) {
            filtered = filtered.filter(prof => {
                // Map service types to categories
                const serviceToCategoryMap = {
                    'Architectural Design': 'ArchitectureConsultant',
                    'Interior Design': 'InteriorDesigner',
                    'Structural Design': 'StructuralConsultant',
                    'MEP Design': 'MEPConsultant',
                    'Construction': 'Contractor',
                };

                // Check if any selected service matches the professional's category
                return selectedServices.some(service => {
                    const mappedCategory = serviceToCategoryMap[service];
                    if (mappedCategory) {
                        return prof.category === mappedCategory;
                    }
                    // For other services, we can't filter precisely without service data
                    // So we include all professionals if any non-category-specific service is selected
                    return true;
                });
            });
        }

        setFilteredProfessionals(filtered);
    };

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                showAlert({
                    title: 'Permission Denied',
                    message: 'Please allow location access to find nearby professionals.',
                    icon: '📍',
                    buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
                });
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = location.coords;
            const userLoc = { latitude, longitude };
            setUserLocation(userLoc);

            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            });
        } catch (error) {
            console.error('Location error:', error);
            showAlert({
                title: 'Location Error',
                message: 'Unable to get your location. Please try again.',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
        }
    };

    const fetchRadiusOptions = async () => {
        try {
            const response = await api.get('/professional/radius-options');
            if (response.data.success && response.data.data?.options) {
                const options = response.data.data.options.map(opt => ({
                    key: opt.value.toString(),
                    label: opt.label,
                    value: opt.value,
                }));
                setRadiusOptions(options);
                const fiveKmOption = options.find(opt => opt.value === 5);
                if (fiveKmOption) {
                    setSelectedRadius(5);
                } else if (options.length > 0) {
                    setSelectedRadius(options[0].value);
                }
            }
        } catch (error) {
            console.error('Error fetching radius options:', error);
        }
    };

    const fetchNearbyProfessionals = async () => {
        if (!userLocation) return;

        try {
            setLoading(true);
            const response = await api.get('/professional/nearby', {
                params: {
                    lat: userLocation.latitude,
                    lng: userLocation.longitude,
                    radius: selectedRadius,
                    limit: 50,
                },
            });

            if (response.data.success && response.data.data?.professionals) {
                const profs = response.data.data.professionals;
                setProfessionals(profs);
            } else {
                setProfessionals([]);
            }
        } catch (error) {
            console.error('Error fetching nearby professionals:', error);
            showAlert({
                title: 'Error',
                message: 'Failed to load nearby professionals. Please try again.',
                icon: '❌',
                buttons: [{ text: 'OK', onPress: hideAlert, style: 'primary' }],
            });
            setProfessionals([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        getCurrentLocation();
    };

    const showAlert = (config) => {
        setAlertConfig(config);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    const getCategoryColor = (category) => {
        const colors = {
            'ArchitectureConsultant': '#3b82f6',
            'InteriorDesigner': '#8b5cf6',
            'StructuralConsultant': '#10b981',
            'MEPConsultant': '#f59e0b',
            'Contractor': '#ef4444',
        };
        return colors[category] || '#64748b';
    };

    const getCategoryLabel = (category) => {
        const labels = {
            'ArchitectureConsultant': 'Architect',
            'InteriorDesigner': 'Interior Designer',
            'StructuralConsultant': 'Structural',
            'MEPConsultant': 'MEP',
            'Contractor': 'Contractor',
        };
        return labels[category] || category;
    };

    const toggleService = (service) => {
        setSelectedServices(prev =>
            prev.includes(service)
                ? prev.filter(s => s !== service)
                : [...prev, service]
        );
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedServices([]);
    };

    const hasActiveFilters = selectedCategory || selectedServices.length > 0;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <View className="flex-1">
                {/* Compact Header with Filters */}
                <View className="px-3 py-1.5 bg-white border-b border-secondary-200">
                    {/* Title and Clear Filters in one row */}
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-xl font-bold text-secondary-900 mb-1">
                            Nearby Professionals
                        </Text>
                        <View className="flex-row items-center">
                            <Text className="text-xs text-gray-500 mr-2">
                                {filteredProfessionals.length}/{professionals.length}
                            </Text>
                            {hasActiveFilters && (
                                <TouchableOpacity
                                    onPress={clearFilters}
                                    className="px-2 py-0.5"
                                >
                                    <Text className="text-primary-600 text-xs font-medium">
                                        Clear
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Category Filter - First Line */}
                    <View className="flex-row items-center mb-1">
                        <Text className="text-xs text-gray-600 mr-2 font-bold">Category:</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ maxHeight: 32 }}
                            contentContainerStyle={{ paddingRight: 8 }}
                        >
                            <View className="flex-row items-center">
                                {categoryOptions.map((option) => {
                                    const isSelected = selectedCategory === option.value;
                                    return (
                                        <TouchableOpacity
                                            key={option.key}
                                            onPress={() => setSelectedCategory(option.value)}
                                            className={`px-2.5 py-1 rounded-full mr-1.5 ${isSelected
                                                ? 'bg-primary-600'
                                                : 'bg-gray-200'
                                                }`}
                                        >
                                            <Text className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-700'
                                                }`}>
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Services Filter - Second Line */}
                    <View className="flex-row items-center mb-1">
                        <Text className="text-xs text-gray-600 mr-2 font-bold">Services:</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ maxHeight: 32 }}
                            contentContainerStyle={{ paddingRight: 8 }}
                        >
                            <View className="flex-row items-center">
                                {serviceOptions.map((service) => {
                                    const isSelected = selectedServices.includes(service);
                                    return (
                                        <TouchableOpacity
                                            key={service}
                                            onPress={() => toggleService(service)}
                                            className={`px-2.5 py-1 rounded-full mr-1.5 ${isSelected
                                                ? 'bg-primary-600'
                                                : 'bg-gray-200'
                                                }`}
                                        >
                                            <Text className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-700'
                                                }`}>
                                                {service}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Radius Filter - Third Line */}
                    {radiusOptions.length > 0 && (
                        <View className="flex-row items-center">
                            <Text className="text-xs text-gray-600 mr-2 font-bold">Radius:</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={{ maxHeight: 32 }}
                                contentContainerStyle={{ paddingRight: 8 }}
                            >
                                <View className="flex-row items-center">
                                    {radiusOptions.map((option) => {
                                        const isSelected = selectedRadius === option.value;
                                        return (
                                            <TouchableOpacity
                                                key={option.key}
                                                onPress={() => setSelectedRadius(option.value)}
                                                className={`px-2.5 py-1 rounded-full mr-1.5 ${isSelected
                                                    ? 'bg-primary-600'
                                                    : 'bg-gray-200'
                                                    }`}
                                            >
                                                <Text className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-700'
                                                    }`}>
                                                    {option.label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    )}
                </View>

                {/* Map View */}
                {region && (
                    <View style={{ flex: 1 }}>
                        <MapView
                            style={{ flex: 1 }}
                            provider={PROVIDER_GOOGLE}
                            region={region}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                            onRegionChangeComplete={setRegion}
                        >
                            {userLocation && (
                                <Circle
                                    center={userLocation}
                                    radius={selectedRadius * 1000}
                                    strokeWidth={2}
                                    strokeColor="#0d9488"
                                    fillColor="rgba(13, 148, 136, 0.1)"
                                />
                            )}

                            {filteredProfessionals.map((professional) => {
                                if (!professional.location?.coordinates || professional.location.coordinates.length !== 2) return null;
                                const [lng, lat] = professional.location.coordinates;
                                return (
                                    <Marker
                                        key={professional._id}
                                        coordinate={{ latitude: lat, longitude: lng }}
                                        title={professional.businessName}
                                        description={`${professional.distance?.toFixed(1) || 'N/A'} km away`}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: getCategoryColor(professional.category),
                                                padding: 8,
                                                borderRadius: 20,
                                                borderWidth: 2,
                                                borderColor: '#fff',
                                                minWidth: 40,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                                                {getCategoryLabel(professional.category).charAt(0)}
                                            </Text>
                                        </View>
                                    </Marker>
                                );
                            })}
                        </MapView>
                    </View>
                )}

                {/* Professionals List - Expandable */}
                <View
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: listExpanded ? SCREEN_HEIGHT * 0.7 : 256,
                        backgroundColor: 'white',
                        borderTopWidth: 1,
                        borderTopColor: '#e2e8f0',
                    }}
                >
                    {/* List Header with Toggle */}
                    <View className="px-4 py-3 border-b border-secondary-100 flex-row justify-between items-center bg-white">
                        <Text className="text-lg font-semibold text-secondary-900">
                            Found {filteredProfessionals.length} Professional{filteredProfessionals.length !== 1 ? 's' : ''}
                        </Text>
                        {filteredProfessionals.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setListExpanded(!listExpanded)}
                                className="px-3 py-1 bg-primary-100 rounded-lg"
                            >
                                <Text className="text-primary-600 text-sm font-medium">
                                    {listExpanded ? '▼ Minimize' : '▲ Expand'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {loading && !refreshing ? (
                        <View className="flex-1 justify-center items-center py-8">
                            <ActivityIndicator size="large" color="#0d9488" />
                            <Text className="text-secondary-500 mt-2">Loading professionals...</Text>
                        </View>
                    ) : (
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={true}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={['#0d9488']}
                                />
                            }
                        >
                            {filteredProfessionals.length === 0 ? (
                                <View className="flex-1 justify-center items-center py-12 px-4">
                                    <Text className="text-4xl mb-3">🔍</Text>
                                    <Text className="text-secondary-600 text-center mb-2">
                                        No professionals found with the selected filters
                                    </Text>
                                    {hasActiveFilters && (
                                        <TouchableOpacity
                                            onPress={clearFilters}
                                            className="mt-4 px-6 py-2 bg-primary-600 rounded-lg"
                                        >
                                            <Text className="text-white font-medium">Clear Filters</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ) : (
                                filteredProfessionals.map((professional) => (
                                    <TouchableOpacity
                                        key={professional._id}
                                        className="px-4 py-4 border-b border-secondary-100"
                                        onPress={() => {
                                            navigation.navigate('ProfessionalDetail', {
                                                professionalId: professional._id
                                            });
                                        }}
                                    >
                                        <View className="flex-row">
                                            <View
                                                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                                                style={{ backgroundColor: getCategoryColor(professional.category) + '20' }}
                                            >
                                                <Text className="text-xl">
                                                    {professional.logo ? '🏢' : '👷'}
                                                </Text>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-base font-bold text-secondary-900 mb-1">
                                                    {professional.businessName}
                                                </Text>
                                                <Text className="text-sm text-secondary-600 mb-1">
                                                    {getCategoryLabel(professional.category)}
                                                </Text>
                                                <View className="flex-row items-center flex-wrap">
                                                    <Text className="text-xs text-secondary-500">
                                                        📍 {professional.distance?.toFixed(1) || 'N/A'} km away
                                                    </Text>
                                                    {professional.avgRating > 0 && (
                                                        <Text className="text-xs text-secondary-500 ml-3">
                                                            ⭐ {professional.avgRating.toFixed(1)} ({professional.totalReview})
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>

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

export default NearbyProfessionalsScreen;
