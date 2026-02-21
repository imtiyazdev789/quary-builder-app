import React from 'react';
import { View, Text } from 'react-native';
import { InputField } from '../../../components';

const Step3Contact = ({
    companyEmail,
    setCompanyEmail,
    companyPhone,
    setCompanyPhone,
    whatsappNumber,
    setWhatsappNumber,
    websiteUrl,
    setWebsiteUrl,
    errors,
    clearError,
}) => {
    return (
        <View>
            <View className="mb-6">
                <Text className="text-2xl font-bold text-secondary-900 mb-1">
                    Company Contact
                </Text>
                <Text className="text-secondary-500">
                    How can clients reach your business?
                </Text>
            </View>

            <InputField
                label="Company Email *"
                value={companyEmail}
                onChangeText={(text) => { setCompanyEmail(text); clearError('companyEmail'); }}
                error={errors.companyEmail}
                placeholder="company@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail"
            />

            <InputField
                label="Company Phone *"
                value={companyPhone}
                onChangeText={(text) => { setCompanyPhone(text.replace(/[^0-9]/g, '').slice(0, 10)); clearError('companyPhone'); }}
                error={errors.companyPhone}
                placeholder="10-digit phone number"
                keyboardType="phone-pad"
                maxLength={10}
                leftIcon="call"
            />

            <InputField
                label="WhatsApp Number"
                value={whatsappNumber}
                onChangeText={(text) => setWhatsappNumber(text.replace(/[^0-9]/g, '').slice(0, 10))}
                placeholder="10-digit WhatsApp number"
                keyboardType="phone-pad"
                maxLength={10}
                leftIcon="call"
            />

            <InputField
                label="Website URL"
                value={websiteUrl}
                onChangeText={setWebsiteUrl}
                placeholder="https://www.example.com"
                keyboardType="url"
                autoCapitalize="none"
                leftIcon="globe"
            />
        </View>
    );
};

export default Step3Contact;

