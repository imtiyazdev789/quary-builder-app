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
            <View className="mb-6">
                <Text className="text-2xl font-bold text-secondary-900 mb-1">
                    Representative
                </Text>
                <Text className="text-secondary-500">
                    Who should we contact regarding yours requests?
                </Text>
            </View>

            <InputField
                label="Representative Name *"
                value={representativeName}
                onChangeText={(text) => { setRepresentativeName(text); clearError('representativeName'); }}
                error={errors.representativeName}
                placeholder="Full name"
                maxLength={120}
                leftIcon="person"
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
                leftIcon="call"
            />

            <InputField
                label="Representative Email *"
                value={representativeEmail}
                onChangeText={(text) => { setRepresentativeEmail(text); clearError('representativeEmail'); }}
                error={errors.representativeEmail}
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail"
            />
        </View>
    );
};

export default Step4Representative;

