import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { DropdownSelector, CustomAlert } from '../../components';
import api from '../../config/axios';
import { useAuth } from '../../context/AuthContext';

const NearbyProfessionalsScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [professionals, setProfessionals] = useState([]);
    const [radiusOptions, setRadiusOptions] = useState([]);
    const [selectedRadius, setSelectedRadius] = useState(5); // Default 5km
    const [userLocation, setUserLocation] = useState(null);
    const [region, setRegion] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: '',
        buttons: [],
    });

    useEffect(() => {
        fetchRadiusOptions();
        getCurrentLocation();
    }, []);

    useEffect(() => {
        if (userLocation) {
            fetchNearbyProfessionals();
        }
    }, [userLocation, selectedRadius]);

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

            // Set map region
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
                // Keep default 5km if it exists, otherwise use first option
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
                setProfessionals(response.data.data.professionals);
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

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <View className="flex-1">
                {/* Header with Radius Selector */}
                <View className="px-4 py-4 bg-white border-b border-secondary-200">
                    <Text className="text-2xl font-bold text-secondary-900 mb-3">
                        Nearby Professionals
                    </Text>
                    {radiusOptions.length > 0 && (
                        <DropdownSelector
                            label="Search Radius"
                            options={radiusOptions}
                            selected={selectedRadius.toString()}
                            onSelect={(val) => setSelectedRadius(parseInt(val))}
                        />
                    )}
                </View>

                {/* Map View */}
                {region && (
                    <View className="flex-1">
                        <MapView
                            style={{ flex: 1 }}
                            region={region}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                            onRegionChangeComplete={setRegion}
                        >
                            {/* User Location Circle */}
                            {userLocation && (
                                <Circle
                                    center={userLocation}
                                    radius={selectedRadius * 1000} // Convert km to meters
                                    strokeWidth={2}
                                    strokeColor="#0d9488"
                                    fillColor="rgba(13, 148, 136, 0.1)"
                                />
                            )}

                            {/* Professional Markers */}
                            {professionals.map((professional) => {
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

                {/* Professionals List */}
                <View className="h-64 border-t border-secondary-200 bg-white">
                    <View className="px-4 py-3 border-b border-secondary-100">
                        <Text className="text-lg font-semibold text-secondary-900">
                            Found {professionals.length} Professional{professionals.length !== 1 ? 's' : ''}
                        </Text>
                    </View>

                    {loading && !refreshing ? (
                        <View className="flex-1 justify-center items-center py-8">
                            <ActivityIndicator size="large" color="#0d9488" />
                            <Text className="text-secondary-500 mt-2">Loading professionals...</Text>
                        </View>
                    ) : (
                        <ScrollView
                            className="flex-1"
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={['#0d9488']}
                                />
                            }
                        >
                            {professionals.length === 0 ? (
                                <View className="flex-1 justify-center items-center py-12">
                                    <Text className="text-4xl mb-3">🔍</Text>
                                    <Text className="text-secondary-600 text-center px-6">
                                        No professionals found within {selectedRadius}km
                                    </Text>
                                    <TouchableOpacity
                                        onPress={onRefresh}
                                        className="mt-4 px-6 py-2 bg-primary-600 rounded-lg"
                                    >
                                        <Text className="text-white font-medium">Refresh</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                professionals.map((professional) => (
                                    <TouchableOpacity
                                        key={professional._id}
                                        className="px-4 py-4 border-b border-secondary-100"
                                        onPress={() => {
                                            // Navigate to professional profile
                                            // navigation.navigate('ProfessionalProfile', { id: professional._id });
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
                                                <View className="flex-row items-center">
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

