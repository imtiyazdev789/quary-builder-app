import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import ErrorText from './ErrorText';

/**
 * LocationPickerField Component
 * A button to get current location and reverse geocode to address
 * 
 * @param {function} onLocationSelect - Callback with { coordinates, address } when location is fetched
 * @param {string} error - Error message to display
 * @param {boolean} disabled - Disable the button
 */
const LocationPickerField = ({
    onLocationSelect,
    error,
    disabled = false,
}) => {
    const [loading, setLoading] = useState(false);
    const [locationFetched, setLocationFetched] = useState(false);

    const getCurrentLocation = async () => {
        try {
            setLoading(true);

            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Please allow location access to use this feature. You can enable it in your device settings.',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Get current position
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = location.coords;

            // Reverse geocode to get address
            const [addressResult] = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (addressResult) {
                const addressData = {
                    coordinates: {
                        latitude,
                        longitude,
                    },
                    addressLine1: [addressResult.name, addressResult.streetNumber, addressResult.street]
                        .filter(Boolean)
                        .join(', ') || '',
                    addressLine2: addressResult.district || addressResult.subregion || '',
                    city: addressResult.city || addressResult.subregion || '',
                    district: addressResult.subregion || addressResult.district || '',
                    state: addressResult.region || '',
                    pincode: addressResult.postalCode || '',
                    formattedAddress: [
                        addressResult.name,
                        addressResult.street,
                        addressResult.city,
                        addressResult.region,
                        addressResult.postalCode,
                        addressResult.country,
                    ].filter(Boolean).join(', '),
                };

                onLocationSelect(addressData);
                setLocationFetched(true);
            } else {
                // If reverse geocode fails, still return coordinates
                onLocationSelect({
                    coordinates: { latitude, longitude },
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    district: '',
                    state: '',
                    pincode: '',
                    formattedAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                });
                setLocationFetched(true);
            }
        } catch (err) {
            console.error('Location error:', err);
            Alert.alert(
                'Location Error',
                'Unable to get your current location. Please try again or enter the address manually.',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="mb-4">
            <TouchableOpacity
                className={`border-2 border-dashed rounded-xl px-4 py-4 flex-row items-center justify-center ${disabled ? 'bg-secondary-50 border-secondary-200' :
                    locationFetched ? 'bg-success-50 border-success-300' :
                        'bg-primary-50 border-primary-300'
                    }`}
                onPress={getCurrentLocation}
                disabled={disabled || loading}
            >
                {loading ? (
                    <>
                        <ActivityIndicator size="small" color="#0d9488" />
                        <Text className="text-primary-600 font-medium ml-2">
                            Getting location...
                        </Text>
                    </>
                ) : (
                    <>
                        <Text className="text-2xl mr-2">
                            {locationFetched ? '✅' : '📍'}
                        </Text>
                        <Text className={`font-medium ${locationFetched ? 'text-success-700' : 'text-primary-600'
                            }`}>
                            {locationFetched ? 'Location fetched! Tap to refresh' : 'Use Current Location'}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
            <Text className="text-xs text-secondary-500 mt-1 ml-1">
                Tap to auto-fill address fields from your current location
            </Text>
            <ErrorText error={error} />
        </View>
    );
};

export default LocationPickerField;

