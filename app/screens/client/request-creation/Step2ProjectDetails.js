import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { InputField, DropdownSelector } from '../../../components';
import { TIMELINE_OPTIONS } from './constants';

const Step2ProjectDetails = ({
    projectDetail,
    setProjectDetail,
    specificRequirements,
    setSpecificRequirements,
    timeline,
    setTimeline,
    errors,
    clearError,
}) => {
    return (
        <View>
            <Text className="text-2xl font-bold text-secondary-900 mb-2">
                Project Details
            </Text>
            <Text className="text-base text-secondary-600 mb-6">
                Describe your project requirements
            </Text>

            <View className="mb-4">
                <Text className="text-sm font-medium text-secondary-800 mb-2">
                    Project Description * {projectDetail.length > 0 && `(${projectDetail.length} characters)`}
                </Text>
                <TextInput
                    className={`border rounded-xl px-4 py-3 text-base bg-white h-32 ${errors.projectDetail ? 'border-error-500' : 'border-secondary-200'
                        }`}
                    placeholder="Describe your project in detail..."
                    placeholderTextColor="#94a3b8"
                    value={projectDetail}
                    onChangeText={(text) => {
                        setProjectDetail(text);
                        clearError('projectDetail');
                    }}
                    multiline
                    numberOfLines={6}
                    style={{ textAlignVertical: 'top' }}
                    maxLength={1000}
                />
                {errors.projectDetail && (
                    <Text className="text-error-500 text-xs mt-1 ml-1">{errors.projectDetail}</Text>
                )}
                <Text className="text-xs text-secondary-500 mt-1 ml-1">
                    Minimum 50 characters. {1000 - projectDetail.length} characters remaining.
                </Text>
            </View>

            <View className="mb-4">
                <Text className="text-sm font-medium text-secondary-800 mb-2">
                    Specific Requirements {specificRequirements.length > 0 && `(${specificRequirements.length} characters)`}
                </Text>
                <TextInput
                    className="border border-secondary-200 rounded-xl px-4 py-3 text-base bg-white h-24"
                    placeholder="Any specific requirements, constraints, or preferences (optional)..."
                    placeholderTextColor="#94a3b8"
                    value={specificRequirements}
                    onChangeText={setSpecificRequirements}
                    multiline
                    numberOfLines={4}
                    style={{ textAlignVertical: 'top' }}
                    maxLength={500}
                />
                <Text className="text-xs text-secondary-500 mt-1 ml-1">
                    {500 - specificRequirements.length} characters remaining.
                </Text>
            </View>

            <DropdownSelector
                label="Project Timeline *"
                options={TIMELINE_OPTIONS}
                selected={timeline}
                onSelect={(key) => {
                    setTimeline(key);
                    clearError('timeline');
                }}
                error={errors.timeline}
            />
        </View>
    );
};

export default Step2ProjectDetails;
