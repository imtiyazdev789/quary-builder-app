import React from 'react';
import { View, Text } from 'react-native';
import { DropdownSelector, InputField, LocationPickerField } from '../../../components';
import { BUDGET_RANGES } from './constants';

const Step3BudgetLocation = ({
    budgetRange,
    setBudgetRange,
    projectLocation,
    setProjectLocation,
    locationData,
    setLocationData,
    errors,
    clearError,
}) => {
    const handleLocationSelect = (data) => {
        setLocationData(data);
        // Auto-fill project location from formatted address
        if (data.formattedAddress) {
            setProjectLocation(data.formattedAddress);
            clearError('projectLocation');
        }
    };

    return (
        <View>
            <Text className="text-2xl font-bold text-secondary-900 mb-2">
                Budget & Location
            </Text>
            <Text className="text-base text-secondary-600 mb-6">
                Set your budget and project location
            </Text>

            <DropdownSelector
                label="Budget Range *"
                options={BUDGET_RANGES}
                selected={budgetRange}
                onSelect={(key) => {
                    setBudgetRange(key);
                    clearError('budgetRange');
                }}
                error={errors.budgetRange}
            />

            <LocationPickerField
                onLocationSelect={handleLocationSelect}
                error={errors.locationData}
            />

            <InputField
                label="Project Location *"
                value={projectLocation}
                onChangeText={(text) => {
                    setProjectLocation(text);
                    clearError('projectLocation');
                }}
                placeholder="Enter project location address"
                error={errors.projectLocation}
                multiline
                numberOfLines={2}
            />

            {locationData?.formattedAddress && (
                <View className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
                    <Text className="text-xs text-primary-700 font-medium mb-1">
                        Selected Location:
                    </Text>
                    <Text className="text-sm text-primary-900">
                        {locationData.formattedAddress}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default Step3BudgetLocation;
