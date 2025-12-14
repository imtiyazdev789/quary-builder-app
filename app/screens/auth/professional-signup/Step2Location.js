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
            <Text className="text-xl font-bold text-secondary-900 mb-4">
                Location Details
            </Text>

            <LocationPickerField onLocationSelect={handleLocationSelect} />

            <InputField
                label="Address Line 1"
                value={addressLine1}
                onChangeText={setAddressLine1}
                placeholder="Building, Street"
            />

            <InputField
                label="Address Line 2"
                value={addressLine2}
                onChangeText={setAddressLine2}
                placeholder="Area, Landmark"
            />

            <InputField
                label="City *"
                value={city}
                onChangeText={(text) => { setCity(text); clearError('city'); }}
                error={errors.city}
                placeholder="Enter city"
            />

            <InputField
                label="District *"
                value={district}
                onChangeText={(text) => { setDistrict(text); clearError('district'); }}
                error={errors.district}
                placeholder="Enter district"
            />

            <InputField
                label="State *"
                value={state}
                onChangeText={(text) => { setState(text); clearError('state'); }}
                error={errors.state}
                placeholder="Enter state"
            />

            <InputField
                label="Pincode *"
                value={pincode}
                onChangeText={(text) => { setPincode(text.replace(/[^0-9]/g, '').slice(0, 6)); clearError('pincode'); }}
                error={errors.pincode}
                placeholder="Enter 6-digit pincode"
                keyboardType="number-pad"
                maxLength={6}
            />

            {coordinates && (
                <View className="bg-success-50 rounded-xl p-3 mt-2">
                    <Text className="text-success-700 text-xs">
                        📍 Location: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default Step2Location;

