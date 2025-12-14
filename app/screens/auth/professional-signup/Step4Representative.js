import React from 'react';
import { View, Text } from 'react-native';
import { InputField, DropdownSelector } from '../../../components';
import { DESIGNATIONS } from './constants';

const Step4Representative = ({
    representativeName,
    setRepresentativeName,
    designation,
    setDesignation,
    representativeMobile,
    setRepresentativeMobile,
    representativeEmail,
    setRepresentativeEmail,
    errors,
    clearError,
}) => {
    return (
        <View>
            <Text className="text-xl font-bold text-secondary-900 mb-4">
                Representative Details
            </Text>

            <InputField
                label="Representative Name *"
                value={representativeName}
                onChangeText={(text) => { setRepresentativeName(text); clearError('representativeName'); }}
                error={errors.representativeName}
                placeholder="Full name"
                maxLength={120}
            />

            <DropdownSelector
                label="Designation *"
                options={DESIGNATIONS}
                selected={designation}
                onSelect={(val) => { setDesignation(val); clearError('designation'); }}
                error={errors.designation}
            />

            <InputField
                label="Representative Mobile *"
                value={representativeMobile}
                onChangeText={(text) => { setRepresentativeMobile(text.replace(/[^0-9]/g, '').slice(0, 10)); clearError('representativeMobile'); }}
                error={errors.representativeMobile}
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
            />

            <InputField
                label="Representative Email *"
                value={representativeEmail}
                onChangeText={(text) => { setRepresentativeEmail(text); clearError('representativeEmail'); }}
                error={errors.representativeEmail}
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
            />
        </View>
    );
};

export default Step4Representative;

