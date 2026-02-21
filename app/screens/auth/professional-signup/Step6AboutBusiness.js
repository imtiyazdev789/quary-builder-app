import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ErrorText, InputField } from '../../../components';
import { SERVICES_LIST } from './constants';

const Step6AboutBusiness = ({
    tagline,
    setTagline,
    shortDescription,
    setShortDescription,
    detailedDescription,
    setDetailedDescription,
    selectedServices,
    toggleService,
    errors,
    clearError,
}) => {
    const wordCount = shortDescription.trim().split(/\s+/).filter(Boolean).length;

    return (
        <View>
            <Text className="text-xl font-bold text-secondary-900 mb-4">About Your Business</Text>

            <InputField
                label="Tagline"
                value={tagline}
                onChangeText={setTagline}
                placeholder="Your company tagline"
                maxLength={160}
            />

            <InputField
                label="Short Description (25-150 words)"
                value={shortDescription}
                onChangeText={(text) => {
                    setShortDescription(text);
                    clearError('shortDescription');
                }}
                placeholder="Brief overview of your business"
                multiline
                numberOfLines={5}
                error={errors.shortDescription}
            />
            <Text className="text-xs text-secondary-400 -mt-2 mb-3 ml-1">
                {wordCount} words
            </Text>

            <InputField
                label="Detailed Description"
                value={detailedDescription}
                onChangeText={(text) => {
                    setDetailedDescription(text);
                    clearError('detailedDescription');
                }}
                placeholder="Detailed information about your services, experience, and expertise"
                multiline
                numberOfLines={8}
                error={errors.detailedDescription}
            />

            <View className="mb-4">
                <Text className="text-sm font-medium text-secondary-800 mb-2">
                    Services Offered * <Text className="text-secondary-400 text-xs">(Select all that apply)</Text>
                </Text>
                <View className="flex-row flex-wrap gap-2">
                    {SERVICES_LIST.map((service) => (
                        <TouchableOpacity
                            key={service}
                            style={{
                                paddingVertical: 8,
                                paddingHorizontal: 14,
                                borderRadius: 12,
                                borderWidth: 1.5,
                                borderColor: selectedServices.includes(service) ? '#0d9488' : '#e2e8f0',
                                backgroundColor: selectedServices.includes(service) ? '#0d9488' : '#ffffff',
                            }}
                            onPress={() => {
                                toggleService(service);
                                clearError('services');
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: selectedServices.includes(service) ? '#ffffff' : '#475569',
                            }}>
                                {service}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <ErrorText error={errors.services} />
            </View>
        </View>
    );
};

export default Step6AboutBusiness;
