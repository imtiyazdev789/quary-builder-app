import React from 'react';
import { View, Text } from 'react-native';
import { InputField } from '../../../components';

const Step4ContactInfo = ({
    clientName,
    setClientName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    errors,
    clearError,
}) => {
    return (
        <View>
            <Text className="text-2xl font-bold text-secondary-900 mb-2">
                Contact Information
            </Text>
            <Text className="text-base text-secondary-600 mb-6">
                Your contact details for this request
            </Text>

            <InputField
                label="Your Name *"
                value={clientName}
                onChangeText={(text) => {
                    setClientName(text);
                    clearError('clientName');
                }}
                placeholder="Enter your full name"
                error={errors.clientName}
                maxLength={20}
                autoCapitalize="words"
            />

            <InputField
                label="Email Address *"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    clearError('email');
                }}
                placeholder="your.email@example.com"
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <InputField
                label="Phone Number *"
                value={phoneNumber}
                onChangeText={(text) => {
                    // Only allow digits, max 10
                    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
                    setPhoneNumber(cleaned);
                    clearError('phoneNumber');
                }}
                placeholder="9876543210"
                error={errors.phoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
            />

            <View className="mt-4 p-3 bg-secondary-50 rounded-lg">
                <Text className="text-xs text-secondary-600">
                    💡 Tip: These details will be shared with the professional you're requesting services from.
                </Text>
            </View>
        </View>
    );
};

export default Step4ContactInfo;
