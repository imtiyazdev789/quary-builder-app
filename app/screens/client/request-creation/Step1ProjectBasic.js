import React from 'react';
import { View, Text } from 'react-native';
import { DropdownSelector } from '../../../components';
import { PROJECT_TYPES, PROJECT_CATEGORIES, SERVICE_TYPES } from './constants';

const Step1ProjectBasic = ({
    projectType,
    setProjectType,
    projectCategory,
    setProjectCategory,
    selectedServices,
    setSelectedServices,
    errors,
    clearError,
}) => {
    return (
        <View>
            <Text className="text-2xl font-bold text-secondary-900 mb-2">
                Project Basics
            </Text>
            <Text className="text-base text-secondary-600 mb-6">
                Tell us about your project type and category
            </Text>

            <DropdownSelector
                label="Project Type *"
                options={PROJECT_TYPES}
                selected={projectType}
                onSelect={(key) => {
                    setProjectType(key);
                    clearError('projectType');
                }}
                error={errors.projectType}
            />

            <DropdownSelector
                label="Project Category *"
                options={PROJECT_CATEGORIES}
                selected={projectCategory}
                onSelect={(key) => {
                    setProjectCategory(key);
                    clearError('projectCategory');
                }}
                error={errors.projectCategory}
            />

            <DropdownSelector
                label="Required Services *"
                options={SERVICE_TYPES.map(service => ({ key: service, label: service }))}
                selected=""
                selectedMultiple={selectedServices}
                onSelect={(selected) => {
                    setSelectedServices(selected);
                    clearError('selectedServices');
                }}
                multiple={true}
                error={errors.selectedServices}
            />
        </View>
    );
};

export default Step1ProjectBasic;
