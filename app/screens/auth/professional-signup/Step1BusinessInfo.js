import React from 'react';
import { View, Text } from 'react-native';
import { InputField, DropdownSelector, DatePickerField } from '../../../components';
import { BUSINESS_TYPES, CATEGORIES } from './constants';

const Step1BusinessInfo = ({
    businessName,
    setBusinessName,
    businessType,
    setBusinessType,
    category,
    setCategory,
    dateOfEstablishment,
    setDateOfEstablishment,
    errors,
    clearError,
}) => {
    return (
        <View>
            <Text className="text-xl font-bold text-secondary-900 mb-4">
                Business Information
            </Text>

            <InputField
                label="Business Name *"
                value={businessName}
                onChangeText={(text) => { setBusinessName(text); clearError('businessName'); }}
                error={errors.businessName}
                placeholder="Enter business name"
                maxLength={140}
            />

            <DropdownSelector
                label="Business Type *"
                options={BUSINESS_TYPES}
                selected={businessType}
                onSelect={(val) => { setBusinessType(val); clearError('businessType'); }}
                error={errors.businessType}
            />

            <DropdownSelector
                label="Category *"
                options={CATEGORIES}
                selected={category}
                onSelect={(val) => { setCategory(val); clearError('category'); }}
                error={errors.category}
            />

            <DatePickerField
                label="Date of Establishment *"
                value={dateOfEstablishment}
                onChange={(date) => { setDateOfEstablishment(date); clearError('dateOfEstablishment'); }}
                error={errors.dateOfEstablishment}
                placeholder="Select establishment date"
                maximumDate={new Date()}
                required
            />
        </View>
    );
};

export default Step1BusinessInfo;

