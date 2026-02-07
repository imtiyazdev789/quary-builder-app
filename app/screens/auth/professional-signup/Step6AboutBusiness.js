import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
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

            <View className="mb-4">
                <Text className="text-sm font-medium text-secondary-800 mb-2">
                    Short Description * <Text className="text-secondary-400 text-xs">(25-150 words)</Text>
                </Text>
                <TextInput
                    className={`border rounded-xl px-4 py-3 text-base bg-white h-32 ${errors.shortDescription ? 'border-error-500' : 'border-secondary-200'
                        }`}
                    placeholder="Brief overview of your business (25-150 words)"
                    placeholderTextColor="#94a3b8"
                    value={shortDescription}
                    onChangeText={(text) => {
                        setShortDescription(text);
                        clearError('shortDescription');
                    }}
                    multiline
                    numberOfLines={5}
                    style={{ textAlignVertical: 'top' }}
                />
                <Text className="text-xs text-secondary-400 mt-1 ml-1">
                    {wordCount} words
                </Text>
                <ErrorText error={errors.shortDescription} />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-medium text-secondary-800 mb-2">
                    Detailed Description *
                </Text>
                <TextInput
                    className={`border rounded-xl px-4 py-3 text-base bg-white h-40 ${errors.detailedDescription ? 'border-error-500' : 'border-secondary-200'
                        }`}
                    placeholder="Detailed information about your services, experience, and expertise"
                    placeholderTextColor="#94a3b8"
                    value={detailedDescription}
                    onChangeText={(text) => {
                        setDetailedDescription(text);
                        clearError('detailedDescription');
                    }}
                    multiline
                    numberOfLines={8}
                    style={{ textAlignVertical: 'top' }}
                />
                <ErrorText error={errors.detailedDescription} />
            </View>

            <View className="mb-4">
                <Text className="text-sm font-medium text-secondary-800 mb-2">
                    Services Offered * <Text className="text-secondary-400 text-xs">(Select all that apply)</Text>
                </Text>
                <View className="flex-row flex-wrap gap-2">
                    {SERVICES_LIST.map((service) => (
                        <TouchableOpacity
                            key={service}
                            className={`py-2 px-3 rounded-lg border ${selectedServices.includes(service)
                                ? 'bg-primary-600 border-primary-600'
                                : 'bg-white border-secondary-200'
                                }`}
                            onPress={() => {
                                toggleService(service);
                                clearError('services');
                            }}
                        >
                            <Text className={`text-xs ${selectedServices.includes(service) ? 'text-white' : 'text-secondary-700'
                                }`}>
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

