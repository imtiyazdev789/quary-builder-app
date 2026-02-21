import React from 'react';
import { View, Text } from 'react-native';
import { InputField, LocationPickerField } from '../../../components';

const Step2Location = ({
    coordinates,
    setCoordinates,
    addressLine1,
    setAddressLine1,
    addressLine2,
    setAddressLine2,
    city,
    setCity,
    district,
    setDistrict,
    state,
    setState,
    pincode,
    setPincode,
    errors,
    clearError,
}) => {
    const handleLocationSelect = (locationData) => {
        setCoordinates(locationData.coordinates);
        if (locationData.addressLine1) setAddressLine1(locationData.addressLine1);
        if (locationData.addressLine2) setAddressLine2(locationData.addressLine2);
        if (locationData.city) setCity(locationData.city);
        if (locationData.district) setDistrict(locationData.district);
        if (locationData.state) setState(locationData.state);
        if (locationData.pincode) setPincode(locationData.pincode);
    };

    return (
        <View>
            <View className="mb-6">
                <Text className="text-2xl font-bold text-secondary-900 mb-1">
                    Location Office
                </Text>
                <Text className="text-secondary-500">
                    Where is your business registered?
                </Text>
            </View>

            <LocationPickerField onLocationSelect={handleLocationSelect} />

            <InputField
                label="Address Line 1"
                value={addressLine1}
                onChangeText={setAddressLine1}
                placeholder="Building, Street"
                leftIcon="location"
            />

            <InputField
                label="Address Line 2"
                value={addressLine2}
                onChangeText={setAddressLine2}
                placeholder="Area, Landmark"
                leftIcon="location"
            />

            <View className="flex-row gap-3">
                <View className="flex-1">
                    <InputField
                        label="City *"
                        value={city}
                        onChangeText={(text) => { setCity(text); clearError('city'); }}
                        error={errors.city}
                        placeholder="City"
                        leftIcon="location"
                    />
                </View>
                <View className="flex-1">
                    <InputField
                        label="District *"
                        value={district}
                        onChangeText={(text) => { setDistrict(text); clearError('district'); }}
                        error={errors.district}
                        placeholder="District"
                        leftIcon="location"
                    />
                </View>
            </View>

            <View className="flex-row gap-3">
                <View className="flex-1">
                    <InputField
                        label="State *"
                        value={state}
                        onChangeText={(text) => { setState(text); clearError('state'); }}
                        error={errors.state}
                        placeholder="State"
                        leftIcon="location"
                    />
                </View>
                <View className="flex-1">
                    <InputField
                        label="Pincode *"
                        value={pincode}
                        onChangeText={(text) => { setPincode(text.replace(/[^0-9]/g, '').slice(0, 6)); clearError('pincode'); }}
                        error={errors.pincode}
                        placeholder="6-digit"
                        keyboardType="number-pad"
                        maxLength={6}
                        leftIcon="location"
                    />
                </View>
            </View>

            {coordinates && (
                <View className="bg-success-50 rounded-xl p-4 mt-2 flex-row items-center border border-success-100">
                    <Text className="text-lg mr-2">📍</Text>
                    <Text className="text-success-700 text-xs font-medium">
                        Coordinates Verified: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default Step2Location;

